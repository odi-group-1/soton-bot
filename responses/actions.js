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

                        if (typeof location === 'string') {
                            echo(sender, location, req, res);
                        } else {
                            location = {
                                attachment: {
                                    type: "template",
                                    payload: {
                                        template_type: "generic",
                                        elements: [
                                            {
                                                title: aiResponse.result.fulfillment.speech,
                                                image_url: "http://staticmap.openstreetmap.de/staticmap.php?center="+location.lat + ","+location.long+"&zoom=18&size=865x512&maptype=mapnik&markers=" + location.lat + "," + location.long,
                                                subtitle: "From Open Street Map",
                                                default_action: {
                                                    type: "web_url",
                                                    url: "https://www.openstreetmap.org/?mlat="+location.lat+"&mlon="+location.long+"4#map=19/"+location.lat+"/"+location.long+"&layers=N",
                                                    "messenger_extensions": true,
                                                    "webview_height_ratio" : "tall",
                                                },
                                            }
                                        ]
                                    }
                                }
                            };
                            echo(sender, location, req, res);
                        }
                    });
                    break;
                case "find-nearest-service" :
                    let desiredService = aiResponse.result.parameters.offering;

                    queries.findOffering(desiredService, function (services) {
                        if (typeof services === 'string') {
                            echo(sender, services, req, res);
                        } else {
                            let servs = {
                                attachment: {
                                    type: "template",
                                    payload: {
                                        template_type: "generic",
                                        elements: []
                                    }
                                }
                            };
                            for (let i = 0; i < services.length; i++) {
                                servs.attachment.payload.elements.push({
                                    title: services[i],
                                    image_url: services[i],
                                    "buttons":[
                                        {
                                            "type":"web_url",
                                            "url": services[i],
                                            "title":"More details",
                                        }
                                    ]
                                })
                            }
                            logger.log(servs);
                            echo(sender, servs, req, res);
                            // echo(sender, JSON.stringify(services), req, res);
                        }
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

                // case "when-term-start":
                //     var term = aiResponse.result.parameters.term;
                //
                //     echo(sender, "not impl", req, res);
                //
                //     //Go wild Deepak
                //     break;
                //
                // case "when-term-end":
                //     var term = aiResponse.result.parameters.term;
                //
                //     echo(sender, "not impl", req, res);
                //
                //     //Go wild Deepak
                //     break;

                case "when-term-start":
                    // Get the term they asked for
                    var term = aiResponse.result.parameters.term;

                    // Find the start date for that term
                    queries.startTermDates(term, function (stringStartDate) {
                        // Get the response and att the date to it
                        var aiRawSpeech = aiResponse.result.fulfillment.speech;
                        echo(sender, aiRawSpeech + " " + stringStartDate, req, res);

                    }, function (errorMessage) {
                        // Give some random response
                        echo(sender, "Some term error message", req, res);
                    });
                    break;

                case "when-term-end":
                    // Get the term they asked for
                    var term = aiResponse.result.parameters.term;
                    // Find the end date for that term
                    queries.endTermDates(term, function (stringEndDate) {
                        var aiRawSpeech = aiResponse.result.fulfillment.speech;
                        echo(sender, aiRawSpeech + " " + stringEndDate, req, res);

                    }, function (errorMessage) {
                        // Give some random response
                        echo(sender, "Some term error message", req, res);
                    });
                    break;

                default:
                    if (aiResponse.result.fulfillment && aiResponse.result.fulfillment.speech) {
                        echo(sender, aiResponse.result.fulfillment.speech, req, res);
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