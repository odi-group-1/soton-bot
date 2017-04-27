const sparqls = require('sparqling-star');
const logger = require('tracer').colorConsole();
const _ = require('lodash');
const stored = require('./sparqlUrlMachine/storedQueries');
const jqc = require('./sparqlUrlMachine/jsonQueryConverter');

/**
 * getDistanceFromLatLonInKm takes the lat/long from point A and the lat/long from
 * point B and returns the distance in Km between the two points taking into account
 * the curvature of the earth!
 *
 * @param lat1 - Latitude of point A
 * @param lon1 - Longitude of point A
 * @param lat2 - Latitude of point B
 * @param lon2 - Longitude of point B
 * @returns {number} - Distance in Km between points A and B
 */
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

/**
 * Convert degrees to radians to assist distance function
 *
 * @param deg - Degrees input
 * @returns {number} - Radians output
 */
let deg2rad = (deg) => {
    return deg * (Math.PI/180)
};

/**
 * clean_times is a helper function for the findBookableRoom query that returns the hour from
 * an ISO format date time string.
 *
 * @param str - Input date
 * @returns {Array} - Output hour
 */
let clean_times = (str) => {
    return str.replace(/[0-9]{4}-[0-9]{2}-[0-9]{2}T/g, "").replace(/:00:00\+[0-9]{2}:00/g, "").split(" ");
};

/**
 * findNearestFood is a query that aims to return several options of places to eat within 250m
 * of the user's location when they're close to the university campus.
 *
 * @param location - lat/long of user's position
 * @param cb
 */
let findNearestFood = (location, cb) => {

    let result = [];

    // Generate, encode and execute food query
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

            // Sort venues by increasing distance from user
            result = _.sortBy(result, 'dist');

            // Only finds results close to campus
            if (result.length = 0) {
                result = "You are not close enough to UoS..."
            }
        } catch (err) {
            logger.log(err);
            logger.error('Failed to read query results');
            result = "Something went wrong."
        }
        if (_.isFunction(cb)) cb(result);

    },function (error) {
        logger.log(error);
        if (_.isFunction(cb)) cb(result);
    });
};

/**
 * findBuilding is a query that aims to show where a particular university building is on
 * a map.
 *
 * @param buildingId - The university building number
 * @param cb
 */
let findBuilding = (buildingId, cb) => {
    let result = "Sorry, I don't know where that is...";

    // Generate query using buildingId arg
    let queryJson = stored.building(buildingId);

    // Convert and execute query
    jqc.getOfferings(queryJson, function (buildingAttrList) {
        if(buildingAttrList.length > 0) {
            try {
                // Store lat/long of found building
                result = {
                    lat: buildingAttrList[0].o.value,
                    long: buildingAttrList[1].o.value
                };

            } catch (error) {
                logger.error(error);
                logger.error('Tried to find building, failed...');
                result = "Something went wrong..."
            }
        }
        if(_.isFunction(cb)) cb(result);

    }, function (error) {
        logger.error(error);
        cb(result); //TODO @Shakib: make it errcb when we've defined what errcb looks like
    });
};

/**
 * findOffering is a query that aims to find required amenities close to the user.
 * Todays date is also passed to the query to find open/close times where available.
 *
 * @param obj - JSON object containing the amenity required and lat/long position
 *              of the user.
 * @param cb
 */
function findOffering(obj, cb) {

    // Get today's date
    let d = new Date();
    let today = new Date().toLocaleString('en-us', {  weekday: 'long' });

    // Generate 'amenity' query with desired amenity and today's date
    let query = stored.amenity(obj.amenity, today);

    let result = [];

    // Convert and execute the query
    jqc.getOfferings(query, function (allOfferings) {

        if(allOfferings.length > 0) {
            try {
                allOfferings.forEach( function(resultBinding) {

                    // Reset distance on each iteration
                    let distance = undefined;

                    // If a lat/long location is available for this result, calculate the distance from user
                    if (resultBinding.shopLat && resultBinding.shopLong) {
                        distance = getDistanceFromLatLonInKm(obj.location.lat, obj.location.long,
                            resultBinding.shopLat.value, resultBinding.shopLong.value);
                    }

                    // Add the details of the located amenity to results array
                    result.push({
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

                // Return results sorted by distance in ascending order
                result = _.sortBy(result, 'dist');

            } catch (err) {
                logger.log('Failed to read query results');
                logger.error(err);
                result = "Something went wrong."
            }
        } else {
            result = "Sorry I couldn't find any results close to you :("
        }

        if (_.isFunction(cb)) cb(result);
    },function (error) {
        logger.log(error);
        if (_.isFunction(cb)) cb("Something went wrong...");
    });
}

/**
 * TODO @Deepak - comment this function
 * TODO @Tom - convert this function to use JQC
 * @param passedTerm
 * @param cb
 * @param errcb
 */
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
                    } else{
                        withinEndTerm = false;
                    }
                }

                if(dateToSendBack){
                    let month = dateToSendBack.getUTCMonth() + 1;
                    let day = dateToSendBack.getUTCDate();
                    let year = dateToSendBack.getUTCFullYear();

                    if (_.isFunction(cb)) cb(day+"/"+month+"/"+year);
                } else{
                    logger.log('Failed to retrieve date, even though query passed.');
                    if (_.isFunction(cb)) errcb("No dates available");
                }
            } catch (err) {
                logger.log('Failed to read query results');
                if (_.isFunction(cb)) errcb("No dates available");
            }
        }

    });
};

/**
 * TODO @Deepak - comment this function
 * TODO @Tom - convert this function to use JQC
 *
 * @param passedTerm
 * @param cb
 * @param errcb
 */
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

                    if (_.isFunction(cb)) cb(day+"/"+month+"/"+year);
                }else{
                    logger.log('Failed to retrieve date, even though query passed.');
                    if (_.isFunction(cb)) errcb("No dates available");
                }
            } catch (err) {
                logger.log('Failed to read query results');
                if (_.isFunction(errcb)) errcb("No dates available");
            }
        }
    });
};

/**
 * findRoomDetails is a query that aims to find information about a specific university room
 * such as its open data URI, capacity and base building. Also returns an image of the room.
 *
 * @param room - University room in the form bb-rrrr where bb is the building number
 *               and rrrr the room number
 * @param cb
 */
function findRoomDetails(room, cb) {

    // Constants used in string operation
    let bString = 'http://id.southampton.ac.uk/building/';
    let fString = 'http://id.southampton.ac.uk/floor/';

    // Initialization of the result object returned on success
    let result = {  URI: undefined,
                    name: undefined,
                    roomType: undefined,
                    imgURL: undefined,
                    building: undefined,
                    floor: undefined,
                    accessNotes: undefined,
                    capacity: undefined};

    // Build query to find room info using room parameter
    let query = stored.room(room);

    // Convert and execute query
    jqc.getOfferings(query, function (roomDetails) {

        if(roomDetails.length > 0) {
            // Parse result
            try {
                result.URI = roomDetails[0].room.value;
                result.name = roomDetails[0].roomNotation.value;
                result.roomType = roomDetails[0].roomType.value;
                result.imgURL = roomDetails[0].roomImage.value;
                result.accessNotes = roomDetails[0].roomAccess.value;
                result.capacity = roomDetails[0].roomCapacity.value;

                // Some rooms provide a floor attribute, others just provide building
                let building = roomDetails[0].roomBuilding.value;
                if (building.includes(bString)) {
                    result.building = building.replace(bString, '');
                }
                if (building.includes(fString)) {
                    result.building = building.replace(fString, '').split('-')[0];
                    result.floor = building.replace(fString, '').split('-')[1];
                }

            } catch (err) {
                logger.log('Failed to read query results');
                logger.error(err);
                result = "Something went wrong."
            }
        } else {
            result = "Sorry I couldn't find that room."
        }

        if (_.isFunction(cb)) cb(result);
    },function (error) {
        logger.log(error);
        if (_.isFunction(cb)) cb("Something went wrong...");
    });
}

/**
 * findBookableRoom is a query that aims to find university rooms available at a specified
 * time. api.ai allows the question to be asked in several ways resulting in a few different
 * forms of the resulting argument 'timeReq' as detailed below.
 *
 * @param timeReq - Sent from api.ai, can take several forms:
 *                  00:00:00, yyyy-mm-dd, yyyy-mm-ddT00:00:00Z, yyyy-mm-dd/yyyy-mm-dd
 * @param cb
 */
function findBookableRoom(timeReq, cb) {

    // Initialize date-time parameters used in sparql query
    let dateSt = undefined;
    let dateEnd = undefined;
    let dateTimeRequest = undefined;

    let early = '00:00:00Z';
    let late = '23:59:59Z';

    // Get todays date in ISO format for 'today' queries
    let d = new Date().toISOString().split('.')[0] + "Z";
    let dat = d.split('T')[0] + 'T';

    /**
     * The timeReq requirement can take several forms, each of which require different values
     * of the three query parameters. Regex used to determine which type of value as been
     * provided for timeReq.
     */
    if (timeReq.match(/^[0-9]{2}:[0-9]{2}:[0-9]{2}$/)) {
        //00:00:00  -   Pure Time
        dateSt = dat + early;
        dateEnd = dat + late;
        dateTimeRequest = dat + timeReq + 'Z';

    } else if (timeReq.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
        //yyyy-mm-dd  -  Pure Date
        dateSt = timeReq + 'T' + early;
        dateEnd = timeReq + 'T' + late;

        //If request is for future date, use 7am onwards. Otherwise go from time now (today)
        let now = new Date().toISOString();
        if(now.split('T')[0] === timeReq) {
            //Today
            dateTimeRequest = now.split('.')[0]+"Z";
        } else {
            dateTimeRequest = timeReq + 'T' + '07:00:00Z';
        }

    } else if (timeReq.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$/)) {
        //yyyy-mm-ddT00:00:00Z  -  DateTime
        let trimD = timeReq.split('T')[0];
        let trimT = timeReq.split('T')[1];
        dateSt = trimD + 'T' + early;
        dateEnd = trimD + 'T' + late;
        dateTimeRequest = timeReq;

    } else if (timeReq.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}\/[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
        //yyyy-mm-dd/yyyy-mm-dd  - Date Range
        logger.log('Date range not supported - consider changing output from AI API');

    } else {
        //BAD
        logger.log('Bad output from AI API: ' + timeReq);
    }

    // Result is either a string upon error or an array of JSON objects holding parsed results
    let result = [];

    // Build query 'freeRoom' using above params
    let query = stored.freeRoom(dateSt,dateEnd,dateTimeRequest);

    // Convert and execute query
    jqc.getOfferings(query, function (availableRooms) {

        if(availableRooms.length > 0) {
            try {
                availableRooms.forEach( function(resultBinding) {
                    let range = [7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22];
                    let start_arr = clean_times(resultBinding.starts.value);
                    let end_arr   = clean_times(resultBinding.ends.value);

                    // Iterate through all bookings
                    for (let i = 0; i < start_arr.length; i++) {

                        //iterate over every 'starting' hour that is used by the bookings
                        for (let time = start_arr[i]; time < end_arr[i]; time++){
                            delete range[time-7]
                        }
                    }

                    // Clean the 'range' variable from undefined's
                    // and ensure that no entries before 'min_time' are included
                    let min_time  = 0 + dateTimeRequest.split('T')[1].split(':')[0];
                    let range2 = range.filter(function(n){ return n != undefined && n > min_time });

                    // Add parsed data to results array
                    result.push({
                        room: resultBinding.roomNumber.value,
                        uri: resultBinding.room.value,
                        possibleTimes: range2,
                        img: resultBinding.img.value,
                        capacity: resultBinding.capacity.value
                    });
                });

                // Sort results by most available to least available
                result = _.sortBy(result, [function(o) { return 24-o.possibleTimes.length}]);

            } catch (err) {
                // Usually when an expected object property was not found
                logger.log('Failed to read query results');
                logger.error(err);
                result = "Something went wrong..."
            }
        } else {
            result = "Sorry I couldn't find anything matching your criteria."
        }

        // Successful return of results
        if (_.isFunction(cb)) cb(result);
    },function (error) {
        logger.log(error);
        if (_.isFunction(cb)) cb("Something went wrong...");
    });
}

module.exports = {
    findBuilding: findBuilding,
    findNearestFood: findNearestFood,
    findOffering: findOffering,
    endTermDates: endTermDates,
    startTermDates: startTermDates,
    findRoomDetails: findRoomDetails,
    findBookableRoom: findBookableRoom
};