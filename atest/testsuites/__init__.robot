*** Settings ***
Library    OperatingSystem
Library    pabot.pabotlib

Suite Teardown    Run Teardown Only Once    keyword=Remove Index


*** Keywords ***
Remove Index
    Remove File    path=index.txt
