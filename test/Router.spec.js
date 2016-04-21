import {expect} from 'chai';
import {Router} from '../lib/Router';

describe('Router', () => {
    it('should handle root key', done => {
        Router(router => {
            router.route('').subscribe(record => {
                expect(record.value).to.equal('Hi!');
                done();
            });

            router.push('', 'Hi!');
        });
    });

    it('should handle static case', done => {
        done();
    });

    it('should handle dynamic case', done => {
        done();
    });
});
