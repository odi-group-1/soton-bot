const logger = require('tracer').colorConsole();
const request = require('request-promise');

const sendMessage = require('./send-message');
const responseMaker = require('./responseMaker');
const queries = require('./queries');
const actions = require('./actions');

// this is a higher level function that will relay based on what type of message was sent
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

            responseMaker.handleThis(text, sender, actions.switchOnAction(req, res));

        } else if (event.message && !event.message.text){
            // message does not have any text
            logger.log("Received a non-text message => " + JSON.stringify(event));

            // does the message have attachments
            let attachments = event.message.attachments;

            if (attachments) {
                let attachment = attachments[0];

                // the user sent coordinates
                if (attachment.payload && attachment.payload.coordinates) {
                    responseMaker.handleThis('got-coords--InaDeepakTomShakibStefan-hidden-key', sender, actions.switchOnAction(req, res))
                } else {
                    // unrecognized attachments
                    echo(sender, "I don't recognize the attachments", req, res);
                }
            } else {
                // message without text or attachments!
                echo(sender, "I was expecting some attachments.", req, res);
            }

        } else {
            // not a message, probably a delivery or sent message, reply yes anyway
            logger.log("Received Misc message => " + JSON.stringify(event) + " Sending 200 to Bot");
            res.sendStatus(200);
        }
    }
};

function echo(sender, text, req, res) {
    sendMessage(sender, text, undefined, undefined, req, res);
}

module.exports = relay;