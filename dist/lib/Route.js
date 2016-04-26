'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Route = undefined;

var _Key = require('./Key');

var _Key2 = _interopRequireDefault(_Key);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function ensureGen(route, obj, key) {
    return obj[key] ? obj[key] : obj[key] = _Route(route, key);
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
        route.subs.forEach(function (callback) {
            return callback.apply(undefined, _toConsumableArray(entry));
        });
    }
}

function root(route) {
    while (route.parent) {
        route = route.parent;
    }
    return route;
}

function _push(route, entry) {
    propagate(root(route), _Key2.default.parse(entry[0]), entry);
}

function _Route(parent, key) {
    var keys = parent ? parent.keys.map(function (v) {
        return v;
    }) : [];

    if (key) {
        keys.push(key);
    }

    return {
        parent: parent,
        keys: keys,
        children: {},
        subs: new Set()
    };
}

function wrap(_route) {
    function route(key) {
        return wrap(child(_route, _Key2.default.parse(key)));
    }

    return Object.assign(route, {
        push: function push() {
            for (var _len = arguments.length, entry = Array(_len), _key = 0; _key < _len; _key++) {
                entry[_key] = arguments[_key];
            }

            _push(_route, [_Key2.default.stringify(_route.keys)].concat(entry));
        },
        key: function key() {
            return _Key2.default.stringify(_route.keys);
        },
        subscribe: function subscribe(cb) {
            _route.subs.add(cb);
            return function () {
                return _route.subs.delete(cb);
            };
        }
    });
}

function Route() {
    return wrap(_Route());
}

exports.default = Route;
exports.Route = Route;