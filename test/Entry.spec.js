import {expect} from 'chai';
import {Entry} from '../lib/index';

describe('Entry', () => {

    describe('key', () => {
        it('should return key', () => {
            expect(Entry.key(['/users/1', 'Hi!'])).to.equal('/users/1');
        });
    });

    describe('values', () => {
        it('should return array of data items', () => {
            expect(Array.isArray(Entry.values(['/key', '1', '2']))).to.be.true;
        });

        it('should handle undefined', () => {
            expect(Entry.values()).to.not.exist;
        });

        it('should return undefined if non array is passed', () => {
            expect(Entry.values('hi!')).to.not.exist;
        });
    });
});