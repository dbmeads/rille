'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Router = exports.Store = undefined;

var _Router = require('./Router');

var _Router2 = _interopRequireDefault(_Router);

var _Store = require('./Store');

var _Store2 = _interopRequireDefault(_Store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Rille = { Router: _Router2.default, Store: _Store2.default };

exports.default = Rille;
exports.Store = _Store2.default;
exports.Router = _Router2.default;