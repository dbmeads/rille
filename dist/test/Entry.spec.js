'use strict';

var _chai = require('chai');

var _index = require('../lib/index');

describe('Entry', function () {

    describe('key', function () {
        it('should return key', function () {
            (0, _chai.expect)(_index.Entry.key(['/users/1', 'Hi!'])).to.equal('/users/1');
        });
    });

    describe('values', function () {
        it('should return array of data items', function () {
            (0, _chai.expect)(Array.isArray(_index.Entry.values(['/key', '1', '2']))).to.be.true;
        });

        it('should handle undefined', function () {
            var values = _index.Entry.values();

            (0, _chai.expect)(Array.isArray(values)).to.be.true;
            (0, _chai.expect)(values.length).to.equal(0);
        });

        it('should return empty array if non array is passed', function () {
            var values = _index.Entry.values('Hi!');

            (0, _chai.expect)(Array.isArray(values)).to.be.true;
            (0, _chai.expect)(values.length).to.equal(0);
        });
    });
});