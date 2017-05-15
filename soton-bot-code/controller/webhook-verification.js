/**
 * Action for route for facebook to verify the webhook token
 */

const env = require('../config/staging');
const logger = require('tracer').colorConsole();

// simple route to verify the app token so that the webhook can be connected to fb messenger api
let verfiyAppToken = (req, res) => {

    logger.log("verifying token " + req.query['hub.verify_token']);

    if (req.query['hub.verify_token'] === env.APP_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong token');
    }

};

module.exports = verfiyAppToken;