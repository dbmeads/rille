"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Entry = {
    data: function data(entry) {
        return entry.length > 2 ? entry.slice(1) : entry[1];
    },
    key: function key(entry) {
        return entry[0];
    }
};

exports.default = Entry;
exports.Entry = Entry;