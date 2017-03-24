/**
 * Created by stefan on 24/03/17.
 */


let get = (url) => {
    http.get(url, (res) => {
        const statusCode = res.statusCode;
        // const contentType = res.headers['content-type'];

        let error;
        //If not 200 OK
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                'Status Code: ${statusCode}');

        // If we did not recieve JSON data
        }
        // else if (!/^application\/json/.test(contentType)) {
        //     error = new Error('Invalid content-type.\n' +
        //         'Expected application/json but received ${contentType}');
        // }
        if (error) {
            console.log(error)
            // consume response data to free up memory
            res.resume();
            return undefined;
        }
        return res;
    //     res.setEncoding('utf8');
    //     let rawData = '';
    //     res.on('data', (chunk) => rawData += chunk);
    //     res.on('end', () => {
    //         try {
    //             return JSON.parse(rawData);
    //
    //         } catch (e) {
    //             console.log(e.message);
    //             return undefined;
    //         }
    //     });
    // }).on('error', (e) => {
    //     console.log('Got error: ${e.message}');
    //     return undefined;
    });
};
