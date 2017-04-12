/**
 * Starts the Server
 */

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const Logger = require('tracer');

const verifyAppToken = require('./responses/webhook-verification');
const relay = require('./responses/relay');

const app = express();
const logger = Logger.colorConsole();

app.set('port', (process.env.PORT || 5000));

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
    let stored = require('./responses/sparqlUrlMachine/storedQueries');
    let queryJson = stored.amenity('Alcohol', 'Friday');

    let jqc = require('./responses/sparqlUrlMachine/jsonQueryConverter');
    jqc.getOfferings(queryJson, function (allOfferings) {
        res.send(allOfferings);

    },function (error) {
        logger.log(error);
        res.send(error);
    })
});

// app.get('/tom/:obj', (req, res) => {
//
//     // Expecting { amenity: 'Alcohol', location:{ lat:50.000000, long:-1.000000 }}
//
//     //let obj = req.params.obj; // TODO: Use this
//     let obj = { 'amenity':'Cigarettes', 'location':{'lat':50.9346656, 'long':-1.3959572}};
//
//         // PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
//         // PREFIX gr: <http://purl.org/goodrelations/v1#>
//         // PREFIX ns0: <http://purl.org/goodrelations/v1#>
//         // PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
//         // SELECT ?Location ?shop ?name ?lat ?long ?day ?opens ?closes WHERE {
//         //     ?Offering a gr:Offering .
//         //     ?Offering gr:availableAtOrFrom ?Location .
//         //     ?Offering rdfs:label ?name .
//         //     ?Location a ns0:LocationOfSalesOrServiceProvisioning .
//         //     OPTIONAL {?Location rdfs:label ?shop}
//         //     ?Location geo:lat ?lat .
//         //     ?Location geo:long ?long .
//         //     OPTIONAL {?Location gr:hasOpeningHoursSpecification ?Hours}
//         //     OPTIONAL {?Hours gr:hasOpeningHoursDayOfWeek ?day}
//         //     OPTIONAL {?Hours gr:opens ?opens}
//         //     OPTIONAL {?Hours gr:closes ?closes}
//         //     FILTER(?name = 'ATM') .
//         // }
//         // LIMIT 700
//
//     let myquery = new sparqls.Query({limit: 700, distinct: true});
//
//     myquery.registerPrefix( 'rdfs', '<http://www.w3.org/2000/01/rdf-schema#>');
//     myquery.registerPrefix( 'gr', '<http://purl.org/goodrelations/v1#>');
//     myquery.registerPrefix( 'ns0', '<http://purl.org/goodrelations/v1#>');
//     myquery.registerPrefix( 'geo', '<http://www.w3.org/2003/01/geo/wgs84_pos#>');
//
//     myquery.selection(['?Location', '?shop', '?lat', '?long', '?day', '?opens', '?closes']);
//
//     let Offering = {
//         'type': 'gr:Offering',
//         'gr:availableAtOrFrom': '?Location',
//         'rdfs:label': '?name'
//     };
//
//     // TODO: Figure out how to do optional as shown in the query above
//
//     let Location = {
//         'type': 'ns0:LocationOfSalesOrServiceProvisioning',
//         'geo:lat': '?lat',
//         'geo:long': '?long',
//         'rdfs:label': '?shop',
//         'gr:hasOpeningHoursSpecification': '?Hours'
//     };
//
//     let Hours = {
//         'gr:hasOpeningHoursDayOfWeek': '?day',
//         'gr:opens': '?opens',
//         'gr:closes': '?closes'
//     }
//
//     myquery.registerVariable('Offering', Offering);
//     myquery.registerVariable('Location', Location);
//     myquery.registerVariable('Hours', Hours);
//
//     myquery.filter("?name = '" + obj.amenity + "'");
//
//     logger.log(myquery.sparqlQuery);
//
//     let sparqler = new sparqls.Client("http://sparql.data.southampton.ac.uk/");
//
//     let result = [];
//     let times = [];
//     let d = new Date();
//     let today = d.getDay();
//     let weekday = new Array(7);
//     weekday[0] =  "Sunday";
//     weekday[1] = "Monday";
//     weekday[2] = "Tuesday";
//     weekday[3] = "Wednesday";
//     weekday[4] = "Thursday";
//     weekday[5] = "Friday";
//     weekday[6] = "Saturday";
//
//     sparqler.send(myquery, function(error, data){
//         if(data.results.bindings.length > 0) {
//             try {
//                 // Try because trying to access JSON properties that may be undefined
//                 data.results.bindings.forEach( function(resultBinding) {
//                     let foundDay = resultBinding.day.value.replace("http://purl.org/goodrelations/v1#", "")
//                     let distance = getDistanceFromLatLonInKm(obj.location.lat, obj.location.long, resultBinding.lat.value, resultBinding.long.value);
//                     if( foundDay === weekday[today]) {
//                         result.push(
//                             {
//                                 'venue': resultBinding.shop.value,
//                                 'uri': resultBinding.Location.value,
//                                 'dist': Number(Math.round(distance+'e3')+'e-3'),
//                                 'coordinates': {
//                                     'lat': resultBinding.lat.value,
//                                     'long': resultBinding.long.value
//                                 },
//                                 'times': {
//                                     'open': resultBinding.opens.value,
//                                     'close': resultBinding.closes.value
//                                 }
//                             });
//                     }
//                 });
//             } catch (err) {
//                 logger.log('Failed to read query results');
//                 logger.log(err);
//             }
//         }
//         res.send(result);
//     });
//
// });
//
// let getDistanceFromLatLonInKm = (lat1,lon1,lat2,lon2) => {
//     let R = 6371; // Radius of the earth in km
//     let dLat = deg2rad(lat2-lat1);  // deg2rad below
//     let dLon = deg2rad(lon2-lon1);
//     let a =
//             Math.sin(dLat/2) * Math.sin(dLat/2) +
//             Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
//             Math.sin(dLon/2) * Math.sin(dLon/2)
//         ;
//     let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     return R * c;
// };
//
// let deg2rad = (deg) => {
//     return deg * (Math.PI/180)
// };