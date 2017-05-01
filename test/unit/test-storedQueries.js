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

    describe('Test busRoutes query', function () {

        it('Should add atcocodes correctly to query', function() {

            let atcoCode1 = "1980SN120415";
            let atcoCode2 = "1980SN120416";

            let result1 = "[ skos:notation '"+atcoCode1+"'^^soton:bus-stop-id-scheme]";
            let result2 = "[ skos:notation '"+atcoCode2+"'^^soton:bus-stop-id-scheme]";

            expect(stored.busRoutes(atcoCode1,atcoCode2).where[6].o).to.be.equal(result1);
            expect(stored.busRoutes(atcoCode1,atcoCode2).where[9].o).to.be.equal(result2);

        });

    });

    describe('Test busesStartNameStopName query', function () {

        it('Should add stop names correctly to query', function() {

            let stopName1 = "Civic Centre";
            let stopName2 = "Giddy Bridge";

            let result1 = "'"+stopName1+"'";
            let result2 = "'"+stopName2+"'";

            expect(stored.busesStartNameStopName(stopName1,stopName2).where[6].o).to.be.equal(result1);
            expect(stored.busesStartNameStopName(stopName1,stopName2).where[9].o).to.be.equal(result2);

        });

    });

    describe('Test stopsForGivenBus query', function () {

        it('Should add bus name and operator name correctly to query', function() {

            let busName = "Stile Inn";
            let operatorName = "Unilink";

            let result1 = "'"+busName+"'^^soton:bus-route-id-scheme"
            let result2 = "'"+operatorName+"'";

            expect(stored.stopsForGivenBus(busName,operatorName).where[3].o).to.be.equal(result1);
            expect(stored.stopsForGivenBus(busName,operatorName).where[4].o).to.be.equal(result2);

        });

    });

    describe('Test termDates query', function () {

        it('Should add passed year and passed term correctly to query', function() {

            let passedYear = "2017";
            let passedTerm = "Summer";

            let result = "regex(str(?name) , '"+passedYear+"') && regex(str(?name) , '"+passedTerm+"')";

            expect(stored.termDates(passedYear,passedTerm).where[4].cond).to.be.equal(result);

        });

    });


    describe('Test amenity query', function () {

        it('Should add Alcohol to query', function() {

            let amenity = 'Alcohol';

            let result = '?offering gr:availableAtOrFrom ?shop; rdfs:label "'+amenity+'"';

            expect(stored.amenity(amenity).where[1].s).to.be.equal(result);

        });

    });

    describe('Test room query', function () {

        it('Should add room to query', function() {

            let room = "32-1015";

            let result = '?room = rm:' + room;

            expect(stored.room(room).where[7].cond).to.be.equal(result);

        });

    });

    describe('Test freeRoom query', function () {

        it('Should add start date, end date and current date to query', function() {

            let startDate = "";
            let endDate = "";
            let currentDate = "";

            let result = "?start >= '" + dateSt + "'^^xsd:dateTime && ?start < '" + dateEnd + "'^^xsd:dateTime && ?end > '" + dateNow + "'^^xsd:dateTime";

            expect(stored.freeRoom(room).where[7].cond).to.be.equal(result);

        });

    });

});

