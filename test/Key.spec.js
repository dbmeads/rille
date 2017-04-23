const {expect} = require('chai');
const {Key} = require('../lib');

describe('Key', () => {
    it('should handle strings', () => {
        expect(Key('/').parts).to.eql([]);
        expect(Key('/child').parts).to.eql(['child']);
        expect(Key('/lobby/1').parts).to.eql(['lobby', '1']);
    });

    it('should handle an array of parts', () => {
        expect(Key(['child']).parts).to.eql(['child']);
    });

    it('should handle multiple arguments', () => {
        expect(Key('this', 'is', 'great').parts).to.eql(['this', 'is', 'great']);
    });

    describe('concat', () => {
        it('should be able to concat a part', () => {
            expect(Key('this').concat('is').parts).to.eql(['this', 'is']);
        });
    });

    describe('toString', () => {
        it('should join correctly', () => {
            expect(Key().toString()).to.eql('/');
            expect(Key('child').toString()).to.eql('/child');
            expect(Key('lobby', '1').toString()).to.eql('/lobby/1');
        });
    });
});