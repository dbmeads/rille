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
            (0, _chai.expect)(_index.Entry.values()).to.not.exist;
        });

        it('should return undefined if non array is passed', function () {
            (0, _chai.expect)(_index.Entry.values('hi!')).to.not.exist;
        });
    });
});