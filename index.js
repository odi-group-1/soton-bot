/**
 * Created by shakib on 08/03/17.
 */
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const sparqls = require('sparqling-star');
const _ = require('lodash');
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

        // PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        // PREFIX gr: <http://purl.org/goodrelations/v1#>
        // PREFIX ns0: <http://purl.org/goodrelations/v1#>
        // PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
        // SELECT ?Location ?shop ?name ?lat ?long ?day ?opens ?closes WHERE {
        //     ?Offering a gr:Offering .
        //     ?Offering gr:availableAtOrFrom ?Location .
        //     ?Offering rdfs:label ?name .
        //     ?Location a ns0:LocationOfSalesOrServiceProvisioning .
        //     ?Location rdfs:label ?shop .
        //     ?Location geo:lat ?lat .
        //     ?Location geo:long ?long .
        //     ?Location gr:hasOpeningHoursSpecification ?Hours .
        //     ?Hours gr:hasOpeningHoursDayOfWeek ?day .
        //     ?Hours gr:opens ?opens .
        //     ?Hours gr:closes ?closes .
        // FILTER(?name = 'Cigarettes') .
        // }
        // LIMIT 700

    let myquery = new sparqls.Query({limit: 700, distinct: true});

    myquery.registerPrefix( 'rdfs', '<http://www.w3.org/2000/01/rdf-schema#>');
    myquery.registerPrefix( 'gr', '<http://purl.org/goodrelations/v1#>');
    myquery.registerPrefix( 'ns0', '<http://purl.org/goodrelations/v1#>');
    myquery.registerPrefix( 'geo', '<http://www.w3.org/2003/01/geo/wgs84_pos#>');

    myquery.selection(['?Location', '?shop', '?lat', '?long', '?day', '?opens', '?closes']);

    let Offering = {
        'type': 'gr:Offering',
        'gr:availableAtOrFrom': '?Location',
        'rdfs:label': '?name'
    };

    let Location = {
        'type': 'ns0:LocationOfSalesOrServiceProvisioning',
        'geo:lat': '?lat',
        'geo:long': '?long',
        'rdfs:label': '?shop',
        'gr:hasOpeningHoursSpecification': '?Hours'
    };

    let Hours = {
        'gr:hasOpeningHoursDayOfWeek': '?day',
        'gr:opens': '?opens',
        'gr:closes': '?closes'
    }

    myquery.registerVariable('Offering', Offering);
    myquery.registerVariable('Location', Location);
    myquery.registerVariable('Hours', Hours);

    myquery.filter("?name = '" + param + "'");

    logger.log(myquery.sparqlQuery);

    let sparqler = new sparqls.Client("http://sparql.data.southampton.ac.uk/");

    let result = [];
    let times = [];
    let d = new Date();
    let today = d.getDay();
    let weekday = new Array(7);
    weekday[0] =  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    sparqler.send(myquery, function(error, data){
        if(data.results.bindings.length > 0) {
            try {
                // Try because trying to access JSON properties that may be undefined
                data.results.bindings.forEach( function(resultBinding) {
                    let foundDay = resultBinding.day.value.replace("http://purl.org/goodrelations/v1#", "")
                    if( foundDay === weekday[today]) {
                        result.push(
                            {
                                'shop': resultBinding.shop.value,
                                'uri': resultBinding.Location.value,
                                'coordinates': {
                                    'lat': resultBinding.lat.value,
                                    'long': resultBinding.long.value
                                },
                                'times': {
                                    'open': resultBinding.opens.value,
                                    'close': resultBinding.closes.value
                                }
                            });
                    }
                });
            } catch (err) {
                logger.log('Failed to read query results');
                logger.log(err);
            }
        }
        res.send(result);
    });

});