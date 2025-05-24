*** Settings ***
Library    OperatingSystem


*** Variables ***
${SCREENSHOT_FOLDER}    ${CURDIR}/../../results/browser/screenshot
${REFERENCE_FOLDER}    ${CURDIR}/../resources/dashboard_output


*** Tasks ***
Move Filter Screenshots
    Remove Old Files   type=filter
    Copy New Files    type=filter

Move Run Screenshots
    Remove Old Files   type=run
    Copy New Files    type=run

Move Suite Screenshots
    Remove Old Files   type=suite
    Copy New Files    type=suite

Move Test Screenshots
    Remove Old Files   type=test
    Copy New Files    type=test

Move Keyword Screenshots
    Remove Old Files   type=keyword
    Copy New Files    type=keyword


*** Keywords ***
Remove Old Files
    [Arguments]    ${type}
    ${old_files}    List Files In Directory    path=${REFERENCE_FOLDER}/${type}
    FOR    ${file}    IN    @{old_files}
        Remove File    path=${file}
        Log To Console    message=Deleted ${file}
    END

Copy New Files
    [Arguments]    ${type}
    ${new_files}    List Files In Directory    path=${SCREENSHOT_FOLDER}
    FOR    ${file}    IN    @{new_files}
        IF    $type in $file
            Move File    source=${SCREENSHOT_FOLDER}/${file}    destination=${REFERENCE_FOLDER}/${type}
            Log To Console    message=Moved ${file}
        END
    END
