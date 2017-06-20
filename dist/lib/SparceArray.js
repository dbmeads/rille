"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function SparceArray() {
    this.length = 0;
    this.totalLength = 0;
    this.max = 0;
}

Object.assign(SparceArray.prototype, {
    setAt: function setAt(id, value) {
        this[id] = value;
        if (id > this.max) {
            this.max = id;
        }
        this.updateLength(this);
        return this;
    },
    push: function push(value) {
        this.setAt(this.max, value);
        return this;
    },
    updateLength: function updateLength() {
        while (this.hasOwnProperty(this.length)) {
            this.length++;
        }
        return this;
    }
});

exports.default = SparceArray;