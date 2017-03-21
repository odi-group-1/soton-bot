const verfiyAppToken = (req, res) => {
    if (req.query['hub.verify_token'] === 'we-will-change-student-lives-in-soton') {
        res.send(req.query['hub.challenge'])
    } else {
        res.send('Error, wrong token')
    }
};

module.exports = verfiyAppToken;