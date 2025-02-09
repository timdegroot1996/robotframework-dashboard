*** Settings ***
Documentation    This testsuite covers the generated HTML dashboard of robotdashboard

Resource    ../resources/keywords/dashboard-keywords.resource
Resource    ../resources/keywords/general-keywords.resource

Suite Setup    Start Browser
Suite Teardown    Close Browser
Test Setup    Run Keywords    Generate Dashboard    Open Dashboard
Test Teardown    Run Keywords    Close Dashboard    Remove Database And Dashboard


*** Test Cases ***
Validate Dashboard Run Statistics
    Validate Graph    canvas=runStatisticsCanvas    graphId=runStatisticsGraphBarPercentages
    Validate Graph    canvas=runStatisticsCanvas    graphId=runStatisticsGraphBarAmount    button=${true}
    Validate Graph    canvas=runStatisticsCanvas    graphId=runStatisticsGraphLine    button=${true}

Validate Dashboard Run Duration
    Validate Graph    canvas=runDurationCanvas    graphId=runDurationGraphBar
    Validate Graph    canvas=runDurationCanvas    graphId=runDurationGraphLine    button=${true}

Validate Dashboard Suite Statistics
    Validate Graph    canvas=suiteStatisticsCanvas    graphId=suiteStatisticsGraphBarPercentages
    Validate Graph    canvas=suiteStatisticsCanvas    graphId=suiteStatisticsGraphBarAmount    button=${true}
    Validate Graph    canvas=suiteStatisticsCanvas    graphId=suiteStatisticsGraphLine    button=${true}

Validate Dashboard Suite Duration
    Validate Graph    canvas=suiteDurationCanvas    graphId=suiteDurationGraphBar
    Validate Graph    canvas=suiteDurationCanvas    graphId=suiteDurationGraphLine    button=${true}

Validate Dashboard Suite Most Failed
    Validate Graph    canvas=suiteMostFailedCanvas    graphId=suiteMostFailedGraphBar
    Validate Graph    canvas=suiteMostFailedCanvas    graphId=suiteMostFailedGraphTimeline    button=${true}

Validate Dashboard Test Statistics
    Validate Graph    canvas=testStatusCanvas    graphId=testStatusGraph

Validate Dashboard Test Duration
    Validate Graph    canvas=testDurationCanvas    graphId=testDurationGraphBar
    Validate Graph    canvas=testDurationCanvas    graphId=testDurationGraphLine    button=${true}

Validate Dashboard Test Most Failed
    Validate Graph    canvas=testMostFailedCanvas    graphId=testMostFailedGraphBar
    Validate Graph    canvas=testMostFailedCanvas    graphId=testMostFailedGraphTimeline    button=${true}

Validate Dashboard Test Top 10 Fail Messages
    Validate Graph    canvas=testMessagesCanvas    graphId=testMessagesGraphBar
    Validate Graph    canvas=testMessagesCanvas    graphId=testMessagesGraphTimeline    button=${true}

Validate Dashboard Keyword Statistics
    Validate Graph    canvas=keywordStatisticsCanvas    graphId=keywordStatisticsGraphBarPercentages
    Validate Graph    canvas=keywordStatisticsCanvas    graphId=keywordStatisticsGraphBarAmount    button=${true}
    Validate Graph    canvas=keywordStatisticsCanvas    graphId=keywordStatisticsGraphLine    button=${true}

Validate Dashboard Keyword Times Run
    Validate Graph    canvas=keywordTimesRunCanvas    graphId=keywordTimesRunGraphBar
    Validate Graph    canvas=keywordTimesRunCanvas    graphId=keywordTimesRunGraphLine    button=${true}

Validate Dashboard Keyword Total Duration
    Validate Graph    canvas=keywordTotalDurationCanvas    graphId=keywordTotalDurationGraphBar
    Validate Graph    canvas=keywordTotalDurationCanvas    graphId=keywordTotalDurationGraphLine    button=${true}

Validate Dashboard Keyword Average Duration
    Validate Graph    canvas=keywordAverageDurationCanvas    graphId=keywordAverageDurationGraphBar
    Validate Graph    canvas=keywordAverageDurationCanvas    graphId=keywordAverageDurationGraphLine    button=${true}

Validate Dashboard Keyword Min Duration
    Validate Graph    canvas=keywordMinDurationCanvas    graphId=keywordMinDurationGraphBar
    Validate Graph    canvas=keywordMinDurationCanvas    graphId=keywordMinDurationGraphLine    button=${true}

Validate Dashboard Keyword Max Duration
    Validate Graph    canvas=keywordMaxDurationCanvas    graphId=keywordMaxDurationGraphBar
    Validate Graph    canvas=keywordMaxDurationCanvas    graphId=keywordMaxDurationGraphLine    button=${true}
