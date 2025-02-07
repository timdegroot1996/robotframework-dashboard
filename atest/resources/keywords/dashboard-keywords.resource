*** Settings ***
Library    Browser
Library    ImageCompare


*** Keywords ***
Start Browser
    New Browser    browser=chromium    headless=False
    New Context    colorScheme=dark

Close Browser
    Close Context
    Close Page

Open Dashboard
    New Page    url=${CURDIR}/../../../robot_dashboard.html

Close Dashboard
    Close Page

Validate Image
    [Arguments]    ${screenshot}    ${reference}
    Compare Images    reference_image=${CURDIR}/../dashboard_output/${reference}.png
    ...    test_image=${CURDIR}/../../../results/browser/screenshot/${screenshot}.png
