var runStatisticsGraph;
var runStatisticsGraphType = "percentages";
var runDurationGraph;
var runDurationGraphType = "bar";
var runTable;

document.getElementById("updateRunStatisticsGraphBarPercentages").addEventListener("click", (e) => {
    create_run_statistics_graph("percentages");
    document.getElementById("updateRunStatisticsGraphBarAmount").classList.remove("disabled");
    document.getElementById("updateRunStatisticsGraphLine").classList.remove("disabled");
    document.getElementById("updateRunStatisticsGraphBarPercentages").classList.add("disabled");
});
document.getElementById("updateRunStatisticsGraphBarAmount").addEventListener("click", (e) => {
    create_run_statistics_graph("amount");
    document.getElementById("updateRunStatisticsGraphBarAmount").classList.add("disabled");
    document.getElementById("updateRunStatisticsGraphLine").classList.remove("disabled");
    document.getElementById("updateRunStatisticsGraphBarPercentages").classList.remove("disabled");
});
document.getElementById("updateRunStatisticsGraphLine").addEventListener("click", (e) => {
    create_run_statistics_graph("line");
    document.getElementById("updateRunStatisticsGraphBarAmount").classList.remove("disabled");
    document.getElementById("updateRunStatisticsGraphLine").classList.add("disabled");
    document.getElementById("updateRunStatisticsGraphBarPercentages").classList.remove("disabled");
});

document.getElementById("updateRunDurationGraphBar").addEventListener("click", (e) => {
    create_run_duration_graph("bar");
    document.getElementById("updateRunDurationGraphBar").classList.add("disabled");
    document.getElementById("updateRunDurationGraphLine").classList.remove("disabled");
});
document.getElementById("updateRunDurationGraphLine").addEventListener("click", (e) => {
    create_run_duration_graph("line");
    document.getElementById("updateRunDurationGraphBar").classList.remove("disabled");
    document.getElementById("updateRunDurationGraphLine").classList.add("disabled");
});

function create_run_statistics_graph(type) {
    if (typeof type === "string") {
        runStatisticsGraphType = type;
    }
    if (runStatisticsGraph) {
        runStatisticsGraph.destroy();
    }
    var graphData = get_statistics_graph_data("run", runStatisticsGraphType, filteredRuns);
    if (runStatisticsGraphType == "line") {
        var config = get_graph_config("line", graphData, "Amount Of Tests (Line)", "Date", "amount", false);
        runStatisticsGraph = new Chart("runStatisticsGraph", config);
    } else if (runStatisticsGraphType == "amount") {
        Chart.register(ChartDataLabels);
        var config = get_graph_config("bar", graphData, "Run Statistics (Bar)", "Run", "Amount Of Tests");
        runStatisticsGraph = new Chart("runStatisticsGraph", config);
    } else if (runStatisticsGraphType == "percentages") {
        Chart.register(ChartDataLabels);
        var config = get_graph_config("bar", graphData, "Run Statistics (Bar)", "Run", "Percentage");
        runStatisticsGraph = new Chart("runStatisticsGraph", config);
    }
}

function create_run_duration_graph(type) {
    if (typeof type === "string") {
        runDurationGraphType = type;
    }
    if (runDurationGraph) {
        runDurationGraph.destroy();
    }
    var graphData = get_duration_graph_data("run", runDurationGraphType, "elapsed_s", filteredRuns);
    if (runDurationGraphType == "bar") {
        var config = get_graph_config("bar", graphData, "Run Duration (Bar)", "Run", "Duration");
        runDurationGraph = new Chart("runDurationGraph", config);
    } else if (runDurationGraphType == "line") {
        var config = get_graph_config("line", graphData, "Run Duration (Line)", "Date", "Duration");
        runDurationGraph = new Chart("runDurationGraph", config);
    }
}

function create_run_table() {
    if (runTable) {
        runTable.destroy();
    }
    data = [];
    for (run of filteredRuns) {
        data.push([run.run_start, run.full_name, run.name, run.total, run.passed, run.failed, run.skipped, run.elapsed_s, run.start_time, run.tags]);
    }
    runTable = new DataTable("#runTable", {
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
            { title: "tags" },
        ],
        data: data,
    });
}
