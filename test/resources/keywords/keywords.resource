*** Settings ***
Library    OperatingSystem
Library    Browser


*** Keywords ***
Generate Dashboard
    ${result}    Run    command=robotdashboard -f ${CURDIR}/../outputs:dev:prod -n robot_dashboard.html

Remove Database And Dashboard
    ${files}    List Files In Directory    path=${CURDIR}/../../..
    FOR    ${file}    IN    @{files}
        IF    'robot' in $file and ('.db' in $file or '.html' in $file)
            Remove File    path=${file}
        END
    END

Validate CLI
    [Arguments]    ${command}    ${expected}=${NONE}
    ${result}    Run    command=${command}
    IF    '${expected}' != '${NONE}'
        ${expected}    Get File    path=${CURDIR}/../resources/cli_output/${expected}.txt
        Should Match    string=${result}    pattern=${expected}
    END

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