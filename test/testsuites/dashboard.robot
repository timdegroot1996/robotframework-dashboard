*** Settings ***
Documentation    This testsuite covers the generated HTML dashboard of robotdashboard

Resource    ../resources/keywords/keywords.resource

Suite Setup    Start Browser
Suite Teardown    Close Browser
Test Setup    Run Keywords    Generate Dashboard    Open Dashboard
Test Teardown    Run Keywords    Close Dashboard    Remove Database And Dashboard

*** Test Cases ***
Open Dashboard
    Take Screenshot    fullPage=${True}