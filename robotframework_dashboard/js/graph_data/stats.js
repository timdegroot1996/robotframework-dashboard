// function to prepare the data for the run stats canvas
function get_stats_data(filteredRuns, filteredSuites, filteredTests, filteredKeywords) {
    const data = {
        totalRuns: Object.keys(filteredRuns).length,
        totalSuites: Object.keys(filteredSuites).length,
        totalTests: Object.keys(filteredTests).length,
        totalKeywords: filteredKeywords.reduce((sum, k) => sum + parseInt(k.times_run), 0),
    };
    const testStats = {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        duration: 0,
        names: new Set(),
    };
    for (const test of filteredTests) {
        testStats.total++;
        testStats.names.add(test.name);
        if (test.passed == 1) testStats.passed++;
        if (test.failed == 1) testStats.failed++;
        if (test.skipped == 1) testStats.skipped++;
        testStats.duration += parseFloat(test.elapsed_s);
    }
    data.totalUniqueTests = testStats.names.size;
    data.totalPassed = `${testStats.passed} (${Math.round(testStats.passed / testStats.total * 100)}%)`;
    data.totalFailed = `${testStats.failed} (${Math.round(testStats.failed / testStats.total * 100)}%)`;
    data.totalSkipped = `${testStats.skipped} (${Math.round(testStats.skipped / testStats.total * 100)}%)`;
    let totalRunDuration = 0;
    const passRates = filteredRuns.map(run => {
        totalRunDuration += parseFloat(run.elapsed_s);
        return Math.round((run.passed / run.total) * 100);
    });
    data.totalRunTime = Math.round(totalRunDuration);
    data.averageRunTime = Math.round(totalRunDuration / data.totalRuns);
    data.averageTestTime = Math.round(testStats.duration / testStats.total * 100) / 100;
    data.averagePassRate = `${Math.round(passRates.reduce((a, b) => a + b, 0) / passRates.length)}%`;
    return data;
}

export {
    get_stats_data
};