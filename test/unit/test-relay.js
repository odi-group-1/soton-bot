/**
 * TODO comment
 */

let expect = require('chai').expect;
let relay = require('../../controller/relay');
let aihandler = require('../../service/ai-handler');


describe('Test', function () {

    describe('Test', function () {

        it('Should', function(done) {

            // Setup req
            let req = {
                body: {
                    entry: [
                        { messaging: [
                            {
                                sender: {id: 'test'},
                                message: {text: 'HI'}
                            }
                            ]
                        }
                        ]
                }
            };

            let res = {};

            relay(req, res, function() {

                done();
            });

        });

        // it('Should', function() {
        //
        //     // Setup req
        //     let req = {
        //         body: {
        //             entry: [
        //                 { messaging: [
        //                     {event: {
        //                         sender: { id: 'test'},
        //                         message: {attachments: [{payload: {coordinates: { lat: '', long: ''}}}]}
        //                     }
        //                     }
        //                 ]
        //                 }
        //             ]
        //         }
        //     };
        //
        //     expect(true).to.be.equal(false);
        //
        // });


    });

});