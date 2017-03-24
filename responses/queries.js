const sparqls = require('sparqling-star');
const logger = require('tracer').colorConsole();
const _ = require('lodash');

const stored = require('./sparqlUrlMachine/storedQueries');
const jqc = require('./sparqlUrlMachine/jsonQueryConverter');

const weekday = new Array(7);
weekday[0] =  "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

let getDistanceFromLatLonInKm = (lat1,lon1,lat2,lon2) => {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2-lat1);  // deg2rad below
    let dLon = deg2rad(lon2-lon1);
    let a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

let deg2rad = (deg) => {
    return deg * (Math.PI/180)
};

let findNearestFood = (location, cb) => {

    let result = [];
    let ans = "Something went wrong.";

    let queryJson = stored.food();

    jqc.getOfferings(queryJson, function (allOfferings) {
        try {
            // Try because trying to access JSON properties that may be undefined
            allOfferings.forEach( function(resultBinding) {
                let distance = getDistanceFromLatLonInKm(location.lat, location.long, resultBinding.lat.value, resultBinding.long.value);
                if(distance <= 0.250) { //Within 250m
                    result.push({
                        uri: resultBinding.Business.value,
                        lat: resultBinding.lat.value,
                        long: resultBinding.long.value,
                        name: resultBinding.name.value,
                        dist: Number(Math.round(distance+'e3')+'e-3'),
                    });
                }
            });
            result = _.sortBy(result, 'dist');
            if (result.length > 0) {
                ans = result;
            } else {
                ans = "You are not close enough to UoS..."
            }
        } catch (err) {
            logger.log(err)
            logger.error('Failed to read query results');
        }
        if (cb) cb(ans);

    },function (error) {
        logger.log(error);
        if (cb) cb(ans);
    });
};

let findBuilding = (str, cb) => {
    let building = str;
    let myquery = new sparqls.Query({limit: 2});
    myquery.registerTriple({'subject':'?s','predicate':'?p','object':'?o'});
    myquery.filter("?s = <http://id.southampton.ac.uk/building/"+building+"> && (?p = <http://www.w3.org/2003/01/geo/wgs84_pos#lat> || ?p = <http://www.w3.org/2003/01/geo/wgs84_pos#long>)");

    logger.log(myquery.sparqlQuery);

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
                ans = {
                    lat: lat,
                    long: lng
                };
            } catch (err) {
                logger.error('Tried to find building, failed...');
            }
        }
        if(cb) cb(ans);
    });
};

function findOffering(obj, cb) {

    // Expecting { amenity: 'Alcohol', location:{ lat:50.000000, long:-1.000000 }}
    let obj = req.params.obj;

    let result = [];
    let d = new Date();
    let today = d.getDay();

    let queryJson = stored.amenity(obj.amenity);

    logger.log();

    jqc.getOfferings(queryJson, function (allOfferings) {
        if(allOfferings.length > 0) {
            try {
                // Try because trying to access JSON properties that may be undefined
                allOfferings.forEach( function(resultBinding) {
                    let foundDay = resultBinding.day.value.replace("http://purl.org/goodrelations/v1#", "")
                    let distance = getDistanceFromLatLonInKm(obj.location.lat, obj.location.long, resultBinding.lat.value, resultBinding.long.value);
                    if( foundDay === weekday[today]) {
                        result.push(
                            {
                                'venue': resultBinding.shop.value,
                                'uri': resultBinding.Location.value,
                                'dist': Number(Math.round(distance+'e3')+'e-3'),
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
        } else {
            result = "Sorry I couldn't find any results close to you :("
        }
        if (cb) cb(result);
    },function (error) {
        logger.log(error);
        if (cb) cb("Something went wrong...");
    });
};

let endTermDates = (passedTerm, cb, errcb) => {

    let myquery = new sparqls.Query();

    myquery.registerPrefix('rdfs','<http://www.w3.org/2000/01/rdf-schema#>');
    myquery.registerPrefix('ns','<http://id.southampton.ac.uk/ns/>');
    myquery.registerPrefix('tl','<http://purl.org/NET/c4dm/timeline.owl#>');

    let terms = {
        'type':'ns:AcademicSessionTerm',
        'rdfs:label' : '?name',
        'tl:beginsAtDateTime' : '?start',
        'tl:endsAtDateTime' : '?end'
    };
    let currentYear = new Date().getFullYear();
    let currentDate = new Date();

    myquery.registerVariable('terms', terms);
    myquery.filter("regex(?name, \'" + currentYear +"\')");
    myquery.filter("regex(?name, \'" + passedTerm +"\')");

    logger.log(myquery.sparqlQuery);

    let sparqler = new sparqls.Client("http://sparql.data.southampton.ac.uk/");
    let result = [];
    let withinEndTerm = true;
    let dateToSendBack;



    sparqler.send(myquery, function(error, data){
        if(data.results.bindings.length > 0) {
            try {

                data.results.bindings.forEach( function(resultBinding) {
                    result.push({
                        'name': resultBinding.name.value,
                        'startDate': new Date(resultBinding.start.value),
                        'endDate':  new Date(resultBinding.end.value)
                    });
                });

                //check if they are within the current term's end data
                for(let i=0; i<result.length;i++){
                    if(currentDate <= result[i].endDate){
                        //within term end date
                        dateToSendBack = result[i].endDate;
                        break;
                    }else{
                        withinEndTerm = false;
                    }
                }

                if(dateToSendBack){
                    let month = dateToSendBack.getUTCMonth() + 1;
                    let day = dateToSendBack.getUTCDate();
                    let year = dateToSendBack.getUTCFullYear();

                    if (cb) cb(day+"/"+month+"/"+year);
                }else{
                    logger.log('Failed to retrieve date, even though query passed.');
                    if (errcb) errcb("No dates available");
                }
            } catch (err) {
                logger.log('Failed to read query results');
                if (errcb) errcb("No dates available");
            }
        }

    });
};

let startTermDates = (passedTerm, cb, errcb) => {

    let myquery = new sparqls.Query();

    myquery.registerPrefix('rdfs','<http://www.w3.org/2000/01/rdf-schema#>');
    myquery.registerPrefix('ns','<http://id.southampton.ac.uk/ns/>');
    myquery.registerPrefix('tl','<http://purl.org/NET/c4dm/timeline.owl#>');

    let terms = {
        'type':'ns:AcademicSessionTerm',
        'rdfs:label' : '?name',
        'tl:beginsAtDateTime' : '?start',
        'tl:endsAtDateTime' : '?end'
    };
    let currentYear = new Date().getFullYear();
    let currentDate = new Date();

    myquery.registerVariable('terms', terms);
    myquery.filter("regex(?name, \'" + currentYear +"\')");
    myquery.filter("regex(?name, \'" + passedTerm +"\')");

    logger.log(myquery.sparqlQuery);

    let sparqler = new sparqls.Client("http://sparql.data.southampton.ac.uk/");
    let result = [];
    let termNotStarted = true;
    let dateToSendBack;


    sparqler.send(myquery, function(error, data){
        if(data.results.bindings.length > 0) {
            try {

                data.results.bindings.forEach( function(resultBinding) {
                    result.push({
                        'name': resultBinding.name.value,
                        'startDate': new Date(resultBinding.start.value),
                        'endDate':  new Date(resultBinding.end.value)
                    });
                });

                //check if they are before the current term's start data
                for(let i=0; i<result.length;i++){
                    if(currentDate <= result[i].startDate){
                        //within term start date
                        dateToSendBack = result[i].startDate;
                        break;
                    }else{
                        termNotStarted = false;
                    }
                }

                if(dateToSendBack){
                    let month = dateToSendBack.getUTCMonth() + 1;
                    let day = dateToSendBack.getUTCDate();
                    let year = dateToSendBack.getUTCFullYear();

                    if (cb) cb(day+"/"+month+"/"+year);
                }else{
                    logger.log('Failed to retrieve date, even though query passed.');
                    if (errcb) errcb("No dates available");
                }
            } catch (err) {
                logger.log('Failed to read query results');
                if (errcb) errcb("No dates available");
            }
        }

    });
};

module.exports = {
    findBuilding: findBuilding,
    findNearestFood: findNearestFood,
    findOffering: findOffering,
    endTermDates: endTermDates,
    startTermDates: startTermDates
};