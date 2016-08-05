'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Route = require('./Route');

var _Route2 = _interopRequireDefault(_Route);

var _Entry = require('./Entry');

var _Entry2 = _interopRequireDefault(_Entry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Store(options) {
    return (0, _Route2.default)(Object.assign({
        route: function route(_route) {
            _route.entry = undefined;
            _route.subscribe(function () {
                for (var _len = arguments.length, entry = Array(_len), _key = 0; _key < _len; _key++) {
                    entry[_key] = arguments[_key];
                }

                _route.entry = entry;
            });
        },
        wrap: function wrap(wrapper, route) {
            wrapper.entry = function () {
                return route.entry;
            };
            wrapper.values = function () {
                return _Entry2.default.values(route.entry);
            };
            wrapper.value = function (loc) {
                return _Entry2.default.value(route.entry, loc);
            };
        }
    }, options));
}

exports.default = Store;