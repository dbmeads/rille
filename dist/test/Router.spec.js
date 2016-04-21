'use strict';

var _chai = require('chai');

var _Router = require('../lib/Router');

describe('Router', function () {
    it('should handle root key', function (done) {
        (0, _Router.Router)(function (router) {
            router.route('').subscribe(function (record) {
                (0, _chai.expect)(record.value).to.equal('Hi!');
                done();
            });

            router.push('', 'Hi!');
        });
    });

    it('should handle static case', function (done) {
        done();
    });

    it('should handle dynamic case', function (done) {
        done();
    });
});