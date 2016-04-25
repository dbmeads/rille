import chai, {expect} from 'chai';
import spies from 'chai-spies';
import {Route} from '../lib/Route';

chai.use(spies);

describe('Route', () => {

    var route;

    beforeEach(() => {
        route = Route();
    });

    it('should know it\'s key', () => {
        var child = route('/test/key/values');

        expect(child.key()).to.equal('/test/key/values');
    });

    it('should handle root', done => {
        route('/').subscribe((key, value) => {
            expect(key).to.equal('/');
            expect(value).to.equal('Hi!');
            done();
        });

        route('/notroot').push('Doh!');
        route('/').push('Hi!');
    });

    it('should handle static', done => {
        route('/users/1').subscribe((key, value) => {
            expect(key).to.equal('/users/1');
            expect(value).to.equal('bar');
            done();
        });

        route('/').push('foo');
        route('/users/1').push('bar');
    });

    it('should handle wildcard', done => {
        route('/users/*').subscribe((key, value) => {
            expect(key).to.equal('/users/1');
            expect(value).to.equal('bar');
            done();
        });

        route('/').push('foo');
        route('/users/1').push('bar');
    });

    it('should support relative pushes', done => {
        var child = route('/i/am/a/child');

        route('/i/am/a/child/*').subscribe((key, value) => {
            expect(key).to.equal('/i/am/a/child/too');
            expect(value).to.equal('Yay!');
            done();
        });

        child('/too').push('Yay!');
    });

});
