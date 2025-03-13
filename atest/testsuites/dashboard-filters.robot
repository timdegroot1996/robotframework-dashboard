*** Settings ***
Documentation    This testsuite covers the generated HTML dashboard of robotdashboard

Resource    ../resources/keywords/dashboard-keywords.resource
Resource    ../resources/keywords/general-keywords.resource

Suite Setup    Start Browser
Suite Teardown    Close Browser
Test Setup    Run Keywords    Generate Dashboard    Open Dashboard
Test Teardown    Run Keywords    Close Dashboard    Remove Database And Dashboard


*** Test Cases ***
Validate dashboard runs filter
    Validate Run Filter    option=Tests
    Validate Run Filter    option=Testsuites
    Validate Run Filter    option=Other
    Validate Run Filter    option=All

Validate dashboard run tags filter
    Validate Run Tag Filter    option=dev
    Validate Run Tag Filter    option=prod
    Validate Run Tag Filter    option=All
