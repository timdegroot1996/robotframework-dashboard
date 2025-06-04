*** Settings ***
Documentation    This testsuite covers the generated HTML dashboard of robotdashboard

Resource    ../resources/keywords/dashboard-keywords.resource
Resource    ../resources/keywords/general-keywords.resource

Suite Setup    Start Browser
Suite Teardown    Close Browser
Test Setup    Run Keywords    Generate Dashboard    Open Dashboard
Test Teardown    Run Keywords    Close Dashboard    Remove Database And Dashboard With Index


*** Test Cases ***
Validate dashboard runStatistics
    Validate Graph    canvas=runStatisticsCanvas    graphId=runStatisticsGraphPercentages
    Validate Graph    canvas=runStatisticsCanvas    graphId=runStatisticsGraphAmount    button=${true}
    Validate Graph    canvas=runStatisticsCanvas    graphId=runStatisticsGraphLine    button=${true}

Validate dashboard runDonut
    Validate Graph    canvas=runDonutCanvas    graphId=runDonutGraph

Validate dashboard runDuration
    Validate Graph    canvas=runDurationCanvas    graphId=runDurationGraphLine
    Validate Graph    canvas=runDurationCanvas    graphId=runDurationGraphBar    button=${true}

Validate dashboard runHeatmap
    Validate Graph    canvas=runHeatmapCanvas    graphId=runHeatmapGraph
