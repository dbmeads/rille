import {expect} from 'chai';
import {Router} from '../lib/Router';

describe('Router', () => {

    it('should throw if no callback', () => {
        expect(() => Router()).to.throw(Error);
    });

    it('should provide JSON trie dump', done => {
        Router(router => {
            router.route('/some/kind/of/path');

            var json = router.toJSON();

            ['some', 'kind', 'of', 'path'].forEach(fragment => {
                expect(json.indexOf(fragment)).to.be.above(0);
            });

            expect(() => JSON.parse(json)).to.not.throw(Error);

            done();
        })
    });

    it('should handle root key', done => {
        Router(router => {
            router.route('/').subscribe((key, value) => {
                expect(key).to.equal('/');
                expect(value).to.equal('Hi!');
                done();
            });

            router.push('/notroot', 'Doh!');
            router.push('/', 'Hi!');
        });
    });

    it('should handle deeper key', done => {
        Router(router => {
            router.route('/users/1').subscribe((key, value) => {
                expect(key).to.equal('/users/1');
                expect(value).to.equal('bar');
                done();
            });

            router.push('/', 'foo');
            router.push('/users/1', 'bar');
        });
    });

    it('should handle dynamic routing', done => {
        Router(router => {
            router.route('/users/*').subscribe((key, value) => {
                expect(key).to.equal('/users/1');
                expect(value).to.equal('bar');
                done();
            });

            router.push('/', 'foo');
            router.push('/users/1', 'bar');
        });
    });

    describe('push', () => {
        it('should throw if no key', done => {
            Router(router => {
                expect(() => router.push()).to.throw(Error);
                done();
            })
        });
    });

});
