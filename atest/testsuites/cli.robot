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
    Validate CLI    command=robotdashboard -o ${OUTPUTS_FOLDER}/output-20241013-223319.xml:tag1   expected=outputpath

Validate robotdashboard outputpath
    Validate CLI    command=robotdashboard --outputpath ${OUTPUTS_FOLDER}/output-20241013-223319.xml   expected=outputpath

Validate robotdashboard f
    Validate CLI    command=robotdashboard -f ${OUTPUTS_FOLDER}    expected=outputfolderpath

Validate robotdashboard outputfolderpath
    Validate CLI    command=robotdashboard --outputfolderpath ${OUTPUTS_FOLDER}:tag1:tag2    expected=outputfolderpath

Validate robotdashboard r
    Validate CLI    command=robotdashboard --outputfolderpath ${OUTPUTS_FOLDER}
    Validate CLI    command=robotdashboard -r -1 -r 0 -r 1 -r "2024-10-15 00:44:06.053103"    expected=removerun

Validate robotdashboard removerun
    Validate CLI    command=robotdashboard --outputfolderpath ${OUTPUTS_FOLDER}
    Validate CLI    command=robotdashboard --removerun -1 --removerun 0 --removerun 1 --removerun "2024-10-15 00:44:06.053103"
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
