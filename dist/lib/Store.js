'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var delimiter = '/';

function parseKey(key) {
    if (key === undefined) {
        throw new Error('You\'ll need a "key" for this ride...');
    } else if (key.length > 0 && key.charAt(0) === Store.delimiter) {
        key = key.trim().slice(1);
    }
    return key === '' ? [] : key.split(Store.delimiter);
}

function _child(store, fragments) {
    if (Array.isArray(fragments)) {
        if (fragments.length > 1) {
            return _child(_child(store, fragments.shift()), fragments);
        } else if (fragments.length > 0) {
            return _child(store, fragments.shift());
        }
        return store;
    }
    return store.children[fragments] || (store.children[fragments] = _Store());
}

function propagate(store, fragments, entry) {
    if (fragments.length > 0) {
        propagate(_child(store, fragments.shift()), fragments, entry);
        propagate(_child(store, '*'), fragments, entry);
    } else {
        store.entries.push(entry);
        store.subs.forEach(function (callback) {
            return callback.apply(undefined, _toConsumableArray(entry));
        });
    }
}

function _Store() {
    var subs = new Set();
    var entries = [];
    var children = {};

    var consumer = {
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
        }
    };

    var producer = Object.assign({
        child: function child() {
            for (var _len = arguments.length, fragments = Array(_len), _key = 0; _key < _len; _key++) {
                fragments[_key] = arguments[_key];
            }

            return _child(store, fragments);
        },
        push: function push() {
            for (var _len2 = arguments.length, entry = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                entry[_key2] = arguments[_key2];
            }

            propagate(store, parseKey(entry[0]), entry);
        },

        consumer: consumer
    }, consumer);

    var store = Object.assign({
        children: children,
        entries: entries,
        subs: subs,
        producer: producer
    }, producer);

    return store;
}

function Store() {
    return _Store().producer;
}

Object.assign(Store, { delimiter: delimiter, parseKey: parseKey });

exports.default = Store;
exports.Store = Store;