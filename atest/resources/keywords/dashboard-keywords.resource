*** Settings ***
Library    Browser
Library    ImageCompare


*** Keywords ***
Start Browser
    New Browser    browser=chromium    headless=True
    New Context    colorScheme=dark    viewport={"width": 1920, "height": 1080}

Close Browser
    Close Context
    Close Page

Open Dashboard
    New Page    url=${CURDIR}/../../../robot_dashboard.html

Close Dashboard
    Close Page

Validate Screenshot
    [Arguments]    ${screenshot}    ${reference}
    Compare Images    reference_image=${CURDIR}/../dashboard_output/${reference}.png
    ...    test_image=${CURDIR}/../../../results/browser/screenshot/${screenshot}.png

Validate Graph
    [Arguments]    ${canvas}    ${graphId}    ${button}=${False}
    IF    ${button}
        Click    selector=id=${graphId}
        Sleep    100ms
    END
    ${boundingBox}    Get BoundingBox    selector=id=${graphId}
    Take Screenshot    filename=${graphId}    selector=id=${canvas}
    Validate Screenshot    screenshot=${graphId}    reference=${graphId}
