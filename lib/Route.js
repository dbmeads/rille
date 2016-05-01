import Key from './Key';

function _Route(key, parent, options) {
    options = parent ? parent.options : (options || {});

    var keys = parent ? parent.keys.map(v => v) : [];
    var route = this;

    if (key) {
        keys.push(key);
    }

    Object.assign(route, {
        options,
        parent,
        keys: keys,
        children: {},
        subs: new Set(),
        ensureGen(obj, key) {
            return obj[key] ? obj[key] : (obj[key] = new _Route(key, route));
        },
        nextGen(key) {
            return key === '*' ? route.ensureGen(route, key) : route.ensureGen(route.children, key);
        },
        child(keys) {
            if (keys.length > 0) {
                return route.nextGen(keys.shift()).child(keys);
            }
            return route;
        },
        propagate(keys, entry) {
            if (keys.length > 0) {
                route.nextGen(keys.shift()).propagate(keys, entry);
                route.nextGen('*').propagate(keys, entry);
            } else {
                route.subs.forEach(callback => callback(...entry));
            }
        },
        root() {
            return route.parent ? route.parent.root() : route;
        },
        push(...entry) {
            route.root().propagate(route.keys, [Key.stringify(route.keys)].concat(entry));
        },
        subscribe(cb) {
            var subs = route.subs;
            subs.add(cb);
            return () => subs.delete(cb);
        },
        key() {
            return Key.stringify(route.keys);
        }
    });

    if (options.route) {
        options.route(route);
    }
}

function makePublic(route) {
    var {key, push, subscribe} = route;

    var target = Object.assign(key => {
        return makePublic(route.child(Key.parse(key)));
    }, {
        key,
        push,
        subscribe
    });

    if (route.options.makePublic) {
        route.options.makePublic(target, route);
    }

    return target;
}

function Route(options) {
    return makePublic(new _Route(undefined, undefined, options));
}

export default Route;
export {Route};