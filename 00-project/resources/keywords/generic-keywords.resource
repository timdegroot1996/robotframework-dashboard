*** Settings ***
Library     Browser
Resource    ../variables/generic-variables.resource
Resource    ../variables/homepage-variables.resource


*** Keywords ***
Open Test RPG
    [Documentation]    Opens a new tab, used in every test
    New Page    url=${S_URL}

Close Test RPG
    [Documentation]    Closes the tab at the end of every test
    Close Page

Open Character Page
    [Documentation]    Navigate from the homepage to the character page
    Click    selector=${L_RPG_HOMEPAGE_PLAY}
