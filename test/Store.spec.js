const {expect} = require('chai');
const {Store} = require('../lib');

describe('Store', () => {
    let store;

    beforeEach(() => {
        store = Store();
    });

    it('should have an entry function', () => {
        expect(store.entry()).to.equal(undefined);
    });

    it('should return the values array', () => {
        store.push('hi!');
        store('/path/1').push(1,2,3);

        expect(store.values()).to.eql(['hi!']);
        expect(store('/path/1').values().length).to.equal(3);
        expect(store('/path/1').values()[0]).to.equal(1);
        expect(store('/path/1').values()[1]).to.equal(2);
        expect(store('/path/1').values()[2]).to.equal(3);
    });

    it('should return an empty array when no value exists', () => {
        expect(Array.isArray(store.values())).to.be.true;
    });

    it('should return requested value', () => {
        store.push(1,2,3);

        expect(store.value(0)).to.equal(1);
        expect(store.value(1)).to.equal(2);
        expect(store.value(2)).to.equal(3);
    });

    it('should return first value by default', () => {
        store.push(1,2,3);

        expect(store.value()).to.equal(1);
    });
});
