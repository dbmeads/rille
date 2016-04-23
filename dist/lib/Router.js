'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Router = undefined;

var _Store = require('./Store');

var _Store2 = _interopRequireDefault(_Store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Router(callback) {
    var root = (0, _Store2.default)();

    var router = {
        route: function route(key) {
            return root.child(_Store2.default.parseKey(key)).consumer;
        }
    };

    callback(Object.assign({}, router, root));

    return router;
}

exports.default = Router;
exports.Router = Router;