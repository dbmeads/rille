'use strict';

var _chai = require('chai');

var _index = require('../lib/index');

describe('Route', function () {

    var route;

    beforeEach(function () {
        route = (0, _index.Route)();
    });

    describe('key', function () {
        it('should know its key', function () {
            (0, _chai.expect)(route('/').key()).to.equal('/');
            (0, _chai.expect)(route('/child').key()).to.equal('/child');
            (0, _chai.expect)(route('/test/key/values').key()).to.equal('/test/key/values');
        });
    });

    describe('route()', function () {
        it('should handle root', function (done) {
            route('/').subscribe(function (key, value) {
                (0, _chai.expect)(key).to.equal('/');
                (0, _chai.expect)(value).to.equal('Hi!');
                done();
            });

            route('/notroot').push('Doh!');
            route('/').push('Hi!');
        });

        it('should handle immediate child', function (done) {
            route('/child').subscribe(function (key, value) {
                (0, _chai.expect)(key).to.equal('/child');
                (0, _chai.expect)(value).to.equal('Yay!');
                done();
            });

            route('/child').push('Yay!');
        });

        it('should handle static', function (done) {
            route('/users/1').subscribe(function (key, value) {
                (0, _chai.expect)(key).to.equal('/users/1');
                (0, _chai.expect)(value).to.equal('bar');
                done();
            });

            route('/').push('foo');
            route('/users/1').push('bar');
        });

        it('should handle wildcard', function (done) {
            route('/users/*').subscribe(function (key, value) {
                (0, _chai.expect)(key).to.equal('/users/1');
                (0, _chai.expect)(value).to.equal('bar');
                done();
            });

            route('/').push('foo');
            route('/users/1').push('bar');
        });

        it('should support relative pushes', function (done) {
            var child = route('/i/am/a/child');

            route('/i/am/a/child/*').subscribe(function (key, value) {
                (0, _chai.expect)(key).to.equal('/i/am/a/child/too');
                (0, _chai.expect)(value).to.equal('Yay!');
                done();
            });

            child('/too').push('Yay!');
        });

        it('should properly route within a route', function (done) {
            var message = 'hi';

            route('/lobby').subscribe(function (key, message) {
                (0, _chai.expect)(route('/lobby/1').key()).to.equal('/lobby/1');

                done();
            });

            route('/lobby').push(message);
        });
    });

    describe('plugin', function () {
        it('should support plugins', function () {
            var route = (0, _index.Route)({
                route: function route(_route) {
                    _route.entry = undefined;
                    _route.subscribe(function () {
                        for (var _len = arguments.length, entry = Array(_len), _key = 0; _key < _len; _key++) {
                            entry[_key] = arguments[_key];
                        }

                        _route.entry = entry;
                    });
                },
                wrap: function wrap(wrapper, route) {
                    wrapper.entry = function () {
                        return route.entry;
                    };
                }
            });

            route.push('Test');

            (0, _chai.expect)(route.entry()[1]).to.equal('Test');
        });
    });

    describe('toJSON', function () {
        it('should support JSON dump', function () {
            route('/one/path');
            route('/another/path');
            route('/*/test');

            (0, _chai.expect)(JSON.parse(route.toJSON())).to.not.throw;
            (0, _chai.expect)(route.toJSON().indexOf('another')).to.be.above(0);
        });
    });

    describe('childKeys', function () {
        it('should expose child keys', function () {
            route('/users/1');
            route('/users/2');

            var keys = route('/users').childKeys();

            (0, _chai.expect)(keys.length).to.equal(2);
            (0, _chai.expect)(keys.indexOf('1')).to.be.above(-1);
            (0, _chai.expect)(keys.indexOf('2')).to.be.above(-1);
        });
    });

    describe('functionTree', function () {
        it('should generate function tree', function (done) {
            route('/a');
            route('/test/1');
            route('/test/2');

            var push = route.functionTree('push');
            var subscribe = route.functionTree('subscribe');

            (0, _chai.expect)(push.a).to.exist;
            (0, _chai.expect)(push.test['1']).to.exist;
            (0, _chai.expect)(push.test['2']).to.exist;

            subscribe.a(function (key) {
                (0, _chai.expect)(key).to.equal('/a');
                (0, _chai.expect)(arguments.length <= 1 ? undefined : arguments[1]).to.equal('hi!');
                done();
            });

            push.a('hi!');
        });
    });

    describe('functionTrees', function () {
        it('should generate function trees', function (done) {
            route('/a');
            route('/test/1');
            route('/test/2');

            var _route$functionTrees = route.functionTrees('push', 'subscribe');

            var push = _route$functionTrees.push;
            var subscribe = _route$functionTrees.subscribe;


            (0, _chai.expect)(push.a).to.exist;
            (0, _chai.expect)(push.test['1']).to.exist;
            (0, _chai.expect)(push.test['2']).to.exist;

            subscribe.a(function (key) {
                (0, _chai.expect)(key).to.equal('/a');
                (0, _chai.expect)(arguments.length <= 1 ? undefined : arguments[1]).to.equal('hi!');
                done();
            });

            push.a('hi!');
        });
    });

    describe('middleware', function () {
        it('should be able to manipulate entries', function (done) {
            var route = (0, _index.Route)({
                middleware: {
                    '/users/*': [function (route) {
                        route('/test').push('hi!');
                    }]
                }
            });

            route('/test').subscribe(function (key) {
                (0, _chai.expect)(key).to.equal('/test');
                (0, _chai.expect)(arguments.length <= 1 ? undefined : arguments[1]).to.equal('hi!');

                done();
            });

            route('/users/1').push('test');
        });

        it('should be able act as a passthrough', function (done) {
            var route = (0, _index.Route)({
                middleware: {
                    '/users/*': [function (route, next, key) {
                        for (var _len2 = arguments.length, values = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
                            values[_key2 - 3] = arguments[_key2];
                        }

                        next.apply(undefined, values);
                    }]
                }
            });

            route('/users/*').subscribe(function (key) {
                (0, _chai.expect)(key).to.equal('/users/1');
                (0, _chai.expect)(arguments.length <= 1 ? undefined : arguments[1]).to.equal('test');

                done();
            });

            route('/users/1').push('test');
        });
    });
});