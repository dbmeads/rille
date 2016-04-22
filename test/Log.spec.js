import {expect} from 'chai';
import Log from '../lib/Log';

describe('Log', () => {

    it('should throw error if no callback', () => {
        expect(() => Log()).to.throw(Error);
    });

    it('should stream previous and future entries', done => {
        Log(log => {
            var expected = [1, 2];

            log.push.apply(null, expected);

            expected.push(3);

            log.subscribe(entry => {
                expect(entry).to.equal(expected.shift());
                if (expected.length === 0) {
                    done();
                }
            });

            log.push(3);
        });
    });

    it('should be capable of validating each entry', done => {
        Log({
            schema: {
                type: 'array'
            }
        }, log => {
            expect(() => {
                log.push(1);
            }).to.throw(Error);
            done();
        });
    });
});