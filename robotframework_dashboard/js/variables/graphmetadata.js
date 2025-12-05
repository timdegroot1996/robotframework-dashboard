const graphMetadata = [
    {
        key: "runStatistics",
        label: "Run Statistics",
        defaultType: "percentages",
        viewOptions: ["Percentages", "Line", "Amount"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Statistics</h6>
                    <div class="graph-controls">
                        <a class="percentage-graph information" id="runStatisticsGraphPercentages"></a>
                        <a class="bar-graph information" id="runStatisticsGraphAmount"></a>
                        <a class="line-graph information" id="runStatisticsGraphLine"></a>
                        <a class="fullscreen-graph information" id="runStatisticsFullscreen"></a>
                        <a class="close-graph information" id="runStatisticsClose" hidden></a>
                        <a class="shown-graph information" id="runStatisticsShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="runStatisticsHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <canvas id="runStatisticsGraph"></canvas>
                </div>`,
    },
    {
        key: "runDonut",
        label: "Run Donut",
        defaultType: "donut",
        viewOptions: ["Donut"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Donut</h6>
                    <div class="graph-controls">
                        <a class="pie-graph information" id="runDonutGraphDonut"></a>
                        <a class="fullscreen-graph information" id="runDonutFullscreen"></a>
                        <a class="close-graph information" id="runDonutClose" hidden></a>
                        <a class="shown-graph information" id="runDonutShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="runDonutHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body" style="height:90%;">
                    <div class="row w-100 h-100">
                        <div class="col-md-6 w-50 h-100">
                            <canvas id="runDonutGraph"></canvas>
                        </div>
                        <div class="col-md-6 w-50 h-100">
                            <canvas id="runDonutTotalGraph"></canvas>
                        </div>
                    </div>
                </div>`,
    },
    {
        key: "runDonutTotal",
        label: "Run Donut Total",
        defaultType: "donut",
        viewOptions: ["Donut"],
        hasFullscreenButton: false,
        information: null,
    },
    {
        key: "runStats",
        label: "Run Stats",
        defaultType: "stats",
        viewOptions: ["Stats"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Stats</h6>
                    <div class="graph-controls">
                        <a class="stats-graph information" id="runStatsGraphStats"></a>
                        <a class="fullscreen-graph information" id="runStatsFullscreen"></a>
                        <a class="close-graph information" id="runStatsClose" hidden></a>
                        <a class="shown-graph information" id="runStatsShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="runStatsHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <div class="w-100 h-100">
                        <div class="d-flex flex-column justify-content-between h-100">
                            <div class="row text-center mb-4">
                                <div class="col">
                                    <div class="stat-label">Executed Runs</div>
                                    <div class="stat-value blue-text" id="totalRuns"></div>
                                </div>
                                <div class="col">
                                    <div class="stat-label">Executed Suites</div>
                                    <div class="stat-value blue-text" id="totalSuites"></div>
                                </div>
                                <div class="col">
                                    <div class="stat-label">Executed Tests</div>
                                    <div class="stat-value blue-text" id="totalTests"></div>
                                </div>
                                <div class="col">
                                    <div class="stat-label">Executed Keywords</div>
                                    <div class="stat-value blue-text" id="totalKeywords"></div>
                                </div>
                            </div>
                            <div class="row text-center mb-4">
                                <div class="col">
                                    <div class="stat-label">Unique Tests</div>
                                    <div class="stat-value white-text" id="totalUniqueTests"></div>
                                </div>
                                <div class="col">
                                    <div class="stat-label">Passed</div>
                                    <div class="stat-value green-text" id="totalPassed"></div>
                                </div>
                                <div class="col">
                                    <div class="stat-label">Failed</div>
                                    <div class="stat-value red-text" id="totalFailed"></div>
                                </div>
                                <div class="col">
                                    <div class="stat-label">Skipped</div>
                                    <div class="stat-value yellow-text" id="totalSkipped"></div>
                                </div>
                            </div>
                            <div class="row text-center">
                                <div class="col">
                                    <div class="stat-label">Total Run Time</div>
                                    <div class="stat-value white-text" id="totalRunTime"></div>
                                </div>
                                <div class="col">
                                    <div class="stat-label">Avg Run Time</div>
                                    <div class="stat-value white-text" id="averageRunTime"></div>
                                </div>
                                <div class="col">
                                    <div class="stat-label">Avg Test Time</div>
                                    <div class="stat-value white-text" id="averageTestTime"></div>
                                </div>
                                <div class="col">
                                    <div class="stat-label">Avg Run Pass Rate</div>
                                    <div class="stat-value green-text" id="averagePassRate"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,
    },
    {
        key: "runDuration",
        label: "Run Duration",
        defaultType: "line",
        viewOptions: ["Bar", "Line"],
        hasFullscreenButton: true,
        html: ` <div class="graph-header">
                    <h6>Duration</h6>
                    <div class="graph-controls">
                        <a class="bar-graph information" id="runDurationGraphBar"></a>
                        <a class="line-graph information" id="runDurationGraphLine"></a>
                        <a class="fullscreen-graph information" id="runDurationFullscreen"></a>
                        <a class="close-graph information" id="runDurationClose" hidden></a>
                        <a class="shown-graph information" id="runDurationShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="runDurationHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <canvas id="runDurationGraph"></canvas>
                </div>`,
    },
    {
        key: "runHeatmap",
        label: "Run Heatmap",
        defaultType: "heatmap",
        viewOptions: ["Heatmap"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Heatmap</h6>
                    <div class="graph-controls">
                        <div class="btn-group">
                            <label class="form-check-label" for="heatMapTestType">Status</label>
                        </div>
                        <div class="btn-group">
                            <select class="form-select form-select-sm" id="heatMapTestType">
                                <option value="All">All</option>
                                <option value="Passed">Passed</option>
                                <option value="Failed">Failed</option>
                                <option value="Skipped">Skipped</option>
                            </select>
                        </div>
                        <div class="btn-group">
                            <label class="form-check-label" for="heatMapHour">Hour</label>
                        </div>
                        <div class="btn-group">
                            <select class="form-select form-select-sm" id="heatMapHour">
                                <option value="All">All</option>
                                <option value="0">00:00</option>
                                <option value="1">01:00</option>
                                <option value="2">02:00</option>
                                <option value="3">03:00</option>
                                <option value="4">04:00</option>
                                <option value="5">05:00</option>
                                <option value="6">06:00</option>
                                <option value="7">07:00</option>
                                <option value="8">08:00</option>
                                <option value="9">09:00</option>
                                <option value="10">10:00</option>
                                <option value="11">11:00</option>
                                <option value="12">12:00</option>
                                <option value="13">13:00</option>
                                <option value="14">14:00</option>
                                <option value="15">15:00</option>
                                <option value="16">16:00</option>
                                <option value="17">17:00</option>
                                <option value="18">18:00</option>
                                <option value="19">19:00</option>
                                <option value="20">20:00</option>
                                <option value="21">21:00</option>
                                <option value="22">22:00</option>
                                <option value="23">23:00</option>
                            </select>
                        </div>
                        <a class="heatmap-graph information" id="runHeatmapGraphHeatmap"></a>
                        <a class="fullscreen-graph information" id="runHeatmapFullscreen"></a>
                        <a class="close-graph information" id="runHeatmapClose" hidden></a>
                        <a class="shown-graph information" id="runHeatmapShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="runHeatmapHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <canvas id="runHeatmapGraph"></canvas>
                </div>`,
    },
    {
        key: "suiteFolderDonut",
        label: "Suite Folder Donut",
        defaultType: "donut",
        viewOptions: ["Donut"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Folders</h6>
                    <div class="graph-controls">
                        <div class="btn-group">
                            <label class="form-check-label" for="onlyFailedFolders">Only Failed</label>
                        </div>
                        <div class="btn-group form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="onlyFailedFolders">
                        </div>
                        <button class="btn btn-outline-light btn-sm" id="suiteFolderDonutGoUp">Go Up</button>
                        <a class="pie-graph information" id="suiteFolderDonutGraphDonut"></a>
                        <a class="fullscreen-graph information" id="suiteFolderDonutFullscreen"></a>
                        <a class="close-graph information" id="suiteFolderDonutClose" hidden></a>
                        <a class="shown-graph information" id="suiteFolderDonutShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="suiteFolderDonutHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <div class="row w-100 h-100">
                        <div class="col-md-6 w-50 h-100">
                            <canvas id="suiteFolderDonutGraph" class="w-100 h-100"></canvas>
                        </div>
                        <div class="col-md-6 w-50 h-100">
                            <canvas id="suiteFolderFailDonutGraph" class="w-100 h-100"></canvas>
                        </div>
                    </div>
                </div>`,
    },
    {
        key: "suiteFolderFailDonut",
        label: "Suite Folder Fail Donut",
        defaultType: "donut",
        viewOptions: ["Donut"],
        hasFullscreenButton: false,
        information: null,
    },
    {
        key: "suiteStatistics",
        label: "Suite Statistics",
        defaultType: "percentages",
        viewOptions: ["Percentages", "Line", "Amount"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Statistics</h6>
                    <div class="graph-controls">
                        <a class="percentage-graph information" id="suiteStatisticsGraphPercentages"></a>
                        <a class="bar-graph information" id="suiteStatisticsGraphAmount"></a>
                        <a class="line-graph information" id="suiteStatisticsGraphLine"></a>
                        <a class="fullscreen-graph information" id="suiteStatisticsFullscreen"></a>
                        <a class="close-graph information" id="suiteStatisticsClose" hidden></a>
                        <a class="shown-graph information" id="suiteStatisticsShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="suiteStatisticsHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <canvas id="suiteStatisticsGraph"></canvas>
                </div>`,
    },
    {
        key: "suiteDuration",
        label: "Suite Duration",
        defaultType: "line",
        viewOptions: ["Bar", "Line"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Duration</h6>
                    <div class="graph-controls">
                        <a class="bar-graph information" id="suiteDurationGraphBar"></a>
                        <a class="line-graph information" id="suiteDurationGraphLine"></a>
                        <a class="fullscreen-graph information" id="suiteDurationFullscreen"></a>
                        <a class="close-graph information" id="suiteDurationClose" hidden></a>
                        <a class="shown-graph information" id="suiteDurationShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="suiteDurationHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <canvas id="suiteDurationGraph"></canvas>
                </div>`,
    },
    {
        key: "suiteMostFailed",
        label: "Suite Most Failed",
        defaultType: "bar",
        viewOptions: ["Bar", "Timeline"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Most Failed</h6>
                    <div class="graph-controls">
                        <a class="bar-graph information" id="suiteMostFailedGraphBar"></a>
                        <a class="timeline-graph information" id="suiteMostFailedGraphTimeline"></a>
                        <a class="fullscreen-graph information" id="suiteMostFailedFullscreen"></a>
                        <a class="close-graph information" id="suiteMostFailedClose" hidden></a>
                        <a class="shown-graph information" id="suiteMostFailedShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="suiteMostFailedHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <div id="suiteMostFailedVertical" class="w-100 vertical">
                        <canvas id="suiteMostFailedGraph"></canvas>
                    </div>
                </div>`,
    },
    {
        key: "suiteMostTimeConsuming",
        label: "Suite Most Time Consuming",
        defaultType: "timeline",
        viewOptions: ["Bar", "Timeline"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Most Time Consuming</h6>
                    <div class="graph-controls">
                        <div class="btn-group">
                            <label class="form-check-label" for="onlyLastRunSuite">Only Last Run</label>
                        </div>
                        <div class="btn-group form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="onlyLastRunSuite">
                        </div>
                        <a class="bar-graph information" id="suiteMostTimeConsumingGraphBar"></a>
                        <a class="timeline-graph information" id="suiteMostTimeConsumingGraphTimeline"></a>
                        <a class="fullscreen-graph information" id="suiteMostTimeConsumingFullscreen"></a>
                        <a class="close-graph information" id="suiteMostTimeConsumingClose" hidden></a>
                        <a class="shown-graph information" id="suiteMostTimeConsumingShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="suiteMostTimeConsumingHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <div id="suiteMostTimeConsumingVertical" class="w-100 vertical">
                        <canvas id="suiteMostTimeConsumingGraph"></canvas>
                    </div
                </div>`,
    },
    {
        key: "testStatistics",
        label: "Test Statistics",
        defaultType: "timeline",
        viewOptions: ["Timeline"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Statistics</h6>
                    <div class="graph-controls">
                        <div class="btn-group">
                            <label class="form-check-label" for="testNoChanges">Status</label>
                        </div>
                        <div class="btn-group">
                            <select class="form-select form-select-sm" id="testNoChanges">
                                <option value="All">All</option>
                                <option value="Passed">Passed</option>
                                <option value="Failed">Failed</option>
                                <option value="Skipped">Skipped</option>
                            </select>
                        </div>
                        <div class="btn-group">
                            <label class="form-check-label" for="testOnlyChanges">Only Changes</label>
                        </div>
                        <div class="btn-group form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="testOnlyChanges">
                        </div>
                        <a class="timeline-graph information" id="testStatisticsGraphTimeline"></a>
                        <a class="fullscreen-graph information" id="testStatisticsFullscreen"></a>
                        <a class="close-graph information" id="testStatisticsClose" hidden></a>
                        <a class="shown-graph information" id="testStatisticsShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="testStatisticsHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <div id="testStatisticsVertical" class="w-100 vertical">
                        <canvas id="testStatisticsGraph"></canvas>
                    </div>
                </div>`,
    },
    {
        key: "testDuration",
        label: "Test Duration",
        defaultType: "line",
        viewOptions: ["Bar", "Line"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Duration</h6>
                    <div class="graph-controls">
                        <a class="bar-graph information" id="testDurationGraphBar"></a>
                        <a class="line-graph information" id="testDurationGraphLine"></a>
                        <a class="fullscreen-graph information" id="testDurationFullscreen"></a>
                        <a class="close-graph information" id="testDurationClose" hidden></a>
                        <a class="shown-graph information" id="testDurationShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="testDurationHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <canvas id="testDurationGraph"></canvas>
                </div>`,
    },
    {
        key: "testDurationDeviation",
        label: "Test Duration Deviation",
        defaultType: "bar",
        viewOptions: ["Bar"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Duration Deviation</h6>
                    <div class="graph-controls">
                        <a class="boxplot-graph information" id="testDurationDeviationGraphBar"></a>
                        <a class="fullscreen-graph information" id="testDurationDeviationFullscreen"></a>
                        <a class="close-graph information" id="testDurationDeviationClose" hidden></a>
                        <a class="shown-graph information" id="testDurationDeviationShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="testDurationDeviationHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <canvas id="testDurationDeviationGraph"></canvas>
                </div>`,
    },
    {
        key: "testMessages",
        label: "Test Messages",
        defaultType: "timeline",
        viewOptions: ["Bar", "Timeline"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Messages</h6>
                    <div class="graph-controls">
                        <a class="bar-graph information" id="testMessagesGraphBar"></a>
                        <a class="timeline-graph information" id="testMessagesGraphTimeline"></a>
                        <a class="fullscreen-graph information" id="testMessagesFullscreen"></a>
                        <a class="close-graph information" id="testMessagesClose" hidden></a>
                        <a class="shown-graph information" id="testMessagesShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="testMessagesHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <div id="testMessagesVertical" class="w-100 vertical">
                        <canvas id="testMessagesGraph"></canvas>
                    </div>
                </div>`,
    },
    {
        key: "testMostFlaky",
        label: "Test Most Flaky",
        defaultType: "timeline",
        viewOptions: ["Bar", "Timeline"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Most Flaky</h6>
                    <div class="graph-controls">
                        <div class="btn-group">
                            <label class="form-check-label" for="ignoreSkips">Ignore Skips</label>
                        </div>
                        <div class="btn-group form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="ignoreSkips">
                        </div>
                        <a class="bar-graph information" id="testMostFlakyGraphBar"></a>
                        <a class="timeline-graph information" id="testMostFlakyGraphTimeline"></a>
                        <a class="fullscreen-graph information" id="testMostFlakyFullscreen"></a>
                        <a class="close-graph information" id="testMostFlakyClose" hidden></a>
                        <a class="shown-graph information" id="testMostFlakyShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="testMostFlakyHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <div id="testMostFlakyVertical" class="w-100 vertical">
                        <canvas id="testMostFlakyGraph"></canvas>
                    </div>
                </div>`,
    },
    {
        key: "testRecentMostFlaky",
        label: "Test Recent Most Flaky",
        defaultType: "timeline",
        viewOptions: ["Bar", "Timeline"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Recent Most Flaky</h6>
                    <div class="graph-controls">
                        <div class="btn-group">
                            <label class="form-check-label" for="ignoreSkipsRecent">Ignore Skips</label>
                        </div>
                        <div class="btn-group form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="ignoreSkipsRecent">
                        </div>
                        <a class="bar-graph information" id="testRecentMostFlakyGraphBar"></a>
                        <a class="timeline-graph information" id="testRecentMostFlakyGraphTimeline"></a>
                        <a class="fullscreen-graph information" id="testRecentMostFlakyFullscreen"></a>
                        <a class="close-graph information" id="testRecentMostFlakyClose" hidden></a>
                        <a class="shown-graph information" id="testRecentMostFlakyShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="testRecentMostFlakyHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <div id="testRecentMostFlakyVertical" class="w-100 vertical">
                        <canvas id="testRecentMostFlakyGraph"></canvas>
                    </div>
                </div>`,
    },
    {
        key: "testMostFailed",
        label: "Test Most Failed",
        defaultType: "timeline",
        viewOptions: ["Bar", "Timeline"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Most Failed</h6>
                    <div class="graph-controls">
                        <a class="bar-graph information" id="testMostFailedGraphBar"></a>
                        <a class="timeline-graph information" id="testMostFailedGraphTimeline"></a>
                        <a class="fullscreen-graph information" id="testMostFailedFullscreen"></a>
                        <a class="close-graph information" id="testMostFailedClose" hidden></a>
                        <a class="shown-graph information" id="testMostFailedShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="testMostFailedHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <div id="testMostFailedVertical" class="w-100 vertical">
                        <canvas id="testMostFailedGraph"></canvas>
                    </div>
                </div>`,
    },
    {
        key: "testRecentMostFailed",
        label: "Test Recent Most Failed",
        defaultType: "timeline",
        viewOptions: ["Bar", "Timeline"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Recent Most Failed</h6>
                    <div class="graph-controls">
                        <a class="bar-graph information" id="testRecentMostFailedGraphBar"></a>
                        <a class="timeline-graph information" id="testRecentMostFailedGraphTimeline"></a>
                        <a class="fullscreen-graph information" id="testRecentMostFailedFullscreen"></a>
                        <a class="close-graph information" id="testRecentMostFailedClose" hidden></a>
                        <a class="shown-graph information" id="testRecentMostFailedShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="testRecentMostFailedHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <div id="testRecentMostFailedVertical" class="w-100 vertical">
                        <canvas id="testRecentMostFailedGraph"></canvas>
                    </div>
                </div>`,
    },
    {
        key: "testMostTimeConsuming",
        label: "Test Most Time Consuming",
        defaultType: "timeline",
        viewOptions: ["Bar", "Timeline"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Most Time Consuming</h6>
                    <div class="graph-controls">
                        <div class="btn-group">
                            <label class="form-check-label" for="onlyLastRunTest">Only Last Run</label>
                        </div>
                        <div class="btn-group form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="onlyLastRunTest">
                        </div>
                        <a class="bar-graph information" id="testMostTimeConsumingGraphBar"></a>
                        <a class="timeline-graph information" id="testMostTimeConsumingGraphTimeline"></a>
                        <a class="fullscreen-graph information" id="testMostTimeConsumingFullscreen"></a>
                        <a class="close-graph information" id="testMostTimeConsumingClose" hidden></a>
                        <a class="shown-graph information" id="testMostTimeConsumingShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="testMostTimeConsumingHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <div id="testMostTimeConsumingVertical" class="w-100 vertical">
                        <canvas id="testMostTimeConsumingGraph"></canvas>
                    </div
                </div>`,
    },
    {
        key: "keywordStatistics",
        label: "Keyword Statistics",
        defaultType: "percentages",
        viewOptions: ["Percentages", "Line", "Amount"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Statistics</h6>
                    <div class="graph-controls">
                        <a class="percentage-graph information" id="keywordStatisticsGraphPercentages"></a>
                        <a class="bar-graph information" id="keywordStatisticsGraphAmount"></a>
                        <a class="line-graph information" id="keywordStatisticsGraphLine"></a>
                        <a class="fullscreen-graph information" id="keywordStatisticsFullscreen"></a>
                        <a class="close-graph information" id="keywordStatisticsClose" hidden></a>
                        <a class="shown-graph information" id="keywordStatisticsShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="keywordStatisticsHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <canvas id="keywordStatisticsGraph"></canvas>
                </div>`,
    },
    {
        key: "keywordTimesRun",
        label: "Keyword Times Run",
        defaultType: "line",
        viewOptions: ["Bar", "Line"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Times Run</h6>
                    <div class="graph-controls">
                        <a class="bar-graph information" id="keywordTimesRunGraphBar"></a>
                        <a class="line-graph information" id="keywordTimesRunGraphLine"></a>
                        <a class="fullscreen-graph information" id="keywordTimesRunFullscreen"></a>
                        <a class="close-graph information" id="keywordTimesRunClose" hidden></a>
                        <a class="shown-graph information" id="keywordTimesRunShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="keywordTimesRunHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <canvas id="keywordTimesRunGraph"></canvas>
                </div>`,
    },
    {
        key: "keywordTotalDuration",
        label: "Keyword Total Duration",
        defaultType: "line",
        viewOptions: ["Bar", "Line"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Total Duration</h6>
                    <div class="graph-controls">
                        <a class="bar-graph information" id="keywordTotalDurationGraphBar"></a>
                        <a class="line-graph information" id="keywordTotalDurationGraphLine"></a>
                        <a class="fullscreen-graph information" id="keywordTotalDurationFullscreen"></a>
                        <a class="close-graph information" id="keywordTotalDurationClose" hidden></a>
                        <a class="shown-graph information" id="keywordTotalDurationShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="keywordTotalDurationHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <canvas id="keywordTotalDurationGraph"></canvas>
                </div>`,
    },
    {
        key: "keywordAverageDuration",
        label: "Keyword Average Duration",
        defaultType: "line",
        viewOptions: ["Bar", "Line"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Average Duration</h6>
                    <div class="graph-controls">
                        <a class="bar-graph information" id="keywordAverageDurationGraphBar"></a>
                        <a class="line-graph information" id="keywordAverageDurationGraphLine"></a>
                        <a class="fullscreen-graph information" id="keywordAverageDurationFullscreen"></a>
                        <a class="close-graph information" id="keywordAverageDurationClose" hidden></a>
                        <a class="shown-graph information" id="keywordAverageDurationShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="keywordAverageDurationHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <canvas id="keywordAverageDurationGraph"></canvas>
                </div>`,
    },
    {
        key: "keywordMinDuration",
        label: "Keyword Min Duration",
        defaultType: "line",
        viewOptions: ["Bar", "Line"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Min Duration</h6>
                    <div class="graph-controls">
                        <a class="bar-graph information" id="keywordMinDurationGraphBar"></a>
                        <a class="line-graph information" id="keywordMinDurationGraphLine"></a>
                        <a class="fullscreen-graph information" id="keywordMinDurationFullscreen"></a>
                        <a class="close-graph information" id="keywordMinDurationClose" hidden></a>
                        <a class="shown-graph information" id="keywordMinDurationShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="keywordMinDurationHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <canvas id="keywordMinDurationGraph"></canvas>
                </div>`,
    },
    {
        key: "keywordMaxDuration",
        label: "Keyword Max Duration",
        defaultType: "line",
        viewOptions: ["Bar", "Line"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Max Duration</h6>
                    <div class="graph-controls">
                        <a class="bar-graph information" id="keywordMaxDurationGraphBar"></a>
                        <a class="line-graph information" id="keywordMaxDurationGraphLine"></a>
                        <a class="fullscreen-graph information" id="keywordMaxDurationFullscreen"></a>
                        <a class="close-graph information" id="keywordMaxDurationClose" hidden></a>
                        <a class="shown-graph information" id="keywordMaxDurationShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="keywordMaxDurationHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <canvas id="keywordMaxDurationGraph"></canvas>
                </div>>`,
    },
    {
        key: "keywordMostFailed",
        label: "Keyword Most Failed",
        defaultType: "timeline",
        viewOptions: ["Bar", "Timeline"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Most Failed</h6>
                    <div class="graph-controls">
                        <a class="bar-graph information" id="keywordMostFailedGraphBar"></a>
                        <a class="timeline-graph information" id="keywordMostFailedGraphTimeline"></a>
                        <a class="fullscreen-graph information" id="keywordMostFailedFullscreen"></a>
                        <a class="close-graph information" id="keywordMostFailedClose" hidden></a>
                        <a class="shown-graph information" id="keywordMostFailedShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="keywordMostFailedHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <div id="keywordMostFailedVertical" class="w-100 vertical">
                        <canvas id="keywordMostFailedGraph"></canvas>
                    </div
                </div>`,
    },
    {
        key: "keywordMostTimeConsuming",
        label: "Keyword Most Time Consuming",
        defaultType: "timeline",
        viewOptions: ["Bar", "Timeline"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Most Time Consuming</h6>
                    <div class="graph-controls">
                        <div class="btn-group">
                            <label class="form-check-label" for="onlyLastRunKeyword">Only Last Run</label>
                        </div>
                        <div class="btn-group form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="onlyLastRunKeyword">
                        </div>
                        <a class="bar-graph information" id="keywordMostTimeConsumingGraphBar"></a>
                        <a class="timeline-graph information" id="keywordMostTimeConsumingGraphTimeline"></a>
                        <a class="fullscreen-graph information" id="keywordMostTimeConsumingFullscreen"></a>
                        <a class="close-graph information" id="keywordMostTimeConsumingClose" hidden></a>
                        <a class="shown-graph information" id="keywordMostTimeConsumingShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="keywordMostTimeConsumingHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <div id="keywordMostTimeConsumingVertical" class="w-100 vertical">
                        <canvas id="keywordMostTimeConsumingGraph"></canvas>
                    </div
                </div>`,
    },
    {
        key: "keywordMostUsed",
        label: "Keyword Most Used",
        defaultType: "timeline",
        viewOptions: ["Bar", "Timeline"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Most Used</h6>
                    <div class="graph-controls">
                        <div class="btn-group">
                            <label class="form-check-label" for="onlyLastRunKeywordMostUsed">Only Last Run</label>
                        </div>
                        <div class="btn-group form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="onlyLastRunKeywordMostUsed">
                        </div>
                        <a class="bar-graph information" id="keywordMostUsedGraphBar"></a>
                        <a class="timeline-graph information" id="keywordMostUsedGraphTimeline"></a>
                        <a class="fullscreen-graph information" id="keywordMostUsedFullscreen"></a>
                        <a class="close-graph information" id="keywordMostUsedClose" hidden></a>
                        <a class="shown-graph information" id="keywordMostUsedShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="keywordMostUsedHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <div id="keywordMostUsedVertical" class="w-100 vertical">
                        <canvas id="keywordMostUsedGraph"></canvas>
                    </div
                </div>`,
    },
    {
        key: "compareStatistics",
        label: "Compare Statistics",
        defaultType: "bar",
        viewOptions: ["Bar"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Statistics</h6>
                    <div class="graph-controls">
                        <a class="bar-graph information" id="compareStatisticsGraphBar"></a>
                        <a class="fullscreen-graph information" id="compareStatisticsFullscreen"></a>
                        <a class="close-graph information" id="compareStatisticsClose" hidden></a>
                        <a class="shown-graph information" id="compareStatisticsShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="compareStatisticsHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <canvas id="compareStatisticsGraph"></canvas>
                </div>`,
    },
    {
        key: "compareSuiteDuration",
        label: "Compare Suite Duration",
        defaultType: "radar",
        viewOptions: ["Radar"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Suite Duration</h6>
                    <div class="graph-controls">
                        <a class="radar-graph information" id="compareSuiteDurationGraphRadar"></a>
                        <a class="fullscreen-graph information" id="compareSuiteDurationFullscreen"></a>
                        <a class="close-graph information" id="compareSuiteDurationClose" hidden></a>
                        <a class="shown-graph information" id="compareSuiteDurationShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="compareSuiteDurationHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <canvas id="compareSuiteDurationGraph"></canvas>
                </div>`,
    },
    {
        key: "compareTests",
        label: "Compare Tests",
        defaultType: "timeline",
        viewOptions: ["Timeline"],
        hasFullscreenButton: true,
        html: `<div class="graph-header">
                    <h6>Tests</h6>
                    <div class="graph-controls">
                        <div class="btn-group">
                            <label class="form-check-label" for="compareNoChanges">Status</label>
                        </div>
                        <div class="btn-group">
                            <select class="form-select form-select-sm" id="compareNoChanges">
                                <option value="All">All</option>
                                <option value="Passed">Passed</option>
                                <option value="Failed">Failed</option>
                                <option value="Skipped">Skipped</option>
                            </select>
                        </div>
                        <div class="btn-group">
                            <label class="form-check-label" for="compareOnlyChanges">Only Changes</label>
                        </div>
                        <div class="btn-group form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="compareOnlyChanges">
                        </div>
                        <a class="timeline-graph information" id="compareTestsGraphTimeline"></a>
                        <a class="fullscreen-graph information" id="compareTestsFullscreen"></a>
                        <a class="close-graph information" id="compareTestsClose" hidden></a>
                        <a class="shown-graph information" id="compareTestsShown" showGraphHidden></a>
                        <a class="hidden-graph information" id="compareTestsHidden" hideGraphHidden></a>
                    </div>
                </div>
                <div class="graph-body">
                    <div id="compareTestsVertical" class="w-100 vertical">
                        <canvas id="compareTestsGraph"></canvas>
                    </div>
                </div>`,
    },
    {
        key: "runTable",
        label: "Table Run",
        defaultType: "table",
        viewOptions: ["Table"],
        hasFullscreenButton: false,
        information: null,
        html: `<div class="col table-section" id="runTableCanvas">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="mb-0">Run Table</h6>
                        <div>
                            <a class="move-up-table information" id="runTableMoveUp" moveUpHidden></a>
                            <a class="move-down-table information" id="runTableMoveDown" moveDownHidden></a>
                            <a class="shown-graph information" id="runTableShown" showGraphHidden></a>
                            <a class="hidden-graph information" id="runTableHidden" hideGraphHidden></a>
                        </div>
                    </div>
                    <table class="table table-striped" id="runTable"></table>
                </div>`,
    },
    {
        key: "suiteTable",
        label: "Table Suite",
        defaultType: "table",
        viewOptions: ["Table"],
        hasFullscreenButton: false,
        information: null,
        html: `<div class="col table-section" id="suiteTableCanvas">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="mb-0">Suite Table</h6>
                        <div>
                            <a class="move-up-table information" id="suiteTableMoveUp" moveUpHidden></a>
                            <a class="move-down-table information" id="suiteTableMoveDown" moveDownHidden></a>
                            <a class="shown-graph information" id="suiteTableShown" showGraphHidden></a>
                            <a class="hidden-graph information" id="suiteTableHidden" hideGraphHidden></a>
                        </div>
                    </div>
                    <table class="table table-striped" id="suiteTable"></table>
                </div>`,
    },
    {
        key: "testTable",
        label: "Table Test",
        defaultType: "table",
        viewOptions: ["Table"],
        hasFullscreenButton: false,
        information: null,
        html: `<div class="col table-section" id="testTableCanvas">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="mb-0">Test Table</h6>
                        <div>
                            <a class="move-up-table information" id="testTableMoveUp" moveUpHidden></a>
                            <a class="move-down-table information" id="testTableMoveDown" moveDownHidden></a>
                            <a class="shown-graph information" id="testTableShown" showGraphHidden></a>
                            <a class="hidden-graph information" id="testTableHidden" hideGraphHidden></a>
                        </div>
                    </div>
                    <table class="table table-striped" id="testTable"></table>
                </div>`,
    },
    {
        key: "keywordTable",
        label: "Table Keyword",
        defaultType: "table",
        viewOptions: ["Table"],
        hasFullscreenButton: false,
        information: null,
        html: `<div class="col table-section" id="keywordTableCanvas">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="mb-0">Keyword Table</h6>
                        <div>
                            <a class="move-up-table information" id="keywordTableMoveUp" moveUpHidden></a>
                            <a class="move-down-table information" id="keywordTableMoveDown" moveDownHidden></a>
                            <a class="shown-graph information" id="keywordTableShown" showGraphHidden></a>
                            <a class="hidden-graph information" id="keywordTableHidden" hideGraphHidden></a>
                        </div>
                    </div>
                    <table class="table table-striped" id="keywordTable"></table>
                </div>`,
    },
];

export { graphMetadata };