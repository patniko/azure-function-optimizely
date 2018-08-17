const qs = require("query-string");
const optimizely = require('../lib/optimizely');
const { WebClient } = require('@slack/client');
const cTable = require('console.table');

const SLACK_TOKEN = process.env['SLACK_TOKEN'];

const processCmd = function(command) {

    if (command == "list") {
        return new Promise((resolve, reject) => { 
            return optimizely.getExperiments()
            .then((experiments) => {
                const table = cTable.getTable(experiments);
                resolve("```" + table + "```");
            })
            .catch((error) => {
                reject(error);
            });
        });
    } else {
        return new Promise((resolve, reject) => { 
            return optimizely.getExperimentResults(command)
            .then((experiments) => {
                resolve(experiments);
            })
            .catch((error) => {
                reject(error);
            });
        });
    }
}

const resolveContext = function (body, status) {
    this.res = { body: body, status: status };
    this.done();

    this.log(body);
};

const postResponse = function(message, channel_id, token) {
    const web = new WebClient(token);
    web.chat.postMessage({ channel: channel_id, text: message })
    .then((res) => {
        console.log('Message sent: ', res.ts);
    })
    .catch(console.error);
}

module.exports = function (context, req) {    
    context.resolve = resolveContext;
    context.log('ExperimentList processed a command.');
    if (req.query.name || (req.body)) {
        context.resolve("", 200);
        const params = qs.parse(req.body);
        processCmd(params.text)
        .then(successMessage => {
            postResponse(successMessage, params.channel_id, SLACK_TOKEN);
        })
        .catch((errorMessage) => {
            postResponse(errorMessage, params.channel_id, SLACK_TOKEN);
        });
    }
    else {
        context.resolve("I hunger to serve.", 200)
        context.done();
    }
};