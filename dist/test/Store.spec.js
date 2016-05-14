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
});