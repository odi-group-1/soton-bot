const request = require('request');


let get = (url, cb) => {
    request(url, function (error, response, body) {
        if (error){
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.
        }
        let jsonBody = JSON.parse(body);
        if (jsonBody && jsonBody.results && jsonBody.results.bindings){
            cb(jsonBody.results.bindings);
        }else{
            console.log("-----------[ERROR]-------------------")
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.
        }
    });
};

module.exports = {
    get : get
};
