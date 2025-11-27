// function to prepare the data in the correct format for statistics graphs
function get_statistics_graph_data(dataType, graphType, filteredData) {
    const suiteSelectSuitesCombined = document.getElementById("suiteSelectSuites").value === "All Suites Combined";
    const keywordSelect = document.getElementById("keywordSelect").value;
    const useLibraryNames = settings?.switch?.useLibraryNames === true;
    const rawPassed = [], rawFailed = [], rawSkipped = [], labels = [], aliases = [];
    let names = [];
    const process_value = (value) => {
        rawPassed.push(value.passed);
        rawFailed.push(value.failed);
        rawSkipped.push(value.skipped);
        labels.push(value.run_start);
        aliases.push(value.run_alias);
        names.push(value.name);
    };
    for (const value of filteredData) {
        if (exclude_from_suite_data(dataType, value)) continue;
        if (dataType === "keyword") {
            const keywordKey = useLibraryNames && value.owner
                ? `${value.owner}.${value.name}`
                : value.name;
            if (keywordKey !== keywordSelect) continue;
        }
        process_value(value);
    }
    const finalLabels = graphType !== "line" ? (settings.show.aliases ? aliases : labels) : labels;
    const styling = graphType !== "line" ? barConfig : lineConfig;
    let statisticsData = {
        labels: finalLabels,
        datasets: [
            {
                label: "Failed",
                data: rawFailed.slice(),
                backgroundColor: failedBackgroundColor,
                borderColor: failedBackgroundBorderColor,
                ...styling,
                stack: graphType === "percentages" || graphType === "amount" ? "Stack 0" : undefined,
            },
            {
                label: "Skipped",
                data: rawSkipped.slice(),
                backgroundColor: skippedBackgroundColor,
                borderColor: skippedBackgroundBorderColor,
                ...styling,
                stack: graphType === "percentages" || graphType === "amount" ? "Stack 0" : undefined,
            },
            {
                label: "Passed",
                data: rawPassed.slice(),
                backgroundColor: passedBackgroundColor,
                borderColor: passedBackgroundBorderColor,
                ...styling,
                stack: graphType === "percentages" || graphType === "amount" ? "Stack 0" : undefined,
            }
        ]
    };
    if (dataType === "suite" && suiteSelectSuitesCombined) {
        const bundled = {};
        const groupedLabels = [];
        const groupedData = Array(statisticsData.datasets.length).fill().map(() => []);

        statisticsData.labels.forEach((label, i) => {
            if (!(label in bundled)) {
                bundled[label] = groupedLabels.length;
                groupedLabels.push(label);
                statisticsData.datasets.forEach((_, d) => groupedData[d].push(0));
            }
            const idx = bundled[label];
            statisticsData.datasets.forEach((dataset, d) => {
                groupedData[d][idx] += dataset.data[i];
            });
        });
        statisticsData.datasets.forEach((dataset, i) => {
            dataset.data = groupedData[i];
        });
        statisticsData.labels = groupedLabels;
        names = Array(statisticsData.labels.length).fill("All Suites Combined");
    }
    if (graphType === "percentages") {
        const totalPoints = statisticsData.datasets[0].data.length;
        for (let i = 0; i < totalPoints; i++) {
            const passed = statisticsData.datasets[2].data[i];
            const failed = statisticsData.datasets[0].data[i];
            const skipped = statisticsData.datasets[1].data[i];
            const total = passed + failed + skipped;
            statisticsData.datasets[2].data[i] = total ? Math.round((passed / total) * 100) : 0;
            statisticsData.datasets[0].data[i] = total ? Math.round((failed / total) * 100) : 0;
            statisticsData.datasets[1].data[i] = total ? Math.round((skipped / total) * 100) : 0;
        }
    }
    return [statisticsData, names];
}

function get_test_statistics_data(filteredTests) {
    const suiteSelectTests = document.getElementById("suiteSelectTests").value;
    const testSelect = document.getElementById("testSelect").value;
    const testTagsSelect = document.getElementById("testTagsSelect").value;
    const testOnlyChanges = document.getElementById("testOnlyChanges").checked;
    const compareOnlyChanges = document.getElementById("compareOnlyChanges").checked;
    const selectedRuns = [...new Set(
        compareRunIds
            .map(id => document.getElementById(id).value)
            .filter(val => val !== "None")
    )];
    const [runStarts, datasets] = [[], []];
    var labels = [];
    function getTestLabel(test) {
        if (settings.menu.dashboard) {
            return settings.switch.suitePathsTestSection ? test.full_name : test.name;
        } else if (settings.menu.compare) {
            return settings.switch.suitePathsCompareSection ? test.full_name : test.name;
        }
        return test.name;
    }
    for (const test of filteredTests) {
        if (settings.menu.dashboard) {
            const testLabel = getTestLabel(test);
            const testBaseName = test.name;
            if (suiteSelectTests !== "All") {
                const expectedFull = `${suiteSelectTests}.${testBaseName}`;
                const isMatch = settings.switch.suitePathsTestSection
                    ? test.full_name === expectedFull
                    : test.full_name.includes(`.${suiteSelectTests}.${testBaseName}`) || test.full_name === expectedFull;
                if (!isMatch) continue;
            }
            if (testSelect !== "All" && testBaseName !== testSelect) continue;

            if (testTagsSelect !== "All") {
                const tagList = test.tags.replace(/\[|\]/g, "").split(",");
                if (!tagList.includes(testTagsSelect)) continue;
            }
        } else if (settings.menu.compare) {
            if (!(selectedRuns.includes(test.run_start) || selectedRuns.includes(test.run_alias))) continue;
        }
        const testLabel = getTestLabel(test);
        if (!labels.includes(testLabel)) {
            labels.push(testLabel);
        }
        const runId = settings.show.aliases ? test.run_alias : test.run_start;

        if (!runStarts.includes(runId)) {
            runStarts.push(runId);
        }
        const runAxis = runStarts.indexOf(runId);
        const config =
            test.passed == 1 ? passedConfig :
                test.failed == 1 ? failedConfig :
                    test.skipped == 1 ? skippedConfig : null;
        if (config) {
            datasets.push({
                label: testLabel,
                data: [{ x: [runAxis, runAxis + 1], y: testLabel }],
                ...config,
            });
        }
    }
    let finalDatasets = convert_timeline_data(datasets);
    if (testOnlyChanges || compareOnlyChanges) {
        const countMap = {};
        for (const ds of finalDatasets) {
            countMap[ds.label] = (countMap[ds.label] || 0) + 1;
        }
        const labelsToKeep = new Set(Object.keys(countMap).filter(label => countMap[label] > 1));

        finalDatasets = finalDatasets.filter(ds => labelsToKeep.has(ds.label));
        labels = labels.filter(label => labelsToKeep.has(label));
    }
    const graphData = {
        labels,
        datasets: finalDatasets,
    };
    return [graphData, runStarts];
}

export {
    get_statistics_graph_data,
    get_test_statistics_data
};