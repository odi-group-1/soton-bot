const logger = require('tracer').colorConsole();
const request = require('request-promise');

const token = process.env.FB_PAGE_ACCESS_TOKEN;

var echo = (receiver, text, cb, errcb) => {

    // the message to send to the bot user
    let messageData = { text:text };

    logger.log("Replying to " + receiver + " => " + messageData);

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
        logger.log('Response from fb ' + JSON.stringify(response));
        logger.log('Sending confirmation to fb');
        if (cb) cb(response);
    }).catch( (error) => {
        logger.error('Error: ' + error);
        if (errcb) errcb(error);
    });
};

module.exports = echo;