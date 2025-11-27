
// function to create run table in the run section
function create_run_table() {
    if (runTable) {
        runTable.destroy();
    }
    const data = [];
    for (const run of filteredRuns) {
        data.push([
            run.run_start,
            run.full_name,
            run.name,
            run.total,
            run.passed,
            run.failed,
            run.skipped,
            run.elapsed_s,
            run.start_time,
            run.tags,
            run.run_alias,
            run.metadata,
        ]);
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
            { title: "alias" },
            { title: "metadata" },
        ],
        data: data,
    });
}

// function to create suite table in the suite section
function create_suite_table() {
    if (suiteTable) {
        suiteTable.destroy();
    }
    const data = [];
    for (const suite of filteredSuites) {
        data.push([
            suite.run_start,
            suite.full_name,
            suite.name,
            suite.total,
            suite.passed,
            suite.failed,
            suite.skipped,
            suite.elapsed_s,
            suite.start_time,
            suite.run_alias,
            suite.id,
        ]);
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
            { title: "alias" },
            { title: "id" },
        ],
        data: data,
    });
}

// function to create test table in the test section
function create_test_table() {
    if (testTable) {
        testTable.destroy();
    }
    const data = [];
    for (const test of filteredTests) {
        data.push([
            test.run_start,
            test.full_name,
            test.name,
            test.passed,
            test.failed,
            test.skipped,
            test.elapsed_s,
            test.start_time,
            test.message,
            test.tags,
            test.run_alias,
            test.id
        ]);
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
            { title: "message" },
            { title: "tags" },
            { title: "alias" },
            { title: "id" },
        ],
        data: data,
    });
}

// function to create keyword table in the tables tab
function create_keyword_table() {
    if (keywordTable) {
        keywordTable.destroy();
    }
    const data = [];
    for (const keyword of filteredKeywords) {
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
            keyword.run_alias,
            keyword.owner,
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
            { title: "alias" },
            { title: "owner" },
        ],
        data: data,
    });
}

export {
    create_run_table,
    create_suite_table,
    create_test_table,
    create_keyword_table
};