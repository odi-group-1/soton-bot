const logger = require('tracer').colorConsole();

let fbSuccessDefaultResponse = (res) => {
    logger.log('Sending confirmation to fb');
    res.sendStatus(200);
};

let fbFailedDefaultResponse = (res, error) => {
    logger.error('Error: ' + error);
    res.sendStatus(400);
};

module.exports = {
    fbSuccessDefaultResponse : fbSuccessDefaultResponse,
    fbFailedDefaultResponse : fbFailedDefaultResponse
};