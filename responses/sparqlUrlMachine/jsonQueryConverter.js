/**
 * Created by stefan on 24/03/17.
 */
const request = require('request');
const encoder = require('./htmlEncoder');
const logger = require('tracer').colorConsole();

let parseJsonQuery = (queryJson) => {
    let queryString = "";

    // Add prefixes
    queryJson.prefix.forEach( function(prefix) {
        queryString += 'PREFIX ' + prefix.id + ' ' + prefix.at + ' ';
    });

    // Add select
    queryString += 'SELECT ';
    queryJson.select.forEach( function(variable) {
        queryString += variable + ' ';
    });

    // Add where
    queryString += 'WHERE { ';
    queryJson.where.forEach( function(statement){
        switch(statement.type) {
            case "STANDARD":
                queryString += statement.s + ' ' + statement.p + ' ' + statement.o + '. ';
                break;
            case "FILTER":
                queryString += 'FILTER (' + statement.cond + '). ';
                break;
            case "OPTIONAL":
                queryString += 'OPTIONAL {' + statement.s + ' ' + statement.p + ' ' + statement.o +'} ';
                break;
        }
    });
    queryString += '} ';

    // Add limit
    queryString += 'LIMIT ' + queryJson.limit;

    logger.log("sending query => " + queryString);

    queryString = encoder.encode(queryString);

    return queryJson.endpoint + queryString;
};

let getOfferings = (queryJson, cb, errcb) => {
    let queryUrl = parseJsonQuery(queryJson);
    request(queryUrl, function (error, response, body) {
        if (error) {
            errcb(error);
            return;
        }
        let jsonBody = JSON.parse(body);
        if (jsonBody && jsonBody.results && jsonBody.results.bindings) {
            cb(jsonBody.results.bindings);

        }else{
            errcb(error);
        }
    })
};

module.exports = {
    getOfferings : getOfferings
};
