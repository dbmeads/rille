const {expect} = require('chai');
const {Route} = require('../lib');

describe('Route', () => {

    let route;

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

    describe('push', () => {
       it('should not return internal route object', () => {
            expect(route.push()).to.equal(route);
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
            let child = route('/i/am/a/child');

            route('/i/am/a/child/*').subscribe((key, value) => {
                expect(key).to.equal('/i/am/a/child/too');
                expect(value).to.equal('Yay!');
                done();
            });

            child('/too').push('Yay!');
        });

        it('should properly route within a route', done => {
            let message = 'hi';

            route('/lobby').subscribe((key, message) => {
                expect(route('/lobby/1').key()).to.equal('/lobby/1');

                done();
            });

            route('/lobby').push(message);
        });
    });

    describe('plugin', () => {
        it('should support plugins', () => {
            let route = Route({
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

            let keys = route('/users').childKeys();

            expect(keys.length).to.equal(2);
            expect(keys.indexOf('1')).to.be.above(-1);
            expect(keys.indexOf('2')).to.be.above(-1);
        });
    });

    describe('middleware', () => {
        it('should be able to manipulate entries', done => {
            let route = Route({
                middleware: {
                    '/users/*': [
                        route => {
                            route('/test').push('hi!');
                        }
                    ]
                }
            });

            route('/test').subscribe((key, ...values) => {
                expect(key).to.equal('/test');
                expect(values[0]).to.equal('hi!');

                done();
            });

            route('/users/1').push('test');
        });

        it('should be able act as a passthrough', done => {
            let route = Route({
                middleware: {
                    '/users/*': [
                        (route, next, key, ...values) => {
                            next(...values);
                        }
                    ]
                }
            });

            route('/users/*').subscribe((key, ...values) => {
                expect(key).to.equal('/users/1');
                expect(values[0]).to.equal('test');

                done();
            });

            route('/users/1').push('test');
        });
    });

});
