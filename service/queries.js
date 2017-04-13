const sparqls = require('sparqling-star');
const logger = require('tracer').colorConsole();
const _ = require('lodash');

const stored = require('./sparqlUrlMachine/storedQueries');
const jqc = require('./sparqlUrlMachine/jsonQueryConverter');

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

let findBuilding = (buildingId, cb) => {
    let ans = "Sorry, I don't know where that is...";

    let queryJson = stored.building(buildingId);

    jqc.getOfferings(queryJson, function (buildingAttrList) {
        if(buildingAttrList.length > 0) {
            try {
                // Try because trying to access JSON properties that may be undefined
                let lat = buildingAttrList[0].o.value;
                let lng = buildingAttrList[1].o.value;
                ans = {
                    lat: lat,
                    long: lng
                };
            } catch (error) {
                logger.error(error);
                logger.error('Tried to find building, failed...');
            }
        }
        if(cb) cb(ans);

    }, function (error) {
        logger.error(error);
        cb(ans);
    });
};

function findOffering(obj, cb) {

    let result = [];
    let d = new Date();
    let today = new Date().toLocaleString('en-us', {  weekday: 'long' });

    let query = `
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
            PREFIX gr: <http://purl.org/goodrelations/v1#> 
            PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> 
            
            SELECT ?shop 
                (SAMPLE (?name) AS ?shopName)
                (SAMPLE (?lat) AS ?shopLat)
                (SAMPLE (?long) AS ?shopLong)
                (SAMPLE (?openTime) AS ?shopOpenTime)
                (SAMPLE (?closeTime) AS ?shopCloseTime)
            
            WHERE { 
              ?shop a gr:LocationOfSalesOrServiceProvisioning;
                    rdfs:label ?name.
              ?offering gr:availableAtOrFrom ?shop;
                        rdfs:label "` + obj.amenity + `".
              
              OPTIONAL {?shop geo:lat ?lat; geo:long ?long;}
              OPTIONAL {?shop gr:hasOpeningHoursSpecification ?openingHours.
                        ?openingHours gr:hasOpeningHoursDayOfWeek gr:` + today + `;
                                      gr:opens ?openTime;
                                      gr:closes ?closeTime.
                       }
            } 
            
            GROUP BY ?shop
            
            LIMIT 10
    `;

    jqc.getOfferings(query, function (allOfferings) {

        if(allOfferings.length > 0) {
            try {
                // Try because trying to access JSON properties that may be undefined
                allOfferings.forEach( function(resultBinding) {
                    let distance = undefined;
                    if (resultBinding.shopLat && resultBinding.shopLong) {
                        distance = getDistanceFromLatLonInKm(obj.location.lat, obj.location.long,
                            resultBinding.shopLat.value, resultBinding.shopLong.value);
                    }
                    logger.log((distance) ? Number(Math.round(distance+'e3')+'e-3') : Infinity);
                    result.push(
                        {
                            'venue': resultBinding.shopName.value,
                            'uri': resultBinding.shop.value,
                            'dist': distance ? Number(Math.round(distance+'e3')+'e-3') : Infinity,
                            'coordinates': {
                                'lat': distance ? resultBinding.shopLat.value : undefined,
                                'long': distance ? resultBinding.shopLong.value: undefined
                            },
                            'times': {
                                'open': resultBinding.shopOpenTime ? resultBinding.shopOpenTime.value : "",
                                'close': resultBinding.shopCloseTime ? resultBinding.shopCloseTime.value : ""
                            }
                        });
                });
                result = _.sortBy(result, 'dist');
            } catch (err) {
                logger.log('Failed to read query results');
                logger.error(err);
            }
        } else {
            result = "Sorry I couldn't find any results close to you :("
        }

        if (cb) cb(result);
    },function (error) {
        logger.log(error);
        if (cb) cb("Something went wrong...");
    });
}

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