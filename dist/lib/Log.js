'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Log = undefined;

var _Route = require('./Route');

var _Entry = require('./Entry');

function Log(options) {
    return (0, _Route.Route)(Object.assign({
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
exports.Log = Log;