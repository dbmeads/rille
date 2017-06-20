'use strict';

var _SparceArray = require('../lib/SparceArray');

var _SparceArray2 = _interopRequireDefault(_SparceArray);

var _chai = require('chai');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('SparceArray', function () {

    var arr;

    beforeEach(function () {
        arr = new _SparceArray2.default();
    });

    describe('length', function () {
        it('should default to 0', function () {
            (0, _chai.expect)(arr.length).to.equal(0);
        });

        it('should report filled length', function () {
            arr.setAt(1, 'There!').setAt(0, 'Hi!').setAt(5, 'Again!');
            (0, _chai.expect)(arr.length).to.equal(2);
        });
    });

    describe('max', function () {
        it('should report max id', function () {
            arr.setAt(1, 'There!').setAt(0, 'Hi!').setAt(5, 'Again!');
            (0, _chai.expect)(arr.max).to.equal(5);
        });
    });
});