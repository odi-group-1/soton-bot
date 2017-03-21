const logger = require('tracer').colorConsole();
const request = require('request-promise');

const handleSendApiResponse = require('./handleSendApiResponse');

const token = process.env.FB_PAGE_ACCESS_TOKEN;

var sendMessage = (receiver, messageData, cb, errcb, req, res) => {

    if (typeof messageData === 'string') messageData = {text:messageData};

    logger.log("Replying to " + receiver + " => " + JSON.stringify(messageData));

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
        if (cb) cb(response);
        else handleSendApiResponse.fbSuccessDefaultResponse(res);
    }).catch( (error) => {
        if (errcb) errcb(error);
        else handleSendApiResponse.fbFailedDefaultResponse(res, error);
    });
};

module.exports = sendMessage;