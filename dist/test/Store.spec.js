'use strict';

var _index = require('../lib/index');

var _chai = require('chai');

describe('Store', function () {

    var store;

    beforeEach(function () {
        store = (0, _index.Store)();
    });

    describe('exists', function () {
        it('should handle no child', function () {
            (0, _chai.expect)(store.exists('test')).to.be.false;
        });
    });

    describe('child', function () {
        it('should create child', function () {
            var child = store.child('test');

            (0, _chai.expect)(store.exists('test')).to.be.true;
            (0, _chai.expect)(child).to.exist;
        });

        it('should create deep child', function () {
            var fragments = ['i', 'am', 'deep'];

            store.child(fragments);

            fragments.forEach(function (fragment) {
                (0, _chai.expect)(store.exists(fragment)).to.be.true;
                store = store.child(fragment);
            });
        });
    });

    describe('entry', function () {
        it('should handle current entry', function () {
            store.push('', 'hi!');

            var entry = store.entry();

            (0, _chai.expect)(entry[0]).to.equal('');
            (0, _chai.expect)(entry[1]).to.equal('hi!');
        });
    });
});