let apiai = require('apiai');
const logger = require('tracer').colorConsole();

let chat_app = apiai("0131221ffe7b41b49872ed7e12b53237");

// ask apiai what the messageText means
let handleThis = (messageText, senderId, cb, errcb) => {

    // send message to api ai, use fb page-chat id as the session id for context
    logger.log("Sending " + messageText + " to apiai");
    let request = chat_app.textRequest(messageText, {
        sessionId: senderId
    });

    // apiai response successful
    request.on('response', function(response) {
        logger.log("apiai response => " + JSON.stringify(response));
        if (cb) cb(response, senderId);
    });

    // apiai response error
    request.on('error', function(error) {
        logger.error("apiai error => " + JSON.stringify(response));
        if (errcb) errcb(error, senderId);
    });

    request.end();
};

module.exports = {
    handleThis: handleThis
};