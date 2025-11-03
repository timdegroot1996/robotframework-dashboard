*** Settings ***
Library    String
Library    Browser
Library    DocTest.VisualTest
Resource    ../variables/variables.resource


*** Variables ***
${ROOT_FOLDER}    ${CURDIR}/../../..
${SCREENSHOT_FOLDER}    ${ROOT_FOLDER}/results/browser/screenshot
${REFERENCE_FOLDER}    ${CURDIR}/../dashboard_output


*** Keywords ***
Start Browser
    New Browser    browser=chromium    headless=${True}

Stop Browser
    Close Browser

Open Dashboard
    New Context    colorScheme=dark    viewport={"width": 1920, "height": 1080}
    New Page    url=${ROOT_FOLDER}/robotdashboard_${DASHBOARD_INDEX}.html
    Wait For Elements State    selector=id=loading    state=hidden
    Click    selector=id=settings
    Fill Text    selector=id=toggleAnimationDuration    txt=0
    Click    selector=id=closeSettings
    Wait For Elements State    selector=id=loading    state=hidden

Close Dashboard
    Close Page
    Close Context

Open Overview Page
    Click    selector=id=menuOverview
    Wait For Elements State    selector=id=overviewStatisticsSection

Open Compare Page
    Click    selector=id=menuCompare
    Wait For Elements State    selector=id=compareStatisticsSection

Open Tables Page
    Click    selector=id=menuTables
    Wait For Elements State    selector=id=tablesStatisticsSection

Validate Screenshot
    [Arguments]    ${screenshot}    ${reference}    ${folder}
    VAR    ${reference}    ${REFERENCE_FOLDER}/${folder}/${reference}.png
    VAR    ${screenshot}    ${SCREENSHOT_FOLDER}/${screenshot}.png
    Compare Images    reference_image=${reference}    candidate_image=${screenshot}    threshold=0.05   # 95% accuracy

Validate Component
    [Arguments]    ${id}    ${name}    ${folder}
    Sleep    time_=200ms
    Take Screenshot    filename=${SCREENSHOT_FOLDER}/${name}    selector=id=${id}
    Validate Screenshot    screenshot=${name}    reference=${name}    folder=${folder}
