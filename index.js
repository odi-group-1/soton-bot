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
app.get('/webhook/', (req, res) => {
    if (req.query['hub.verify_token'] === 'we-will-change-student-lives-in-soton') {
        res.send(req.query['hub.challenge'])
    } else {
        res.send('Error, wrong token')
    }
});

app.post('/webhook/', (req, res) => {

    let messaging_events = req.body.entry[0].messaging;

    for (let i = 0; i < messaging_events.length; i++) {

        let event = req.body.entry[0].messaging[i]; // the messaging events sent to the bot
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
        logger.log('Response from fb ' + JSON.stringify(response.body));
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
        logger.log('Response from fb ' + JSON.stringify(response.body));
        logger.log('Sending confirmation to fb');
        if(cb) cb(response);
    }).catch( (error) => {
        logger.log('Error sending messages: ', error);
        if(errcb) errcb(error)
    })
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

// Spin up the server
app.listen(app.get('port'), () => {
    logger.log('running on port', app.get('port'))
});