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

    // PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    // PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
    // PREFIX ns: <http://id.southampton.ac.uk/ns/>
    // PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    // SELECT * FROM <http://id.southampton.ac.uk/dataset/southampton-food-outlets/latest> WHERE {
    //  ?business a ns:FoodOrDrinkEstablishment ;
    //      geo:lat ?lat ;
    //      geo:long ?long ;
    //      rdfs:label ?name ;
    //      foaf:based_near ?near .
    // }
    // LIMIT 10

    logger.log("hello");
    logger.log(req.params.text);

    let building = req.params.text;

    let myquery = new sparqls.Query({limit: 10});

    myquery.registerPrefix( 'rdfs', '<http://www.w3.org/2000/01/rdf-schema#>');
    myquery.registerPrefix( 'geo', '<http://www.w3.org/2003/01/geo/wgs84_pos#>');
    myquery.registerPrefix( 'ns', '<http://id.southampton.ac.uk/ns/>');

    let business = {
        'type': 'ns:FoodOrDrinkEstablishment',
        'geo:lat': '?lat',
        'geo:long': '?long',
        'rdfs:label': '?name'
        // TODO: Figure out query that finds out closest to you!
    };

    myquery.registerVariable('business', business);

    console.log(myquery.sparqlQuery);

    let sparqler = new sparqls.Client("http://sparql.data.southampton.ac.uk/");

    let result = [];

    sparqler.send(myquery, function(error, data){
        if(data.results.bindings.length > 0) {
            try {
                // Try because trying to access JSON properties that may be undefined
                data.results.bindings.forEach( function(resultBinding) {
                    result.push({
                        'lat': resultBinding.lat.value,
                        'long': resultBinding.long.value,
                        'name': resultBinding.name.value
                    });
                });
            } catch (err) {
                console.log('Tried to find food, failed...');
            }
        };
         res.send(result);
    });
});


