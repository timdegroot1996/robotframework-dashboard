# 🛠️ Contributing

This document contains some usefull tips and guides regarding contributing.

## ⚡️The project uses UV to develop/release

You need python to install uv, the version doesn't really matter as after this uv will handle the downloads and usage of "new" python versions in the venvs.

### 1. Install uv
```pip install uv```

### 2. Start a venv with the respective script
The scripts take 3 parameters: python version, robot framework version, robotdashboard installation option. 
The robotdashboard installation option is to ensure server dependencies are installed in the venv.

#### Examples:

Linux/bash/macos examples

1. uses python 3.13.9, robotframework 7.3.2, robotdashboard[all]
    ```
    scripts/start_venv.sh 3.13.9 7.3.2 all
    ```
2. uses python 3.13.9, robotframework 7.3.2, robotdashboard[server]
    ```
    scripts/start_venv.sh 3.10 7.0 server
    ```

Windows examples:

1. uses python 3.8, robotframework 6.0, robotdashboard
    ```
    scripts/start_venv.bat 3.8 6.0
    ```
2. uses python 3.8, robotframework 6.0, robotdashboard[all]
    ```
    scripts/start_venv.bat 3.8 6.0 all
    ```

Note that all `start_venv` scripts create a venv in which python/robotframework/robotdashboard are installed.
They also create a folder `robotframework_dashboard.egg-info` which is used in interactive mode while developing to keep track of changes.
This folder can be deleted after you are done developing.

### 3. Interactively develop using UV

There are 2 options regarding the venv usage
1. always use `uv run` before your commands:
    ```
    uv run robotdashboard --version  # changes to robotdashboard will instantly take effect when using this after step 3!
    uv run robot --version
    uv run python --version
    ```
2. activate the venv by running `.venv/Scripts/activate.bat` on windows or `.source ./.venv/Scripts/activate` on linux/bash/macos:
    ```
    robotdashboard --version  # changes to robotdashboard will instantly take effect when using this after step 3!
    robot --version
    python --version
    ```
3. if you have activated your venv in step 2. you can deactivate by simply running the following command in your terminal of choice. It works the same on windows/linux/bash/macos etc.
    ```
    deactivate
    ```
4. optionally if you are in a venv and you want to swap python/robot versions you can simply execute 2. Start a venv with the respective script again after which you will be in the "newly created" venv.

## ✅ Tests
Tests are located in `atest`. There are different tests for the different parts of the tool.

- CLI
- Database
- Dashboard

Tests will run automatically in GitHub actions. They are triggered through the `.github/workflows/tests.yml` yml script. In this script details regarding the test pipeline can be found. The tests will run when:

- Creating a PR
- Pushing a commit to a PR
- Manually rerunning a workflow run in GitHub actions

Results can be found at the `PR > checks > Upload robot logs`.
The check will have a failed status if any tests has failed.


## 📖 Docs

The docs are hosted through the main branch. Only this branch will actually deploy the change you make. To locally test the documentation you can do the following:
1. Install node.js
2. Run below to install the vitepress plugin and all other dependencies
```
npm install
```
3. Run below to start the dev server on which you can see the docs. This will provide live updates.
```
npm run docs:dev
```