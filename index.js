/**
 * Created by shakib on 08/03/17.
 */
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const sparqls = require('sparqling-star');
const app = express();
const logger = require('tracer').colorConsole();

const verifyAppToken = require('./responses/webhook-verification');
const relay = require('./responses/relay');

app.set('port', (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Process application/json
app.use(bodyParser.json());

// just to check if the app is running
app.get('/', (req, res) => {
    res.send('Hello world, I am a chat bot')
});
var test_apiai = require('apiai');

var test_chat_app = test_apiai("0131221ffe7b41b49872ed7e12b53237");

app.get('/chat/', (req, res) => {
    console.log("Message Starting");
    var request = test_chat_app.textRequest('Where is building 11?', {
        sessionId: '239482934'
    });

    request.on('response', function(response) {
        console.log("Success");
        res.send(response)
    });

    request.on('error', function(error) {
        console.log("Fails");
        console.log(error);
        res.sendStatus(error.status);
    });

    request.end();
    console.log("Message ended");
});


// for Facebook verification
app.get('/webhook/', verifyAppToken);

// replying to messages sent by the facebook bot
app.post('/webhook/', relay);

// Spin up the server
app.listen(app.get('port'), () => {
    logger.log('running on port', app.get('port'))
});

app.get('/tom/:text', (req, res) => {

    let param = req.params.text;


    res.send(param);

});