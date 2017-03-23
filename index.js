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

//     PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
//         PREFIX gr: <http://purl.org/goodrelations/v1#>
//         PREFIX ns0: <http://purl.org/goodrelations/v1#>
//         PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
//         SELECT ?name ?lat ?long WHERE {
//             ?Offering a gr:Offering .
//         ?Offering gr:availableAtOrFrom ?Location .
//         ?Offering rdfs:label ?name .
//         ?Location a ns0:LocationOfSalesOrServiceProvisioning .
//         ?Location geo:lat ?lat .
//         ?Location geo:long ?long .
//     FILTER(?name = 'Alcohol') .
//     }
//     LIMIT 5

    let myquery = new sparqls.Query({limit: 5, distinct: true});

    myquery.registerPrefix( 'rdfs', '<http://www.w3.org/2000/01/rdf-schema#>');
    myquery.registerPrefix( 'gr', '<http://purl.org/goodrelations/v1#>');
    myquery.registerPrefix( 'ns0', '<http://purl.org/goodrelations/v1#>');
    myquery.registerPrefix( 'geo', '<http://www.w3.org/2003/01/geo/wgs84_pos#>');

    myquery.selection(['?lat','?long']);

    let Offering = {
        'type': 'gr:Offering',
        'gr:availableAtOrFrom': '?Location',
        'rdfs:label': '?name'
    };

    let Location = {
        'type': 'ns0:LocationOfSalesOrServiceProvisioning',
        'geo:lat': '?lat',
        'geo:long': '?long'
    }

    myquery.registerVariable('Offering', Offering);
    myquery.registerVariable('Location', Location);

    myquery.filter("?name = '" + param + "'");

    logger.log(myquery.sparqlQuery);

    let sparqler = new sparqls.Client("http://sparql.data.southampton.ac.uk/");

    let result = [];
    let ans = "Sorry, I couldn't find any " + param + ".";

    sparqler.send(myquery, function(error, data){
        logger.log(data);
        if(data.results.bindings.length > 0) {
            try {
                // Try because trying to access JSON properties that may be undefined
                data.results.bindings.forEach( function(resultBinding) {
                    result.push({ 'lat': resultBinding.lat.value,
                                  'long': resultBinding.long.value});
                });
                // Parse results array
                ans = "I've found the following " + param + " locations: \n"
                result.forEach( function(item) {
                    ans += "lat: " + item.lat + " long: " + item.long +"\n";
                });
            } catch (err) {
                logger.log(err);
                logger.log('Failed to read query results');
            }
        }
        res.send(ans);
    });

});