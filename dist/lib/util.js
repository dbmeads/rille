'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var delimeter = '/';

function parseKey(key) {
    if (key === undefined) {
        throw new Error('You\'ll need a "key" for this ride...');
    } else if (key.length > 0 && key.charAt(0) === delimeter) {
        key = key.trim().slice(1);
    }

    return key === '' ? [] : key.split(delimeter);
}

exports.parseKey = parseKey;