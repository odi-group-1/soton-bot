/**
 this will take the http context and generate the closure which asks api.ai for actions and switch on that action
 */

const logger = require('tracer').colorConsole();
const queries = require('../service/queries');
const sendMessage = require('../service/fb-messaging/send-message');
const _ = require('lodash');

const MAX_CARD_ELEMENTS = 5;

function switchOnAction(req, res){

    // return the closure that will be the callback to api.ai handler
    return (aiResponse, sender) => {

        // action incomplete. perhaps further steps needed.
        if (aiResponse.result.actionIncomplete) {

            let response = prepareIncompleteActionResponse(aiResponse);
            echo(sender, typeof response === 'string'? 'Incomplete. ' + response : response, req, res);

        } else {

            // next step is based on the intent detected by api.ai
            switch (aiResponse.result.action) {

                case 'find-bus-from-and-to' :

                    try {

                        // location is expected as attachment to complete the query. try to extract it
                        let attachment = req.body.entry[0].messaging[0].message.attachments[0];

                        // have the location to deal with nearest food
                        if (attachment && attachment.type === 'location') {

                            let location = attachment.payload.coordinates;

                            let finalStop = aiResponse.result.parameters.busStopDest;

                            logger.log('Received position from ' + sender + ' to find bus stops => ' + JSON.stringify(attachment.payload.coordinates));

                            queries.getNearestBusStops([location]).then(resp => {
                                let firstStop = _.head(_.head(resp)).stop_name;

                                return queries.canITakeBusToX(firstStop, finalStop);
                            }).then(response => {
                                echo(sender, response, req, res);
                            }).catch(error => {
                                echo(sender, error.message, req, res);
                            });
                        } else {
                            echo(sender, "I was expecting the attachment to be a location, but it wasn't!", req, res);
                        }

                    } catch (error) {
                        // intention marked complete as nearest-food, but couldn't extract location
                        logger.error(error);
                        echo(sender, "I was expecting an attachment, but something went wrong!", req, res);
                    }
                    break;

                case 'find-nearest-bus-stop' :

                    try {

                        // location is expected as attachment to complete the query. try to extract it
                        let attachment = req.body.entry[0].messaging[0].message.attachments[0];

                        // have the location to deal with nearest food
                        if (attachment && attachment.type === 'location') {

                            let location = attachment.payload.coordinates;

                            logger.log('Received position from ' + sender + ' to find bus stops => ' + JSON.stringify(attachment.payload.coordinates));

                            queries.getNearestBusStops([location]).then(resp => {
                                let nearestStops = _.head(resp);
                                console.log(nearestStops);
                                // response is actually an array of services
                                let response = createGenericMessengerTemplateAttachment([]);

                                // create an element for each of the first x services
                                for (let stop of nearestStops.slice(0, MAX_CARD_ELEMENTS)) {
                                    response.attachment.payload.elements.push({
                                        title: stop.stop_name,
                                        subtitle: stop.distance + ' meters from you.',
                                        image_url: getStaticOpenStreetMap(stop.latitude, stop.longitude),
                                        default_action: {
                                            type: 'web_url',
                                            url: interactiveOpenStreetMap(stop.latitude, stop.longitude),
                                            messenger_extensions: true,
                                            webview_height_ratio : 'tall',
                                        },
                                        buttons:[
                                            {
                                                type:'web_url',
                                                url: getBusStopPublicDisplay(stop.atcocode),
                                                title:'Live Times',
                                            }
                                        ]
                                    });
                                }
                                echo(sender, response, req, res);
                            }).catch(error => {
                                echo(sender, error.message, req, res);
                            });
                        } else {
                            echo(sender, "I was expecting the attachment to be a location, but it wasn't!", req, res);
                        }

                    } catch (error) {
                        // intention marked complete as nearest-food, but couldn't extract location
                        logger.error(error);
                        echo(sender, "I was expecting an attachment, but something went wrong!", req, res);
                    }
                    break;

                // find room booking times
                case 'find-bookable-rooms' :

                    queries.findBookableRoom(aiResponse.result.parameters.bookingTime, (results) => {

                        let response = createGenericMessengerTemplateAttachment([]);

                        if (typeof results !== 'string') {

                            // create an element for each of the first x services
                            for (let result of results.slice(0, 10)) {
                                response.attachment.payload.elements.push({
                                    title: result.room + ' Capacity: ' + result.capacity,
                                    subtitle: '1hr slots available starting at: ' + result.possibleTimes,
                                    image_url: result.img,
                                    buttons:[
                                        {
                                            type:'web_url',
                                            url: result.uri,
                                            title:'More details'
                                        },
                                        {
                                            type:'web_url',
                                            url: 'https://roombooking.soton.ac.uk/WebRoomBooking/default.aspx',
                                            title:'Book A Room'
                                        }
                                    ]
                                });
                            }
                        } else {
                            response = results;
                        }

                        echo(sender, response, req, res);
                    });
                    break;

                // find room details
                case 'find-room-details' :

                    let b = aiResponse.result.parameters.building;
                    let r = aiResponse.result.parameters.room;

                    let roomNumber = b + '-' + r;

                    queries.findRoomDetails(roomNumber, (result) => {

                        if (typeof result !== 'string') {
                            let roomElements = [{
                                title: result.name,
                                image_url: result.imgURL,
                                subtitle: 'Room capacity: ' + result.capacity,
                                buttons:[
                                    {
                                        type:'web_url',
                                        url: result.URI,
                                        title:'More details',
                                    }
                                ]
                            }];
                            result = createGenericMessengerTemplateAttachment(roomElements);
                        }

                        echo(sender, result, req, res);
                    });
                    break;

                // find a building
                case 'find-building' :

                    let buildingNumber = aiResponse.result.parameters.buidingNumber;

                    // first query for the building number
                    queries.findBuilding(buildingNumber, (location) => {

                        // location can be an apology string, or a coordinate object
                        if (typeof location !== 'string') {

                            // location not an apology string, create a card with a openstreet map
                            let locationElements = [{
                                title: aiResponse.result.fulfillment.speech,
                                image_url: getStaticOpenStreetMap(location.lat, location.long),
                                subtitle: 'From Open Street Map',
                                default_action: {
                                    type: 'web_url',
                                    url: interactiveOpenStreetMap(location.lat, location.long),
                                    messenger_extensions: true,
                                    webview_height_ratio : 'tall',
                                },
                            }];

                            location = createGenericMessengerTemplateAttachment(locationElements);
                        }

                        echo(sender, location, req, res);

                    });
                    break;

                // find nearest x
                case 'find-nearest-service' :
                    try {
                        let attachment = req.body.entry[0].messaging[0].message.attachments[0];

                        // have the location to deal with nearest food
                        if (attachment && attachment.type === 'location') {

                            let location = attachment.payload.coordinates;
                            let desiredService = aiResponse.result.parameters.offering;

                            logger.log('Received position from ' + sender + ' to find ' + desiredService + ' => ' + JSON.stringify(attachment.payload.coordinates));

                            let obj = {
                                'amenity': desiredService,
                                'location': location
                            };

                            queries.findOffering(obj, (services) => {

                                // response can be an apology string or an array of services
                                let response = services;

                                if (typeof response !== 'string') {

                                    // response is actually an array of services
                                    response = createGenericMessengerTemplateAttachment([]);

                                    // create an element for each of the first x services
                                    for (let service of services.slice(0, MAX_CARD_ELEMENTS)) {
                                        response.attachment.payload.elements.push({
                                            title: service.venue,
                                            subtitle: 'Opening Times: ' + service.times.open + ' ' + service.times.close,
                                            image_url: getStaticOpenStreetMap(service.coordinates.lat, service.coordinates.long),
                                            default_action: {
                                                type: 'web_url',
                                                url: interactiveOpenStreetMap(service.coordinates.lat, service.coordinates.long),
                                                messenger_extensions: true,
                                                webview_height_ratio : 'tall',
                                            },
                                            buttons:[
                                                {
                                                    type:'web_url',
                                                    url: service.uri,
                                                    title:'More details',
                                                }
                                            ]
                                        });
                                    }
                                }
                                echo(sender, response, req, res);
                            });
                        } else {
                            echo(sender, "Everything went right, but didn't get your location!", req, res);
                        }
                    } catch (error) {
                        logger.error(error);
                        echo(sender, "Something went wrong while I was reading the attachment", req, res);
                    }
                    break;

                // find nearest food places in uni
                case "nearest-food":
                    try {

                        // location is expected as attachment to complete the query. try to extract it
                        let attachment = req.body.entry[0].messaging[0].message.attachments[0];

                        // have the location to deal with nearest food
                        if (attachment && attachment.type === 'location') {

                            let location = attachment.payload.coordinates;

                            logger.log('Received position from ' + sender + ' to find food => ' + JSON.stringify(attachment.payload.coordinates));

                            // first query for nearest food places
                            queries.findNearestFood(location, (foodPlaces) => {

                                // response could be either an apology string or an array of food place
                                let response = foodPlaces;

                                if (typeof response !== 'string') {

                                    // actual food places found. create cards with open street map location and times
                                    response = createGenericMessengerTemplateAttachment([]);

                                    // add a card for each of the food places
                                    for (let service of foodPlaces.slice(0, MAX_CARD_ELEMENTS)) {
                                        response.attachment.payload.elements.push({
                                            title: service.name,
                                            subtitle: service.dist*1000 + ' metres from you',
                                            image_url: getStaticOpenStreetMap(service.lat, service.long),
                                            default_action: {
                                                type: 'web_url',
                                                url: interactiveOpenStreetMap(service.lat, service.long),
                                                messenger_extensions: true,
                                                webview_height_ratio : 'tall',
                                            },
                                            buttons:[
                                                {
                                                    type:'web_url',
                                                    url: service.uri,
                                                    title:'More details',
                                                }
                                            ]
                                        });
                                    }
                                }
                                echo(sender, response, req, res);
                            });
                        } else {
                            echo(sender, "I was expecting the attachment to be a location, but it wasn't!", req, res);
                        }

                    } catch (error) {
                        // intention marked complete as nearest-food, but couldn't extract location
                        logger.error(error);
                        echo(sender, "I was expecting an attachment, but something went wrong!", req, res);
                    }
                    break;

                case "when-term-start":
                    // Get the term they asked for
                    var term = aiResponse.result.parameters.term;

                    // Find the start date for that term
                    queries.startTermDates(term, function (stringStartDate) {
                        // Get the response and att the date to it
                        let aiRawSpeech = aiResponse.result.fulfillment.speech;
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
                        let aiRawSpeech = aiResponse.result.fulfillment.speech;
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
        }
    }
}

function echo(sender, text, req, res) {
    sendMessage(sender, text, undefined, undefined, req, res);
}

function prepareIncompleteActionResponse(aiResponse){

    // default response is the speech returned by api.ai
    let response = aiResponse.result.fulfillment.speech;

    // special responses. location.
    if (response.includes('location pin')) {
        response = {
            text: 'Please share your location:',
            quick_replies: [
                {
                    content_type: 'location',
                }
            ]
        }
    }
    return response;
}

function createGenericMessengerTemplateAttachment(elements){
    return {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
                elements: elements
            }
        }
    }
}

function getStaticOpenStreetMap(lat, long){
    return "http://staticmap.openstreetmap.de/staticmap.php?center="+lat + ","+long+"&zoom=18&size=865x512&maptype=mapnik&markers=" + lat + "," + long;
}

function interactiveOpenStreetMap(lat, long) {
    return "https://www.openstreetmap.org/?mlat="+lat+"&mlon="+long+"4#map=19/"+lat+"/"+long+"&layers=N";
}

function getBusStopPublicDisplay(atco) {
    return 'http://bus.southampton.ac.uk/bus-stop-publicdisplay/' + atco + '.html';
}

module.exports = {
    switchOnAction: switchOnAction
};