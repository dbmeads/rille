import {expect} from 'chai';
import {Route} from '../lib/index';

describe('Route', () => {

    var route;

    beforeEach(() => {
        route = Route();
    });

    describe('key', () => {
        it('should know its key', () => {
            expect(route('/').key()).to.equal('/');
            expect(route('/child').key()).to.equal('/child');
            expect(route('/test/key/values').key()).to.equal('/test/key/values');
        });
    });

    describe('route()', () => {
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

        it('should properly route within a route', done => {
            var message = 'hi';

            route('/lobby').subscribe((key, message) => {
                expect(route('/lobby/1').key()).to.equal('/lobby/1');

                done();
            });

            route('/lobby').push(message);
        });
    });

    describe('plugin', () => {
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

    describe('toJSON', () => {
        it('should support JSON dump', () => {
            route('/one/path');
            route('/another/path');
            route('/*/test');

            expect(JSON.parse(route.toJSON())).to.not.throw;
            expect(route.toJSON().indexOf('another')).to.be.above(0);
        });
    });

    describe('childKeys', () => {
        it('should expose child keys', () => {
            route('/users/1');
            route('/users/2');

            var keys = route('/users').childKeys();

            expect(keys.length).to.equal(2);
            expect(keys.indexOf('1')).to.be.above(-1);
            expect(keys.indexOf('2')).to.be.above(-1);
        });
    });

    describe('functionTree', () => {
        it('should generate function tree', done => {
            route('/a');
            route('/test/1');
            route('/test/2');

            var push = route.functionTree('push');
            var subscribe = route.functionTree('subscribe');

            expect(push.a).to.exist;
            expect(push.test['1']).to.exist;
            expect(push.test['2']).to.exist;

            subscribe.a((key, ...values) => {
                expect(key).to.equal('/a');
                expect(values[0]).to.equal('hi!');
                done();
            });

            push.a('hi!');
        });
    });

    describe('functionTrees', () => {
        it('should generate function trees', done => {
            route('/a');
            route('/test/1');
            route('/test/2');

            var {push, subscribe} = route.functionTrees('push', 'subscribe');

            expect(push.a).to.exist;
            expect(push.test['1']).to.exist;
            expect(push.test['2']).to.exist;

            subscribe.a((key, ...values) => {
                expect(key).to.equal('/a');
                expect(values[0]).to.equal('hi!');
                done();
            });

            push.a('hi!');
        });
    });

});
