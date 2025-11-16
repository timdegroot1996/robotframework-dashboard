*** Settings ***
Library     RequestsLibrary
Resource    ../variables/api-variables.resource


*** Keywords ***
Get All Builds
    [Documentation]   Retrieve all builds and validate all builds are present
    ${response}    GET    url=${A_URL}/builds
    Should Contain    container=${response.json()}    item=thief
    Should Contain    container=${response.json()}    item=mage
    Should Contain    container=${response.json()}    item=knight
    Should Contain    container=${response.json()}    item=brigadier

Get Specific Build
    [Documentation]   Retrieve a specific build and validate the result
    [Arguments]    ${build}    ${unknown_build}=${False}
    VAR    ${params}    build=${build}
    ${response}    GET    url=${A_URL}/builds    params=${params}
    IF    not ${unknown_build}
        Should Contain    container=${response.json()}    item=weapon
        Should Contain    container=${response.json()}    item=upgradedWeapon
        Should Contain    container=${response.json()}    item=armor
        Should Contain    container=${response.json()}    item=upgradedArmor
        Should Contain    container=${response.json()}    item=strength
        Should Contain    container=${response.json()}    item=agility
        Should Contain    container=${response.json()}    item=wisdom
        Should Contain    container=${response.json()}    item=magic
    ELSE
        Should Contain
        ...    container=${response.json()}[error]
        ...    item=Unknown build '${build}', you may have to purchase the DLC.
    END

Post Build
    [Documentation]   Add a specific build and validate the result
    [Arguments]    ${name}=random
    ...    ${strength}=random
    ...    ${agility}=random
    ...    ${wisdom}=random
    ...    ${magic}=random
    ...    ${error}=${None}
    IF    $name == 'random'    VAR    ${name}    ${{random.choice(${A_RANDOM_BUILDS})}}
    IF    $name == 'random existing'    VAR    ${name}    ${{random.choice(${A_BUILDS})}}
    IF    $strength == 'random'    VAR    ${strength}    ${{random.randint(1,4)}}
    IF    $agility == 'random'    VAR    ${agility}    ${{random.randint(1,3)}}
    IF    $wisdom == 'random'    VAR    ${wisdom}    ${{random.randint(1,2)}}
    IF    $magic == 'random'    VAR    ${magic}    ${{random.randint(1,1)}}
    VAR    &{build}    name=${name}
    ...    strength=${{int(${strength})}}
    ...    agility=${{int(${agility})}}
    ...    wisdom=${{int(${wisdom})}}
    ...    magic=${{int(${magic})}}
    VAR    &{body}    build=${build}
    IF    $error != ${None}
        ${response}    POST    url=${A_URL}/builds    json=${body}    expected_status=400
        Should Be Equal As Strings    first=${response.json()}[success]    second=${False}
        Should Contain    container=${response.json()}[error][0][message]    item=${error}
    ELSE
        ${response}    POST    url=${A_URL}/builds    json=${body}
        Should Be Equal As Strings    first=${response.json()}[success]    second=${True}
        Should Be Equal As Strings    first=${response.json()}[result][build][name]    second=${name}
        Should Be Equal As Integers    first=${response.json()}[result][build][strength]    second=${strength}
        Should Be Equal As Integers    first=${response.json()}[result][build][agility]    second=${agility}
        Should Be Equal As Integers    first=${response.json()}[result][build][wisdom]    second=${wisdom}
        Should Be Equal As Integers    first=${response.json()}[result][build][magic]    second=${magic}
    END
