/**
 * This file will run the scenarios defined in ai-test-scenarios.js
 */

const apiai = require('apiai-promise');
const _ = require('lodash');
const request = require('request-promise');
const env = require('../../config/staging');
const expect = require('chai').expect;
const logger = require('tracer').colorConsole();

let ai = apiai(env.API_AI_CLIENT_ID);

let tests = require('./test-scenarios');


function buildTest(test){

    test.forEach(step => {

        it(step.message, (done) => {

            ai.textRequest(step.message, {
                sessionId: step.sessionId
            }).then(response => {

                let properties = Object.keys(step.result);
                for (let property of properties) {

                    let actualVal = response.result[property];
                    let expectVal = step.result[property];

                    expect(actualVal).to.deep.equal(expectVal);
                }

                done();

            }).catch(error => {
                done(error);
            })

        });
    });
}

describe('API AI Test', () => {

    tests.forEach(test => buildTest(test));

});