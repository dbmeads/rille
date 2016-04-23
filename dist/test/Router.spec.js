'use strict';

var _chai = require('chai');

var _Router = require('../lib/Router');

describe('Router', function () {

    it('should throw if no callback', function () {
        (0, _chai.expect)(function () {
            return (0, _Router.Router)();
        }).to.throw(Error);
    });

    it('should provide JSON dump', function (done) {
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

    describe('route', function () {
        it('should throw if no key', function (done) {
            (0, _Router.Router)(function (router) {
                (0, _chai.expect)(function () {
                    return router.route();
                }).to.throw(Error);
                done();
            });
        });

        it('should handle root', function (done) {
            (0, _Router.Router)(function (router) {
                router.route('/').subscribe(function (key, value) {
                    (0, _chai.expect)(key).to.equal('/');
                    (0, _chai.expect)(value).to.equal('Hi!');
                    done();
                });

                router.log.push('/notroot', 'Doh!');
                router.log.push('/', 'Hi!');
            });
        });

        it('should handle static', function (done) {
            (0, _Router.Router)(function (router) {
                router.route('/users/1').subscribe(function (key, value) {
                    (0, _chai.expect)(key).to.equal('/users/1');
                    (0, _chai.expect)(value).to.equal('bar');
                    done();
                });

                router.log.push('/', 'foo');
                router.log.push('/users/1', 'bar');
            });
        });

        it('should handle wildcard', function (done) {
            (0, _Router.Router)(function (router) {
                router.route('/users/*').subscribe(function (key, value) {
                    (0, _chai.expect)(key).to.equal('/users/1');
                    (0, _chai.expect)(value).to.equal('bar');
                    done();
                });

                router.log.push('/', 'foo');
                router.log.push('/users/1', 'bar');
            });
        });

        it('should return latest entry', function (done) {
            var expected = { name: 'David' };

            (0, _Router.Router)(function (router) {
                router.log.push('/profile', expected);

                router.route('/profile').subscribe(function (key, value) {
                    (0, _chai.expect)(key).to.equal('/profile');
                    (0, _chai.expect)(value.toJS()).to.eql(expected);
                    done();
                });
            });
        });
    });

    describe('push', function () {
        it('should throw if no key', function (done) {
            (0, _Router.Router)(function (router) {
                (0, _chai.expect)(function () {
                    return router.log.push();
                }).to.throw(Error);
                done();
            });
        });
    });
});