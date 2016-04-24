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

function stringify(keys) {
    var key = '';
    keys.forEach(function (subKey) {
        return key += delimiter + subKey;
    });
    return key;
}

var Key = { parse: parse, stringify: stringify };

exports.default = Key;
exports.Key = Key;