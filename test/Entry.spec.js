import {expect} from 'chai';
import {Entry} from '../lib/index';

describe('Entry', () => {

    describe('key', () => {
        it('should return key', () => {
            expect(Entry.key(['/users/1', 'Hi!'])).to.equal('/users/1');
        });
    });

    describe('data', () => {
        it('should return data if only one item', () => {
            expect(Entry.data(['/users/1', 'Hi!'])).to.equal('Hi!');
        });

        it('should return array if multiple data items', () => {
            expect(Array.isArray(Entry.data(['/key', '1', '2']))).to.be.true;
        });

        it('should handle undefined', () => {
            expect(Entry.data()).to.not.exist;
        });

        it('should return undefined if non array is passed', () => {
            expect(Entry.data('hi!')).to.not.exist;
        });
    });
});