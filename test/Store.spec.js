import {Store} from '../lib/index';
import {expect} from 'chai';

describe('Store', () => {

    var store;

    beforeEach(() => {
        store = Store();
    });

    describe('exists', () => {
        it('should handle no child', () => {
            expect(store.exists('test')).to.be.false;
        });
    });

    describe('child', () => {
        it('should create child', () => {
            var child = store.child('test');

            expect(store.exists('test')).to.be.true;
            expect(child).to.exist;
        });

        it('should create deep child', () => {
            var fragments = ['i', 'am', 'deep'];

            store.child(fragments);

            fragments.forEach(fragment => {
                expect(store.exists(fragment)).to.be.true;
                store = store.child(fragment);
            });
        });
    });

});