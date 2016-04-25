'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Route = undefined;

var _Key = require('./Key');

var _Key2 = _interopRequireDefault(_Key);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function myChild(route, key) {
    if (key === '*') {
        return route.wildcard || (route.wildcard = Route(route, key));
    } else {
        return route.children[key] || (route.children[key] = Route(route, key));
    }
}

function child(route, keys) {
    if (keys.length > 0) {
        return child(myChild(route, keys.shift()), keys);
    }
    return route;
}

function propagate(route, keys, entry) {
    if (keys.length > 0) {
        propagate(myChild(route, keys.shift()), keys, entry);
        propagate(myChild(route, '*'), keys, entry);
    } else {
        entry[0] = _Key2.default.stringify(entry[0]);
        route.subs.forEach(function (callback) {
            return callback.apply(undefined, _toConsumableArray(entry));
        });
    }
}

function _push(route, entry) {
    while (route.parent) {
        route = route.parent;
    }
    propagate(route, entry[0].map(function (v) {
        return v;
    }), entry);
}

function Route(parent, key) {
    var subs = new Set();
    var children = {};
    var keys = parent ? parent.keys.map(function (v) {
        return v;
    }) : [];

    if (key) {
        keys.push(key);
    }

    function route(key) {
        return child(route, _Key2.default.parse(key));
    }

    return Object.assign(route, {
        push: function push() {
            for (var _len = arguments.length, entry = Array(_len), _key = 0; _key < _len; _key++) {
                entry[_key] = arguments[_key];
            }

            _push(this, [keys].concat(entry));
        },
        exists: function exists(key) {
            return !!children[key];
        },
        key: function key() {
            return _Key2.default.stringify(keys);
        },
        subscribe: function subscribe(cb) {
            subs.add(cb);
            return function () {
                return subs.delete(cb);
            };
        },

        parent: parent,
        keys: keys,
        children: children,
        subs: subs,
        wildcard: undefined
    });
}

exports.default = Route;
exports.Route = Route;