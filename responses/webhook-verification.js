/**
 * Action for route for facebook to verify the webhook token
 */

const APP_TOKEN = require('../config/staging').APP_TOKEN;

// simple route to verify the app token so that the webhook can be connected to fb messenger api
const verfiyAppToken = (req, res) => {
    if (req.query['hub.verify_token'] === APP_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong token');
    }
};

module.exports = verfiyAppToken;