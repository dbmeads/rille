'use strict';

var _chai = require('chai');

var _Route = require('../lib/Route');

describe('Route', function () {

    var route;

    beforeEach(function () {
        route = (0, _Route.Route)();
    });

    it('should know its key', function () {
        var child = route('/test/key/values');

        (0, _chai.expect)(child.key()).to.equal('/test/key/values');
    });

    it('should handle root', function (done) {
        route('/').subscribe(function (key, value) {
            (0, _chai.expect)(key).to.equal('/');
            (0, _chai.expect)(value).to.equal('Hi!');
            done();
        });

        route('/notroot').push('Doh!');
        route('/').push('Hi!');
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

    it('should support plugins', function () {
        var route = (0, _Route.Route)({
            route: function route(_route) {
                _route.entry = undefined;
                _route.subscribe(function () {
                    for (var _len = arguments.length, entry = Array(_len), _key = 0; _key < _len; _key++) {
                        entry[_key] = arguments[_key];
                    }

                    _route.entry = entry;
                });
            },
            wrap: function wrap(_route, route) {
                route.entry = function () {
                    return _route.entry;
                };
            }
        });

        route.push('Test');

        (0, _chai.expect)(route.entry()[1]).to.equal('Test');
    });
});