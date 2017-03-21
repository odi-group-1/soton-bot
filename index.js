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

// for Facebook verification
app.get('/webhook/', verifyAppToken);

// replying to messages sent by the facebook bot
app.post('/webhook/', relay);

// Spin up the server
app.listen(app.get('port'), () => {
    logger.log('running on port', app.get('port'))
});

app.get('/sparql/:id', (req, res) => {
    logger.log("hello");
    logger.log(req.params.id)

    let building = req.params.id;

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
        res.send(ans);
    });
})