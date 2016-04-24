'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Store = undefined;

var _Key = require('./Key');

var _Key2 = _interopRequireDefault(_Key);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _child(store, fragments) {
    if (Array.isArray(fragments)) {
        if (fragments.length > 1) {
            return _child(_child(store, fragments.shift()), fragments);
        } else if (fragments.length > 0) {
            return _child(store, fragments.shift());
        }
        return store;
    }
    if (fragments === '*') {
        return store.wildcard || (store.wildcard = Store());
    } else {
        return store.children[fragments] || (store.children[fragments] = Store());
    }
}

function propagate(store, fragments, entry) {
    if (fragments.length > 0) {
        propagate(_child(store, fragments.shift()), fragments, entry);
        propagate(_child(store, '*'), fragments, entry);
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
        child: function child() {
            for (var _len = arguments.length, fragments = Array(_len), _key = 0; _key < _len; _key++) {
                fragments[_key] = arguments[_key];
            }

            return _child(this, fragments);
        },
        push: function push() {
            for (var _len2 = arguments.length, entry = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                entry[_key2] = arguments[_key2];
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