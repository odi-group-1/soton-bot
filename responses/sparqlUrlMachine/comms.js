const request = require('request');


let get = (url) => {
    request(url, function (error, response, body) {
        if (error){
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.
        }
        return body.results.bindings;
    });
};

module.exports = {
    get : get
};
