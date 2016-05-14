import {expect} from 'chai';
import {Key} from '../lib/index';

describe('Key', () => {
    describe('parse', () => {
        it('should parse correctly', () => {
            expect(Key.parse('/')).to.eql([]);
            expect(Key.parse('/child')).to.eql(['child']);
            expect(Key.parse('/lobby/1')).to.eql(['lobby', '1']);
        });

        it('should parsed input', () => {
            expect(Key.parse(['child'])).to.eql(['child']);
        });
    });

    describe('stringify', () => {
        it('should stringify correctly', () => {
            expect(Key.stringify([])).to.eql('/');
            expect(Key.stringify(['child'])).to.eql('/child');
            expect(Key.stringify(['lobby', '1'])).to.eql('/lobby/1');
        });

        it('should handle stringified input', () => {
            expect(Key.stringify('/child')).to.equal('/child');
        });
    });
});