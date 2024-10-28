var suiteStatisticsGraph;
var suiteStatisticsGraphType = "percentages";
var suiteDurationGraph;
var suiteDurationGraphType = "bar";
var suiteMostFailedGraph;
var suiteMostFailedGraphType = "bar";
var suiteTable;

document.getElementById("suiteSelectSuites").addEventListener("change", (e) => {
    create_suite_duration_graph();
    create_suite_statistics_graph();
});

document.getElementById("updateSuiteStatisticsGraphBarPercentages").addEventListener("click", (e) => {
    create_suite_statistics_graph("percentages");
    document.getElementById("updateSuiteStatisticsGraphBarPercentages").classList.add("disabled");
    document.getElementById("updateSuiteStatisticsGraphBarAmount").classList.remove("disabled");
    document.getElementById("updateSuiteStatisticsGraphLine").classList.remove("disabled");
});
document.getElementById("updateSuiteStatisticsGraphBarAmount").addEventListener("click", (e) => {
    create_suite_statistics_graph("amount");
    document.getElementById("updateSuiteStatisticsGraphBarPercentages").classList.remove("disabled");
    document.getElementById("updateSuiteStatisticsGraphBarAmount").classList.add("disabled");
    document.getElementById("updateSuiteStatisticsGraphLine").classList.remove("disabled");
});
document.getElementById("updateSuiteStatisticsGraphLine").addEventListener("click", (e) => {
    create_suite_statistics_graph("line");
    document.getElementById("updateSuiteStatisticsGraphBarPercentages").classList.remove("disabled");
    document.getElementById("updateSuiteStatisticsGraphBarAmount").classList.remove("disabled");
    document.getElementById("updateSuiteStatisticsGraphLine").classList.add("disabled");
});

document.getElementById("updateSuiteDurationGraphBar").addEventListener("click", (e) => {
    create_suite_duration_graph("bar");
    document.getElementById("updateSuiteDurationGraphBar").classList.add("disabled");
    document.getElementById("updateSuiteDurationGraphLine").classList.remove("disabled");
});
document.getElementById("updateSuiteDurationGraphLine").addEventListener("click", (e) => {
    create_suite_duration_graph("line");
    document.getElementById("updateSuiteDurationGraphBar").classList.remove("disabled");
    document.getElementById("updateSuiteDurationGraphLine").classList.add("disabled");
});

document.getElementById("updateSuiteMostFailedGraphBar").addEventListener("click", (e) => {
    create_suite_most_failed_graph("bar");
    document.getElementById("updateSuiteMostFailedGraphBar").classList.add("disabled");
    document.getElementById("updateSuiteMostFailedGraphTimeline").classList.remove("disabled");
});
document.getElementById("updateSuiteMostFailedGraphTimeline").addEventListener("click", (e) => {
    create_suite_most_failed_graph("timeline");
    document.getElementById("updateSuiteMostFailedGraphBar").classList.remove("disabled");
    document.getElementById("updateSuiteMostFailedGraphTimeline").classList.add("disabled");
});

function create_suite_statistics_graph(type) {
    if (typeof type === "string") {
        suiteStatisticsGraphType = type;
    }
    if (suiteStatisticsGraph) {
        suiteStatisticsGraph.destroy();
    }
    var graphData = get_statistics_graph_data("suite", suiteStatisticsGraphType, filteredSuites);
    if (suiteStatisticsGraphType == "line") {
        var config = get_graph_config("line", graphData, "Amount Of Tests (Line)", "Date", "amount", false);
        suiteStatisticsGraph = new Chart("suiteStatisticsGraph", config);
    } else if (suiteStatisticsGraphType == "amount") {
        Chart.register(ChartDataLabels);
        var config = get_graph_config("bar", graphData, "Suite Statistics (Bar)", "Run", "Amount Of Tests");
        suiteStatisticsGraph = new Chart("suiteStatisticsGraph", config);
    } else if (suiteStatisticsGraphType == "percentages") {
        Chart.register(ChartDataLabels);
        var config = get_graph_config("bar", graphData, "Suite Statistics (Bar)", "Run", "Percentage");
        suiteStatisticsGraph = new Chart("suiteStatisticsGraph", config);
    }
}

function create_suite_duration_graph(type) {
    if (typeof type === "string") {
        suiteDurationGraphType = type;
    }
    if (suiteDurationGraph) {
        suiteDurationGraph.destroy();
    }
    var graphData = get_duration_graph_data("suite", suiteDurationGraphType, "elapsed_s", filteredSuites);
    if (suiteDurationGraphType == "bar") {
        var config = get_graph_config("bar", graphData, "Suite Duration (Bar)", "Run", "Duration");
        suiteDurationGraph = new Chart("suiteDurationGraph", config);
    } else if (suiteDurationGraphType == "line") {
        var config = get_graph_config("line", graphData, "Suite Duration (Line)", "Date", "Duration");
        suiteDurationGraph = new Chart("suiteDurationGraph", config);
    }
}

function create_suite_most_failed_graph(type) {
    if (typeof type === "string") {
        suiteMostFailedGraphType = type;
    }
    if (suiteMostFailedGraph) {
        suiteMostFailedGraph.destroy();
    }
    var graphData = get_most_failed_data("suite", suiteMostFailedGraphType, filteredSuites);
    var callbackData = graphData[0];
    graphData = graphData[1];
    if (suiteMostFailedGraphType == "bar") {
        var config = get_graph_config("bar", graphData, "Top 10 Most Failed Suites", "Suite Name", "Times Failed");
        // overwrite legend and tooltip
        config.options.plugins.legend = { display: false };
        config.options.plugins.tooltip = {
            callbacks: {
                label: function (tooltipItem) {
                    return callbackData[tooltipItem.label];
                },
            },
        };
        suiteMostFailedGraph = new Chart("suiteMostFailedGraph", config);
    } else if (suiteMostFailedGraphType == "timeline") {
        var config = get_graph_config("timeline", graphData, "Top 10 Most Failed Suites");
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
        suiteMostFailedGraph = new Chart("suiteMostFailedGraph", config);
    }
}

function create_suite_table() {
    if (suiteTable) {
        suiteTable.destroy();
    }
    data = [];
    for (suite of filteredSuites) {
        data.push([suite.run_start, suite.full_name, suite.name, suite.total, suite.passed, suite.failed, suite.skipped, suite.elapsed_s, suite.start_time]);
    }
    suiteTable = new DataTable("#suiteTable", {
        layout: {
            topStart: "info",
            bottomStart: null,
        },
        columns: [
            { title: "run" },
            { title: "full_name" },
            { title: "name" },
            { title: "total" },
            { title: "passed" },
            { title: "failed" },
            { title: "skipped" },
            { title: "elapsed_s" },
            { title: "start_time" },
        ],
        data: data,
    });
}
