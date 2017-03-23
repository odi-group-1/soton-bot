const sparqls = require('sparqling-star');
const logger = require('tracer').colorConsole();
const _ = require('lodash');

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

    let myquery = new sparqls.Query({limit: 10000});

    myquery.registerPrefix( 'rdfs', '<http://www.w3.org/2000/01/rdf-schema#>');
    myquery.registerPrefix( 'geo', '<http://www.w3.org/2003/01/geo/wgs84_pos#>');
    myquery.registerPrefix( 'ns', '<http://id.southampton.ac.uk/ns/>');

    let business = {
        'type': 'ns:FoodOrDrinkEstablishment',
        'geo:lat': '?lat',
        'geo:long': '?long',
        'rdfs:label': '?name'
    };

    myquery.registerVariable('business', business);

    logger.log(myquery.sparqlQuery);

    let sparqler = new sparqls.Client("http://sparql.data.southampton.ac.uk/");

    let result = [];
    let ans = "";

    sparqler.send(myquery, function(error, data){
        if(data.results.bindings.length > 0) {
            try {
                // Try because trying to access JSON properties that may be undefined
                data.results.bindings.forEach( function(resultBinding) {
                    let distance = getDistanceFromLatLonInKm(location.lat, location.long, resultBinding.lat.value, resultBinding.long.value);
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
                if (result.length > 0) {
                    ans = "Within 250m there are " + result.length + ' places to eat: ';
                    result.forEach(function (place) {
                        ans += " " + place.name + " " + place.dist + "km";
                    });
                } else {
                    ans = "You are not close enough to UoS..."
                }
            } catch (err) {
                logger.error('Failed to read query results');
            }
        }
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

function findOffering(param, cb) {

    let myquery = new sparqls.Query({limit: 5, distinct: true});

    myquery.registerPrefix( 'rdfs', '<http://www.w3.org/2000/01/rdf-schema#>');
    myquery.registerPrefix( 'gr', '<http://purl.org/goodrelations/v1#>');

    let Offering = {
        'type': 'gr:Offering',
        'gr:availableAtOrFrom': '?location',
        'rdfs:label': '?name'
    };

    myquery.registerVariable('Offering', Offering);

    myquery.filter("?name = '" + param + "'");

    logger.log(myquery.sparqlQuery);

    let sparqler = new sparqls.Client("http://sparql.data.southampton.ac.uk/");

    let result = [];
    let ans = "Sorry, I couldn't find any " + param + ".";

    sparqler.send(myquery, function(error, data){
        if(data.results.bindings.length > 0) {
            try {
                // Try because trying to access JSON properties that may be undefined
                data.results.bindings.forEach( function(resultBinding) {
                    // console.log(resultBinding);
                    result.push(resultBinding.location.value);
                });
                ans = result;
            } catch (err) {
                logger.error('Failed to read query results');
            }
        }
        if (cb) cb(ans);
    });
}

module.exports = {
    findBuilding: findBuilding,
    findNearestFood: findNearestFood,
    findOffering: findOffering
};