'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Router = undefined;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _Dir = require('./Dir');

var _Dir2 = _interopRequireDefault(_Dir);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Router(callback) {
    var root = (0, _Dir2.default)();

    var router = {
        route: function route(key) {
            return root.child(_Dir2.default.parseKey(key)).consumer;
        }
    };

    callback(Object.assign({}, router, root));

    return router;
}

exports.default = Router;
exports.Router = Router;