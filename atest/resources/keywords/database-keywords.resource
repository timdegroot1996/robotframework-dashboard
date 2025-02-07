*** Settings ***
Library    OperatingSystem
Library    DatabaseLibrary


*** Keywords ***
Create Database Connection
    Connect To Database    db_module=sqlite3    db_name=robot_results.db

Close Database Connection
    Disconnect From Database

Validate Database
    [Arguments]    ${table}
    ${result}    Query    select_statement=SELECT * FROM ${table}
    ${result}    Convert To String    item=${result}
    Log    ${result}
    ${expected}    Get File    path=${CURDIR}/../database_output/${table}.txt
    Should Be Equal As Strings    first=${result}    second=${expected}
