'use strict';

var _index = require('../lib/index');

var _chai = require('chai');

describe('Dir', function () {

    var dir;

    beforeEach(function () {
        dir = (0, _index.Dir)();
    });

    describe('exists', function () {
        it('should handle no child', function () {
            (0, _chai.expect)(dir.exists('test')).to.be.false;
        });
    });

    describe('child', function () {
        it('should create child', function () {
            var child = dir.child('test');

            (0, _chai.expect)(dir.exists('test')).to.be.true;
            (0, _chai.expect)(child).to.exist;
        });

        it('should create deep child', function () {
            var fragments = ['i', 'am', 'deep'];

            dir.child(fragments);

            fragments.forEach(function (fragment) {
                (0, _chai.expect)(dir.exists(fragment)).to.be.true;
                dir = dir.child(fragment);
            });
        });
    });
});