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

                    queries.findOffering(desiredService, function (services) {
                        echo(sender, services, req, res);
                    });

                    break;
                case "nearest-food":
                    try {
                        let attachment = req.body.entry[0].messaging[0].message.attachments[0];

                        // have the location to deal with nearest food
                        if (attachment && attachment.type === 'location') {

                            let location = attachment.payload.coordinates;

                            logger.log('Received position from ' + sender + ' to find food => ' + JSON.stringify(attachment.payload.coordinates));

                            // make sparql query
                            queries.findNearestFood(location, function (foodStr) {
                                echo(sender, foodStr, req, res);
                            });
                        } else {
                            echo(sender, "Everything went right, but didn't get your location!", req, res);
                        }

                    } catch (error) {
                        echo(sender, "Something went wrong while I was reading the attachment", req, res);
                    }
                    break;

                case "when-term-start":
                    var term = aiResponse.result.parameters.term;
                    
                    //Go wild Deepak
                    break;

                case "when-term-end":
                    var term = aiResponse.result.parameters.term;

                    //Go wild Deepak
                    break;

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
                    break;
            }
        } else {
            // basic incomplete action response
            let speech = aiResponse.result.fulfillment.speech;
            if (speech.includes('location pin')) {
                speech = {
                    "text":"Please share your location:",
                    "quick_replies":[
                        {
                            "content_type":"location",
                        }
                    ]
                }
            }
            echo(sender, typeof speech === 'string'? "Incomplete. " + speech : speech, req, res);
        }
    }
}

function echo(sender, text, req, res) {
    sendMessage(sender, text, undefined, undefined, req, res);
}

module.exports = {
    switchOnAction: switchOnAction
};