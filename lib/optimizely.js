const request = require('request-promise');

module.exports = {
    getProjects: function() {
        const options = BuildUrl(`/projects`);
        Object.assign(options, { method: 'GET' });
        return request(options);
    },
    getExperiments: function() {
        const OPTIMIZELY_PROJECT = process.env['OPTIMIZELY_PROJECT'];
        const options = BuildUrl(`/experiments?project_id=${OPTIMIZELY_PROJECT}`);
        Object.assign(options, { method: 'GET' });
        return request(options)
        .then(response => {
            const experiments = JSON.parse(response);
            const running = experiments.filter(experiment => experiment.status != "paused");
            const list = running.map(experiment => {
                return {
                    id: experiment.id,
                    description: experiment.description,
                    status: experiment.status,
                    type: experiment.types
                }
            });
            return list;
        });
    },
    getExperimentResults: function(experiment_id) {
        const options = BuildUrl(`/experiments/${experiment_id}/results`);
        Object.assign(options, { method: 'GET' });
        return request(options)
        .then(response => {

            const results = JSON.parse(response);
            let report = {
                start_time: results.start_time,
                baseline_count: results.reach.baseline_count,
                treatment_count: results.reach.treatment_count,
                total_count: results.reach.total_count
            };
            report.metrics = results.metrics.map(metric => {
                const item = {
                    name: metric.name,
                    winner: metric.conclusion ? metric.conclusion.winner : "inconclusive"
                }
                item.variants = Object.keys(metric.results).map(function(key) {
                    const result = metric.results[key];
                    return {
                        baseline: result.is_baseline,
                        name: result.name,
                        samples: result.samples,
                        visitors_remaining: result.lift ? result.lift.visitors_remaining : "?",
                        is_significant: result.lift ? result.lift.is_significant : "",
                        status: result.lift ? result.lift.lift_status : ""
                    };
                });
                return item;
            });

            return report;
        });
    }
};

function BuildUrl(endpoint) {
    const OPTIMIZELY_TOKEN = process.env['OPTIMIZELY_TOKEN'];
    const options = {
        headers: { 'Authorization': `Bearer ${OPTIMIZELY_TOKEN}` },
        url: `https://api.optimizely.com/v2${endpoint}`
    };
    return options;
}
