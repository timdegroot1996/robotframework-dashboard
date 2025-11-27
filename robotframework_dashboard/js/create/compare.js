import { get_test_statistics_data, get_compare_statistics_graph_data } from "../data/statistics.js";
import { get_compare_suite_duration_data } from "../data/duration.js";
import { get_graph_config } from "../data/graph_config.js";
import { update_height } from "../data/helpers.js";
import { open_log_file, open_log_from_label } from "../log.js";
import { filteredRuns, filteredSuites, filteredTests } from "../constants/globals.js";
import { settings } from "../constants/settings.js";

// function to create the compare statistics in the compare section
function create_compare_statistics_graph() {
    if (compareStatisticsGraph) {
        compareStatisticsGraph.destroy();
    }
    const graphData = get_compare_statistics_graph_data(filteredRuns);
    const config = get_graph_config("bar", graphData, "", "Run", "Amount");
    config.options.scales.y.stacked = false;
    compareStatisticsGraph = new Chart("compareStatisticsGraph", config);
}

// function to create the compare statistics in the compare section
function create_compare_suite_duration_graph() {
    if (compareSuiteDurationGraph) {
        compareSuiteDurationGraph.destroy();
    }
    const graphData = get_compare_suite_duration_data(filteredSuites);
    const config = get_graph_config("radar", graphData, "");
    compareSuiteDurationGraph = new Chart("compareSuiteDurationGraph", config);
}

// function to create the compare statistics in the compare section
function create_compare_tests_graph() {
    if (compareTestsGraph) {
        compareTestsGraph.destroy();
    }
    const data = get_test_statistics_data(filteredTests);
    const graphData = data[0]
    const runStarts = data[1]
    var config = get_graph_config("timeline", graphData, "", "Run", "Test");
    config.options.plugins.tooltip = {
        callbacks: {
            label: function (context) {
                return runStarts[context.raw.x[0]];
            },
        },
    };
    config.options.scales.x = {
        ticks: {
            minRotation: 45,
            maxRotation: 45,
            stepSize: 1,
            callback: function (value, index, ticks) {
                return runStarts[this.getLabelForValue(value)];
            },
        },
        title: {
            display: settings.show.axisTitles,
            text: "Run",
        },
    };
    config.options.onClick = (event, chartElement) => {
        if (chartElement.length) {
            open_log_file(event, chartElement, runStarts)
        }
    };
    if (!settings.show.dateLabels) { config.options.scales.x.ticks.display = false }
    update_height("compareTestsVertical", config.data.labels.length, "timeline");
    compareTestsGraph = new Chart("compareTestsGraph", config);
    compareTestsGraph.canvas.addEventListener("click", (event) => {
        open_log_from_label(compareTestsGraph, event)
    });
}

export {
    create_compare_statistics_graph,
    create_compare_suite_duration_graph,
    create_compare_tests_graph
};