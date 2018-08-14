const qs = require("query-string");
const optimizely = require('../lib/optimizely');

const processCmd = function(command) {

    if (command == "list") {
        return new Promise((resolve, reject) => { 
            return optimizely.getExperiments()
            .then((experiments) => {
                resolve(experiments);
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

module.exports = function (context, req) {    
    context.resolve = resolveContext;
    context.log('ExperimentList processed a command.');
    if (req.query.name || (req.body)) {
        const params = qs.parse(req.body);
        processCmd(params.text)
        .then(successMessage => {
            context.resolve(successMessage, 200)
        })
        .catch((errorMessage) => {
            context.resolve(errorMessage, 200);
        });
    }
    else {
        context.res = {
            status: 200,
            body: "Please pass a valid command."
        };
        context.done();
    }
};