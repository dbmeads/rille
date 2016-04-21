'use strict';

var _chai = require('chai');

var _Log = require('../lib/Log');

var _Log2 = _interopRequireDefault(_Log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Log', function () {
    it('should stream previous and future entries', function (done) {
        (0, _Log2.default)(function (log) {
            var expected = [1, 2];

            log.push.apply(null, expected);

            expected.push(3);

            log.subscribe(function (entry) {
                (0, _chai.expect)(entry).to.equal(expected.shift());
                if (expected.length === 0) {
                    done();
                }
            });

            log.push(3);
        });
    });
});