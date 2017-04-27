/**
 * Created by stefan on 24/03/17.
 */
const request = require('request');
const requestPromise = require('request-promise');
const _ = require('lodash');
const encoder = require('./htmlEncoder');
const logger = require('tracer').colorConsole();

let parseJsonQuery = (queryJson) => {
    let queryString = "";

    // Add prefixes
    if (queryJson.prefix) {
        queryJson.prefix.forEach(function (prefix) {
            queryString += 'PREFIX ' + prefix.id + ' ' + prefix.at + ' ';
        });
    }

    // Add select
    queryString += 'SELECT ';
    if (queryJson.select) {
        queryJson.select.forEach(function (variable) {
            queryString += variable + ' ';
        });
    }

    // Add where
    queryString += 'WHERE { ';
    if (queryJson.where) {
        queryJson.where.forEach(function (statement) {
            switch (statement.type) {
                case "STANDARD":
                    queryString += statement.s + ' ' + statement.p + ' ' + statement.o + '. ';
                    break;
                case "FILTER":
                    queryString += 'FILTER (' + statement.cond + '). ';
                    break;
                case "OPTIONAL":
                    queryString += 'OPTIONAL {' + statement.s + ' ' + statement.p + ' ' + statement.o + '}. ';
                    break;
            }
        });
    }
    queryString += '} ';

    if (queryJson.group) {
        queryString += 'GROUP BY ' + queryJson.group + ' ';
    }

    // Add limit
    if (queryJson.limit) {
        queryString += 'LIMIT ' + queryJson.limit + ' ';
    }

    logger.log("sending query => ##" + queryString+"##");

    queryString = encoder.encode(queryString);

    return queryJson.endpoint + queryString;
};

let getOfferings = (query, cb, errcb) => {

    let queryUrl = parseJsonQuery(query);

    request(queryUrl, function (error, response, body) {

        if (error) {
            cb(error);
            return;
        }

        let jsonBody = JSON.parse(body);


        if (jsonBody && jsonBody.results && jsonBody.results.bindings) {
            cb(jsonBody.results.bindings);

        }else{
            cb(error);
        }
    })
};

/**
 *  Run the sparql query and extract the bindings
 *
 * @param query
 * @returns Promise that resolves if bindings were found, rejects if no bindings were found
 */
let query = query => {

    let queryUrl = parseJsonQuery(query);

    return requestPromise(queryUrl)
        .then(res => {
            let response = JSON.parse(res);
            if (_.has(response, 'results.bindings')) return Promise.resolve(response.results.bindings);
            else return Promise.reject(new Error("No bindings found"))
        });

};

module.exports = {
    getOfferings : getOfferings,
    query : query
};
