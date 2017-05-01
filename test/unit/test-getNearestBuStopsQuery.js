let expect = require('chai').expect;
let query = require('../../service/queries');
const _ = require('lodash');

describe('Test getNearestBusStops query', function () {

        it('Should return only 1 stop with Waitrose as stop name', function(done) {

            query.getNearestBusStops([{lat: 50.923710, long: -1.394745}]).then(resp => {
                let firstStop = _.head(_.head(resp));
                expect(firstStop.stop_name).to.be.equal("Waitrose");
                expect(resp.length).to.be.equal(1);

                done();
            });


        });


});



