
var APP_TOKEN = 'we-will-change-student-lives-in-soton';

// simple route to verify the app token so that the webhook can be connected to fb messenger api
const verfiyAppToken = (req, res) => {
    if (req.query['hub.verify_token'] === APP_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong token');
    }
};

module.exports = verfiyAppToken;