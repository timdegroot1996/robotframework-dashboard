*** Settings ***
Resource            ../../resources/keywords/generic-keywords.resource
Resource            ../../resources/keywords/homepage-keywords.resource

Test Setup          Open Test RPG
Test Teardown       Close Test RPG

Test Tags           homepage


*** Test Cases ***
Verify Homepage Components
    Verify Homepage Components

Verify GitHub
    Verify Github Link

Verify API Link
    Verify Api Link

Verify TestCoders Link
    Verify TestCoders Link

Verify Homepage Link
    Verify Homepage Link

Verify Login And Logout
    Log In
    Log Out

Verify Login No Account
    Verify No Account
