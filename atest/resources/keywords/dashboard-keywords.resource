*** Settings ***
Library    String
Library    Browser
Library    DocTest.VisualTest


*** Keywords ***
Start Browser
    New Browser    browser=chromium    headless=${True}
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
    IF    'run' in $reference    VAR    ${folder}    run
    IF    'suite' in $reference    VAR    ${folder}    suite
    IF    'test' in $reference    VAR    ${folder}    test
    IF    'keyword' in $reference    VAR    ${folder}    keyword
    IF    'filter' in $reference    VAR    ${folder}    filter
    VAR    ${reference}    ${CURDIR}/../dashboard_output/${folder}/${reference}.png
    VAR    ${screenshot}    ${CURDIR}/../../../results/browser/screenshot/${screenshot}.png
    Compare Images    reference_image=${reference}    test_image=${screenshot}    threshold=0.01

Validate Graph
    [Arguments]    ${canvas}    ${graphId}    ${button}=${False}
    IF    ${button}
        Click    selector=id=${graphId}
        Sleep    time_=200ms
    END
    Take Screenshot    filename=${graphId}    selector=id=${canvas}
    Validate Screenshot    screenshot=${graphId}    reference=${graphId}
    ${fullscreenButton}    Replace String    string=${canvas}    search_for=Canvas    replace_with=Fullscreen
    Click    selector=id=${fullscreenButton}
    Take Screenshot    filename=${graphId}Fullscreen    selector=id=${canvas}
    Validate Screenshot    screenshot=${graphId}Fullscreen    reference=${graphId}Fullscreen
    ${closeButton}    Replace String    string=${canvas}    search_for=Canvas    replace_with=Close
    Click    selector=id=${closeButton}
    Validate Screenshot    screenshot=${graphId}    reference=${graphId}

Validate Table
    [Arguments]    ${tableId}    ${collapseButtonId}
    Click    selector=id=${collapseButtonId}
    Sleep    time_=200ms
    Take Screenshot    filename=${tableId}    selector=id=${tableId}
    Validate Screenshot    screenshot=${tableId}    reference=${tableId}

Validate Run Filter
    [Arguments]    ${option}
    Select Options By    id=runs    value    ${option}
    Take Screenshot    filename=filterRuns${option}    fullPage=${True}
    Validate Screenshot    screenshot=filterRuns${option}    reference=filterRuns${option}

Validate Run Tag Filter
    [Arguments]    ${option}
    Click    selector=id=selectRunTags
    IF    '${option}' == 'All'
        Check Checkbox    selector=id=All
        Uncheck Checkbox    selector=id=prod
        Uncheck Checkbox    selector=id=dev
    ELSE IF    '${option}' == 'prod'
        Uncheck Checkbox    selector=id=All
        Check Checkbox    selector=id=prod
        Uncheck Checkbox    selector=id=dev
    ELSE IF    '${option}' == 'dev'
        Uncheck Checkbox    selector=id=All
        Uncheck Checkbox    selector=id=prod
        Check Checkbox    selector=id=dev
    END
    Click    selector=id=selectRunTags
    Sleep    time_=1s
    Take Screenshot    filename=filterRunTags${option}    fullPage=${True}
    Validate Screenshot    screenshot=filterRunTags${option}    reference=filterRunTags${option}
