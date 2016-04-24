'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Store = undefined;

var _Key = require('./Key');

var _Key2 = _interopRequireDefault(_Key);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function myChild(store, fragment) {
    if (fragment === '*') {
        return store.wildcard || (store.wildcard = Store());
    } else {
        return store.children[fragment] || (store.children[fragment] = Store());
    }
}

function _child(store, fragments) {
    if (fragments.length > 0) {
        return _child(myChild(store, fragments.shift()), fragments);
    }
    return store;
}

function propagate(store, fragments, entry) {
    if (fragments.length > 0) {
        propagate(myChild(store, fragments.shift()), fragments, entry);
        propagate(myChild(store, '*'), fragments, entry);
    } else {
        store.entries[0] = entry;
        store.subs.forEach(function (callback) {
            return callback.apply(undefined, _toConsumableArray(entry));
        });
    }
}

function Store() {
    var subs = new Set();
    var entries = [];
    var children = {};

    return {
        child: function child(key) {
            return _child(this, Array.isArray(key) ? key : _Key2.default.parse(key));
        },
        push: function push() {
            for (var _len = arguments.length, entry = Array(_len), _key = 0; _key < _len; _key++) {
                entry[_key] = arguments[_key];
            }

            propagate(this, _Key2.default.parse(entry[0]), entry);
        },
        entry: function entry() {
            return entries[entries.length - 1];
        },
        exists: function exists(fragment) {
            return !!children[fragment];
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

        children: children,
        entries: entries,
        subs: subs,
        wildcard: undefined
    };
}

exports.default = Store;
exports.Store = Store;