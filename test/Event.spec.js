const {expect} = require('chai');
const {Event, Key} = require('../lib');

describe('Event', () => {

    describe('key', () => {
        it('should return key', () => {
            expect(Event(Key('/users/1'), 'Hi!').key.toString()).to.equal('/users/1');
        });
    });

});