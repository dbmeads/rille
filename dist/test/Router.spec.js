'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiSpies = require('chai-spies');

var _chaiSpies2 = _interopRequireDefault(_chaiSpies);

var _Router = require('../lib/Router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiSpies2.default);

describe('Router', function () {

    it('should throw if no callback', function () {
        (0, _chai.expect)(function () {
            return (0, _Router.Router)();
        }).to.throw(Error);
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

                router.push('/notroot', 'Doh!');
                router.push('/', 'Hi!');
            });
        });

        it('should handle static', function (done) {
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

        it('should handle wildcard', function (done) {
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

        it('should handle unsubscribe', function (done) {
            (0, _Router.Router)(function (router) {
                var spy = _chai2.default.spy(function (key, value) {
                    (0, _chai.expect)(key).to.equal('/users/1');
                    (0, _chai.expect)(value).to.equal('bar');
                    done();
                });

                var unsubscribe = router.route('/users/*').subscribe(spy);

                unsubscribe();

                router.push('/', 'foo');
                router.push('/users/1', 'bar');

                router.route('/users/*').subscribe(function () {
                    (0, _chai.expect)(spy).to.not.have.been.called.once;
                    done();
                });
            });
        });

        it('should return latest entry', function (done) {
            var expected = { name: 'David' };

            (0, _Router.Router)(function (router) {
                router.push('/profile', expected);

                router.route('/profile').subscribe(function (key, value) {
                    (0, _chai.expect)(key).to.equal('/profile');
                    (0, _chai.expect)(value).to.eql(expected);
                    done();
                });
            });
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