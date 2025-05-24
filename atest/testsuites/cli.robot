*** Settings ***
Documentation    This testsuite covers the Command Line Interface of robotdashboard
Library    pabot.pabotlib
Resource    ../resources/keywords/cli-keywords.resource
Resource    ../resources/keywords/general-keywords.resource
Suite Teardown    Run Teardown Only Once    keyword=Remove Database And Dashboard


*** Variables ***
${OUTPUTS_FOLDER}    ${CURDIR}/../resources/outputs


*** Test Cases ***
Validate robotdashboard h
    Validate CLI    command=robotdashboard -d h.db -h    expected=help

Validate robotdashboard help
    Validate CLI    command=robotdashboard -d help.db --help    expected=help

Validate robotdashboard v
    Validate CLI    command=robotdashboard -d v.db -v    expected=version

Validate robotdashboard version
    Validate CLI    command=robotdashboard -d version.db --version    expected=version

Validate robotdashboard o
    Validate CLI    command=robotdashboard -d o.db -o ${OUTPUTS_FOLDER}/output-20250313-002222.xml:tag1   expected=outputpath

Validate robotdashboard outputpath
    Validate CLI    command=robotdashboard -d outputpath.db --outputpath ${OUTPUTS_FOLDER}/output-20250313-002222.xml
    ...       expected=outputpath

Validate robotdashboard f
    Validate CLI    command=robotdashboard -d f.db -f ${OUTPUTS_FOLDER}    expected=outputfolderpath

Validate robotdashboard outputfolderpath
    Validate CLI    command=robotdashboard -d outputfolderpath.db --outputfolderpath ${OUTPUTS_FOLDER}:tag1:tag2    expected=outputfolderpath

Validate robotdashboard r
    Validate CLI    command=robotdashboard -d r.db --outputfolderpath ${OUTPUTS_FOLDER}
    Validate CLI    command=robotdashboard -d r.db -r "index=0:3;-1;6,run_start=2025-03-13 00:27:39.871333,alias=abc,tag=tag1"    expected=removerun

Validate robotdashboard removerun
    Validate CLI    command=robotdashboard -d removerun.db --outputfolderpath ${OUTPUTS_FOLDER}
    Validate CLI
    ...    command=robotdashboard -d removerun.db --removerun index=0:3;-1;6 --removerun "run_start=2025-03-13 00:27:39.871333" --removerun alias=abc,tag=tag1
    ...    expected=removerun

Validate robotdashboard d
    Validate CLI    command=robotdashboard -d databasepath.db    expected=databasepath

Validate robotdashboard databasepath
    Validate CLI    command=robotdashboard --databasepath databasepath.db    expected=databasepath

Validate robotdashboard n
    Validate CLI    command=robotdashboard -d n.db -n robot_dashboard.html   expected=namedashboard

Validate robotdashboard namedashboard
    Validate CLI    command=robotdashboard -d namedashboard.db --namedashboard robot_dashboard.html   expected=namedashboard

Validate robotdashboard l
    Validate CLI    command=robotdashboard -d l.db -l false   expected=listruns

Validate robotdashboard listruns
    Validate CLI    command=robotdashboard -d listruns.db --listruns f    expected=listruns

Validate robotdashboard g
    Validate CLI    command=robotdashboard -d g.db -g f    expected=generatedashboard

Validate robotdashboard generatedashboard
    Validate CLI    command=robotdashboard -d generatedashboard.db --generatedashboard false    expected=generatedashboard

Validate robotdahboard t
    Validate CLI    command=robotdashboard -d t.db -t some-cool-title    expected=dashboardtitle

Validate robotdahboard dashboardtitle
    Validate CLI    command=robotdashboard -d dashboardtitle.db --dashboardtitle "Another very interesting title 91239192"    expected=dashboardtitle

Validate robotdahboard e
    Validate CLI    command=robotdashboard -d e.db -e false    expected=excludemilliseconds

Validate robotdahboard excludemilliseconds
    Validate CLI    command=robotdashboard -d excludemilliseconds.db --excludemilliseconds false    expected=excludemilliseconds

Validate robotdahboard c
    Validate CLI    command=robotdashboard -d c.db -c example/database/mysql.py    expected=databaseclass

Validate robotdahboard databaseclass
    Validate CLI    command=robotdashboard -d databaseclass.db --databaseclass ./example/database/mysql.py    expected=databaseclass

Validate robotdahboard s
    Skip    msg=Might have to implement process library to run in a separate shell and do more tests
    Validate CLI    command=robotdashboard --outputfolderpath ${OUTPUTS_FOLDER} -g f
    Validate CLI    command=robotdashboard -s 127.0.0.1:8543    expected=server

Validate robotdahboard server
    Skip    msg=Might have to implement process library to run in a separate shell and do more tests
    Validate CLI    command=robotdashboard --outputfolderpath ${OUTPUTS_FOLDER} -g f
    Validate CLI    command=robotdashboard --server default    expected=server

Validate robotdahboard a
    Validate CLI    command=robotdashboard -d a.db -a true    expected=aliases

Validate robotdahboard aliases
    Validate CLI    command=robotdashboard -d aliases.db --aliases True    expected=aliases

Validate robotdashboard m
    Validate CLI    command=robotdashboard -d m.db -m ./example/messageconfig.txt    expected=messageconfig

Validate robotdashboard messageconfig
    Validate CLI    command=robotdashboard -d messageconfig.db --messageconfig ./example/messageconfig.txt    expected=messageconfig

Validate robotdashboard q
    Validate CLI    command=robotdashboard -d q.db -q -25    expected=quantity

Validate robotdashboard quantity
    Validate CLI    command=robotdashboard -d quantity.db --quantity 100    expected=quantity

Validate robotdashboard u
    Validate CLI    command=robotdashboard -d u.db -u true    expected=uselogs

Validate robotdashboard uselogs
    Validate CLI    command=robotdashboard -d uselogs.db --uselogs false    expected=uselogs
