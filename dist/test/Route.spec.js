'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiSpies = require('chai-spies');

var _chaiSpies2 = _interopRequireDefault(_chaiSpies);

var _Route = require('../lib/Route');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiSpies2.default);

describe('Route', function () {

    var route;

    beforeEach(function () {
        route = (0, _Route.Route)();
    });

    it('should know it\'s key', function () {
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
});