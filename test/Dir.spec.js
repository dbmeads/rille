import {Dir} from '../lib/index';
import {expect} from 'chai';

describe('Dir', () => {

    var dir;

    beforeEach(() => {
        dir = Dir();
    });

    describe('exists', () => {
        it('should handle no child', () => {
            expect(dir.exists('test')).to.be.false;
        });
    });

    describe('child', () => {
        it('should create child', () => {
            var child = dir.child('test');

            expect(dir.exists('test')).to.be.true;
            expect(child).to.exist;
        });

        it('should create deep child', () => {
            var fragments = ['i', 'am', 'deep'];

            dir.child(fragments);

            fragments.forEach(fragment => {
                expect(dir.exists(fragment)).to.be.true;
                dir = dir.child(fragment);
            });
        });
    });

});