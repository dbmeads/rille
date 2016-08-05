'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var delimiter = '/';

function parse(key, locs) {
    if (Array.isArray(key)) {
        return key;
    }
    key = key || '';
    if (key.length > 0 && key.charAt(0) === delimiter) {
        key = key.trim().slice(1);
    }
    var fragments = key === '' ? [] : key.split(delimiter);
    if (locs) {
        var requested = [];
        locs.forEach(function (loc) {
            if (loc < fragments.length) {
                requested.push(fragments[loc]);
            } else {
                throw 'Invalid loc [' + loc + '] passed to Key.parse';
            }
        });
        return requested;
    }
    return fragments;
}

function stringify(keys) {
    if (typeof keys === 'string') {
        return keys;
    }
    if (keys.length > 0) {
        var key = '';
        keys.forEach(function (subKey) {
            return key += delimiter + subKey;
        });
        return key;
    }
    return '/';
}

var Key = {
    parse: parse,
    stringify: stringify
};

exports.default = Key;
exports.parse = parse;
exports.stringify = stringify;