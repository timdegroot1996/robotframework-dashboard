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

Validate Dashboard Suite Statistics
    Validate Graph    canvas=suiteStatisticsCanvas    graphId=suiteStatisticsGraphBarPercentages
    Validate Graph    canvas=suiteStatisticsCanvas    graphId=suiteStatisticsGraphBarAmount    button=${true}
    Validate Graph    canvas=suiteStatisticsCanvas    graphId=suiteStatisticsGraphLine    button=${true}

Validate Dashboard Test Statistics
    Validate Graph    canvas=testStatusCanvas    graphId=testStatusGraph

Validate Dashboard Keyword Statistics
    Validate Graph    canvas=keywordStatisticsCanvas    graphId=keywordStatisticsGraphBarPercentages
    Validate Graph    canvas=keywordStatisticsCanvas    graphId=keywordStatisticsGraphBarAmount    button=${true}
    Validate Graph    canvas=keywordStatisticsCanvas    graphId=keywordStatisticsGraphLine    button=${true}
