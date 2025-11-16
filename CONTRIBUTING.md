# Contributing

This document contains some usefull tips for contributing.

## Validate changes without installing the package
Sometimes it can be quite time consuming to constantly install (pip install .) the entire package to your python version.
To still run the code you can use the following command to run from the package itself. You can add all cli options you desire.
```sh
python -m robotframework_dashboard.main -n robot_dashboard.html
```
It is a good practice to make sure that after everything works like you expect to still install the package and run the same command from the installed version.
All commands should be executed from the root of the project, and can contain the same cli options as above.
```sh
pip install .
robotdashboard -n robot_dashboard.html
```

## Tests
Before you run the tests be sure to install the test dependencies from requirements.txt. This can also be done from a venv if you prefer.
```sh
pip install -r .\requirements.txt
```
There are some acceptance tests (located in ./atest) that can be run like in a powershell or similar terminal.
```sh
.\tests.bat
```
Or they can be run through the command line or robotcode plugin.


## Docs

The docs are hosted through the main branch. Only this branch will actually deploy the change you make. To locally test the documentation you can do the following:
1. Install node.js
2. Run below to install the vitepress plugin
```
npm add -D vitepress@next
```
3. Run below to start the dev server on which you can see the docs. This will provide live updates.
```
npm run docs:dev
```
