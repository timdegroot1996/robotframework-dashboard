*** Settings ***
Resource            ../../resources/keywords/generic-keywords.resource
Resource            ../../resources/keywords/homepage-keywords.resource
Resource            ../../resources/keywords/adventure-keywords.resource

Test Setup          Open Test RPG
Test Teardown       Close Test RPG

Test Tags           game


*** Test Cases ***
Verify Adventure Components
    Start Adventure    name=Some Random Name    build=Brigadier
    Verify Adventure Components

Verify Adventure Clicker
    Start Adventure    name=Some Random Name    build=Thief
    Play Clicker    times=5
    Verify Character    build=thief    level=2

Verify Adventure Uploader
    Start Adventure    name=Some Random Name    build=Knight
    Play Uploader    file=automate.png
    Verify Character    build=knight    level=2

Verify Adventure Typer
    Start Adventure    name=Some Random Name    build=Mage
    Play Typer    text=Lorem Ipsum
    Verify Character    build=mage    level=2

Verify Adventure Slider
    Start Adventure    name=Some Random Name    build=Brigadier
    Play Slider    percentage=100
    Verify Character    build=brigadier    level=2

Verify Adventure Complete
    Start Adventure    name=Winner!!    build=Mage
    Play Clicker    times=5
    Play Uploader    file=automate.png
    Play Typer    text=Lorem Ipsum
    Play Slider    percentage=100
    Verify Character    build=mage    level=5
    Verify Victory
