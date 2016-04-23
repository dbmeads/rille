'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Router = undefined;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _Store = require('./Store');

var _Store2 = _interopRequireDefault(_Store);

var _Log = require('./Log');

var _Log2 = _interopRequireDefault(_Log);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Router(callback) {
    var root = (0, _Store2.default)();

    var router = {
        route: function route(key) {
            return resolve(root, (0, _util.parseKey)(key));
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
                return JSON.stringify(root);
            }
        }, router));
    });

    log.subscribe(function (entry) {
        propagate(root, (0, _util.parseKey)(entry.get(0)), entry);
    });

    return router;
}

function resolve(store, fragments) {
    if (fragments.length > 0) {
        var fragment = fragments.shift();
        return resolve(store.children[fragment] || (store.children[fragment] = (0, _Store2.default)()), fragments);
    }
    return store.obs;
}

function propagate(store, fragments, entry) {
    if (fragments.length > 0) {
        propagate(ensure(store, fragments.shift()), fragments, entry);
        propagate(ensure(store, '*'), fragments, entry);
    } else {
        store.push(entry);
    }
}

function ensure(store, fragment) {
    return store.children[fragment] ? store.children[fragment] : store.children[fragment] = (0, _Store2.default)();
}

exports.default = Router;
exports.Router = Router;