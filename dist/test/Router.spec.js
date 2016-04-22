'use strict';

var _chai = require('chai');

var _Router = require('../lib/Router');

describe('Router', function () {

    it('should throw if no callback', function () {
        (0, _chai.expect)(function () {
            return (0, _Router.Router)();
        }).to.throw(Error);
    });

    it('should provide JSON trie dump', function (done) {
        (0, _Router.Router)(function (router) {
            router.route('/some/kind/of/path');

            var json = router.toJSON();

            ['some', 'kind', 'of', 'path'].forEach(function (fragment) {
                (0, _chai.expect)(json.indexOf(fragment)).to.be.above(0);
            });

            (0, _chai.expect)(function () {
                return JSON.parse(json);
            }).to.not.throw(Error);

            done();
        });
    });

    it('should handle root key', function (done) {
        (0, _Router.Router)(function (router) {
            router.route('/').subscribe(function (key, value) {
                (0, _chai.expect)(key).to.equal('/');
                (0, _chai.expect)(value).to.equal('Hi!');
                done();
            });

            router.push('/notroot', 'Doh!');
            router.push('/', 'Hi!');
        });
    });

    it('should handle deeper key', function (done) {
        (0, _Router.Router)(function (router) {
            router.route('/users/1').subscribe(function (key, value) {
                (0, _chai.expect)(key).to.equal('/users/1');
                (0, _chai.expect)(value).to.equal('bar');
                done();
            });

            router.push('/', 'foo');
            router.push('/users/1', 'bar');
        });
    });

    it('should handle dynamic routing', function (done) {
        (0, _Router.Router)(function (router) {
            router.route('/users/*').subscribe(function (key, value) {
                (0, _chai.expect)(key).to.equal('/users/1');
                (0, _chai.expect)(value).to.equal('bar');
                done();
            });

            router.push('/', 'foo');
            router.push('/users/1', 'bar');
        });
    });

    describe('push', function () {
        it('should throw if no key', function (done) {
            (0, _Router.Router)(function (router) {
                (0, _chai.expect)(function () {
                    return router.push();
                }).to.throw(Error);
                done();
            });
        });
    });
});