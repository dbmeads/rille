'use strict';

var _chai = require('chai');

var _index = require('../lib/index');

describe('Route', function () {

    var route;

    beforeEach(function () {
        route = (0, _index.Route)();
    });

    it('should know its key', function () {
        (0, _chai.expect)(route('/').key()).to.equal('/');
        (0, _chai.expect)(route('/child').key()).to.equal('/child');
        (0, _chai.expect)(route('/test/key/values').key()).to.equal('/test/key/values');
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

    it('should support JSON dump', function () {
        route('/one/path');
        route('/another/path');
        route('/*/test');

        (0, _chai.expect)(JSON.parse(route.toJSON())).to.not.throw;
        (0, _chai.expect)(route.toJSON().indexOf('another')).to.be.above(0);
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