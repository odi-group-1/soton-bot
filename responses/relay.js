const logger = require('tracer').colorConsole();
const request = require('request-promise');

const sendMessage = require('./send-message');

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
            echo(sender, text.substring(0, 200), req, res);

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

function echo(sender, text, req, res) {
    sendMessage(sender, "Text received, echo: " + text.substring(0, 200), undefined, undefined, req, res);
}

function whereIsSubject(subject, cb) {

    let dataSourceUrl = 'http://sparql.data.southampton.ac.uk/?output=json&show_inline=0&query=PREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0D%0APREFIX+gr%3A+%3Chttp%3A%2F%2Fpurl.org%2Fgoodrelations%2Fv1%23%3E%0D%0ASELECT+%2A+WHERE+%7B+%0D%0A++GRAPH+%3Chttp%3A%2F%2Fid.southampton.ac.uk%2Fdataset%2Famenities%2Flatest%3E+%7B%0D%0A++++++++%3FOffering+a+gr%3AOffering+%3B%0D%0A++++++++++++++++gr%3AavailableAtOrFrom%09%3FLocation+%3B%0D%0A++++++++++++++++rdfs%3Alabel+++++++%3FName+%3B%0D%0A++++++++++++++++FILTER+%28%3FName+%3D+%22SUBJECT%22%29+.%0D%0A+++++%7D%0D%0A%7D'
    dataSourceUrl = dataSourceUrl.replace('SUBJECT', subject);

    request({
        url: dataSourceUrl,
        method: 'GET'
    }).then((response) =>  {
        let places = [];
        let answers = response.results.bindings;
        answers.forEach(function(entry){
            let locationURI = entry.Location.value;
            let location = locationURI.replace('http://id.southampton.ac.uk/point-of-service/','');
            places.push(location);
        });
        logger.log('Returned Data ' + JSON.stringify(response));
        if (cb) cb(places);
    }).catch( (error) => {
        logger.error('Error: ' + error);
    });
}

module.exports = relay;