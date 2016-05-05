import {expect} from 'chai';
import {Route} from '../lib/index';

describe('Route', () => {

    var route;

    beforeEach(() => {
        route = Route();
    });

    it('should know its key', () => {
        expect(route('/').key()).to.equal('/');
        expect(route('/child').key()).to.equal('/child');
        expect(route('/test/key/values').key()).to.equal('/test/key/values');
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

    it('should handle immediate child', done => {
        route('/child').subscribe((key, value) => {
            expect(key).to.equal('/child');
            expect(value).to.equal('Yay!');
            done();
        });

        route('/child').push('Yay!');
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

    it('should support plugins', () => {
        var route = Route({
            route(route) {
                route.entry = undefined;
                route.subscribe((...entry) => {
                    route.entry = entry;
                });
            },
            wrap(wrapper, route) {
                wrapper.entry = () => route.entry;
            }
        });

        route.push('Test');

        expect(route.entry()[1]).to.equal('Test');
    });

});
