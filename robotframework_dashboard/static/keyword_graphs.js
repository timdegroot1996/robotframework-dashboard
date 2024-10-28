var keywordStatisticsGraph;
var keywordStatisticsGraphType = "percentages";
var keywordTimesRunGraph;
var keywordTimesRunGraphType = "bar";
var keywordTotalTimeGraph;
var keywordTotalTimeGraphType = "bar";
var keywordAverageTimeGraph;
var keywordAverageTimeGraphType = "bar";
var keywordMinTimeGraph;
var keywordMinTimeGraphType = "bar";
var keywordMaxTimeGraph;
var keywordMaxTimeGraphType = "bar";
var keywordTable;

document.getElementById("keywordSelect").addEventListener("change", (e) => {
    create_keyword_statistics_graph();
    create_keyword_times_run_graph();
    create_keyword_total_time_graph();
    create_keyword_average_time_graph();
    create_keyword_min_time_graph();
    create_keyword_max_time_graph();
});

document.getElementById("updateKeywordStatisticsGraphBarPercentages").addEventListener("click", (e) => {
    create_keyword_statistics_graph("percentages");
    document.getElementById("updateKeywordStatisticsGraphBarPercentages").classList.add("disabled");
    document.getElementById("updateKeywordStatisticsGraphBarAmount").classList.remove("disabled");
    document.getElementById("updateKeywordStatisticsGraphLine").classList.remove("disabled");
});
document.getElementById("updateKeywordStatisticsGraphBarAmount").addEventListener("click", (e) => {
    create_keyword_statistics_graph("amount");
    document.getElementById("updateKeywordStatisticsGraphBarPercentages").classList.remove("disabled");
    document.getElementById("updateKeywordStatisticsGraphBarAmount").classList.add("disabled");
    document.getElementById("updateKeywordStatisticsGraphLine").classList.remove("disabled");
});
document.getElementById("updateKeywordStatisticsGraphLine").addEventListener("click", (e) => {
    create_keyword_statistics_graph("line");
    document.getElementById("updateKeywordStatisticsGraphBarPercentages").classList.remove("disabled");
    document.getElementById("updateKeywordStatisticsGraphBarAmount").classList.remove("disabled");
    document.getElementById("updateKeywordStatisticsGraphLine").classList.add("disabled");
});

document.getElementById("updateKeywordTimesRunGraphBar").addEventListener("click", (e) => {
    create_keyword_times_run_graph("bar");
    document.getElementById("updateKeywordTimesRunGraphBar").classList.add("disabled");
    document.getElementById("updateKeywordTimesRunGraphLine").classList.remove("disabled");
});
document.getElementById("updateKeywordTimesRunGraphLine").addEventListener("click", (e) => {
    create_keyword_times_run_graph("line");
    document.getElementById("updateKeywordTimesRunGraphBar").classList.remove("disabled");
    document.getElementById("updateKeywordTimesRunGraphLine").classList.add("disabled");
});

document.getElementById("updateKeywordTotalTimeGraphBar").addEventListener("click", (e) => {
    create_keyword_total_time_graph("bar");
    document.getElementById("updateKeywordTotalTimeGraphBar").classList.add("disabled");
    document.getElementById("updateKeywordTotalTimeGraphLine").classList.remove("disabled");
});
document.getElementById("updateKeywordTotalTimeGraphLine").addEventListener("click", (e) => {
    create_keyword_total_time_graph("line");
    document.getElementById("updateKeywordTotalTimeGraphBar").classList.remove("disabled");
    document.getElementById("updateKeywordTotalTimeGraphLine").classList.add("disabled");
});

document.getElementById("updateKeywordAverageTimeGraphBar").addEventListener("click", (e) => {
    create_keyword_average_time_graph("bar");
    document.getElementById("updateKeywordAverageTimeGraphBar").classList.add("disabled");
    document.getElementById("updateKeywordAverageTimeGraphLine").classList.remove("disabled");
});
document.getElementById("updateKeywordAverageTimeGraphLine").addEventListener("click", (e) => {
    create_keyword_average_time_graph("line");
    document.getElementById("updateKeywordAverageTimeGraphBar").classList.remove("disabled");
    document.getElementById("updateKeywordAverageTimeGraphLine").classList.add("disabled");
});

document.getElementById("updateKeywordMinTimeGraphBar").addEventListener("click", (e) => {
    create_keyword_min_time_graph("bar");
    document.getElementById("updateKeywordMinTimeGraphBar").classList.add("disabled");
    document.getElementById("updateKeywordMinTimeGraphLine").classList.remove("disabled");
});
document.getElementById("updateKeywordMinTimeGraphLine").addEventListener("click", (e) => {
    create_keyword_min_time_graph("line");
    document.getElementById("updateKeywordMinTimeGraphBar").classList.remove("disabled");
    document.getElementById("updateKeywordMinTimeGraphLine").classList.add("disabled");
});

document.getElementById("updateKeywordMaxTimeGraphBar").addEventListener("click", (e) => {
    create_keyword_max_time_graph("bar");
    document.getElementById("updateKeywordMaxTimeGraphBar").classList.add("disabled");
    document.getElementById("updateKeywordMaxTimeGraphLine").classList.remove("disabled");
});
document.getElementById("updateKeywordMaxTimeGraphLine").addEventListener("click", (e) => {
    create_keyword_max_time_graph("line");
    document.getElementById("updateKeywordMaxTimeGraphBar").classList.remove("disabled");
    document.getElementById("updateKeywordMaxTimeGraphLine").classList.add("disabled");
});

function create_keyword_statistics_graph(type) {
    if (typeof type === "string") {
        keywordStatisticsGraphType = type;
    }
    if (keywordStatisticsGraph) {
        keywordStatisticsGraph.destroy();
    }
    var graphData = get_statistics_graph_data("keyword", keywordStatisticsGraphType, filteredKeywords);
    if (keywordStatisticsGraphType == "line") {
        var config = get_graph_config("line", graphData, "Keyword Statistics (Line)", "Date", "Amount", false);
        keywordStatisticsGraph = new Chart("keywordStatisticsGraph", config);
    } else if (keywordStatisticsGraphType == "amount") {
        Chart.register(ChartDataLabels);
        var config = get_graph_config("bar", graphData, "Keyword Statistics (Bar)", "Run", "Amount");
        keywordStatisticsGraph = new Chart("keywordStatisticsGraph", config);
    } else if (keywordStatisticsGraphType == "percentages") {
        Chart.register(ChartDataLabels);
        var config = get_graph_config("bar", graphData, "Keyword Statistics (Bar)", "Run", "Percentage");
        keywordStatisticsGraph = new Chart("keywordStatisticsGraph", config);
    }
}

function create_keyword_times_run_graph(type) {
    if (typeof type === "string") {
        keywordTimesRunGraphType = type;
    }
    if (keywordTimesRunGraph) {
        keywordTimesRunGraph.destroy();
    }
    var graphData = get_duration_graph_data("keyword", keywordTimesRunGraphType, "times_run", filteredKeywords);
    if (keywordTimesRunGraphType == "bar") {
        var config = get_graph_config("bar", graphData, "Times Run (Bar)", "Run", "Duration");
        keywordTimesRunGraph = new Chart("keywordTimesRunGraph", config);
    } else if (keywordTimesRunGraphType == "line") {
        var config = get_graph_config("line", graphData, "Times Run (Line)", "Date", "Duration");
        keywordTimesRunGraph = new Chart("keywordTimesRunGraph", config);
    }
}

function create_keyword_total_time_graph(type) {
    if (typeof type === "string") {
        keywordTotalTimeGraphType = type;
    }
    if (keywordTotalTimeGraph) {
        keywordTotalTimeGraph.destroy();
    }
    var graphData = get_duration_graph_data("keyword", keywordTotalTimeGraphType, "total_time_s", filteredKeywords);
    if (keywordTotalTimeGraphType == "bar") {
        var config = get_graph_config("bar", graphData, "Total Duration (Bar)", "Run", "Duration");
        keywordTotalTimeGraph = new Chart("keywordTotalTimeGraph", config);
    } else if (keywordTotalTimeGraphType == "line") {
        var config = get_graph_config("line", graphData, "Total Duration (Line)", "Date", "Duration");
        keywordTotalTimeGraph = new Chart("keywordTotalTimeGraph", config);
    }
}

function create_keyword_average_time_graph(type) {
    if (typeof type === "string") {
        keywordAverageTimeGraphType = type;
    }
    if (keywordAverageTimeGraph) {
        keywordAverageTimeGraph.destroy();
    }
    var graphData = get_duration_graph_data("keyword", keywordAverageTimeGraphType, "average_time_s", filteredKeywords);
    if (keywordAverageTimeGraphType == "bar") {
        var config = get_graph_config("bar", graphData, "Average Duration (Bar)", "Run", "Duration");
        keywordAverageTimeGraph = new Chart("keywordAverageTimeGraph", config);
    } else if (keywordAverageTimeGraphType == "line") {
        var config = get_graph_config("line", graphData, "Average Duration (Line)", "Date", "Duration");
        keywordAverageTimeGraph = new Chart("keywordAverageTimeGraph", config);
    }
}

function create_keyword_min_time_graph(type) {
    if (typeof type === "string") {
        keywordMinTimeGraphType = type;
    }
    if (keywordMinTimeGraph) {
        keywordMinTimeGraph.destroy();
    }
    var graphData = get_duration_graph_data("keyword", keywordMinTimeGraphType, "min_time_s", filteredKeywords);
    if (keywordMinTimeGraphType == "bar") {
        var config = get_graph_config("bar", graphData, "Min Duration (Bar)", "Run", "Duration");
        keywordMinTimeGraph = new Chart("keywordMinTimeGraph", config);
    } else if (keywordMinTimeGraphType == "line") {
        var config = get_graph_config("line", graphData, "Min Duration (Line)", "Date", "Duration");
        keywordMinTimeGraph = new Chart("keywordMinTimeGraph", config);
    }
}

function create_keyword_max_time_graph(type) {
    if (typeof type === "string") {
        keywordMaxTimeGraphType = type;
    }
    if (keywordMaxTimeGraph) {
        keywordMaxTimeGraph.destroy();
    }
    var graphData = get_duration_graph_data("keyword", keywordMaxTimeGraphType, "max_time_s", filteredKeywords);
    if (keywordMaxTimeGraphType == "bar") {
        var config = get_graph_config("bar", graphData, "Max Duration (Bar)", "Run", "Duration");
        keywordMaxTimeGraph = new Chart("keywordMaxTimeGraph", config);
    } else if (keywordMaxTimeGraphType == "line") {
        var config = get_graph_config("line", graphData, "Max Duration (Line)", "Date", "Duration");
        keywordMaxTimeGraph = new Chart("keywordMaxTimeGraph", config);
    }
}

function create_keyword_table() {
    if (keywordTable) {
        keywordTable.destroy();
    }
    data = [];
    for (keyword of filteredKeywords) {
        data.push([
            keyword.run_start,
            keyword.name,
            keyword.passed,
            keyword.failed,
            keyword.skipped,
            keyword.times_run,
            keyword.total_time_s,
            keyword.average_time_s,
            keyword.min_time_s,
            keyword.max_time_s,
        ]);
    }
    keywordTable = new DataTable("#keywordTable", {
        layout: {
            topStart: "info",
            bottomStart: null,
        },
        columns: [
            { title: "run" },
            { title: "name" },
            { title: "passed" },
            { title: "failed" },
            { title: "skipped" },
            { title: "times_run" },
            { title: "total_execution_time" },
            { title: "average_execution_time" },
            { title: "min_execution_time" },
            { title: "max_execution_time" },
        ],
        data: data,
    });
}
