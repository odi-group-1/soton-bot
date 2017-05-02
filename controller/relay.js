/**
 * The first stage of message handling pipeline. Relays to other functions based on message types - text, location etc.
 */

const Logger = require('tracer');
const request = require('request-promise');

const sendMessage = require('../service/fb-messaging/send-message').sendMessage;
const aiHandler = require('../service/ai-handler');
const queries = require('../service/queries');
const actions = require('../responses/actions');
const env = require('../config/staging');
const skills = require('../responses/bot-skills').skills;

const logger = Logger.colorConsole();

/**
 * This is a higher level function that will relay based on what type of message was sent
 * @param req
 * @param res
 */
let relay = (req, res) => {

    let messaging_events = req.body.entry[0].messaging;

    for (let i = 0; i < messaging_events.length; i++) {

        let event = req.body.entry[0].messaging[i]; // the messaging events sent to the bot
        let sender = event.sender.id; // the senders of the message

        // reply only if the message has some text
        if (event.message && event.message.text) {

            let text = event.message.text; // parse the message sent to the bot

            // take action based on the text sent to the bot
            logger.log("Received from " + sender + " => " + text);

            aiHandler.handleThis(text, sender, actions.switchOnAction(req, res));

        } else if (event.message && !event.message.text){
            // message does not have any text
            logger.log("Received a non-text message => " + JSON.stringify(event));

            // does the message have attachments
            let attachments = event.message.attachments;

            if (attachments) {
                let attachment = attachments[0];

                // the user sent coordinates
                if (attachment.payload && attachment.payload.coordinates) {
                    aiHandler.handleThis(env.API_AI_HIDDEN_KEYS.COORDINATE, sender, actions.switchOnAction(req, res))
                } else {
                    // unrecognized attachments
                    relayExport.echo(sender, "I don't recognize the attachments", req, res);
                }
            } else {
                // message without text or attachments!
                relayExport.echo(sender, "I was expecting some attachments", req, res);
            }

        } else {
            // not a message, probably a delivery or sent message, reply yes anyway
            logger.log("Received Misc message => " + JSON.stringify(event) + " Sending 200 to Bot");

            let postback = event.message.postback;

            if (postback) {
                let postbackAction = postback.payload.split(':')[0];

                if (postbackAction === 'SKILLS') {

                    let skillGifUrl = skills[postback.payload].default_action.url;

                    relayExport.echo(sender, skillGifUrl, req, res);
                } else {
                    relayExport.echo(sender, 'Developers have not build this feature yet!', req, res);
                }
            } else {
                res.sendStatus(200);
            }
        }
    }
};

/**
 * TODO comment
 * @param sender
 * @param text
 * @param req
 * @param res
 */
let echo = (sender, text, req, res) => {
    sendMessage(sender, text, undefined, undefined, req, res);
};

let relayExport = {
    relay: relay,
    echo: echo
};

module.exports = relayExport;