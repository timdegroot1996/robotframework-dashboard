
// function to create test statistics graph in the test section
function create_test_statistics_graph() {
    if (testStatisticsGraph) {
        testStatisticsGraph.destroy();
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
    update_height("testStatisticsVertical", config.data.labels.length, "timeline");
    testStatisticsGraph = new Chart("testStatisticsGraph", config);
    testStatisticsGraph.canvas.addEventListener("click", (event) => {
        open_log_from_label(testStatisticsGraph, event)
    });
}

// function to create test duration graph in the test section
function create_test_duration_graph() {
    if (testDurationGraph) {
        testDurationGraph.destroy();
    }
    var graphData = get_duration_graph_data("test", settings.graphTypes.testDurationGraphType, "elapsed_s", filteredTests);
    var config;
    if (settings.graphTypes.testDurationGraphType == "bar") {
        const limit = inFullscreen && inFullscreenGraph.includes("testDuration") ? 100 : 30;
        config = get_graph_config("bar", graphData, `Max ${limit} Bars`, "Run", "Duration");
    } else if (settings.graphTypes.testDurationGraphType == "line") {
        config = get_graph_config("line", graphData, "", "Date", "Duration");
    }
    if (!settings.show.dateLabels) { config.options.scales.x.ticks.display = false }
    testDurationGraph = new Chart("testDurationGraph", config);
    testDurationGraph.canvas.addEventListener("click", (event) => {
        open_log_from_label(testDurationGraph, event)
    });
}

// function to create test messages graph in the test section
function create_test_messages_graph() {
    if (testMessagesGraph) {
        testMessagesGraph.destroy();
    }
    const data = get_messages_data("test", settings.graphTypes.testMessagesGraphType, filteredTests);
    const graphData = data[0];
    const callbackData = data[1];
    var config;
    const limit = inFullscreen && inFullscreenGraph.includes("testMessages") ? 50 : 10;
    if (settings.graphTypes.testMessagesGraphType == "bar") {
        config = get_graph_config("bar", graphData, `Top ${limit}`, "Message", "Times");
        config.options.plugins.legend = { display: false };
        config.options.plugins.tooltip = {
            callbacks: {
                label: function (tooltipItem) {
                    return callbackData[tooltipItem.label];
                },
            },
        };
        config.options.scales.x = {
            ticks: {
                minRotation: 45,
                maxRotation: 45,
                callback: function (value, index) {
                    return this.getLabelForValue(value).slice(0, 40);
                },
            },
            title: {
                display: settings.show.axisTitles,
                text: "Message",
            },
        };
        delete config.options.onClick
    } else if (settings.graphTypes.testMessagesGraphType == "timeline") {
        config = get_graph_config("timeline", graphData, `Top ${limit}`, "Run", "Message");
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
        config.options.scales.y.ticks = {
            callback: function (value, index, ticks) {
                return this.getLabelForValue(value).slice(0, 40);
            },
        };
        if (!settings.show.dateLabels) { config.options.scales.x.ticks.display = false }
    }
    update_height("testMessagesVertical", config.data.labels.length, settings.graphTypes.testMessagesGraphType);
    testMessagesGraph = new Chart("testMessagesGraph", config);
    testMessagesGraph.canvas.addEventListener("click", (event) => {
        open_log_from_label(testMessagesGraph, event)
    });
}

// function to create test duration deviation graph in test section
function create_test_duration_deviation_graph() {
    if (testDurationDeviationGraph) {
        testDurationDeviationGraph.destroy();
    }
    const graphData = get_duration_deviation_data("test", settings.graphTypes.testDurationDeviationGraphType, filteredTests)
    const config = get_graph_config("boxplot", graphData, "", "Test", "Duration");
    delete config.options.onClick
    testDurationDeviationGraph = new Chart("testDurationDeviationGraph", config);
    testDurationDeviationGraph.canvas.addEventListener("click", (event) => {
        open_log_from_label(testDurationDeviationGraph, event)
    });
}

// function to create test most flaky graph in test section
function create_test_most_flaky_graph() {
    if (testMostFlakyGraph) {
        testMostFlakyGraph.destroy();
    }
    const data = get_most_flaky_data("test", settings.graphTypes.testMostFlakyGraphType, filteredTests, ignoreSkips, false);
    const graphData = data[0]
    const callbackData = data[1];
    var config;
    const limit = inFullscreen && inFullscreenGraph.includes("testMostFlaky") ? 50 : 10;
    if (settings.graphTypes.testMostFlakyGraphType == "bar") {
        config = get_graph_config("bar", graphData, `Top ${limit}`, "Test", "Status Flips");
        config.options.plugins.legend = false
        delete config.options.onClick
    } else if (settings.graphTypes.testMostFlakyGraphType == "timeline") {
        config = get_graph_config("timeline", graphData, `Top ${limit}`, "Run", "Test");
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
    update_height("testMostFlakyVertical", config.data.labels.length, settings.graphTypes.testMostFlakyGraphType);
    testMostFlakyGraph = new Chart("testMostFlakyGraph", config);
    testMostFlakyGraph.canvas.addEventListener("click", (event) => {
        open_log_from_label(testMostFlakyGraph, event)
    });
}

// function to create test recent most flaky graph in test section
function create_test_recent_most_flaky_graph() {
    if (testRecentMostFlakyGraph) {
        testRecentMostFlakyGraph.destroy();
    }
    const data = get_most_flaky_data("test", settings.graphTypes.testRecentMostFlakyGraphType, filteredTests, ignoreSkipsRecent, true);
    const graphData = data[0];
    const callbackData = data[1];
    var config;
    const limit = inFullscreen && inFullscreenGraph.includes("testRecentMostFlaky") ? 50 : 10;
    if (settings.graphTypes.testRecentMostFlakyGraphType == "bar") {
        config = get_graph_config("bar", graphData, `Top ${limit}`, "Test", "Status Flips");
        config.options.plugins.legend = false
        delete config.options.onClick
    } else if (settings.graphTypes.testRecentMostFlakyGraphType == "timeline") {
        config = get_graph_config("timeline", graphData, `Top ${limit}`, "Run", "Test");
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
    update_height("testRecentMostFlakyVertical", config.data.labels.length, settings.graphTypes.testRecentMostFlakyGraphType);
    testRecentMostFlakyGraph = new Chart("testRecentMostFlakyGraph", config);
    testRecentMostFlakyGraph.canvas.addEventListener("click", (event) => {
        open_log_from_label(testRecentMostFlakyGraph, event)
    });
}

// function to create test most failed graph in the test section
function create_test_most_failed_graph() {
    if (testMostFailedGraph) {
        testMostFailedGraph.destroy();
    }
    const data = get_most_failed_data("test", settings.graphTypes.testMostFailedGraphType, filteredTests, false);
    const graphData = data[0]
    const callbackData = data[1];
    var config;
    const limit = inFullscreen && inFullscreenGraph.includes("testMostFailed") ? 50 : 10;
    if (settings.graphTypes.testMostFailedGraphType == "bar") {
        config = get_graph_config("bar", graphData, `Top ${limit}`, "Test", "Fails");
        config.options.plugins.legend = { display: false };
        config.options.plugins.tooltip = {
            callbacks: {
                label: function (tooltipItem) {
                    return callbackData[tooltipItem.label];
                },
            },
        };
        delete config.options.onClick
    } else if (settings.graphTypes.testMostFailedGraphType == "timeline") {
        config = get_graph_config("timeline", graphData, `Top ${limit}`, "Run", "Test");
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
    update_height("testMostFailedVertical", config.data.labels.length, settings.graphTypes.testMostFailedGraphType);
    testMostFailedGraph = new Chart("testMostFailedGraph", config);
    testMostFailedGraph.canvas.addEventListener("click", (event) => {
        open_log_from_label(testMostFailedGraph, event)
    });
}

// function to create test recent most failed graph in the test section
function create_test_recent_most_failed_graph() {
    if (testRecentMostFailedGraph) {
        testRecentMostFailedGraph.destroy();
    }
    const data = get_most_failed_data("test", settings.graphTypes.testRecentMostFailedGraphType, filteredTests, true);
    const graphData = data[0]
    const callbackData = data[1];
    var config;
    const limit = inFullscreen && inFullscreenGraph.includes("testRecentMostFailed") ? 50 : 10;
    if (settings.graphTypes.testRecentMostFailedGraphType == "bar") {
        config = get_graph_config("bar", graphData, `Top ${limit}`, "Test", "Fails");
        config.options.plugins.legend = { display: false };
        config.options.plugins.tooltip = {
            callbacks: {
                label: function (tooltipItem) {
                    return callbackData[tooltipItem.label];
                },
            },
        };
        delete config.options.onClick
    } else if (settings.graphTypes.testRecentMostFailedGraphType == "timeline") {
        config = get_graph_config("timeline", graphData, `Top ${limit}`, "Run", "Test");
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
    update_height("testRecentMostFailedVertical", config.data.labels.length, settings.graphTypes.testRecentMostFailedGraphType);
    testRecentMostFailedGraph = new Chart("testRecentMostFailedGraph", config);
    testRecentMostFailedGraph.canvas.addEventListener("click", (event) => {
        open_log_from_label(testRecentMostFailedGraph, event)
    });
}

// function to create the most time consuming test graph in the test section
function create_test_most_time_consuming_graph() {
    if (testMostTimeConsumingGraph) {
        testMostTimeConsumingGraph.destroy();
    }
    const onlyLastRun = document.getElementById("onlyLastRunTest").checked;
    const data = get_most_time_consuming_or_most_used_data("test", settings.graphTypes.testMostTimeConsumingGraphType, filteredTests, onlyLastRun);
    const graphData = data[0]
    const callbackData = data[1];
    var config;
    const limit = inFullscreen && inFullscreenGraph.includes("testMostTimeConsuming") ? 50 : 10;
    if (settings.graphTypes.testMostTimeConsumingGraphType == "bar") {
        config = get_graph_config("bar", graphData, `Top ${limit}`, "Test", "Most Time Consuming");
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
    } else if (settings.graphTypes.testMostTimeConsumingGraphType == "timeline") {
        config = get_graph_config("timeline", graphData, `Top ${limit}`, "Run", "Test");
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
    update_height("testMostTimeConsumingVertical", config.data.labels.length, settings.graphTypes.testMostTimeConsumingGraphType);
    testMostTimeConsumingGraph = new Chart("testMostTimeConsumingGraph", config);
    testMostTimeConsumingGraph.canvas.addEventListener("click", (event) => {
        open_log_from_label(testMostTimeConsumingGraph, event)
    });
}

export {
    create_test_statistics_graph,
    create_test_duration_graph,
    create_test_duration_deviation_graph,
    create_test_messages_graph,
    create_test_most_flaky_graph,
    create_test_recent_most_flaky_graph,
    create_test_most_failed_graph,
    create_test_recent_most_failed_graph,
    create_test_most_time_consuming_graph,
};