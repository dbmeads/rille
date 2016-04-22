'use strict';

var _chai = require('chai');

var _Router = require('../lib/Router');

describe('Router', function () {

    it('should throw error if no callback', function () {
        (0, _chai.expect)(function () {
            return (0, _Router.Router)();
        }).to.throw(Error);
    });

    it('should handle root key', function (done) {
        (0, _Router.Router)(function (router) {
            router.route('/').subscribe(function (record) {
                (0, _chai.expect)(record.value).to.equal('Hi!');
                done();
            });

            router.push('/notroot', 'Doh!');
            router.push('/', 'Hi!');
        });
    });

    it('should handle deeper key', function (done) {
        (0, _Router.Router)(function (router) {
            router.route('/users/1').subscribe(function (record) {
                (0, _chai.expect)(record.value).to.equal('bar');
                done();
            });

            router.push('/', 'foo');
            router.push('/users/1', 'bar');
        });
    });

    it('should handle dynamic routing', function (done) {
        (0, _Router.Router)(function (router) {
            router.route('/users/*').subscribe(function (record) {
                (0, _chai.expect)(record.value).to.equal('bar');
                done();
            });

            router.push('/', 'foo');
            router.push('/users/1', 'bar');
        });
    });
});