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

var delimeter = '/';

function split(key) {
    if (key === undefined) {
        throw new Error('You\'ll need a "key" for this ride...');
    } else if (key.length > 0 && key.charAt(0) === delimeter) {
        key = key.slice(1);
    }

    return key.split(delimeter);
}

function Router(callback) {
    var trie = Trie();

    var router = {
        route: function route(key) {
            return resolve(trie, split(key));
        }
    };

    var log = (0, _Log2.default)(function (log) {
        callback(Object.assign({
            push: function push(key, value) {
                log.push({
                    key: key,
                    value: value
                });
            },
            toJSON: function toJSON() {
                return JSON.stringify(trie);
            }
        }, router));
    });

    log.subscribe(function (entry) {
        propagate(trie, split(entry.get('key')), entry);
    });

    return router;
}

function resolve(trie, fragments) {
    if (fragments.length > 1) {
        var fragment = fragments.shift();
        return resolve(trie.children[fragment] || (trie.children[fragment] = Trie()), fragments);
    }
    return trie.obs;
}

function propagate(trie, fragments, entry) {
    if (fragments.length > 1) {
        var fragment = fragments.shift();
        propagate(trie[fragment], fragments, entry);
        var wildcard = trie['*'];
        if (wildcard) {
            wildcard.push(entry);
            propagate(wildcard, fragments, entry);
        }
    } else if (trie) {
        trie.push(entry);
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
                cb(entry.toJS());
            });
        },

        subs: 0,
        obs: obs
    };
    return trie;
}

exports.default = Router;
exports.Router = Router;