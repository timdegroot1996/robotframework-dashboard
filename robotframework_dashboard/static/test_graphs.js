var testStatusGraph;
var testDurationGraph;
var testDurationGraphType = "bar";
var testMostFailedGraph;
var testMostFailedGraphType = "bar";
var testTable;
var showOnlySelectedTestStatistic = false;

document.getElementById("showOnlySelectedTestStatistic").addEventListener("change", (e) => {
    showOnlySelectedTestStatistic = !showOnlySelectedTestStatistic;
    create_test_status_graph();
});
document.getElementById("suiteSelectTests").addEventListener("change", (e) => {
    add_tests_in_select();
    create_test_status_graph();
    create_test_duration_graph();
});
document.getElementById("testSelect").addEventListener("change", (e) => {
    if (showOnlySelectedTestStatistic) {
        create_test_status_graph();
    }
    create_test_duration_graph();
});

document.getElementById("updateTestDurationGraphBar").addEventListener("click", (e) => {
    create_test_duration_graph("bar");
    document.getElementById("updateTestDurationGraphBar").classList.add("disabled");
    document.getElementById("updateTestDurationGraphLine").classList.remove("disabled");
});
document.getElementById("updateTestDurationGraphLine").addEventListener("click", (e) => {
    create_test_duration_graph("line");
    document.getElementById("updateTestDurationGraphBar").classList.remove("disabled");
    document.getElementById("updateTestDurationGraphLine").classList.add("disabled");
});

document.getElementById("updateTestMostFailedGraphBar").addEventListener("click", (e) => {
    create_test_most_failed_graph("bar");
    document.getElementById("updateTestMostFailedGraphBar").classList.add("disabled");
    document.getElementById("updateTestMostFailedGraphTimeline").classList.remove("disabled");
});
document.getElementById("updateTestMostFailedGraphTimeline").addEventListener("click", (e) => {
    create_test_most_failed_graph("timeline");
    document.getElementById("updateTestMostFailedGraphBar").classList.remove("disabled");
    document.getElementById("updateTestMostFailedGraphTimeline").classList.add("disabled");
});

function create_test_status_graph() {
    if (testStatusGraph) {
        testStatusGraph.destroy();
    }
    var suiteSelectTests = document.getElementById("suiteSelectTests").value;
    var testSelect = document.getElementById("testSelect").value;
    var labels = [];
    var runStarts = [];
    for (test of filteredTests) {
        if (!test.full_name.includes(`.${suiteSelectTests}.${test.name}`)) {
            continue;
        }
        if (showOnlySelectedTestStatistic && testSelect != "All" && test.name != testSelect) {
            continue;
        }
        if (!labels.includes(test.name)) {
            labels.push(test.name);
        }
        if (!runStarts.includes(test.run_start)) {
            runStarts.push(test.run_start);
        }
    }
    var datasets = [];
    var runAxis = 0;
    for (runStart of runStarts) {
        for (label of labels) {
            var foundTests = [];
            for (test of filteredTests) {
                if (test.name == label && test.run_start == runStart) {
                    foundTests.push(test);
                }
            }
            if (foundTests.length > 0) {
                var value = foundTests[0];
                if (value.passed == 1) {
                    datasets.push({
                        label: label,
                        data: [{ x: [runAxis, runAxis + 1], y: label }],
                        backgroundColor: [passedBackgroundColor],
                        borderWidth: 1,
                    });
                } else if (value.failed == 1) {
                    datasets.push({
                        label: label,
                        data: [{ x: [runAxis, runAxis + 1], y: label }],
                        backgroundColor: [failedBackgroundColor],
                        borderWidth: 1,
                    });
                } else if (value.skipped == 1) {
                    datasets.push({
                        label: label,
                        data: [{ x: [runAxis, runAxis + 1], y: label }],
                        backgroundColor: [skippedBackgroundColor],
                        borderWidth: 1,
                    });
                }
            } else {
                datasets.push({
                    label: label,
                    data: [{ x: [runAxis, runAxis + 1], y: label }],
                    backgroundColor: [greyBackgroundColor],
                    borderWidth: 1,
                });
            }
        }
        runAxis += 1;
    }
    var graphData = {
        labels: labels,
        datasets: datasets,
    };
    var config = get_graph_config("timeline", graphData, "Test Status (Bar)");
    // overwrite tooltip and x scale with callbacks
    config.options.plugins.tooltip = {
        callbacks: {
            label: function (context) {
                return runStarts[context.raw.x[0]];
            },
        },
    };
    config.options.scales.x = {
        ticks: {
            minRotation: 20,
            callback: function (value, index, ticks) {
                return runStarts[this.getLabelForValue(value)];
            },
        },
    };
    testStatusGraph = new Chart("testStatusGraph", config);
}

function create_test_duration_graph(type) {
    if (typeof type === "string") {
        testDurationGraphType = type;
    }
    if (testDurationGraph) {
        testDurationGraph.destroy();
    }
    var graphData = get_duration_graph_data("test", testDurationGraphType, "elapsed_s", filteredTests);
    if (testDurationGraphType == "bar") {
        var config = get_graph_config("bar", graphData, "Test Duration (Bar)", "Run", "Duration");
        testDurationGraph = new Chart("testDurationGraph", config);
    } else if (testDurationGraphType == "line") {
        var config = get_graph_config("line", graphData, "Test Duration (Line)", "Date", "Duration");
        testDurationGraph = new Chart("testDurationGraph", config);
    }
}

function create_test_most_failed_graph(type) {
    if (typeof type === "string") {
        testMostFailedGraphType = type;
    }
    if (testMostFailedGraph) {
        testMostFailedGraph.destroy();
    }
    var graphData = get_most_failed_data("test", testMostFailedGraphType, filteredTests);
    var callbackData = graphData[0];
    graphData = graphData[1];
    if (testMostFailedGraphType == "bar") {
        var config = get_graph_config("bar", graphData, "Top 10 Most Failed Tests", "Test Name", "Times Failed");
        // overwrite legend and tooltip
        config.options.plugins.legend = { display: false };
        config.options.plugins.tooltip = {
            callbacks: {
                label: function (tooltipItem) {
                    return callbackData[tooltipItem.label];
                },
            },
        };
        testMostFailedGraph = new Chart("testMostFailedGraph", config);
    } else if (testMostFailedGraphType == "timeline") {
        var config = get_graph_config("timeline", graphData, "Top 10 Most Failed Tests");
        // overwrite tooltip and x scale with callbacks
        config.options.plugins.tooltip = {
            callbacks: {
                label: function (context) {
                    return callbackData[context.raw.x[0]];
                },
            },
        };
        config.options.scales.x = {
            ticks: {
                minRotation: 20,
                callback: function (value, index, ticks) {
                    return callbackData[this.getLabelForValue(value)];
                },
            },
        };
        testMostFailedGraph = new Chart("testMostFailedGraph", config);
    }
}

function create_test_table() {
    if (testTable) {
        testTable.destroy();
    }
    data = [];
    for (test of filteredTests) {
        data.push([test.run_start, test.full_name, test.name, test.passed, test.failed, test.skipped, test.elapsed_s, test.start_time, test.tags]);
    }
    testTable = new DataTable("#testTable", {
        layout: {
            topStart: "info",
            bottomStart: null,
        },
        columns: [
            { title: "run" },
            { title: "full_name" },
            { title: "name" },
            { title: "passed" },
            { title: "failed" },
            { title: "skipped" },
            { title: "elapsed_s" },
            { title: "start_time" },
            { title: "tags" },
        ],
        data: data,
    });
}
