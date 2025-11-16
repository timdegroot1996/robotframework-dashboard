*** Settings ***
Library     Browser
Resource    ../variables/homepage-variables.resource


*** Keywords ***
Verify Homepage Components
    [Documentation]    Validates the most important homepage components
    Wait For Elements State    selector=${L_RPG_HOMEPAGE_HERO}
    Wait For Elements State    selector=${L_RPG_HOMEPAGE_LINKS}
    Wait For Elements State    selector=${L_RPG_HOMEPAGE_PLAY}
    Wait For Elements State    selector=${L_RPG_HOMEPAGE_GITHUB}
    Wait For Elements State    selector=${L_RPG_HOMEPAGE_LOGIN}
    Wait For Elements State    selector=${L_RPG_HOMEPAGE_LINK}
    Wait For Elements State    selector=${L_RPG_HOMEPAGE_TESTCODERS}
    Wait For Elements State    selector=${L_RPG_HOMEPAGE_API_ENDPOINTS}

Verify GitHub Link
    [Documentation]    Validates the GitHub page button works and the page is opened correctly
    Click    selector=${L_RPG_HOMEPAGE_GITHUB}
    Switch Page    id=NEW
    Wait For Elements State    selector=${L_GITHUB_HOMEPAGE}

Verify API Link
    [Documentation]    Validates the API page button works and the page is opened correctly
    Click    selector=${L_RPG_HOMEPAGE_API_ENDPOINTS}
    Wait For Elements State    selector=${L_RPG_HOMEPAGE_HERO}
    Wait For Elements State    selector=${L_API_PAGE_GET}
    Wait For Elements State    selector=${L_API_PAGE_POST}

Verify TestCoders Link
    [Documentation]    Validates the TestCoders page button works and the page is opened correctly
    Click    selector=${L_RPG_HOMEPAGE_TESTCODERS}
    Switch Page    id=NEW
    Wait For Elements State    selector=${L_TESTCODERS_HOMEPAGE}

Verify Homepage Link
    [Documentation]    Validates the homepage button works and the page is opened correctly
    Click    selector=${L_RPG_HOMEPAGE_PLAY}
    Click    selector=${L_RPG_HOMEPAGE_LINK}
    Wait For Elements State    selector=${L_RPG_HOMEPAGE_GITHUB}

Log In
    [Documentation]    Validates the login button works correctly
    Click    selector=${L_RPG_HOMEPAGE_LOGIN}
    Fill Text    selector=${L_LOGIN_EMAIL}    txt=some-email@test.com
    Fill Text    selector=${L_LOGIN_PASSWORD}    txt=verystrongpassword
    Click    selector=${L_LOGIN_BUTTON}
    Wait For Elements State    selector=${L_RPG_HOMEPAGE_LOGOUT}

Log Out
    [Documentation]    Validates the logout button works correctly
    Click    selector=${L_RPG_HOMEPAGE_LOGOUT}
    Wait For Elements State    selector=${L_RPG_HOMEPAGE_LOGIN}

Verify No Account
    [Documentation]    Validates the login button gives the correct messages when used incorrectly
    Click    selector=${L_RPG_HOMEPAGE_LOGIN}
    Click    selector=${L_LOGIN_BUTTON}
    Wait For Elements State    selector=${L_LOGIN_EMAIL_LABEL}
    Wait For Elements State    selector=${L_LOGIN_EMAIL_REQUIRED}
    Wait For Elements State    selector=${L_LOGIN_PASSWORD_LABEL}
    Wait For Elements State    selector=${L_LOGIN_PASSWORD_REQUIRED}
