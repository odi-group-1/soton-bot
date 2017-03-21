/**
 * Created by shakib on 08/03/17.
 */
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request-promise');
const app = express();
const logger = require('tracer').colorConsole();

const token = process.env.FB_PAGE_ACCESS_TOKEN;

const verifyAppToken = require('./responses/webhook-verification');

app.set('port', (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Process application/json
app.use(bodyParser.json());

// Index route
app.get('/', (req, res) => {
    res.send('Hello world, I am a chat bot')
});

// for Facebook verification
app.get('/webhook/', verifyAppToken);

app.post('/webhook/', (req, res) => {

    let messaging_events = req.body.entry[0].messaging;

    for (let i = 0; i < messaging_events.length; i++) {

        let event = req.body.entry[0].messaging[i]; // the messaging events sent to the bot

        logger.log(JSON.stringify(event, null, 2))

        let sender = event.sender.id; // the senders of the message

        if (event.message && event.message.text) {

            let text = event.message.text; // parse the message sent to the bot

            logger.log("Received from " + sender + " => " + text);

            // take action based on the text sent to the bot
            if (text === 'Generic') {
                sendGenericMessage(sender,
                    (fbResponse) => {
                        res.sendStatus(200);
                    }, (fbError) => {
                        res.sendStatus(400);
                    });
            } else {
                sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200),
                    (fbResponse) => {
                        res.sendStatus(200);
                    }, (fbError) => {
                        res.sendStatus(400);
                    });
            }
        } else {
            sendTextMessage(sender, "Couldn't understand the text. ",
                (fbResponse) => {
                    res.sendStatus(200);
                }, (fbError) => {
                    res.sendStatus(400);
                });
        }
    }
});

function sendTextMessage(receiver, text, cb, errcb) {

    // the message to send to the bot user
    let messageData = { text:text };

    logger.log("Replying to " + receiver + " => " + messageData);

    request({
        url: 'https://graph.facebook.com/v2.8/me/messages',
        qs: {
            access_token:token
        },
        method: 'POST',
        json: {
            recipient: {
                id:receiver
            },
            message: messageData,
        }
    }).then((response) =>  {
        logger.log('Response from fb ' + JSON.stringify(response));
        logger.log('Sending confirmation to fb');
        if (cb) cb(response);
    }).catch( (error) => {
        logger.error('Error: ' + error);
        if (errcb) errcb(error);
    });
}

function sendGenericMessage(sender, cb, errcb) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    };
    request({
        url: 'https://graph.facebook.com/v2.8/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }).then((response, body) => {
        logger.log('Response from fb ' + JSON.stringify(response));
        logger.log('Sending confirmation to fb');
        if(cb) cb(response);
    }).catch( (error) => {
        logger.log('Error sending messages: ', error);
        if(errcb) errcb(error)
    })
}

// Spin up the server
app.listen(app.get('port'), () => {
    logger.log('running on port', app.get('port'))
});