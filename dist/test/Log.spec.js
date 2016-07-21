'use strict';

var _index = require('../lib/index');

var _chai = require('chai');

describe('Log', function () {
    var log;

    beforeEach(function () {
        log = (0, _index.Log)();
    });

    it('should be able to return size', function () {
        (0, _chai.expect)(log.size()).to.equal(0);
    });
});