import {expect} from 'chai';
import {Key} from '../lib/index';

describe('Key', () => {
    describe('parse', () => {
        it('should parse correctly', () => {
            expect(Key.parse('/')).to.eql([]);
            expect(Key.parse('/child')).to.eql(['child']);
            expect(Key.parse('/lobby/1')).to.eql(['lobby', '1']);
        });

        it('should handle parsed input', () => {
            expect(Key.parse(['child'])).to.eql(['child']);
        });

        it('should return specific path fragments when requested', () => {
            var [a, b] = Key.parse('/i/am/a/key', [0, 3]);

            expect(a).to.equal('i');
            expect(b).to.equal('key');
        });

        it('should throw proper exception if requested fragment is out of range', () => {
            expect(() => Key.parse('/i/am/a/key', [0, 4])).to.throw;
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