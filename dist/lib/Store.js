'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Store = undefined;

var _Route = require('./Route');

var _Entry = require('./Entry');

function Store(options) {
    return (0, _Route.Route)(Object.assign({
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
            wrapper.values = function (ordinal) {
                var values = _Entry.Entry.values(route.entry);
                return ordinal != undefined ? values[ordinal] : values;
            };
        }
    }, options));
}

exports.default = Store;
exports.Store = Store;