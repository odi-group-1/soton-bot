/**
 * Created by shakib on 08/03/17.
 */
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const logger = require('tracer').colorConsole();

const verifyAppToken = require('./responses/webhook-verification');
const relay = require('./responses/relay');

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

app.post('/webhook/', relay);

// Spin up the server
app.listen(app.get('port'), () => {
    logger.log('running on port', app.get('port'))
});