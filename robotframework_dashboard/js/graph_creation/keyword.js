import { settings } from "../variables/settings.js";
import { inFullscreen, inFullscreenGraph } from "../variables/globals.js";
import { get_statistics_graph_data } from "../graph_data/statistics.js";
import { get_duration_graph_data } from "../graph_data/duration.js";
import { get_most_failed_data } from "../graph_data/failed.js";
import { get_most_time_consuming_or_most_used_data } from "../graph_data/time_consuming.js";
import { get_graph_config } from "../graph_data/graph_config.js";
import { open_log_from_label, open_log_file } from "../log.js";
import { format_duration } from "../common.js";
import { update_height } from "../graph_data/helpers.js";

// function to keyword statistics graph in the keyword section
function create_keyword_statistics_graph() {
    if (keywordStatisticsGraph) {
        keywordStatisticsGraph.destroy();
    }
    const data = get_statistics_graph_data("keyword", settings.graphTypes.keywordStatisticsGraphType, filteredKeywords);
    const graphData = data[0]
    var config;
    if (settings.graphTypes.keywordStatisticsGraphType == "line") {
        config = get_graph_config("line", graphData, "", "Date", "Amount", false);
    } else if (settings.graphTypes.keywordStatisticsGraphType == "amount") {
        config = get_graph_config("bar", graphData, "", "Run", "Amount");
    } else if (settings.graphTypes.keywordStatisticsGraphType == "percentages") {
        config = get_graph_config("bar", graphData, "", "Run", "Percentage");
    }
    if (!settings.show.dateLabels) { config.options.scales.x.ticks.display = false }
    keywordStatisticsGraph = new Chart("keywordStatisticsGraph", config);
    keywordStatisticsGraph.canvas.addEventListener("click", (event) => {
        open_log_from_label(keywordStatisticsGraph, event)
    });
}

// function to keyword times run graph in the keyword section
function create_keyword_times_run_graph() {
    if (keywordTimesRunGraph) {
        keywordTimesRunGraph.destroy();
    }
    const graphData = get_duration_graph_data("keyword", settings.graphTypes.keywordTimesRunGraphType, "times_run", filteredKeywords);
    var config;
    if (settings.graphTypes.keywordTimesRunGraphType == "bar") {
        const limit = inFullscreen && inFullscreenGraph.includes("keywordTimesRun") ? 100 : 30;
        config = get_graph_config("bar", graphData, `Max ${limit} Bars`, "Run", "Times Run");
    } else if (settings.graphTypes.keywordTimesRunGraphType == "line") {
        config = get_graph_config("line", graphData, "", "Date", "Times Run");
    }
    if (!settings.show.dateLabels) { config.options.scales.x.ticks.display = false }
    keywordTimesRunGraph = new Chart("keywordTimesRunGraph", config);
    keywordTimesRunGraph.canvas.addEventListener("click", (event) => {
        open_log_from_label(keywordTimesRunGraph, event)
    });
}

// function to keyword total time graph in the keyword section
function create_keyword_total_duration_graph() {
    if (keywordTotalDurationGraph) {
        keywordTotalDurationGraph.destroy();
    }
    const graphData = get_duration_graph_data("keyword", settings.graphTypes.keywordTotalDurationGraphType, "total_time_s", filteredKeywords);
    var config;
    if (settings.graphTypes.keywordTotalDurationGraphType == "bar") {
        const limit = inFullscreen && inFullscreenGraph.includes("keywordTotalDuration") ? 100 : 30;
        config = get_graph_config("bar", graphData, `Max ${limit} Bars`, "Run", "Duration");
    } else if (settings.graphTypes.keywordTotalDurationGraphType == "line") {
        config = get_graph_config("line", graphData, "", "Date", "Duration");
    }
    if (!settings.show.dateLabels) { config.options.scales.x.ticks.display = false }
    keywordTotalDurationGraph = new Chart("keywordTotalDurationGraph", config);
    keywordTotalDurationGraph.canvas.addEventListener("click", (event) => {
        open_log_from_label(keywordTotalDurationGraph, event)
    });
}

// function to keyword average time graph in the keyword section
function create_keyword_average_duration_graph() {
    if (keywordAverageDurationGraph) {
        keywordAverageDurationGraph.destroy();
    }
    const graphData = get_duration_graph_data("keyword", settings.graphTypes.keywordAverageDurationGraphType, "average_time_s", filteredKeywords);
    var config;
    if (settings.graphTypes.keywordAverageDurationGraphType == "bar") {
        const limit = inFullscreen && inFullscreenGraph.includes("keywordAverageDuration") ? 100 : 30;
        config = get_graph_config("bar", graphData, `Max ${limit} Bars`, "Run", "Duration");
    } else if (settings.graphTypes.keywordAverageDurationGraphType == "line") {
        config = get_graph_config("line", graphData, "", "Date", "Duration");
    }
    if (!settings.show.dateLabels) { config.options.scales.x.ticks.display = false }
    keywordAverageDurationGraph = new Chart("keywordAverageDurationGraph", config);
    keywordAverageDurationGraph.canvas.addEventListener("click", (event) => {
        open_log_from_label(keywordAverageDurationGraph, event)
    });
}

// function to keyword min time graph in the keyword section
function create_keyword_min_duration_graph() {
    if (keywordMinDurationGraph) {
        keywordMinDurationGraph.destroy();
    }
    const graphData = get_duration_graph_data("keyword", settings.graphTypes.keywordMinDurationGraphType, "min_time_s", filteredKeywords);
    var config;
    if (settings.graphTypes.keywordMinDurationGraphType == "bar") {
        const limit = inFullscreen && inFullscreenGraph.includes("keywordMinDuration") ? 100 : 30;
        config = get_graph_config("bar", graphData, `Max ${limit} Bars`, "Run", "Duration");
    } else if (settings.graphTypes.keywordMinDurationGraphType == "line") {
        config = get_graph_config("line", graphData, "", "Date", "Duration");
    }
    if (!settings.show.dateLabels) { config.options.scales.x.ticks.display = false }
    keywordMinDurationGraph = new Chart("keywordMinDurationGraph", config);
    keywordMinDurationGraph.canvas.addEventListener("click", (event) => {
        open_log_from_label(keywordMinDurationGraph, event)
    });
}

// function to keyword max time graph in the keyword section
function create_keyword_max_duration_graph() {
    if (keywordMaxDurationGraph) {
        keywordMaxDurationGraph.destroy();
    }
    const graphData = get_duration_graph_data("keyword", settings.graphTypes.keywordMaxDurationGraphType, "max_time_s", filteredKeywords);
    var config;
    if (settings.graphTypes.keywordMaxDurationGraphType == "bar") {
        const limit = inFullscreen && inFullscreenGraph.includes("keywordMaxDuration") ? 100 : 30;
        config = get_graph_config("bar", graphData, `Max ${limit} Bars`, "Run", "Duration");
    } else if (settings.graphTypes.keywordMaxDurationGraphType == "line") {
        config = get_graph_config("line", graphData, "", "Date", "Duration");
    }
    if (!settings.show.dateLabels) { config.options.scales.x.ticks.display = false }
    keywordMaxDurationGraph = new Chart("keywordMaxDurationGraph", config);
    keywordMaxDurationGraph.canvas.addEventListener("click", (event) => {
        open_log_from_label(keywordMaxDurationGraph, event)
    });
}

// function to create test most failed graph in the keyword section
function create_keyword_most_failed_graph() {
    if (keywordMostFailedGraph) {
        keywordMostFailedGraph.destroy();
    }
    const data = get_most_failed_data("keyword", settings.graphTypes.keywordMostFailedGraphType, filteredKeywords, false);
    const graphData = data[0]
    const callbackData = data[1];
    var config;
    const limit = inFullscreen && inFullscreenGraph.includes("keywordMostFailed") ? 50 : 10;
    if (settings.graphTypes.keywordMostFailedGraphType == "bar") {
        config = get_graph_config("bar", graphData, `Top ${limit}`, "Keyword", "Fails");
        config.options.plugins.legend = { display: false };
        config.options.plugins.tooltip = {
            callbacks: {
                label: function (tooltipItem) {
                    return callbackData[tooltipItem.label];
                },
            },
        };
        delete config.options.onClick
    } else if (settings.graphTypes.keywordMostFailedGraphType == "timeline") {
        config = get_graph_config("timeline", graphData, `Top ${limit}`, "Run", "Keyword");
        config.options.plugins.tooltip = {
            callbacks: {
                label: function (context) {
                    return callbackData[context.raw.x[0]];
                },
            },
        };
        config.options.scales.x = {
            ticks: {
                minRotation: 45,
                maxRotation: 45,
                stepSize: 1,
                callback: function (value, index, ticks) {
                    return callbackData[this.getLabelForValue(value)];
                },
            },
            title: {
                display: settings.show.axisTitles,
                text: "Run",
            },
        };
        config.options.onClick = (event, chartElement) => {
            if (chartElement.length) {
                open_log_file(event, chartElement, callbackData)
            }
        };
        if (!settings.show.dateLabels) { config.options.scales.x.ticks.display = false }
    }
    update_height("keywordMostFailedVertical", config.data.labels.length, settings.graphTypes.keywordMostFailedGraphType);
    keywordMostFailedGraph = new Chart("keywordMostFailedGraph", config);
    keywordMostFailedGraph.canvas.addEventListener("click", (event) => {
        open_log_from_label(keywordMostFailedGraph, event)
    });
}

// function to create the most time consuming keyword graph in the keyword section
function create_keyword_most_time_consuming_graph() {
    if (keywordMostTimeConsumingGraph) {
        keywordMostTimeConsumingGraph.destroy();
    }
    const onlyLastRun = document.getElementById("onlyLastRunKeyword").checked;
    const data = get_most_time_consuming_or_most_used_data("keyword", settings.graphTypes.keywordMostTimeConsumingGraphType, filteredKeywords, onlyLastRun);
    const graphData = data[0]
    const callbackData = data[1];
    var config;
    const limit = inFullscreen && inFullscreenGraph.includes("keywordMostTimeConsuming") ? 50 : 10;
    if (settings.graphTypes.keywordMostTimeConsumingGraphType == "bar") {
        config = get_graph_config("bar", graphData, `Top ${limit}`, "Keyword", "Most Time Consuming");
        config.options.plugins.legend = { display: false };
        config.options.plugins.tooltip = {
            callbacks: {
                label: function (tooltipItem) {
                    const key = tooltipItem.label;
                    const cb = callbackData;
                    const runStarts = cb.run_starts[key] || [];
                    const namesToShow = settings.show.aliases ? cb.aliases[key] : runStarts;
                    return runStarts.map((runStart, idx) => {
                        const info = cb.details[key][runStart];
                        const displayName = namesToShow[idx];
                        if (!info) return `${displayName}: (no data)`;
                        return `${displayName}: ${format_duration(info.duration)}`;
                    });
                }
            },
        };
        delete config.options.onClick
    } else if (settings.graphTypes.keywordMostTimeConsumingGraphType == "timeline") {
        config = get_graph_config("timeline", graphData, `Top ${limit}`, "Run", "Keyword");
        config.options.plugins.tooltip = {
            callbacks: {
                label: function (context) {
                    const key = context.dataset.label;
                    const runIndex = context.raw.x[0];
                    const runStart = callbackData.runs[runIndex];
                    const info = callbackData.details[key][runStart];
                    const displayName = settings.show.aliases
                        ? callbackData.aliases[runIndex]
                        : runStart;
                    if (!info) return `${displayName}: (no data)`;
                    return `${displayName}: ${format_duration(info.duration)}`;
                }
            },
        };
        config.options.scales.x = {
            ticks: {
                minRotation: 45,
                maxRotation: 45,
                stepSize: 1,
                callback: function (value, index, ticks) {
                    const displayName = settings.show.aliases
                        ? callbackData.aliases[this.getLabelForValue(value)]
                        : callbackData.runs[this.getLabelForValue(value)];
                    return displayName;
                },
            },
            title: {
                display: settings.show.axisTitles,
                text: "Run",
            },
        };
        config.options.onClick = (event, chartElement) => {
            if (chartElement.length) {
                open_log_file(event, chartElement, callbackData.runs)
            }
        };
        if (!settings.show.dateLabels) { config.options.scales.x.ticks.display = false }
    }
    update_height("keywordMostTimeConsumingVertical", config.data.labels.length, settings.graphTypes.keywordMostTimeConsumingGraphType);
    keywordMostTimeConsumingGraph = new Chart("keywordMostTimeConsumingGraph", config);
    keywordMostTimeConsumingGraph.canvas.addEventListener("click", (event) => {
        open_log_from_label(keywordMostTimeConsumingGraph, event)
    });
}

// function to create the most used keyword graph in the keyword section
function create_keyword_most_used_graph() {
    if (keywordMostUsedGraph) {
        keywordMostUsedGraph.destroy();
    }
    const onlyLastRun = document.getElementById("onlyLastRunKeywordMostUsed").checked;
    const data = get_most_time_consuming_or_most_used_data("keyword", settings.graphTypes.keywordMostUsedGraphType, filteredKeywords, onlyLastRun, true);
    const graphData = data[0]
    const callbackData = data[1];
    var config;
    const limit = inFullscreen && inFullscreenGraph.includes("keywordMostUsed") ? 50 : 10;
    if (settings.graphTypes.keywordMostUsedGraphType == "bar") {
        config = get_graph_config("bar", graphData, `Top ${limit}`, "Keyword", "Most Used");
        config.options.plugins.legend = { display: false };
        config.options.plugins.tooltip = {
            callbacks: {
                label: function (tooltipItem) {
                    const key = tooltipItem.label;
                    const cb = callbackData;
                    const runStarts = cb.run_starts[key] || [];
                    const namesToShow = settings.show.aliases ? cb.aliases[key] : runStarts;
                    return runStarts.map((runStart, idx) => {
                        const info = cb.details[key][runStart];
                        const displayName = namesToShow[idx];
                        if (!info) return `${displayName}: (no data)`;
                        return `${displayName}: ran ${info.timesRun} times`;
                    });
                }
            },
        };
        delete config.options.onClick
    } else if (settings.graphTypes.keywordMostUsedGraphType == "timeline") {
        config = get_graph_config("timeline", graphData, `Top ${limit}`, "Run", "Keyword");
        config.options.plugins.tooltip = {
            callbacks: {
                label: function (context) {
                    const key = context.dataset.label;
                    const runIndex = context.raw.x[0];
                    const runStart = callbackData.runs[runIndex];
                    const info = callbackData.details[key][runStart];
                    const displayName = settings.show.aliases
                        ? callbackData.aliases[runIndex]
                        : runStart;
                    if (!info) return `${displayName}: (no data)`;
                    return `${displayName}: ran ${info.timesRun} times`;
                }
            },
        };
        config.options.scales.x = {
            ticks: {
                minRotation: 45,
                maxRotation: 45,
                stepSize: 1,
                callback: function (value, index, ticks) {
                    const displayName = settings.show.aliases
                        ? callbackData.aliases[this.getLabelForValue(value)]
                        : callbackData.runs[this.getLabelForValue(value)];
                    return displayName;
                },
            },
            title: {
                display: settings.show.axisTitles,
                text: "Run",
            },
        };
        config.options.onClick = (event, chartElement) => {
            if (chartElement.length) {
                open_log_file(event, chartElement, callbackData.runs)
            }
        };
        if (!settings.show.dateLabels) { config.options.scales.x.ticks.display = false }
    }
    update_height("keywordMostUsedVertical", config.data.labels.length, settings.graphTypes.keywordMostUsedGraphType);
    keywordMostUsedGraph = new Chart("keywordMostUsedGraph", config);
    keywordMostUsedGraph.canvas.addEventListener("click", (event) => {
        open_log_from_label(keywordMostUsedGraph, event)
    });
}

export {
    create_keyword_statistics_graph,
    create_keyword_times_run_graph,
    create_keyword_total_duration_graph,
    create_keyword_average_duration_graph,
    create_keyword_min_duration_graph,
    create_keyword_max_duration_graph,
    create_keyword_most_failed_graph,
    create_keyword_most_time_consuming_graph,
    create_keyword_most_used_graph
};