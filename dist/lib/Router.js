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
    return Object.assign({
        route: function route(key) {
            return this.child(_Key2.default.parse(key));
        }
    }, (0, _Store2.default)());
}

exports.default = Router;
exports.Router = Router;