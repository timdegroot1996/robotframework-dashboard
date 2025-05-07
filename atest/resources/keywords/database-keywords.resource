*** Settings ***
Library    Collections
Library    OperatingSystem
Library    String
Library    DatabaseLibrary


*** Keywords ***
Create Database Connection
    Connect To Database    db_module=sqlite3    db_name=robot_results.db

Close Database Connection
    Disconnect From Database

Validate Database
    [Arguments]    ${table}
    ${result}    Query    select_statement=SELECT * FROM ${table}
    ${result}    Evaluate    [list(x) for x in $result]
    VAR    @{new_result}    @{EMPTY}
    IF    $table == 'runs'
        FOR    ${row}    IN    @{result}
            Log    ${row}[-1]
            ${path}    Split String From Right    string=${row}[-1]    separator=\\    max_split=1
            Set List Value    ${row}    index=-1    value=${path}[1]
            Append To List    ${new_result}    ${row}
        END
    ELSE
        VAR    ${new_result}    ${result}
    END
    ${new_result}    Convert To String    item=${new_result}
    ${expected}    Get File    path=${CURDIR}/../database_output/${table}.txt
    Should Be Equal As Strings    first=${new_result}    second=${expected}
