/**
 * TODO comment
 */

let sinon = require('sinon');
let expect = require('chai').expect;
let relay = require('../../controller/relay');
let actions = require('../../responses/actions');
let aihandler = require('../../service/ai-handler');
let env = require('../../config/staging');
let sendMessage = require('../../service/fb-messaging/send-message');


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

            let res = 'FAKE RES';

            let stub2 = sinon.stub(actions, 'switchOnAction').returns(function() {});

            let stub = sinon.stub(aihandler, 'handleThis');
            stub.yields();

            relay(req, res);
            stub.restore();
            stub2.restore();
            sinon.assert.calledOnce(stub2);
            sinon.assert.calledWith(stub2, req, res);
            sinon.assert.calledOnce(stub);
            sinon.assert.calledWith(stub, 'HI', 'test');

        });

        it('Should send location payload to ai-handler with callback of actions.switchOnAction', function() {

            // Setup req
            let req = {
                body: {
                    entry: [
                        { messaging: [
                            {
                                sender: {id: 'test'},
                                message: {attachments: [{payload: {coordinates: { lat: '', long: ''}}}]}
                            }
                        ]
                        }
                    ]
                }
            };

            let res = 'FAKE RES';

            let stub2 = sinon.stub(actions, 'switchOnAction').returns(function() {});

            let stub = sinon.stub(aihandler, 'handleThis');
            stub.yields();

            relay(req, res);
            stub.restore();
            stub2.restore();
            sinon.assert.calledOnce(stub2);
            sinon.assert.calledWith(stub2, req, res);
            sinon.assert.calledOnce(stub);
            sinon.assert.calledWith(stub, env.API_AI_HIDDEN_KEYS.COORDINATE, 'test');

        });

        it("Should call echo with string 'I don't recognize the attachments'", function() {

            // Setup req
            let req = {
                body: {
                    entry: [
                        { messaging: [
                            {
                                sender: {id: 'test'},
                                message: {attachments: undefined }
                            }
                        ]
                        }
                    ]
                }
            };

            let res = 'FAKE RES';

            let stub = sinon.stub(sendMsg, sendMessage); //TODO problem because sendMessage is a module...
            stub.yields();

            relay(req, res);
            stub.restore();
            sinon.assert.calledOnce(stub);
            sinon.assert.calledWith(stub, 'test', "I don't recognize the attachments", undefined, undefined, req, res);

        });

    });

});