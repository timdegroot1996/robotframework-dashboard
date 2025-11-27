import { settings } from '../constants/settings.js';
import { compareRunIds } from '../constants/graphs.js';
import { barConfig } from '../constants/config.js';

// function to get the compare statistics data
function get_compare_statistics_graph_data(filteredData) {
    const selectedRuns = [...new Set(
        compareRunIds
            .map(id => document.getElementById(id).value)
            .filter(val => val !== "None")
    )];
    const datasets = selectedRuns.map(runId => {
        const match = filteredData.find(d =>
            d.run_start === runId || d.run_alias === runId
        );
        return match ? {
            label: settings.show.aliases ? match.run_alias : match.run_start,
            data: [match.passed, match.failed, match.skipped],
            ...barConfig
        } : null;
    }).filter(Boolean);
    return {
        labels: ['Passed', 'Failed', 'Skipped'],
        datasets
    };
}

function get_compare_suite_duration_data(filteredData) {
    const labelSet = new Set();
    const dataMap = new Map();
    const datasets = [];
    const selectedRuns = [...new Set(
        compareRunIds
            .map(id => document.getElementById(id)?.value)
            .filter(val => val && val !== "None")
    )];

    for (const value of filteredData) {
        for (const run of selectedRuns) {
            if (value.run_start === run || value.run_alias === run) {
                if (settings.switch.suitePathsCompareSection) {
                    labelSet.add(value.full_name)
                } else {
                    labelSet.add(value.name);
                }
                if (!dataMap.has(run)) dataMap.set(run, []);
                dataMap.get(run).push(value.elapsed_s);
            }
        }
    }
    for (const run of selectedRuns) {
        datasets.push({
            label: run,
            data: dataMap.get(run) || [],
            fill: true
        });
    }
    return {
        labels: [...labelSet],
        datasets
    };
}

export {
    get_compare_statistics_graph_data, 
    get_compare_suite_duration_data
};