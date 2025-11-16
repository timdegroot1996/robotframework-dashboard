*** Settings ***
Resource            ../../resources/keywords/generic-keywords.resource
Resource            ../../resources/keywords/homepage-keywords.resource
Resource            ../../resources/keywords/character-keywords.resource

Test Setup          Run Keywords    Open Test Rpg    Open Character Page
Test Teardown       Close Test RPG

Test Tags           character


*** Test Cases ***
Verify Character Components
    Verify Character Components

Verify Default Characters And Stats
    Select Build    build=Thief
    Verify Character    build=thief
    Select Build    build=Knight
    Verify Character    build=knight
    Select Build    build=Mage
    Verify Character    build=mage
    Select Build    build=Brigadier
    Verify Character    build=brigadier

Verify Character Name
    Enter Name    name=The Coolest Guy

Verify Character Name Too Short
    Enter Name    name=a
    Verify Name Too Short

Verify Character Name Too Long
    Enter Name    name=Balthazar Corwin Casimus Titus Hawke the 6th
    Verify Name Too Long
