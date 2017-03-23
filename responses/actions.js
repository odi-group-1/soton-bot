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
                    queries.findBuilding(aiResponse.result.parameters.buidingNumber, function (location) {
                        echo(sender, location, req, res);
                    });
                    break;
                case "find-nearest-service" :
                case "nearest-food":
                    try {
                        let location = req.body.entry[0].messaging[0].message.attachments[0].payload.coordinates;

                        if (location) {
                            logger.log('Received position from ' + sender + ' ' + JSON.stringify(attachment.payload.coordinates));
                            queries.findNearestFood(location, function (foodStr) {
                                echo(sender, foodStr, req, res);
                            });
                        } else {
                            echo(sender, "Everything went right, but didn't get your location!", req, res);
                        }

                    } catch (error) {
                        echo(sender, "Something went wrong while I was getting your location", req, res);
                    }

                default:
                    // let test = function (text) {
                    //     echo(sender, text.substring(0, 200), req, res);
                    // };
                    // responseMaker.handleThis(text, sender, test);
                    if (aiResponse.result.fulfillment && aiResponse.result.fulfillment.speech) {
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