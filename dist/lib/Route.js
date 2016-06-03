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

            for (var _len2 = arguments.length, funcs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                funcs[_key2] = arguments[_key2];
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
            for (var _len3 = arguments.length, entry = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                entry[_key3] = arguments[_key3];
            }

            route.root().propagate(keys.map(function (v) {
                return v;
            }), [_Key2.default.stringify(keys)].concat(entry));
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
    return wrap(new _Route(undefined, undefined, options));
}

exports.default = Route;
exports.Route = Route;