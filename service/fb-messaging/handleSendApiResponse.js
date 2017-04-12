const logger = require('tracer').colorConsole();

// when messaging confirmation is sent to the bot on success
let fbSuccessDefaultResponse = (res) => {
    logger.log('Sending confirmation to fb');
    res.sendStatus(200);
};

// when messaging confirmation is sent to the bot on failure
let fbFailedDefaultResponse = (res, error) => {
    logger.error('Error: ' + error);
    res.sendStatus(400);
};

module.exports = {
    fbSuccessDefaultResponse : fbSuccessDefaultResponse,
    fbFailedDefaultResponse : fbFailedDefaultResponse
};