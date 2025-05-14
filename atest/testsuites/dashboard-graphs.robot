*** Settings ***
Documentation    This testsuite covers the generated HTML dashboard of robotdashboard

Resource    ../resources/keywords/dashboard-keywords.resource
Resource    ../resources/keywords/general-keywords.resource

Suite Setup    Start Browser
Suite Teardown    Close Browser
Test Setup    Run Keywords    Generate Dashboard    Open Dashboard
Test Teardown    Run Keywords    Close Dashboard    Remove Database And Dashboard


*** Test Cases ***
Validate dashboard runStatistics
    Validate Graph    canvas=runStatisticsCanvas    graphId=runStatisticsGraphPercentages
    Validate Graph    canvas=runStatisticsCanvas    graphId=runStatisticsGraphAmount    button=${true}
    Validate Graph    canvas=runStatisticsCanvas    graphId=runStatisticsGraphLine    button=${true}

Validate dashboard runDuration
    Validate Graph    canvas=runDurationCanvas    graphId=runDurationGraphLine
    Validate Graph    canvas=runDurationCanvas    graphId=runDurationGraphBar    button=${true}

Validate dashboard suiteStatistics
    Validate Graph    canvas=suiteStatisticsCanvas    graphId=suiteStatisticsGraphPercentages
    Validate Graph    canvas=suiteStatisticsCanvas    graphId=suiteStatisticsGraphAmount    button=${true}
    Validate Graph    canvas=suiteStatisticsCanvas    graphId=suiteStatisticsGraphLine    button=${true}

Validate dashboard suiteDuration
    Validate Graph    canvas=suiteDurationCanvas    graphId=suiteDurationGraphLine
    Validate Graph    canvas=suiteDurationCanvas    graphId=suiteDurationGraphBar    button=${true}

Validate dashboard suiteMostFailed
    Validate Graph    canvas=suiteMostFailedCanvas    graphId=suiteMostFailedGraphBar
    Validate Graph    canvas=suiteMostFailedCanvas    graphId=suiteMostFailedGraphTimeline    button=${true}

Validate dashboard testStatistics
    Validate Graph    canvas=testStatisticsCanvas    graphId=testStatisticsGraph

Validate dashboard testDuration
    Validate Graph    canvas=testDurationCanvas    graphId=testDurationGraphLine
    Validate Graph    canvas=testDurationCanvas    graphId=testDurationGraphBar    button=${true}

Validate dashboard testDurationDeviation
    Validate Graph    canvas=testDurationDeviationCanvas    graphId=testDurationDeviation

Validate dashboard testMessages
    Validate Graph    canvas=testMessagesCanvas    graphId=testMessagesGraphTimeline
    Validate Graph    canvas=testMessagesCanvas    graphId=testMessagesGraphBar    button=${true}

Validate dashboard testMostFlaky
    Validate Graph    canvas=testMostFlakyCanvas    graphId=testMostFlakyGraphTimeline
    Validate Graph    canvas=testMostFlakyCanvas    graphId=testMostFlakyGraphBar    button=${true}

Validate dashboard testRecentMostFlaky
    Validate Graph    canvas=testRecentMostFlakyCanvas    graphId=testRecentMostFlakyGraphTimeline
    Validate Graph    canvas=testRecentMostFlakyCanvas    graphId=testRecentMostFlakyGraphBar    button=${true}

Validate dashboard testMostFailed
    Validate Graph    canvas=testMostFailedCanvas    graphId=testMostFailedGraphTimeline
    Validate Graph    canvas=testMostFailedCanvas    graphId=testMostFailedGraphBar    button=${true}

Validate dashboard testRecentMostFailed
    Validate Graph    canvas=testRecentMostFailedCanvas    graphId=testRecentMostFailedGraphTimeline
    Validate Graph    canvas=testRecentMostFailedCanvas    graphId=testRecentMostFailedGraphBar    button=${true}

Validate dashboard keywordStatistics
    Validate Graph    canvas=keywordStatisticsCanvas    graphId=keywordStatisticsGraphPercentages
    Validate Graph    canvas=keywordStatisticsCanvas    graphId=keywordStatisticsGraphAmount    button=${true}
    Validate Graph    canvas=keywordStatisticsCanvas    graphId=keywordStatisticsGraphLine    button=${true}

Validate dashboard keywordTimesRun
    Validate Graph    canvas=keywordTimesRunCanvas    graphId=keywordTimesRunGraphBar
    Validate Graph    canvas=keywordTimesRunCanvas    graphId=keywordTimesRunGraphLine    button=${true}

Validate dashboard keywordTotalDuration
    Validate Graph    canvas=keywordTotalDurationCanvas    graphId=keywordTotalDurationGraphLine
    Validate Graph    canvas=keywordTotalDurationCanvas    graphId=keywordTotalDurationGraphBar    button=${true}

Validate dashboard keywordAverageDuration
    Validate Graph    canvas=keywordAverageDurationCanvas    graphId=keywordAverageDurationGraphLine
    Validate Graph    canvas=keywordAverageDurationCanvas    graphId=keywordAverageDurationGraphBar    button=${true}

Validate dashboard minDuration
    Validate Graph    canvas=keywordMinDurationCanvas    graphId=keywordMinDurationGraphBar
    Validate Graph    canvas=keywordMinDurationCanvas    graphId=keywordMinDurationGraphLine    button=${true}

Validate dashboard maxDuration
    Validate Graph    canvas=keywordMaxDurationCanvas    graphId=keywordMaxDurationGraphBar
    Validate Graph    canvas=keywordMaxDurationCanvas    graphId=keywordMaxDurationGraphLine    button=${true}
