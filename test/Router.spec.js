import chai, {expect} from 'chai';
import spies from 'chai-spies';
import {Router} from '../lib/Router';

chai.use(spies);

describe('Router', () => {

    var router;

    beforeEach(() => {
        router = Router();
    });

    describe('route', () => {
        it('should handle root', done => {
            router.route('/').subscribe((key, value) => {
                expect(key).to.equal('/');
                expect(value).to.equal('Hi!');
                done();
            });

            router.push('/notroot', 'Doh!');
            router.push('/', 'Hi!');
        });

        it('should handle static', done => {
            router.route('/users/1').subscribe((key, value) => {
                expect(key).to.equal('/users/1');
                expect(value).to.equal('bar');
                done();
            });

            router.push('/', 'foo');
            router.push('/users/1', 'bar');
        });

        it('should handle wildcard', done => {
            router.route('/users/*').subscribe((key, value) => {
                expect(key).to.equal('/users/1');
                expect(value).to.equal('bar');
                done();
            });

            router.push('/', 'foo');
            router.push('/users/1', 'bar');
        });

        it('should handle unsubscribe', done => {
            var spy = chai.spy((key, value) => {
                expect(key).to.equal('/users/1');
                expect(value).to.equal('bar');
                done();
            });

            var unsubscribe = router.route('/users/*').subscribe(spy);

            unsubscribe();

            router.push('/', 'foo');
            router.push('/users/1', 'bar');

            router.route('/users/*').subscribe(() => {
                expect(spy).to.not.have.been.called.once;
                done();
            });
        });

        it('should return latest entry', done => {
            var expected = {name: 'David'};

            router.push('/profile', expected);

            router.route('/profile').subscribe((key, value) => {
                expect(key).to.equal('/profile');
                expect(value).to.eql(expected);
                done();
            });
        });
    });

});
