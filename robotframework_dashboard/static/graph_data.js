function get_statistics_graph_data(dataType, graphType, filteredData) {
    var keywordSelect = document.getElementById("keywordSelect").value;
    var suiteSelectSuites = document.getElementById("suiteSelectSuites").value;
    var [passed, failed, skipped, labels] = [[], [], [], []];
    for (value of filteredData) {
        if (graphType == "percentages") {
            if (dataType == "suite" && value.name != suiteSelectSuites) {
                continue;
            }
            if (dataType == "keyword") {
                if (value.name != keywordSelect) {
                    continue;
                } else {
                    passed.push(Math.round((value.passed / (value.passed + value.failed + value.skipped)) * 100 * 100) / 100);
                    failed.push(Math.round((value.failed / (value.passed + value.failed + value.skipped)) * 100 * 100) / 100);
                    skipped.push(Math.round((value.skipped / (value.passed + value.failed + value.skipped)) * 100 * 100) / 100);
                    labels.push(value.run_start);
                }
            } else {
                passed.push(Math.round((value.passed / value.total) * 100 * 100) / 100);
                failed.push(Math.round((value.failed / value.total) * 100 * 100) / 100);
                skipped.push(Math.round((value.skipped / value.total) * 100 * 100) / 100);
                labels.push(value.run_start);
            }
        } else {
            if (dataType == "suite" && value.name != suiteSelectSuites) {
                continue;
            }
            if (dataType == "keyword" && value.name != keywordSelect) {
                continue;
            }
            passed.push(value.passed);
            failed.push(value.failed);
            skipped.push(value.skipped);
            labels.push(value.run_start);
        }
    }
    if (graphType != "line") {
        var statisticsData = {
            labels: labels,
            datasets: [
                {
                    label: "Failed",
                    data: failed,
                    backgroundColor: failedBackgroundColor,
                    stack: "Stack 0",
                },
                {
                    label: "Skipped",
                    data: skipped,
                    backgroundColor: skippedBackgroundColor,
                    stack: "Stack 0",
                },
                {
                    label: "Passed",
                    data: passed,
                    backgroundColor: passedBackgroundColor,
                    stack: "Stack 0",
                },
            ],
        };
    } else {
        var statisticsData = {
            labels: labels,
            datasets: [
                {
                    label: "Failed",
                    data: failed,
                    backgroundColor: failedBackgroundColor,
                    borderColor: failedBackgroundColor,
                },
                {
                    label: "Skipped",
                    data: skipped,
                    backgroundColor: skippedBackgroundColor,
                    borderColor: skippedBackgroundColor,
                },
                {
                    label: "Passed",
                    data: passed,
                    backgroundColor: passedBackgroundColor,
                    borderColor: passedBackgroundColor,
                },
            ],
        };
    }
    return statisticsData;
}

function get_duration_graph_data(dataType, graphType, objectDataAttribute, filteredData) {
    // used for suite selection filter
    var suiteSelectSuites = document.getElementById("suiteSelectSuites").value;
    // used for test selection filter
    var suiteSelectTests = document.getElementById("suiteSelectTests").value;
    var testSelect = document.getElementById("testSelect").value;
    // used for keyword selection filter
    var keywordSelect = document.getElementById("keywordSelect").value;
    if (graphType == "bar") {
        var [labels, data] = [[], { 0: [] }];
        // prepare data for bar chart
        for (value of filteredData) {
            if (dataType == "keyword" && value.name != keywordSelect) {
                continue;
            }
            if (dataType == "suite" && value.name != suiteSelectSuites) {
                continue;
            }
            if (dataType == "test" && !value.full_name.includes(`.${suiteSelectTests}.${value.name}`)) {
                continue;
            }
            if (dataType == "test" && testSelect != "All" && value.name != testSelect) {
                continue;
            }
            labels.push(value.run_start);
            var dataLength = data[0].length;
            if (data[value.name]) {
                // add 0 to all not matching, and value.elapsed to matching
                data[value.name].push(Math.round(value[objectDataAttribute] * 100) / 100);
            } else {
                // add longest amount of 0's to matched and 1 zero to not matching
                data[value.name] = [];
                for (let step = 0; step < dataLength; step++) {
                    data[value.name].push(0);
                }
                data[value.name].push(Math.round(value[objectDataAttribute] * 100) / 100);
            }
            // add 0 to every other value
            for (d in data) {
                if (d != value.name) {
                    data[d].push(0);
                }
            }
        }
        delete data[0];
        var graphData = {
            labels: labels,
            datasets: [],
        };
        for (key in data) {
            graphData["datasets"].push({
                label: key,
                data: data[key],
                stack: "Stack 0",
            });
        }
        return graphData;
    } else if (graphType == "line") {
        var [labels, datasets, sets] = [[], [], {}];
        for (value of filteredData) {
            if (dataType == "keyword" && value.name != keywordSelect) {
                continue;
            }
            if (dataType == "suite" && value.name != suiteSelectSuites) {
                continue;
            }
            if (dataType == "test" && !value.full_name.includes(`.${suiteSelectTests}.${value.name}`)) {
                continue;
            }
            if (dataType == "test" && testSelect != "All" && value.name != testSelect) {
                continue;
            }
            var name = value.name;
            var run_start = new Date(value.run_start);
            var rounded_value = Math.round(value[objectDataAttribute] * 100) / 100;
            if (labels.includes(name)) {
                var values = sets[name];
                values.push({ x: run_start, y: rounded_value });
                sets[name] = values;
            } else {
                labels.push(name);
                sets[name] = [{ x: run_start, y: rounded_value }];
            }
        }
        for (const [key, value] of Object.entries(sets)) {
            datasets.push({ label: key, fill: false, data: value });
        }
        return datasets;
    }
}

function get_most_failed_data(dataType, graphType, filteredData) {
    var data = {};
    for (value of filteredData) {
        if (value.failed > 0) {
            if (data[value.name]) {
                data[value.name].push(value.run_start);
            } else {
                data[value.name] = [value.run_start];
            }
        }
    }
    data = Object.keys(data) // sorted failed items based on amount of times it has failed
        .sort((a, b) => data[b].length - data[a].length)
        .reduce((acc, key) => ((acc[key] = data[key]), acc), {});
    if (graphType == "bar") {
        var [datasets, labels, count] = [[], [], 0];
        for (key in data) {
            if (count > 9) {
                break;
            }
            labels.push(key);
            datasets.push(data[key].length);
            count += 1;
        }
        var graphData = {
            labels: labels,
            datasets: [{ data: datasets, backgroundColor: failedBackgroundColor }],
        };
        return [data, graphData];
    } else if (graphType == "timeline") {
        var labels = [];
        var runStarts = [];
        var count = 0;
        for (key in data) {
            if (count > 9) {
                break;
            }
            labels.push(key);
            for (runStart of data[key]) {
                if (!runStarts.includes(runStart)) {
                    runStarts.push(runStart);
                }
            }
            count += 1;
        }
        var datasets = [];
        var runAxis = 0;
        for (runStart of runStarts) {
            for (label of labels) {
                var foundValues = [];
                for (value of filteredData) {
                    if (value.name == label && value.run_start == runStart) {
                        foundValues.push(value);
                    }
                }
                if (foundValues.length > 0) {
                    var value = foundValues[0];
                    if (value.failed > 0) {
                        datasets.push({
                            label: label,
                            data: [{ x: [runAxis, runAxis + 1], y: label }],
                            backgroundColor: [failedBackgroundColor],
                            borderWidth: 1,
                        });
                    } else if (value.skipped > 0) {
                        datasets.push({
                            label: label,
                            data: [{ x: [runAxis, runAxis + 1], y: label }],
                            backgroundColor: [skippedBackgroundColor],
                            borderWidth: 1,
                        });
                    } else if (value.passed > 0) {
                        datasets.push({
                            label: label,
                            data: [{ x: [runAxis, runAxis + 1], y: label }],
                            backgroundColor: [passedBackgroundColor],
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
        return [runStarts, graphData];
    }
}
