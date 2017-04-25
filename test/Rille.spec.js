const {expect} = require('chai');
const Rille = require('../lib');

describe('Rille', () => {

    let rille;

    beforeEach(() => {
        rille = Rille();
    });

    it('should be able to find root', () => {
        let child = rille('/test/this/route');

        expect(child).to.not.eql(rille);
        expect(child.root).to.eql(rille);
    });

    it('should be able to find children', () => {
        let child = rille('/test/this/route');

        expect(rille.child('test').child('this').child('route')).to.eql(child);
    });

    it('should be able to list key', () => {
        expect(rille('/another/route').key.toString()).to.equal('/another/route');
    });

    it('should be able to recieve event', done => {
        rille
            .sub(event => {
                expect(event[0]).to.eql('some data');
                done();
            });

        rille.pub('some data');
    });

    it('should be able to recieve event with wildcard', done => {
        rille('/users/*')
            .sub(event => {
                expect(event[0].firstname).to.eql('Dave');
                done();
            });

        rille('/users/1').pub({firstname: 'Dave'});
    });

    it('should count number of events emitted', () => {
        rille('/users/2').pub(1).pub(2);

        expect(rille('/users/2').count()).to.eql(2);
    });

});
