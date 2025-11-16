*** Settings ***
Library             Browser
Resource            ../../resources/variables/generic-variables.resource

Suite Setup         Start Browser RPG
Suite Teardown      Close Browser RPG

Test Tags           ui


*** Keywords ***
Start Browser RPG
    New Browser    headless=${S_HEADLESS}    browser=${S_BROWSER}
    New Context

Close Browser RPG
    Close Context
    Close Browser
