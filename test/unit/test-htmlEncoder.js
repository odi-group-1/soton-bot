/**
 * Tests for the HTML encoder. N.B. no need to test 'encodeURIComponent' as it is built in and already tested
 */

let expect = require('chai').expect;
let encoder = require('../../service/sparqlUrlMachine/htmlEncoder');

describe('Test html encoder', function () {

    describe('Test encoding', function () {

        it('Should replace single quote with %27', function() {

            let str = "SOMETHING'TO'ENCODE";
            let res = 'SOMETHING%27TO%27ENCODE';

            expect(encoder.encode(str)).to.be.equal(res);

        });

        it('Should replace double quote with %22', function() {

            let str = 'SOMETHING"TO"ENCODE';
            let res = 'SOMETHING%22TO%22ENCODE';

            expect(encoder.encode(str)).to.be.equal(res);
        });

    });

});