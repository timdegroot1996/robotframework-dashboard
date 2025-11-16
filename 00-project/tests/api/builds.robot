*** Settings ***
Resource        ../../resources/keywords/api-keywords.resource

Test Tags       api


*** Test Cases ***
Verify Get All Builds
    Get All Builds

Verify get thief build
    Get Specific Build    build=thief

Verify get knight build
    Get Specific Build    build=knights

Verify get mage build
    Get Specific Build    build=mage

Verify get brigadier build
    Get Specific Build    build=brigadiers

Verify get warrior build
    Get Specific Build    build=warrior    unknown_build=${True}

Verify post random build
    Post Build    name=random

Verify post existing name
    Post Build    name=random existing
    ...    error=a build with this name already exists

Verify post level too high
    Post Build    name=random    strength=1    agility=1    wisdom=1    magic=20
    ...    error=Magic can't be higher than 10

Verify post over maximum level
    Post Build    name=random    strength=3    agility=3    wisdom=3    magic=3
    ...    error=Total value of stats cannot be more than 10

*** Keywords ***
log some shit
    Log    message=some shit