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
    });
});