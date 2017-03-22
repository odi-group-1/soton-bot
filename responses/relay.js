const logger = require('tracer').colorConsole();
const request = require('request-promise');
const sparqls = require('sparqling-star');

const sendMessage = require('./send-message');
const responseMaker = require('./responseMaker');

var relay = (req, res) => {

    let messaging_events = req.body.entry[0].messaging;

    for (let i = 0; i < messaging_events.length; i++) {

        let event = req.body.entry[0].messaging[i]; // the messaging events sent to the bot
        let sender = event.sender.id; // the senders of the message

        // reply only if the message has some text
        if (event.message && event.message.text) {

            let text = event.message.text; // parse the message sent to the bot

            // take action based on the text sent to the bot
            logger.log("Received from " + sender + " => " + text);

            responseMaker.handleThis(text, sender, switchOnAction(req, res));


        } else if (event.message && !event.message.text){
            // message does not have any text
            logger.log("Received a non-text message => " + JSON.stringify(event));
            echo(sender, "I don't know what you mean", req, res);

        } else {
            // not a message, probably a delivery or sent message, reply yes anyway
            logger.log("Received Misc message => " + JSON.stringify(event) + " Sending 200 to Bot");
            res.sendStatus(200);
        }
    }
};

function switchOnAction(req, res){
    return function (aiResponse, sender) {
        if (!aiResponse.result.actionIncomplete) {
            switch (aiResponse.result.action) {
                case "find-building" :
                    findBuilding(aiResponse.result.parameters.buidingNumber, function (location) {
                        echo(sender, location, req, res);
                    });
                    break;
                default:
                    // let test = function (text) {
                    //     echo(sender, text.substring(0, 200), req, res);
                    // };
                    // responseMaker.handleThis(text, sender, test);
                    echo(sender, aiResponse.result.resolvedQuery.substring(0, 200), req, res);
            }
        }
    }
}

function findBuilding(str, cb) {
    let building = str;
    let myquery = new sparqls.Query({limit: 2});
    myquery.registerTriple({'subject':'?s','predicate':'?p','object':'?o'});
    myquery.filter("?s = <http://id.southampton.ac.uk/building/"+building+"> && (?p = <http://www.w3.org/2003/01/geo/wgs84_pos#lat> || ?p = <http://www.w3.org/2003/01/geo/wgs84_pos#long>)");

    console.log(myquery.sparqlQuery);

    let sparqler = new sparqls.Client("http://sparql.data.southampton.ac.uk/");
    let lat = undefined;
    let lng = undefined;
    let ans = "Sorry, I don't know where that is...";

    sparqler.send(myquery, function(error, data){
        if(data.results.bindings.length > 0) {
            try {
                // Try because trying to access JSON properties that may be undefined
                lat = data.results.bindings[0].o.value;
                lng = data.results.bindings[1].o.value;
                console.log('LAT: ' + lat + ' LONG: ' + lng);
                ans = 'LAT: ' + lat + ' LONG: ' + lng;
            } catch (err) {
                console.log('Tried to find building, failed...');
            }
        };
        if(cb) cb(ans);
    });
};

function echo(sender, text, req, res) {
    sendMessage(sender, "Text received, echo: " + text.substring(0, 200), undefined, undefined, req, res);
}

module.exports = relay;