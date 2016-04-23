import {expect} from 'chai';
import {Router} from '../lib/Router';

describe('Router', () => {

    it('should throw if no callback', () => {
        expect(() => Router()).to.throw(Error);
    });

    it('should provide JSON dump', done => {
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

    describe('route', () => {
        it('should throw if no key', done => {
            Router(router => {
                expect(() => router.route()).to.throw(Error);
                done();
            });
        });

        it('should handle root', done => {
            Router(router => {
                router.route('/').subscribe((key, value) => {
                    expect(key).to.equal('/');
                    expect(value).to.equal('Hi!');
                    done();
                });

                router.log.push('/notroot', 'Doh!');
                router.log.push('/', 'Hi!');
            });
        });

        it('should handle static', done => {
            Router(router => {
                router.route('/users/1').subscribe((key, value) => {
                    expect(key).to.equal('/users/1');
                    expect(value).to.equal('bar');
                    done();
                });

                router.log.push('/', 'foo');
                router.log.push('/users/1', 'bar');
            });
        });

        it('should handle wildcard', done => {
            Router(router => {
                router.route('/users/*').subscribe((key, value) => {
                    expect(key).to.equal('/users/1');
                    expect(value).to.equal('bar');
                    done();
                });

                router.log.push('/', 'foo');
                router.log.push('/users/1', 'bar');
            });
        });

        it('should return latest entry', done => {
            var expected = {name: 'David'};

            Router(router => {
                router.log.push('/profile', expected);

                router.route('/profile').subscribe((key, value) => {
                    expect(key).to.equal('/profile');
                    expect(value.toJS()).to.eql(expected);
                    done();
                });
            });
        });
    });

    describe('push', () => {
        it('should throw if no key', done => {
            Router(router => {
                expect(() => router.log.push()).to.throw(Error);
                done();
            })
        });
    });

});
