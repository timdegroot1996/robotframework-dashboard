*** Settings ***
Documentation    This testsuite covers the generated HTML dashboard of robotdashboard

Resource    ../resources/keywords/dashboard-keywords.resource
Resource    ../resources/keywords/general-keywords.resource

Suite Setup    Start Browser
Suite Teardown    Close Browser
Test Setup    Run Keywords    Generate Dashboard    Open Dashboard
Test Teardown    Run Keywords    Close Dashboard    Remove Database And Dashboard With Index


*** Test Cases ***
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