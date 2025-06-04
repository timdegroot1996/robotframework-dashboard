*** Settings ***
Documentation    This testsuite covers the generated HTML dashboard of robotdashboard

Resource    ../resources/keywords/dashboard-keywords.resource
Resource    ../resources/keywords/general-keywords.resource

Suite Setup    Start Browser
Suite Teardown    Close Browser
Test Setup    Run Keywords    Generate Dashboard    Open Dashboard
Test Teardown    Run Keywords    Close Dashboard    Remove Database And Dashboard With Index


*** Test Cases ***
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

Validate dashboard keywordMostFailed
    Skip    msg=This test has some issues with the vertical, unclear why
    Validate Graph    canvas=keywordMostFailedCanvas    graphId=keywordMostFailedGraphBar
    Validate Graph    canvas=keywordMostFailedCanvas    graphId=keywordMostFailedGraphTimeline    button=${true}
