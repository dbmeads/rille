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

    it('should have a data function', function () {
        store.push('hi!');
        store('/path/1').push(1, 2, 3);

        (0, _chai.expect)(store.data()).to.equal('hi!');
        (0, _chai.expect)(store('/path/1').data().length).to.equal(3);
        (0, _chai.expect)(store('/path/1').data()[0]).to.equal(1);
        (0, _chai.expect)(store('/path/1').data()[1]).to.equal(2);
        (0, _chai.expect)(store('/path/1').data()[2]).to.equal(3);
    });
});