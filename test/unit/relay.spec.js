/**
 * Test suite for relay.js
 * @author Tom Aley
 */

let sinon = require('sinon');
let expect = require('chai').expect;
let relay = require('../../controller/relay');
let actions = require('../../responses/actions');
let aihandler = require('../../service/ai-handler');
let env = require('../../config/staging');
let sendMessage = require('../../service/fb-messaging/send-message');

let req = {};

describe('Test relay.js', function () {

    beforeEach(function(){
        // Reset request object
        req = {
            body: {
                entry: [
                    { messaging: [
                        {
                            sender: {id: 'test'}
                        }
                    ]
                    }
                ]
            }
        };
    });

    it('Should send text to ai-handler with callback of actions.switchOnAction', function() {

        req.body.entry[0].messaging[0].message = {text: 'HI'};

        let res = 'FAKE RES';

        let stub2 = sinon.stub(actions, 'switchOnAction').returns(function() {});

        let stub = sinon.stub(aihandler, 'handleThis');
        stub.yields();

        relay.relay(req, res);
        stub.restore();
        stub2.restore();
        sinon.assert.calledOnce(stub2);
        sinon.assert.calledWith(stub2, req, res);
        sinon.assert.calledOnce(stub);
        sinon.assert.calledWith(stub, 'HI', 'test');

    });

    it('Should send location payload to ai-handler with callback of actions.switchOnAction', function() {

        req.body.entry[0].messaging[0].message = {attachments: [{payload: {coordinates: { lat: '', long: ''}}}]};

        let res = 'FAKE RES';

        let stub2 = sinon.stub(actions, 'switchOnAction').returns(function() {});

        let stub = sinon.stub(aihandler, 'handleThis');
        stub.yields();

        relay.relay(req, res);
        stub.restore();
        stub2.restore();
        sinon.assert.calledOnce(stub2);
        sinon.assert.calledWith(stub2, req, res);
        sinon.assert.calledOnce(stub);
        sinon.assert.calledWith(stub, env.API_AI_HIDDEN_KEYS.COORDINATE, 'test');

    });

    it("Should call echo with string 'I don't recognize the attachments'", function() {

        req.body.entry[0].messaging[0].message = {attachments: [{}] };

        let res = 'FAKE RES';

        let stub = sinon.stub(relay, 'echo').returns(function() {});

        relay.relay(req, res);
        stub.restore();
        sinon.assert.calledOnce(stub);
        sinon.assert.calledWith(stub, 'test', "I don't recognize the attachments", req, res);

    });

    it("Should call echo with string 'I was expecting some attachments'", function() {

        req.body.entry[0].messaging[0].message = {};

        let res = 'FAKE RES';

        let stub = sinon.stub(relay, 'echo').returns(function() {});

        relay.relay(req, res);
        stub.restore();
        sinon.assert.calledOnce(stub);
        sinon.assert.calledWith(stub, 'test', "I was expecting some attachments", req, res);

    });

    it("Should res.sendStatus(200) on miscellaneous message", function() {

        // Setup res
        let res = {sendStatus: function (){
            console.log('This should not print');
        }};

        let stub = sinon.stub(res, 'sendStatus').returns(function() {});

        relay.relay(req, res);
        stub.restore();
        sinon.assert.calledOnce(stub);

    });

});