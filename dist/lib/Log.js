'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Log = undefined;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Log(cb) {
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
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                args.forEach(function (entry) {
                    entry = _immutable2.default.fromJS(entry);
                    entries.push(entry);
                    subs.forEach(function (cb) {
                        cb(entry);
                    });
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