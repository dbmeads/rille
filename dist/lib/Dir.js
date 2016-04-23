'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var delimiter = '/';

function parseKey(key) {
    if (key === undefined) {
        throw new Error('You\'ll need a "key" for this ride...');
    } else if (key.length > 0 && key.charAt(0) === Dir.delimiter) {
        key = key.trim().slice(1);
    }
    return key === '' ? [] : key.split(Dir.delimiter);
}

function _child(dir, fragments) {
    if (Array.isArray(fragments)) {
        if (fragments.length > 1) {
            return _child(_child(dir, fragments.shift()), fragments);
        } else if (fragments.length > 0) {
            return _child(dir, fragments.shift());
        }
        return dir;
    }
    return dir.children[fragments] || (dir.children[fragments] = _Dir());
}

function propagate(dir, fragments, entry) {
    if (fragments.length > 0) {
        propagate(_child(dir, fragments.shift()), fragments, entry);
        propagate(_child(dir, '*'), fragments, entry);
    } else {
        dir.entries.push(entry);
        dir.subs.forEach(function (callback) {
            return callback.apply(undefined, _toConsumableArray(entry));
        });
    }
}

function _Dir() {
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

            return _child(dir, fragments);
        },
        push: function push() {
            for (var _len2 = arguments.length, entry = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                entry[_key2] = arguments[_key2];
            }

            propagate(dir, parseKey(entry[0]), entry);
        },

        consumer: consumer
    }, consumer);

    var dir = Object.assign({
        children: children,
        entries: entries,
        subs: subs,
        producer: producer
    }, producer);

    return dir;
}

function Dir() {
    return _Dir().producer;
}

Object.assign(Dir, { delimiter: delimiter, parseKey: parseKey });

exports.default = Dir;
exports.Dir = Dir;