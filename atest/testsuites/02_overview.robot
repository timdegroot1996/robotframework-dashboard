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

Validate Overview Page Projects Base View
    Open Overview Page
    Click    selector=id=collapseOtherBody
    Validate Component    id=projectOverview    name=projectBaseView    folder=overview

Validate Overview Page Projects Base View Version Select
    Open Overview Page
    Click    selector=id=OtherVersionFilterBtn
    Click    selector=id=OtherVersionFilterListItem2.3Input
    Click    selector=id=OtherVersionFilterBtn
    Validate Component    id=projectOverview    name=projectBaseViewVersionSelected    folder=overview
    Click    selector=id=collapseOtherBody

Validate Overview Page Use Run Tags
    Open Overview Page
    Click    selector=id=switchRunTags
    Validate Component    id=overviewStatisticsSection    name=runTags    folder=overview

Validate Overview Page Projects Use Run Tags
    Open Overview Page
    Click    selector=id=collapseproject_1Body
    Validate Component    id=projectOverview    name=projectRunTags    folder=overview

Validate Overview Page Projects Version Select Use Run Tags
    Open Overview Page
    Click    selector=id=project_1VersionFilterBtn
    Click    selector=id=project_1VersionFilterListItem2.3Input
    Click    selector=id=project_1VersionFilterListItem1.1Input
    Click    selector=id=project_1VersionFilterBtn
    Validate Component    id=projectOverview    name=projectRunTagsVersionSelect    folder=overview
    Click    selector=id=collapseproject_1Body
