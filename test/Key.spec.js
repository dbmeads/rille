import {expect} from 'chai';
import {Key} from '../lib/index';

describe('Key', () => {
    it('should parse correctly', () => {
        expect(Key.parse('/')).to.eql([]);
        expect(Key.parse('/child')).to.eql(['child']);
        expect(Key.parse('/lobby/1')).to.eql(['lobby', '1']);
    });

    it('should stringify correctly', () => {
        expect(Key.stringify([])).to.eql('/');
        expect(Key.stringify(['child'])).to.eql('/child');
        expect(Key.stringify(['lobby', '1'])).to.eql('/lobby/1');
    });
});