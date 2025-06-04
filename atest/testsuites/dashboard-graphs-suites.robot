*** Settings ***
Documentation    This testsuite covers the generated HTML dashboard of robotdashboard

Resource    ../resources/keywords/dashboard-keywords.resource
Resource    ../resources/keywords/general-keywords.resource

Suite Setup    Start Browser
Suite Teardown    Close Browser
Test Setup    Run Keywords    Generate Dashboard    Open Dashboard
Test Teardown    Run Keywords    Close Dashboard    Remove Database And Dashboard With Index


*** Test Cases ***
Validate dashboard suiteFolderDonut
    Validate Graph    canvas=suiteFolderDonutCanvas    graphId=suiteFolderDonutGraph

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