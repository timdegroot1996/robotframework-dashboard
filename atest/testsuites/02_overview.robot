*** Settings ***
Documentation    This testsuite covers the generated HTML dashboard of robotdashboard
...              And specifically the overview page

Resource    ../resources/keywords/dashboard-keywords.resource
Resource    ../resources/keywords/general-keywords.resource

Suite Setup    Start Browser
Suite Teardown    Stop Browser
Test Setup    Run Keywords    Generate Dashboard    Open Dashboard
Test Teardown    Run Keywords    Close Dashboard    Remove Database And Dashboard With Index


*** Test Cases ***
Validate Overview Page Base View
    Open Overview Page
    Validate Component    id=overviewStatisticsSection    name=baseView    folder=overview

Validate Overview Page Use Run Tags
    Open Overview Page
    Click    selector=id=switchRunTags
    Validate Component    id=overviewStatisticsSection    name=runTags    folder=overview
