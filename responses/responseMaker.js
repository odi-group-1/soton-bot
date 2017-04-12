const apiai = require('apiai');
const _ = require('lodash');
const logger = require('tracer').colorConsole();
const env = require('../config/staging');

let chatApp = apiai(env.API_AI_CLIENT_ID);

// ask apiai what the messageText means
let handleThis = (messageText, senderId, cb, errcb) => {

    // send message to api ai, use fb page-chat id as the session id for context
    logger.log("Sending " + messageText + " to apiai");

    let request = chatApp.textRequest(messageText, {
        sessionId: senderId
    });

    // apiai response successful
    request.on('response', (response) => {
        logger.log("apiai response => " + JSON.stringify(response));
        if (_.isFunction(cb)) cb(response, senderId);
    });

    // apiai response error
    request.on('error', (error) => {
        logger.error("apiai error => " + JSON.stringify(error));
        if (_.isFunction(errcb)) errcb(error, senderId);
    });

    request.end();

};

module.exports = {
    handleThis: handleThis
};