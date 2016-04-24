'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Router = undefined;

var _Key = require('./Key');

var _Key2 = _interopRequireDefault(_Key);

var _Store = require('./Store');

var _Store2 = _interopRequireDefault(_Store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Router() {
    var root = (0, _Store2.default)();
    return Object.assign({
        route: root.child
    }, root);
}

exports.default = Router;
exports.Router = Router;