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
    var dir = Dir();

    var router = {
        route: function route(key) {
            return resolve(dir, split(key));
        }
    };

    var log = (0, _Log2.default)({
        schema: {
            type: 'array',
            'minItems': 2
        }
    }, function (log) {
        callback(Object.assign({
            log: log,
            toJSON: function toJSON() {
                return JSON.stringify(dir);
            }
        }, router));
    });

    log.subscribe(function (entry) {
        propagate(dir, split(entry.get(0)), entry);
    });

    return router;
}

function resolve(dir, fragments) {
    if (fragments.length > 0) {
        var fragment = fragments.shift();
        return resolve(dir.children[fragment] || (dir.children[fragment] = Dir()), fragments);
    }
    return dir.obs;
}

function propagate(dir, fragments, entry) {
    if (fragments.length > 0) {
        propagate(ensure(dir, fragments.shift()), fragments, entry);
        propagate(ensure(dir, '*'), fragments, entry);
    } else {
        dir.push(entry);
    }
}

function ensure(dir, fragment) {
    return dir.children[fragment] ? dir.children[fragment] : dir.children[fragment] = Dir();
}

function Dir() {
    var subs = new Set();
    var entries = [];
    var obs = {
        subscribe: function subscribe(cb) {
            subs.add(cb);
            dir.subs++;
            entries.forEach(function (entry) {
                cb.apply(undefined, _toConsumableArray(entry));
            });
        }
    };
    var dir = {
        children: {},
        push: function push(entry) {
            entries.push(entry);

            subs.forEach(function (cb) {
                cb.apply(undefined, _toConsumableArray(entry));
            });
        },

        subs: 0,
        obs: obs
    };
    return dir;
}

exports.default = Router;
exports.Router = Router;