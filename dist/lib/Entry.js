"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function values(entry) {
    if (Array.isArray(entry)) {
        return entry.slice(1);
    }
}

function key(entry) {
    return entry[0];
}

var Entry = {
    values: values,
    key: key
};

exports.default = Entry;
exports.Entry = Entry;