/**
 * Starts the Server
 */

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const Logger = require('tracer');

const verifyAppToken = require('./controller/webhook-verification');
const relay = require('./controller/relay');
const env = require('./config/staging');

const app = express();
const logger = Logger.colorConsole();

app.set('port', (process.env.PORT || env.PORT));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// just to check if the app is running
app.get('/', (req, res) => {
    res.send('Soton Bot Running')
});

// for Facebook verification
app.get('/webhook/', verifyAppToken);

// replying to messages sent by the facebook bot
app.post('/webhook/', relay);

// Spin up the server
app.listen(app.get('port'), () => {
    logger.log('running on port', app.get('port'))
});

app.get('/parser/', (req, res) => {
    let stored = require('./service/sparqlUrlMachine/storedQueries');
    let queryJson = stored.amenity('Alcohol', 'Friday');

    let jqc = require('./service/sparqlUrlMachine/jsonQueryConverter');
    jqc.getOfferings(queryJson, function (allOfferings) {
        res.send(allOfferings);

    },function (error) {
        logger.log(error);
        res.send(error);
    })
});

app.get('/tom/', (req, res) => {

    let stored = require('./service/sparqlUrlMachine/storedQueries');
    let queryJson = stored.busRoutes('1980SN120415','1980SN120415');
    let jqc = require('./service/sparqlUrlMachine/jsonQueryConverter');
    jqc.getOfferings(queryJson, function (allOfferings) {


        console.log("hey hey hey ");

        res.send(allOfferings);

    },function (error) {
        logger.log(error);
        res.send(error);
    })
});