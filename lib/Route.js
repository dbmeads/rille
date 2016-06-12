import Key from './Key';

function _Route(key, parent, options) {
    options = parent ? parent.options : (options || {});

    var keys = parent ? parent.keys.map(v => v) : [];
    var route = this;

    if (key) {
        keys.push(key);
    }

    function functionTree(route, func) {
        var tree = (...args) => {
            if (route[func]) {
                return route[func].apply(null, args);
            }
        };

        Object.keys(route.children).forEach(key => tree[key] = functionTree(route.children[key], func));

        return tree;
    }

    function middleware(keys) {
        var cur = options.middleware || {};
        for (let key of keys) {
            if (cur[key]) {
                cur = cur[key];
            } else if (cur['*']) {
                cur = cur['*'];
            } else {
                return [];
            }
        }
        return cur._middleware || [];
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
        functionTree(func) {
            return functionTree(route, func);
        },
        functionTrees(...funcs) {
            var obj = {};
            funcs.forEach(func => obj[func] = functionTree(route, func));
            return obj;
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
            var funcs = middleware(keys);
            for (let i = 0; entry && i < funcs.length; i++) {
                entry = funcs[i](...entry);
            }
            if (entry) {
                route.root().propagate(keys.map(v => v), [Key.stringify(keys)].concat(entry));
            }
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

function calcMiddleware(map) {
    var middleware = {};
    for (let key in map) {
        let cur = middleware;
        let keys = Key.parse(key);
        keys.forEach(key => {
            if (!cur[key]) {
                cur[key] = {};
            }
            cur = cur[key];
        });
        cur._middleware = map[key];
    }
    return middleware;
}


function wrap(route) {
    var {childKeys, functionTree, functionTrees, key, push, subscribe, toJSON} = route;

    var wrapper = Object.assign(key => {
        return wrap(route.child(Key.parse(key)));
    }, {
        childKeys,
        functionTree,
        functionTrees,
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
    options = Object.assign({}, options);
    options.middleware = calcMiddleware(options.middleware);
    return wrap(new _Route(undefined, undefined, options));
}

export default Route;
export {Route};