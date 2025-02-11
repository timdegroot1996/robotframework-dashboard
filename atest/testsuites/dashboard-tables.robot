*** Settings ***
Documentation    This testsuite covers the generated HTML dashboard of robotdashboard

Resource    ../resources/keywords/dashboard-keywords.resource
Resource    ../resources/keywords/general-keywords.resource

Suite Setup    Start Browser
Suite Teardown    Close Browser
Test Setup    Run Keywords    Generate Dashboard    Open Dashboard
Test Teardown    Run Keywords    Close Dashboard    Remove Database And Dashboard


*** Test Cases ***
Validate dashboard runTable
    Validate Table    tableId=runTable

Validate dashboard suiteTable
    Validate Table    tableId=suiteTable

Validate dashboard testTable
    Validate Table    tableId=testTable

Validate dashboard keywordTable
    Validate Table    tableId=keywordTable
