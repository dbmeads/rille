import {Log} from '../lib/index';
import {expect} from 'chai';

describe('Log', () => {
    var log;

    beforeEach(() => {
        log = Log();
    });

    it('should be able to return size', () => {
        expect(log.size()).to.equal(0);
    });

});