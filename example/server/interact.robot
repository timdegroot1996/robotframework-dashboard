*** Settings ***
Documentation    prerequisite: install the requests library like 'pip install robotframework-requests'
...              usage: 'robot examples/server/interact.robot'

Library    RequestsLibrary


*** Variables ***
${URL}    http://127.0.0.1:8543


*** Test Cases ***
Get Outputs
    [Documentation]    get the outputs in the database in a list of dicts
    ${response}    GET    url=${URL}/get-outputs
    Log    ${response.json()}

Add Outputs
    [Documentation]    add an output to the database
    VAR    @{tags}    tag1    cool-tag2    production-tag
    VAR    &{body}    output_path=C:\\users\\docs\\output.xml
    ...               output_tags=${tags}
    ${response}    POST    url=${URL}/add-outputs    json=${body}
    Log    ${response.json()}

Remove Outputs
    [Documentation]    remove some outputs from the database
    VAR    @{runs}    0    -1    2025-03-13 00:22:22.304104
    VAR    &{body}    runs=${runs}
    ${response}    DELETE    url=${URL}/remove-outputs    json=${body}
    Log    ${response.json()}
