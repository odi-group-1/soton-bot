/**
 * TODO comment
 */

let sinon = require('sinon');
let expect = require('chai').expect;
let queries = require('../../service/queries');
let jqc = require('../../service/sparqlUrlMachine/jsonQueryConverter');
let stored = require('../../service/sparqlUrlMachine/storedQueries');

describe('Test queries.js', function () {

    describe('Test findBuilding', function () {

        it('Should return latitude and longitude of a building on success', function (done) {

            let stubStored = sinon.stub(stored, 'building').returns(undefined);
            let stubJQC = sinon.stub(jqc, 'getOfferings');
            stubJQC.yields([{o: {value: 1}}, {o: {value: 2}}]);

            queries.findBuilding('32', function (result) {
                stubStored.restore();
                stubJQC.restore();
                expect(result.lat).to.be.equal(1);
                expect(result.long).to.be.equal(2);
                done();
            })

        });

        it("Should return 'Something went wrong...' on failure", function (done) {

            let stubStored = sinon.stub(stored, 'building').returns(undefined);
            let stubJQC = sinon.stub(jqc, 'getOfferings');
            stubJQC.yields([{bad: 'BAD_RESULT'}]);

            queries.findBuilding('BAD_VALUE', function (result) {
                stubStored.restore();
                stubJQC.restore();
                expect(result).to.be.equal('Something went wrong...');
                done();
            })

        });

        it("Should return 'Sorry, I don't know where that is...' when a bad building id is provided", function (done) {

            let stubStored = sinon.stub(stored, 'building').returns(undefined);
            let stubJQC = sinon.stub(jqc, 'getOfferings');
            stubJQC.yields([]);

            queries.findBuilding('BAD_VALUE', function (result) {
                stubStored.restore();
                stubJQC.restore();
                expect(result).to.be.equal("Sorry, I don't know where that is...");
                done();
            })

        });
    });

    describe('Test findNearestFood', function () {

        it.only("Should", function (done) {

            let location = { lat: 0, long: 0 };

            let stubStored = sinon.stub(stored, 'food').returns(undefined);
            let stubJQC = sinon.stub(jqc, 'getOfferings');
            stubJQC.yields( [ { lat: {value: 0},
                                long: {value: 0},
                                Business: {value: ' '},
                                name: {value: ' '}
                              }
                            ] );

            queries.findNearestFood(location, function (result) {
                stubJQC.restore();
                stubStored.restore();
                expect(result[0]).to.be.deep.equal({ uri: ' ', lat: 0, long: 0, name: ' ', dist: 0 });
                done();
            })

        });

    });
});