let expect = require('chai').expect;
let stored = require('../../service/sparqlUrlMachine/storedQueries');

describe('Test stored queries', function () {

    describe('Test building query', function () {

        it('Should add building id to query', function() {

            let id = 32;

            let result = '?s = <http://id.southampton.ac.uk/building/32> '+
                '&& (?p = <http://www.w3.org/2003/01/geo/wgs84_pos#lat> '+
                '|| ?p = <http://www.w3.org/2003/01/geo/wgs84_pos#long>)';

            expect(stored.building(id).where[1].cond).to.be.equal(result);

        });

    });

});