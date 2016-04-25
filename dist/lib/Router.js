'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Router = undefined;

var _Key = require('./Key');

var _Key2 = _interopRequireDefault(_Key);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function myChild(router, key) {
    if (key === '*') {
        return router.wildcard || (router.wildcard = Router(router, key));
    } else {
        return router.children[key] || (router.children[key] = Router(router, key));
    }
}

function child(router, keys) {
    if (keys.length > 0) {
        return child(myChild(router, keys.shift()), keys);
    }
    return router;
}

function propagate(router, keys, entry) {
    if (keys.length > 0) {
        propagate(myChild(router, keys.shift()), keys, entry);
        propagate(myChild(router, '*'), keys, entry);
    } else {
        router.entries[0] = entry;
        router.subs.forEach(function (callback) {
            return callback.apply(undefined, _toConsumableArray(entry));
        });
    }
}

function Router(parent, key) {
    var subs = new Set();
    var entries = [];
    var children = {};
    var keys = parent ? parent.keys.map(function (value) {
        return value;
    }) : [];

    if (key) {
        keys.push(key);
    }

    return {
        route: function route(key) {
            return child(this, Array.isArray(key) ? key : _Key2.default.parse(key));
        },
        push: function push() {
            for (var _len = arguments.length, entry = Array(_len), _key = 0; _key < _len; _key++) {
                entry[_key] = arguments[_key];
            }

            if (parent) {
                entry[0] = _Key2.default.parse(entry[0]);
                entry[0].unshift(keys[keys.length - 1]);
                parent.push.apply(parent, entry);
            } else {
                entry[0] = _Key2.default.stringify(entry[0]);
                propagate(this, _Key2.default.parse(entry[0]), entry);
            }
        },
        entry: function entry() {
            return entries[entries.length - 1];
        },
        exists: function exists(key) {
            return !!children[key];
        },
        key: function key() {
            return _Key2.default.stringify(keys);
        },
        subscribe: function subscribe(cb) {
            subs.add(cb);
            entries.forEach(function (entry) {
                cb.apply(undefined, _toConsumableArray(entry));
            });
            return function () {
                return subs.delete(cb);
            };
        },

        parent: parent,
        keys: keys,
        children: children,
        entries: entries,
        subs: subs,
        wildcard: undefined
    };
}

exports.default = Router;
exports.Router = Router;