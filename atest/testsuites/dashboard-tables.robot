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
    Validate Table    tableId=runTableCanvas    collapseButtonId=runChevronButton2

Validate dashboard suiteTable
    Validate Table    tableId=suiteTableCanvas    collapseButtonId=suiteChevronButton3

Validate dashboard testTable
    Validate Table    tableId=testTableCanvas    collapseButtonId=testChevronButton5

Validate dashboard keywordTable
    Validate Table    tableId=keywordTableCanvas    collapseButtonId=keywordChevronButton4
