// set default values
document.getElementById(
    "stats"
).innerHTML = `<b>Database Summary</b><br>Runs: ${runs.length}<br>Suites: ${suites.length}<br>Tests: ${tests.length}<br>Keywords: ${keywords.length}`;

// filtered data vars
var filteredRuns;
var filteredSuites;
var filteredTests;
var filteredKeywords;

document.getElementById("runs").addEventListener("change", update_data_and_all_graphs);
document.getElementById("tag").addEventListener("change", update_data_and_all_graphs);
document.getElementById("fromDate").addEventListener("change", update_data_and_all_graphs);
document.getElementById("fromTime").addEventListener("change", update_data_and_all_graphs);
document.getElementById("toDate").addEventListener("change", update_data_and_all_graphs);
document.getElementById("toTime").addEventListener("change", update_data_and_all_graphs);
document.getElementById("resetFilters").addEventListener("click", reset_filters);

function reset_filters() {
    document.getElementById("runs").value = "All";
    document.getElementById("tag").value = "All";
    set_lowest_highest_dates(runs);
    update_data_and_all_graphs();
}

function set_lowest_highest_dates() {
    var dates = [];
    for (run of runs) {
        dates.push(new Date(run.run_start));
    }
    var lowest = new Date(Math.min.apply(null, dates));
    var highest = new Date(Math.max.apply(null, dates));
    var tzoffset = new Date().getTimezoneOffset() * 60000;
    lowest = new Date(new Date(lowest - tzoffset).getTime() + -1 * 60000); // this is to account for seconds in the initial filter value
    highest = new Date(new Date(highest - tzoffset).getTime() + 1 * 60000); // this is to account for seconds in the initial filter value
    document.getElementById("fromDate").value = lowest.toISOString().split("T")[0];
    document.getElementById("fromTime").value = lowest.toISOString().split("T")[1].substring(0, 5);
    document.getElementById("toDate").value = highest.toISOString().split("T")[0];
    document.getElementById("toTime").value = highest.toISOString().split("T")[1].substring(0, 5);
}

function update_data_and_all_graphs() {
    update_filtered_data();
    update_all_graphs();
}

function update_filtered_data() {
    // filter run data
    filteredRuns = filter_runs(runs);
    filteredRuns = filter_tags(filteredRuns);
    filteredRuns = filter_dates(filteredRuns);
    // filter suites and tests based on filtered runs
    filteredSuites = filter_data("suites");
    filteredTests = filter_data("tests");
    filteredKeywords = filter_data("keywords");
    // update tests select based on filtered runs
    add_suites_in_selects();
    add_tests_in_select();
    add_keywords_in_select();
    // set titles with amount of filtered items
    document.getElementById("runTitle").innerText = `Run Statistics (${Object.keys(filteredRuns).length})`;
    document.getElementById("suiteTitle").innerText = `Suite Statistics (${Object.keys(filteredSuites).length})`;
    document.getElementById("testTitle").innerText = `Test Statistics (${Object.keys(filteredTests).length})`;
    document.getElementById("keywordTitle").innerText = `Keyword Statistics (${Object.keys(filteredKeywords).length})`;
}

function update_all_graphs() {
    create_run_statistics_graph();
    create_run_duration_graph();
    create_run_table();
    create_suite_statistics_graph();
    create_suite_duration_graph();
    create_suite_most_failed_graph();
    create_suite_table();
    create_test_status_graph();
    create_test_duration_graph();
    create_test_most_failed_graph();
    create_test_table();
    create_keyword_statistics_graph();
    create_keyword_times_run_graph();
    create_keyword_total_time_graph();
    create_keyword_average_time_graph();
    create_keyword_min_time_graph();
    create_keyword_max_time_graph();
    create_keyword_table();
}

function filter_runs(runs) {
    var run = document.getElementById("runs").value;
    var filteredRuns = [];
    for (const [key, value] of Object.entries(runs)) {
        if (run != "All" && value.name != run) {
            continue;
        } else {
            filteredRuns.push(value);
        }
    }
    return filteredRuns;
}

function filter_tags(runs) {
    var tag = document.getElementById("tag").value;
    var filteredRuns = [];
    for (value of runs) {
        if (tag != "All") {
            var runTags = value.tags.split(",");
            for (runTag of runTags) {
                if (tag != runTag) {
                    continue;
                } else {
                    filteredRuns.push(value);
                }
            }
        } else {
            filteredRuns = runs;
        }
    }
    return filteredRuns;
}

function filter_dates(runs) {
    var fromDate = document.getElementById("fromDate").value;
    var fromTime = document.getElementById("fromTime").value;
    var toDate = document.getElementById("toDate").value;
    var toTime = document.getElementById("toTime").value;
    var filteredRuns = [];
    if (fromDate && fromTime && toDate && toTime) {
        var fromDateTime = new Date(`${fromDate} ${fromTime}:00`);
        var toDateTime = new Date(`${toDate} ${toTime}:00`);
        if (fromDateTime <= toDateTime) {
            for (value of runs) {
                var run_start = new Date(value.run_start);
                if (run_start < fromDateTime || run_start > toDateTime) {
                    continue;
                } else {
                    filteredRuns.push(value);
                }
            }
        } else {
            // you end up here if fromDate > toDate
            alert("Filter error: The selected from date + time is later than your selected to date + time. Date filter has not been applied!");
            filteredRuns = runs;
        }
    } else {
        // no dates or not all value are provided
        filteredRuns = runs;
    }
    return filteredRuns;
}

function filter_data(dataType) {
    var validRunStarts = [];
    for (value of filteredRuns) {
        validRunStarts.push(value.run_start);
    }
    var filteredData = [];
    for (value of window[dataType]) {
        if (validRunStarts.includes(value.run_start)) {
            filteredData.push(value);
        }
    }
    return filteredData;
}

function add_runs_in_select() {
    var runOptions = [];
    for (run of runs) {
        if (!runOptions.includes(run.name)) {
            runOptions.push(run.name);
        }
    }
    var runsSelect = document.getElementById("runs");
    runsSelect.options[runsSelect.options.length] = new Option("All", "All");
    for (runOption of runOptions) {
        runsSelect.options[runsSelect.options.length] = new Option(runOption, runOption);
    }
}

function add_tags_in_select() {
    var tags = [];
    for (run of runs) {
        var runTags = run.tags.split(",");
        for (tag of runTags) {
            if (!tags.includes(tag) && tag != "") {
                tags.push(tag);
            }
        }
    }
    var tagsSelect = document.getElementById("tag");
    tagsSelect.options[tagsSelect.options.length] = new Option("All", "All");
    for (tag of tags) {
        tagsSelect.options[tagsSelect.options.length] = new Option(tag, tag);
    }
}

function add_suites_in_selects() {
    document.getElementById("suiteSelectTests").innerHTML = "";
    document.getElementById("suiteSelectSuites").innerHTML = "";
    var suiteNames = [];
    for (suite of filteredSuites) {
        if (!suiteNames.includes(suite.name)) {
            suiteNames.push(suite.name);
        }
    }
    var suiteSelectTests = document.getElementById("suiteSelectTests");
    var suiteSelectSuites = document.getElementById("suiteSelectSuites");
    for (suiteName of suiteNames.sort()) {
        suiteSelectTests.options[suiteSelectTests.options.length] = new Option(suiteName, suiteName);
        suiteSelectSuites.options[suiteSelectSuites.options.length] = new Option(suiteName, suiteName);
    }
}

function add_tests_in_select() {
    document.getElementById("testSelect").innerHTML = "";
    suiteSelect = document.getElementById("suiteSelectTests").value;
    var testNames = [];
    for (test of filteredTests) {
        if (test.full_name.includes(`.${suiteSelect}.${test.name}`) && !testNames.includes(test.name)) {
            testNames.push(test.name);
        }
    }
    var testSelect = document.getElementById("testSelect");
    testSelect.options[testSelect.options.length] = new Option("All", "All");
    for (testName of testNames) {
        testSelect.options[testSelect.options.length] = new Option(testName, testName);
    }
}

function add_keywords_in_select() {
    document.getElementById("keywordSelect").innerHTML = "";
    var keywordNames = [];
    for (keyword of filteredKeywords) {
        if (!keywordNames.includes(keyword.name)) {
            keywordNames.push(keyword.name);
        }
    }
    var keywordSelect = document.getElementById("keywordSelect");
    for (keywordName of keywordNames.sort()) {
        keywordSelect.options[keywordSelect.options.length] = new Option(keywordName, keywordName);
    }
}
