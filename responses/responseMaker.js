var apiai = require('apiai');
const logger = require('tracer').colorConsole();

var chat_app = apiai("0131221ffe7b41b49872ed7e12b53237");

var handleThis = (messageText, senderId, cb, errcb) => {
    logger.log("Message Starting");
    var request = chat_app.textRequest(messageText, {
        sessionId: senderId
    });

    request.on('response', function(response) {
        logger.log("Success");
        if (cb) cb(response, senderId);
    });

    request.on('error', function(error) {
        logger.log("Fails");
        if (errcb) errcb(error, senderId);
    });

    request.end();
    logger.log("Message ended");
};

module.exports = {
    handleThis: handleThis
};