/**
 * Created by shakib on 22/03/17.
 */
const logger = require('tracer').colorConsole();
const queries = require('./queries');
const sendMessage = require('./send-message');
/*
 this is a function that will take the http context and generate the closure
 that will ask apiai for actions and switch on that action
 */
function switchOnAction(req, res){
    return function (aiResponse, sender) {
        if (!aiResponse.result.actionIncomplete) {
            switch (aiResponse.result.action) {
                case "find-building" :
                    let buildingNumber = aiResponse.result.parameters.buidingNumber;
                    queries.findBuilding(buildingNumber, function (location) {
                        echo(sender, location, req, res);
                    });
                    break;
                case "find-nearest-service" :
                    let desiredService = aiResponse.result.parameters.offering;

                    //Go wild with that knowledge Tom

                case "nearest-food":
                    // Toms section

                case "when-term-start":
                    let term = aiResponse.result.parameters.term;
                    
                    //Go wild Deepak

                case "when-term-end":
                    let term = aiResponse.result.parameters.term;

                    //Go wild Deepak


                default:
                    // let test = function (text) {
                    //     echo(sender, text.substring(0, 200), req, res);
                    // };
                    // responseMaker.handleThis(text, sender, test);
                    if (aiResponse.fulfillment && aiResponse.fulfillment.speech) {
                        echo(sender, aiResponse.result.fulfillment.speech.substring(0, 200), req, res);
                    } else {
                        let responseString = "I'm tired, ask me later please.";
                        echo(sender, responseString, req, res)
                    }
            }
        } else {
            // basic incomplete action response
            echo(sender, aiResponse.result.fulfillment.speech.substring(0, 200), req, res);
        }
    }
}

function echo(sender, text, req, res) {
    sendMessage(sender, text, undefined, undefined, req, res);
}

module.exports = {
    switchOnAction: switchOnAction
};