*** Settings ***
Library     String
Library     Browser
Resource    ../variables/generic-variables.resource
Resource    ../variables/character-variables.resource


*** Keywords ***
Verify Character Components
    [Documentation]    Validates the most important character page components
    Wait For Elements State    selector=${L_CHARACTER_CARD}
    Wait For Elements State    selector=${L_CHARACTER_INPUT}
    Wait For Elements State    selector=${L_CHARACTER_DESCRIPTION}
    Wait For Elements State    selector=${L_CHARACTER_DETAILS}
    Wait For Elements State    selector=${L_CHARACTER_IMAGE}
    Wait For Elements State    selector=${L_START_GAME}

Select Build
    [Documentation]    Select a build, parameter build that should match case sensitive to the options
    [Arguments]    ${build}
    Click    selector=${L_CHARACTER_BUILD_SELECTION}
    ${build}    Format String    ${L_CHARACTER_BUILD_OPTION}    build=${build}
    Click    ${build}

Verify Character
    [Documentation]    Validates the stats, levels and description of the build based on the level and values in generic.variables
    [Arguments]    ${build}    ${level}=1
    ${stats}    Get Text    selector=${L_CHARACTER_DESCRIPTION}
    Should Be Equal As Strings    first=${stats}    second=A level ${level} ${build}
    FOR    ${stat}    IN    @{S_STATS}
        Verify Stat And Bar    build=${build}    stat=${stat}    level=${level}
    END

Verify Stat And Bar
    [Documentation]    Validates the stat and bar are correctly shown on the page
    [Arguments]    ${build}    ${stat}    ${level}
    ${level}    Convert To Integer    ${level}
    VAR    ${stat_value}    ${S_BUILDS}[${build}][${stat}]
    ${stat_value}    Convert To Integer    ${stat_value}
    ${stat_value}    Evaluate    ${stat_value} + ${level} - 1
    ${stat_locator}    Format String    ${L_CHARACTER_${stat}_STAT}    ${stat}=${stat_value}
    Wait For Elements State    selector=${stat_locator}
    ${bar_value}    Evaluate    (10 - ${stat_value}) * 10
    IF    ${bar_value} > 0    VAR    ${bar_value}    -${bar_value}
    ${bar_locator}    Format String    ${L_CHARACTER_${stat}_BAR}    value=${bar_value}
    Wait For Elements State    selector=${bar_locator}

Enter Name
    [Documentation]    Enter a name with parameter name and validate that it has been updated in the stats card
    [Arguments]    ${name}
    Fill Text    selector=${L_CHARACTER_NAME_INPUT}    txt=${name}
    ${locator}    Format String    ${L_CHARACTER_NAME}    name=${name}
    Wait For Elements State    selector=${locator}

Verify Name Too ${value}
    [Documentation]    Validates the error message for incorrect names are shown correctly
    Click    selector=${L_START_GAME}
    Wait For Elements State    selector=${L_CHARACTER_NAME_LABEL}
    Wait For Elements State    selector=${L_CHARACTER_NAME_${value}}
