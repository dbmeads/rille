'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var delimiter = '/';

function parse(key) {
    key = key || '';
    if (key.length > 0 && key.charAt(0) === delimiter) {
        key = key.trim().slice(1);
    }
    return key === '' ? [] : key.split(delimiter);
}

var Key = { parse: parse };

exports.default = Key;
exports.Key = Key;