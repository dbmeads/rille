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
});
