const Key = require('./Key');

function _Route(key, parent, options) {
    options = parent ? parent.options : (options || {});

    let keys = parent ? parent.keys.map(v => v) : [];
    let route = this;

    if (key) {
        keys.push(key);
    }

    // Propogate middleware
    function propogate(route, next, ...entry) {
        root().propagate(Key.parse(entry[0]), entry);
    }

    function next(funcs, pos, key, ...values) {
        if (pos < funcs.length) {
            funcs[pos](root().wrapped, (...values) => {
                ++pos;
                next(funcs, pos, key, ...values);
            }, key, ...values);
        } else if (pos === funcs.length) {
            propogate(root(), undefined, key, ...values);
        }
    }

    function middleware(keys) {
        let cur = options.middleware || {};
        for (let key of keys) {
            if (cur[key]) {
                cur = cur[key];
            } else if (cur['*']) {
                cur = cur['*'];
            } else {
                return [];
            }
        }
        return cur._middleware ? cur._middleware.map(v => v) : [];
    }

    function root() {
        return route.parent ? route.parent.root() : route;
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
        root,
        push(...values) {
            next(middleware(keys), 0, Key.stringify(keys), ...values);
            return route;
        },
        subscribe(cb) {
            let subs = route.subs;
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
            let obj = {
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
        },
    });

    if (options.route) {
        options.route(route);
    }

    // Wrap the route at the end
    route.wrapped = wrap(route);
}

function calcMiddleware(map) {
    let middleware = {};
    for (let key in map) {
        let cur = middleware;
        let keys = Key.parse(key);
        keys.forEach(key => {
            if (!cur[key]) {
                cur[key] = {};
            }
            cur = cur[key];
        });
        cur._middleware = map[key].reverse();
    }
    return middleware;
}


function wrap(route) {
    let {childKeys, key, push, subscribe, toJSON} = route;

    let wrapper = Object.assign(key => {
        return route.child(Key.parse(key)).wrapped;
    }, {
        childKeys,
        key,
        push() {
            route.push.apply(this, arguments);
            return wrapper;
        },
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
    return new _Route(undefined, undefined, options).wrapped;
}

module.exports =  Route;