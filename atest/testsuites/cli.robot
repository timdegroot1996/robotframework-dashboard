*** Settings ***
Documentation    This testsuite covers the Command Line Interface of robotdashboard

Resource    ../resources/keywords/cli-keywords.resource
Resource    ../resources/keywords/general-keywords.resource

Test Teardown    Remove Database And Dashboard


*** Variables ***
${OUTPUTS_FOLDER}    ${CURDIR}/../resources/outputs


*** Test Cases ***
Validate robotdashboard h
    Validate CLI    command=robotdashboard -h    expected=help

Validate robotdashboard help
    Validate CLI    command=robotdashboard --help    expected=help

Validate robotdashboard v
    Validate CLI    command=robotdashboard -v    expected=version

Validate robotdashboard version
    Validate CLI    command=robotdashboard --version    expected=version

Validate robotdashboard o
    Validate CLI    command=robotdashboard -o ${OUTPUTS_FOLDER}/output-20250313-002222.xml:tag1   expected=outputpath

Validate robotdashboard outputpath
    Validate CLI    command=robotdashboard --outputpath ${OUTPUTS_FOLDER}/output-20250313-002222.xml
    ...       expected=outputpath

Validate robotdashboard f
    Validate CLI    command=robotdashboard -f ${OUTPUTS_FOLDER}    expected=outputfolderpath

Validate robotdashboard outputfolderpath
    Validate CLI    command=robotdashboard --outputfolderpath ${OUTPUTS_FOLDER}:tag1:tag2    expected=outputfolderpath

Validate robotdashboard r
    Validate CLI    command=robotdashboard --outputfolderpath ${OUTPUTS_FOLDER}
    Validate CLI    command=robotdashboard -r "index=0:3;-1;6,run_start=2025-03-13 00:27:39.871333,alias=abc,tag=tag1"    expected=removerun

Validate robotdashboard removerun
    Validate CLI    command=robotdashboard --outputfolderpath ${OUTPUTS_FOLDER}
    Validate CLI
    ...    command=robotdashboard --removerun index=0:3;-1;6 --removerun "run_start=2025-03-13 00:27:39.871333" --removerun alias=abc,tag=tag1
    ...    expected=removerun

Validate robotdashboard d
    Validate CLI    command=robotdashboard -d robot_dashboard.db    expected=databasepath

Validate robotdashboard databasepath
    Validate CLI    command=robotdashboard --databasepath robot_dashboard.db    expected=databasepath

Validate robotdashboard n
    Validate CLI    command=robotdashboard -n robot_dashboard.html   expected=namedashboard

Validate robotdashboard namedashboard
    Validate CLI    command=robotdashboard --namedashboard robot_dashboard.html   expected=namedashboard

Validate robotdashboard l
    Validate CLI    command=robotdashboard -l false   expected=listruns

Validate robotdashboard listruns
    Validate CLI    command=robotdashboard --listruns f    expected=listruns

Validate robotdashboard g
    Validate CLI    command=robotdashboard -g f    expected=generatedashboard

Validate robotdashboard generatedashboard
    Validate CLI    command=robotdashboard --generatedashboard false    expected=generatedashboard

Validate robotdahboard t
    Validate CLI    command=robotdashboard -t some-cool-title    expected=dashboardtitle

Validate robotdahboard dashboardtitle
    Validate CLI    command=robotdashboard --dashboardtitle "Another very interesting title 91239192"    expected=dashboardtitle

Validate robotdahboard e
    Validate CLI    command=robotdashboard -e false    expected=excludemilliseconds

Validate robotdahboard excludemilliseconds
    Validate CLI    command=robotdashboard --excludemilliseconds false    expected=excludemilliseconds

Validate robotdahboard c
    Validate CLI    command=robotdashboard -c example/database/mysql.py    expected=databaseclass

Validate robotdahboard databaseclass
    Validate CLI    command=robotdashboard --databaseclass ./example/database/mysql.py    expected=databaseclass

# might have to implement process library to run in a separate shell and do more tests
# Validate robotdahboard s
#     Validate CLI    command=robotdashboard --outputfolderpath ${OUTPUTS_FOLDER} -g f
#     Validate CLI    command=robotdashboard -s 127.0.0.1:8543    expected=server

# Validate robotdahboard server
#     Validate CLI    command=robotdashboard --outputfolderpath ${OUTPUTS_FOLDER} -g f
#     Validate CLI    command=robotdashboard --server default    expected=server

Validate robotdahboard a
    Validate CLI    command=robotdashboard -a true    expected=aliases

Validate robotdahboard aliases
    Validate CLI    command=robotdashboard --aliases True    expected=aliases

Validate robotdashboard m
    Validate CLI    command=robotdashboard -m ./example/messageconfig.txt    expected=messageconfig

Validate robotdashboard messageconfig
    Validate CLI    command=robotdashboard --messageconfig ./example/messageconfig.txt    expected=messageconfig

Validate robotdashboard q
    Validate CLI    command=robotdashboard -q -25    expected=quantity

Validate robotdashboard quantity
    Validate CLI    command=robotdashboard --quantity 100    expected=quantity

Validate robotdashboard u
    Validate CLI    command=robotdashboard -u true    expected=uselogs

Validate robotdashboard uselogs
    Validate CLI    command=robotdashboard --uselogs false    expected=uselogs
