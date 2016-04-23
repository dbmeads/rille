"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function Store() {
    var subs = new Set();
    var entries = [];
    var obs = {
        subscribe: function subscribe(cb) {
            subs.add(cb);
            store.subs++;
            entries.forEach(function (entry) {
                cb.apply(undefined, _toConsumableArray(entry));
            });
        }
    };
    var store = {
        children: {},
        push: function push(entry) {
            entries.push(entry);

            subs.forEach(function (cb) {
                cb.apply(undefined, _toConsumableArray(entry));
            });
        },

        subs: 0,
        obs: obs
    };
    return store;
}

exports.default = Store;
exports.Store = Store;