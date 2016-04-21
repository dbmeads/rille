import {expect} from 'chai';
import {Router} from '../lib/Router';

describe('Router', () => {

    it('should handle root key', done => {
        Router(router => {
            router.route('/').subscribe(record => {
                expect(record.value).to.equal('Hi!');
                done();
            });

            router.push('/notroot', 'Doh!');
            router.push('/', 'Hi!');
        });
    });

    it('should handle deeper key', done => {
        Router(router => {
            router.route('/users/1').subscribe(record => {
                expect(record.value).to.equal('bar');
                done();
            });

            router.push('/', 'foo');
            router.push('/users/1', 'bar');
        });
    });

    it('should handle dynamic routing', done => {
        Router(router => {
            router.route('/users/*').subscribe(record => {
                expect(record.value).to.equal('bar');
                done();
            });
            
            router.push('/', 'foo');
            router.push('/users/1', 'bar');
        });
    });
});
