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
            var values = Entry.values();

            expect(Array.isArray(values)).to.be.true;
            expect(values.length).to.equal(0);
        });

        it('should return empty array if non array is passed', () => {
            var values = Entry.values('Hi!');

            expect(Array.isArray(values)).to.be.true;
            expect(values.length).to.equal(0);
        });
    });

    describe('value', () => {
        it('should return value at position', () => {
            expect(Entry.value(['/key', 1, 2], 1)).to.equal(2);
        });
    });
});