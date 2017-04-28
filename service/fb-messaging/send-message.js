const logger = require('tracer').colorConsole();
const request = require('request-promise');
const _ = require('lodash');

const handleSendApiResponse = require('./handleSendApiResponse');

// token to send and receive messages on the fb page's behalf
const token = process.env.FB_PAGE_ACCESS_TOKEN;

// send message using fb graph api
let sendMessage = (receiver, messageData, cb, errcb, req, res) => {

    // if messagedata is just a string construct the message object
    if (_.isString(messageData)) messageData = {text:messageData};

    logger.log("Replying to " + receiver + " => " + JSON.stringify(messageData));

    // POST to fb send api
    request({
        url: 'https://graph.facebook.com/v2.9/me/messages',
        qs: {
            access_token:token
        },
        method: 'POST',
        json: {
            recipient: {
                id:receiver
            },
            message: messageData,
        }
    }).then((response) =>  {
        // message sent and either callback or default response to soton-bot
        if (_.isFunction(cb)) cb(response);
        else handleSendApiResponse.fbSuccessDefaultResponse(res);
    }).catch((error) => {
        // either callback or default response to soton-bot
        if (_.isFunction(errcb)) errcb(error);
        else handleSendApiResponse.fbFailedDefaultResponse(res, error);
    });
};

module.exports = sendMessage;