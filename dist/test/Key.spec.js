'use strict';

var _chai = require('chai');

var _index = require('../lib/index');

describe('Key', function () {
    it('should parse correctly', function () {
        (0, _chai.expect)(_index.Key.parse('/')).to.eql([]);
        (0, _chai.expect)(_index.Key.parse('/child')).to.eql(['child']);
        (0, _chai.expect)(_index.Key.parse('/lobby/1')).to.eql(['lobby', '1']);
    });

    it('should stringify correctly', function () {
        (0, _chai.expect)(_index.Key.stringify([])).to.eql('/');
        (0, _chai.expect)(_index.Key.stringify(['child'])).to.eql('/child');
        (0, _chai.expect)(_index.Key.stringify(['lobby', '1'])).to.eql('/lobby/1');
    });
});