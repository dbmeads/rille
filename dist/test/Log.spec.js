'use strict';

var _chai = require('chai');

var _Log = require('../lib/Log');

var _Log2 = _interopRequireDefault(_Log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Log', function () {

    it('should throw if no callback', function () {
        (0, _chai.expect)(function () {
            return (0, _Log2.default)();
        }).to.throw(Error);
    });

    it('should stream previous and future entries', function (done) {
        (0, _Log2.default)(function (log) {
            var expected = [1, 2];

            expected.forEach(function (value) {
                return log.push(value);
            });

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

    it('should be capable of validating each entry', function (done) {
        (0, _Log2.default)({
            schema: {
                type: 'array'
            }
        }, function (log) {
            (0, _chai.expect)(function () {
                return log.push(1);
            }).to.throw(Error);
            done();
        });
    });

    describe('push', function () {
        it('should create list when args > 1', function (done) {
            (0, _Log2.default)(function (log) {
                log.subscribe(function (list) {
                    (0, _chai.expect)(list.size).to.equal(3);
                    done();
                });

                log.push(1, 2, 3);
            });
        });
    });
});