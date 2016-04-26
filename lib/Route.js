import Key from './Key';

function ensureGen(route, obj, key) {
    return obj[key] ? obj[key] : (obj[key] = _Route(route, key));
}

function nextGen(route, key) {
    return key === '*' ? ensureGen(route, route, key) : ensureGen(route, route.children, key);
}

function child(route, keys) {
    if (keys.length > 0) {
        return child(nextGen(route, keys.shift()), keys);
    }
    return route;
}

function propagate(route, keys, entry) {
    if (keys.length > 0) {
        propagate(nextGen(route, keys.shift()), keys, entry);
        propagate(nextGen(route, '*'), keys, entry);
    } else {
        route.subs.forEach(callback => callback(...entry));
    }
}

function root(route) {
    while (route.parent) {
        route = route.parent;
    }
    return route;
}

function push(route, entry) {
    propagate(root(route), Key.parse(entry[0]), entry);
}

function _Route(parent, key) {
    var keys = parent ? parent.keys.map(v => v) : [];

    if (key) {
        keys.push(key);
    }

    return {
        parent,
        keys: keys,
        children: {},
        subs: new Set()
    };
}

function wrap(_route) {
    function route(key) {
        return wrap(child(_route, Key.parse(key)));
    }

    return Object.assign(route, {
        push(...entry) {
            push(_route, [Key.stringify(_route.keys)].concat(entry));
        },
        key() {
            return Key.stringify(_route.keys);
        },
        subscribe(cb) {
            _route.subs.add(cb);
            return () => _route.subs.delete(cb);
        }
    });
}

function Route() {
    return wrap(_Route());
}

export default Route;
export {Route};