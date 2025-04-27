*** Settings ***
Library    OperatingSystem


*** Keywords ***
Generate Dashboard
    ${output}    Run    command=robotdashboard -f ${CURDIR}/../outputs:dev:prod -n robot_dashboard.html
    Log    ${output}

Remove Database And Dashboard
    ${files}    List Files In Directory    path=${CURDIR}/../../..
    FOR    ${file}    IN    @{files}
        IF    'robot' in $file and ('.db' in $file or '.html' in $file)
            Remove File    path=${file}
        END
    END
