let expect = require('chai').expect;
let jqc = require('../../service/sparqlUrlMachine/jsonQueryConverter');

describe('Test JSON query parser', function () {

    describe('Test simple query', function () {

        it('Should the canonical ?s ?p ?o query correctly', function() {

            let testQuery = {
                endpoint: '',
                select: [ '?s', '?p', '?o' ],
                where: [
                    {
                        type: 'STANDARD',
                        s: '?s',
                        p: '?p',
                        o: '?o'
                    }
                ]
            };

            let result = 'SELECT%20%3Fs%20%3Fp%20%3Fo%20WHERE%20%7B%20%3Fs%20%3Fp%20%3Fo.%20%7D%20';

            expect(jqc.parseJsonQuery(testQuery)).to.be.equal(result);

        });

    });

});