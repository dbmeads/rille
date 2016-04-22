'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Router = undefined;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _Log = require('./Log');

var _Log2 = _interopRequireDefault(_Log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var delimeter = '/';

function split(key) {
    if (key === undefined) {
        throw new Error('You\'ll need a "key" for this ride...');
    } else if (key.length > 0 && key.charAt(0) === delimeter) {
        key = key.trim().slice(1);
    }

    return key === '' ? [] : key.split(delimeter);
}

function Router(callback) {
    var trie = Trie();

    var router = {
        route: function route(key) {
            return resolve(trie, split(key));
        }
    };

    var log = (0, _Log2.default)({
        schema: {
            type: 'array',
            'minItems': 2
        }
    }, function (log) {
        callback(Object.assign({
            push: function push() {
                log.push.apply(log, arguments);
            },
            toJSON: function toJSON() {
                return JSON.stringify(trie);
            }
        }, router));
    });

    log.subscribe(function (entry) {
        propagate(trie, split(entry.get(0)), entry);
    });

    return router;
}

function resolve(trie, fragments) {
    if (fragments.length > 0) {
        var fragment = fragments.shift();
        return resolve(trie.children[fragment] || (trie.children[fragment] = Trie()), fragments);
    }
    return trie.obs;
}

function propagate(trie, fragments, entry) {
    if (trie) {
        if (fragments.length > 0) {
            var fragment = fragments.shift();
            propagate(trie.children[fragment], fragments, entry);
            var wildcard = trie.children['*'];
            if (wildcard) {
                propagate(wildcard, fragments, entry);
            }
        } else {
            trie.push(entry);
        }
    }
}

function Trie() {
    var subs = new Set();
    var obs = {
        subscribe: function subscribe(cb) {
            subs.add(cb);
            trie.subs++;
        }
    };
    var trie = {
        children: {},
        push: function push(entry) {
            subs.forEach(function (cb) {
                cb.apply(undefined, _toConsumableArray(entry.toJS()));
            });
        },

        subs: 0,
        obs: obs
    };
    return trie;
}

exports.default = Router;
exports.Router = Router;