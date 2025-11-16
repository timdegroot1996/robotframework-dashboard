*** Settings ***
Library     Browser
Resource    ../../resources/keywords/character-keywords.resource
Resource    ../variables/adventure-variables.resource
Resource    ../variables/homepage-variables.resource


*** Keywords ***
log some shit
    Log    message=some shit

Start Adventure
    [Documentation]   Open the adventure page with the chosen name and build
    [Arguments]    ${name}    ${build}
    Click    selector=${L_RPG_HOMEPAGE_PLAY}
    Enter Name    ${name}
    Select Build    ${build}
    Click    selector=${L_START_GAME}

Verify Adventure Components
    [Documentation]    Validates the most important adventure page components
    Wait For Elements State    selector=${L_CHARACTER_CARD}
    Wait For Elements State    selector=${L_CHARACTER_DESCRIPTION}
    Wait For Elements State    selector=${L_CHARACTER_DETAILS}
    Wait For Elements State    selector=${L_ADVENTURE_CONTAINER}
    Wait For Elements State    selector=${L_ADVENTURE_CLICKER}
    Wait For Elements State    selector=${L_ADVENTURE_UPLOADER}
    Wait For Elements State    selector=${L_ADVENTURE_TYPER}
    Wait For Elements State    selector=${L_ADVENTURE_SLIDER}

Play Clicker
    [Documentation]    Validate and play with the clicker, parameter times to handle how many times is clicked
    [Arguments]    ${times}
    FOR    ${time}    IN RANGE    0    ${times}
        Click    selector=${L_ADVENTURE_CLICKER_BUTTON}
    END
    Wait For Elements State    selector=${L_ADVENTURE_CLICKER_SUCCESS}

Play Uploader
    [Documentation]    Validate and play with the uploader, parameter file which is a path relative from the resources folder
    [Arguments]    ${file}
    Upload File By Selector    selector=${L_ADVENTURE_UPLOAD_BUTTON}    path=${CURDIR}/../${file}
    Wait For Elements State    selector=${L_ADVENTURE_UPLOADER_SUCCESS}

Play Typer
    [Documentation]    Validate and play with the uploader, parameter text to determine input into the field
    [Arguments]    ${text}
    Fill Text    selector=${L_ADVENTURE_TYPER_INPUT}    txt=${text}
    Wait For Elements State    selector=${L_ADVENTURE_TYPER_SUCCESS}

Play Slider
    [Documentation]    Validate and play with the uploader, parameter percentage to determine how far the slider goes
    [Arguments]    ${percentage}
    Move Slider    steps=${percentage}
    Wait For Elements State    selector=${L_ADVENTURE_SLIDER_SUCCESS}

Move Slider
    [Documentation]    Calculates the sliding movement of the mouse
    [Arguments]    ${steps}
    ${width}    Get Bounding Box    ${L_ADVENTURE_SLIDER_INPUT}    width
    ${max}    Get Attribute    ${L_ADVENTURE_SLIDER_INPUT_HANDLER}    aria-valuemax
    Hover    ${L_ADVENTURE_SLIDER_INPUT_HANDLER}
    Mouse Button    Down
    Mouse Move Relative To    ${L_ADVENTURE_SLIDER_INPUT_HANDLER}    ${{(${width} / ${max}) * ${steps}}}
    Mouse Button    Up

Verify Victory
    [Documentation]    Validates the game has been completed and the play again button works
    Wait For Elements State    selector=${L_ADVENTURE_HIGHEST_LEVEL}
    Click    selector=${L_ADVENTURE_PLAY_AGAIN}
    Wait For Elements State    selector=${L_CHARACTER_CARD}
    Wait For Elements State    selector=${L_CHARACTER_INPUT}
