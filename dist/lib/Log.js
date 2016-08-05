'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Route = require('./Route');

var _Route2 = _interopRequireDefault(_Route);

var _Entry = require('./Entry');

var _Entry2 = _interopRequireDefault(_Entry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Log(options) {
    return (0, _Route2.default)(Object.assign({
        route: function route(_route) {
            var entries = [];

            _route.size = function () {
                return entries.length;
            };
        },
        wrap: function wrap(wrapper, route) {
            wrapper.size = route.size;
        }
    }, options));
}

exports.default = Log;