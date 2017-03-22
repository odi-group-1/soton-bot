const sparqls = require('sparqling-star');
const logger = require('tracer').colorConsole();

var findBuilding = function(str, cb) {
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
                ans = 'LAT: ' + lat + ' LONG: ' + lng;
            } catch (err) {
                logger.log('Tried to find building, failed...');
            }
        }
        if(cb) cb(ans);
    });
};

module.exports = {
    findBuilding: findBuilding
};