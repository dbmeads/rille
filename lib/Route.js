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
            route.root().propagate(keys.map(v => v), [Key.stringify(keys)].concat(entry));
            return route;
        },
        subscribe(cb) {
            var subs = route.subs;
            subs.add(cb);
            return () => subs.delete(cb);
        },
        key() {
            return Key.stringify(keys);
        },
        childKeys() {
            return Object.keys(route.children);
        },
        raw() {
            var obj = {
                key,
                children: {}
            };

            Object.keys(route.children).forEach(key => {
                obj.children[key] = route.children[key].raw();
            });

            if (route['*']) {
                obj['*'] = route['*'].raw();
            }

            return obj;
        },
        toJSON() {
            return JSON.stringify(route.raw());
        }
    });

    if (options.route) {
        options.route(route);
    }
}

function wrap(route) {
    var {childKeys, key, push, subscribe, toJSON} = route;

    var wrapper = Object.assign(key => {
        return wrap(route.child(Key.parse(key)));
    }, {
        childKeys,
        key,
        push,
        subscribe,
        toJSON
    });

    if (route.options.wrap) {
        route.options.wrap(wrapper, route);
    }

    return wrapper;
}

function Route(options) {
    return wrap(new _Route(undefined, undefined, options));
}

export default Route;
export {Route};