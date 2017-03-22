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

    let myquery = new sparqls.Query({limit: 10000});

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
    let ans = "";

    let myLocation = {"lat":50.934735, "long":-1.395784}; // Remove hard coded value

    sparqler.send(myquery, function(error, data){
        if(data.results.bindings.length > 0) {
            try {
                // Try because trying to access JSON properties that may be undefined
                data.results.bindings.forEach( function(resultBinding) {
                    let distance = getDistanceFromLatLonInKm(myLocation.lat, myLocation.long, resultBinding.lat.value, resultBinding.long.value);
                    if(distance <= 0.250) { //Within 250m
                        result.push({
                            // 'lat': resultBinding.lat.value,
                            // 'long': resultBinding.long.value,
                            'name': resultBinding.name.value,
                            'dist': Number(Math.round(distance+'e3')+'e-3')
                        });
                    }
                });
                result = _.sortBy(result, 'dist');
                ans = "Within 250m there are " + result.length + ' places to eat: ';
                result.forEach( function(place) {
                    ans += " " + place.name + " " + place.dist + "km";
                });
            } catch (err) {
                console.log('Failed to read query results');
            }
        } else {
            ans = "No places to eat within 250m :("
        };
         res.send(ans);
    });
});

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
};

function deg2rad(deg) {
    return deg * (Math.PI/180)
};


