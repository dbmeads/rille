'use strict';

var _index = require('../lib/index');

var _chai = require('chai');

describe('Store', function () {
    var store;

    beforeEach(function () {
        store = (0, _index.Store)();
    });

    it('should have an entry function', function () {
        (0, _chai.expect)(store.entry()).to.equal(undefined);
    });

    it('should return the values array', function () {
        store.push('hi!');
        store('/path/1').push(1, 2, 3);

        (0, _chai.expect)(store.values()).to.eql(['hi!']);
        (0, _chai.expect)(store('/path/1').values().length).to.equal(3);
        (0, _chai.expect)(store('/path/1').values()[0]).to.equal(1);
        (0, _chai.expect)(store('/path/1').values()[1]).to.equal(2);
        (0, _chai.expect)(store('/path/1').values()[2]).to.equal(3);
    });

    it('should return requested value', function () {
        store.push(1, 2, 3);

        (0, _chai.expect)(store.values(0)).to.equal(1);
        (0, _chai.expect)(store.values(1)).to.equal(2);
        (0, _chai.expect)(store.values(2)).to.equal(3);
    });
});