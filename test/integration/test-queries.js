let expect = require('chai').expect;
let jqc = require('../../service/sparqlUrlMachine/jsonQueryConverter');
let stored = require('../../service/sparqlUrlMachine/storedQueries');

describe('Test generated queries', function () {

    describe('Test building query results', function () {

        it('Should return building 32 info', function(done) {

            let query = stored.building('32');

            jqc.getOfferings(query, function (results) {
                expect(results[0].s.value).to.be.equal('http://id.southampton.ac.uk/building/32');
                expect(results[1].s.value).to.be.equal('http://id.southampton.ac.uk/building/32');
                expect(results[0].p.value).to.be.equal('http://www.w3.org/2003/01/geo/wgs84_pos#lat');
                expect(results[1].p.value).to.be.equal('http://www.w3.org/2003/01/geo/wgs84_pos#long');
                done();
            });
        });

    });

    describe('Test canITakeBusToX query results', function () {

        it('Should return correct bus names for going from Civic Centre to Giddy Bridge', function(done) {

            let query = stored.busesStartNameStopName("Civic Centre","Giddy Bridge");

            jqc.query(query).then(routes => {
                expect(routes[0].busName.value).to.be.equal('CP');
                expect(routes[1].busName.value).to.be.equal('U1N');
                expect(routes[2].busName.value).to.be.equal('U1A');
                expect(routes[3].busName.value).to.be.equal('U1E');
                expect(routes[4].busName.value).to.be.equal('U1W');
                done();
            });
        });

    });

    describe('Test whereCanITakeThisBus query results', function () {

        it('Should return stop names for a given bus and operator', function(done) {

            let query = stored.stopsForGivenBus("U1","Unilink");

            jqc.query(query).then(stops => {
                expect(stops[0].stopName.value).to.be.equal('Montefiore House');
                expect(stops[1].stopName.value).to.be.equal('High Road');
                expect(stops[2].stopName.value).to.be.equal('Aster Road');
                expect(stops[3].stopName.value).to.be.equal('Tulip Road');
                expect(stops[4].stopName.value).to.be.equal('Bealing Close');
                expect(stops[5].stopName.value).to.be.equal('Library');
                expect(stops[6].stopName.value).to.be.equal('Stile Inn');
                done();
            });
        });

    });

    describe('Test endTermDates and startTermDates query results', function () {

        it('Should return terms matching searched year and term', function(done) {

            let query = stored.termDates("2017", "Summer");

            jqc.query(query).then(terms => {

                expect(terms.length).to.be.equal(2);

                expect(terms[0].name.value).to.be.equal('Summer Term, 2016-2017');
                expect(terms[0].startDate.value).to.be.equal('2017-04-24T00:00:00Z');
                expect(terms[0].endDate.value).to.be.equal('2017-06-17T23:59:59Z');

                expect(terms[1].name.value).to.be.equal('Summer Term, 2017-2018');
                expect(terms[1].startDate.value).to.be.equal('2018-04-16T00:00:00Z');
                expect(terms[1].endDate.value).to.be.equal('2018-06-16T23:59:59Z');
                done();
            });
        });

    });

});