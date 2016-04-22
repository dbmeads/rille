'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Log = undefined;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _tv = require('tv4');

var _tv2 = _interopRequireDefault(_tv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Log() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    var options = args.length > 1 ? args[0] : {};
    var schema = options.schema;

    var cb = args.length > 1 ? args[1] : args[0];
    var subs = new Set();
    var entries = [];

    if (cb) {
        var log = {
            subscribe: function subscribe(cb) {
                entries.forEach(function (entry) {
                    cb(entry);
                });
                subs.add(cb);
            }
        };

        cb(Object.assign({
            push: function push() {
                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                var entry = args.length === 1 ? args[0] : args;
                if (schema && !_tv2.default.validate(entry, schema)) {
                    throw _tv2.default.error;
                }
                entry = _immutable2.default.fromJS(entry);
                entries.push(entry);
                subs.forEach(function (cb) {
                    cb(entry);
                });
                return this;
            }
        }, log));

        return log;
    }
    throw new Error('A "callback" must be provided to Log.');
}

exports.default = Log;
exports.Log = Log;