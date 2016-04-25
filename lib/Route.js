import Key from './Key';

function ensureGen(route, obj, key) {
    return obj[key] ? obj[key] : (obj[key] = Route(route, key));
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

function Route(parent, key) {
    var subs = new Set();
    var children = {};
    var keys = parent ? parent.keys.map(v => v) : [];

    if (key) {
        keys.push(key);
    }

    function route(key) {
        return child(route, Key.parse(key));
    }

    return Object.assign(route, {
        push(...entry) {
            push(this, [Key.stringify(keys)].concat(entry));
        },
        exists(key) {
            return !!children[key];
        },
        key() {
            return Key.stringify(keys);
        },
        subscribe(cb) {
            subs.add(cb);
            return () => subs.delete(cb);
        },
        parent,
        keys,
        children,
        subs
    });
}

export default Route;
export {Route};