'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Route = undefined;

var _Key = require('./Key');

var _Key2 = _interopRequireDefault(_Key);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _Route(key, parent, options) {
    options = parent ? parent.options : options || {};

    var keys = parent ? parent.keys.map(function (v) {
        return v;
    }) : [];
    var route = this;

    if (key) {
        keys.push(key);
    }

    function _functionTree(route, func) {
        var tree = function tree() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            if (route[func]) {
                return route[func].apply(null, args);
            }
        };

        Object.keys(route.children).forEach(function (key) {
            return tree[key] = _functionTree(route.children[key], func);
        });

        return tree;
    }

    function middleware(keys) {
        var cur = options.middleware || {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _key2 = _step.value;

                if (cur[_key2]) {
                    cur = cur[_key2];
                } else if (cur['*']) {
                    cur = cur['*'];
                } else {
                    return [];
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return cur._middleware || [];
    }

    Object.assign(route, {
        options: options,
        parent: parent,
        keys: keys,
        children: {},
        subs: new Set(),
        ensureGen: function ensureGen(obj, key) {
            return obj[key] ? obj[key] : obj[key] = new _Route(key, route);
        },
        functionTree: function functionTree(func) {
            return _functionTree(route, func);
        },
        functionTrees: function functionTrees() {
            var obj = {};

            for (var _len2 = arguments.length, funcs = Array(_len2), _key3 = 0; _key3 < _len2; _key3++) {
                funcs[_key3] = arguments[_key3];
            }

            funcs.forEach(function (func) {
                return obj[func] = _functionTree(route, func);
            });
            return obj;
        },
        nextGen: function nextGen(key) {
            return key === '*' ? route.ensureGen(route, key) : route.ensureGen(route.children, key);
        },
        child: function child(keys) {
            if (keys.length > 0) {
                return route.nextGen(keys.shift()).child(keys);
            }
            return route;
        },
        propagate: function propagate(keys, entry) {
            if (keys.length > 0) {
                route.nextGen(keys.shift()).propagate(keys, entry);
                route.nextGen('*').propagate(keys, entry);
            } else {
                route.subs.forEach(function (callback) {
                    return callback.apply(undefined, _toConsumableArray(entry));
                });
            }
        },
        root: function root() {
            return route.parent ? route.parent.root() : route;
        },
        push: function push() {
            for (var _len3 = arguments.length, entry = Array(_len3), _key4 = 0; _key4 < _len3; _key4++) {
                entry[_key4] = arguments[_key4];
            }

            var funcs = middleware(keys);
            for (var i = 0; entry && i < funcs.length; i++) {
                entry = funcs[i].apply(funcs, _toConsumableArray(entry));
            }
            if (entry) {
                route.root().propagate(keys.map(function (v) {
                    return v;
                }), [_Key2.default.stringify(keys)].concat(entry));
            }
            return route;
        },
        subscribe: function subscribe(cb) {
            var subs = route.subs;
            subs.add(cb);
            return function () {
                return subs.delete(cb);
            };
        },
        key: function key() {
            return _Key2.default.stringify(keys);
        },
        childKeys: function childKeys() {
            return Object.keys(route.children);
        },
        raw: function raw() {
            var obj = {
                key: key,
                children: {}
            };

            Object.keys(route.children).forEach(function (key) {
                obj.children[key] = route.children[key].raw();
            });

            if (route['*']) {
                obj['*'] = route['*'].raw();
            }

            return obj;
        },
        toJSON: function toJSON() {
            return JSON.stringify(route.raw());
        }
    });

    if (options.route) {
        options.route(route);
    }
}

function calcMiddleware(map) {
    var middleware = {};

    var _loop = function _loop(key) {
        var cur = middleware;
        var keys = _Key2.default.parse(key);
        keys.forEach(function (key) {
            if (!cur[key]) {
                cur[key] = {};
            }
            cur = cur[key];
        });
        cur._middleware = map[key];
    };

    for (var key in map) {
        _loop(key);
    }
    return middleware;
}

function wrap(route) {
    var childKeys = route.childKeys;
    var functionTree = route.functionTree;
    var functionTrees = route.functionTrees;
    var key = route.key;
    var push = route.push;
    var subscribe = route.subscribe;
    var toJSON = route.toJSON;


    var wrapper = Object.assign(function (key) {
        return wrap(route.child(_Key2.default.parse(key)));
    }, {
        childKeys: childKeys,
        functionTree: functionTree,
        functionTrees: functionTrees,
        key: key,
        push: push,
        subscribe: subscribe,
        toJSON: toJSON
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

exports.default = Route;
exports.Route = Route;