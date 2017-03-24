const logger = require('tracer').colorConsole();
const request = require('request-promise');

const handleSendApiResponse = require('./handleSendApiResponse');

// token to send and receive messages on the fb page's behalf
const token = process.env.FB_PAGE_ACCESS_TOKEN;

// send message using fb graph api
var sendMessage = (receiver, messageData, cb, errcb, req, res) => {

    // if messagedata is just a string construct the message object
    if (typeof messageData === 'string') messageData = {text:messageData};

    logger.log("Replying to " + receiver + " => " + JSON.stringify(messageData));

    // POST to fb send api
    request({
        url: 'https://graph.facebook.com/v2.8/me/messages',
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
        if (cb) cb(response);
        else handleSendApiResponse.fbSuccessDefaultResponse(res);
    }).catch( (error) => {
        // either callback or default response to soton-bot
        if (errcb) errcb(error);
        else handleSendApiResponse.fbFailedDefaultResponse(res, error);
    });
};

module.exports = sendMessage;