/**
 * TODO comment
 */

let expect = require('chai').expect;
let relay = require('../../controller/relay');
let actions = require('../../responses/actions');
let aihandler = require('../../service/ai-handler');
let sinon = require('sinon');


describe('Test relay.js', function () {

    describe('Test text message', function () {

        it('Should send text to ai-handler with callback of actions.switchOnAction', function() {

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

            let stub2 = sinon.stub(actions, 'switchOnAction').returns(function() {});

            let stub = sinon.stub(aihandler, 'handleThis');
            stub.yields();

            relay(req, res);
            stub.restore();
            stub2.restore();
            sinon.assert.calledOnce(stub2);
            sinon.assert.calledOnce(stub);
            sinon.assert.calledWith(stub, 'HI', 'test');

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