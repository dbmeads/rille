"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function key(entry) {
    return entry[0];
}

function value(entry, loc) {
    if (entry) {
        return entry[(loc !== undefined ? loc : 0) + 1];
    }
}

function values(entry) {
    if (Array.isArray(entry)) {
        return entry.slice(1);
    }
    return [];
}

var Entry = {
    key: key,
    value: value,
    values: values
};

exports.default = Entry;
exports.key = key;
exports.value = value;
exports.values = values;