import {Store} from '../lib/index';
import {expect} from 'chai';

describe('Store', () => {
    var store;

    beforeEach(() => {
        store = Store();
    });

    it('should have an entry function', () => {
        expect(store.entry()).to.equal(undefined);
    });

    it('should have a data function', () => {
        store.push('hi!');
        store('/path/1').push(1,2,3);

        expect(store.data()).to.equal('hi!');
        expect(store('/path/1').data().length).to.equal(3);
        expect(store('/path/1').data()[0]).to.equal(1);
        expect(store('/path/1').data()[1]).to.equal(2);
        expect(store('/path/1').data()[2]).to.equal(3);
    });
});
