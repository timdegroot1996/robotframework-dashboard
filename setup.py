from setuptools import setup, find_packages

setup(
    name="robotframework-dashboard",
    version="0.6.7",
    description="Output processor and dashboard generator for Robot Framework output files",
    long_description="""# Robot Framework Dashboard

### Table of Contents
- Overview
- Installation
- Command Line Features
- Dashboard HTML Features
- Version Details
- Usage
- Examples
- Custom Database Class
- Dashboard Server
- Listener
- Contributing
- License

## Overview

The Robot Framework Dashboard is a tool for [Robot Framework](https://robotframework.org/) that provides insight of your test results across multiple runs. The tool makes use of the built in Robot Framework [Result Visitor API](https://robot-framework.readthedocs.io/en/stable/_modules/robot/result/visitor.html) to analyse output.xml files, stores these in a simple sqlite3 database and finally creates a HTML dashboard that makes use of [Chart.js](https://www.chartjs.org/docs/latest/) and [Datatables](https://datatables.net/) for the graphs and tables and makes use of [Bootstrap](https://getbootstrap.com/) for styling.

If you need help, have suggestions or want to discuss anything, feel free to contact through the [Slack Channel](https://robotframework.slack.com/archives/C07SPR6N9AB) or through a [GitHub issue](https://github.com/timdegroot1996/robotframework-dashboard/issues)

## Installation

1. Install Robot Framework 6.0 or higher (if not already installed):
2. Install Robot Framework Dashboard

```
pip install robotframework-dashboard
```
## Command Line Features

When running the tool the following steps will be executed

1. Database preparation creates robot_results.db or specified database if it does not yet exist and connects to it
2. Optionally reads test execution result from 1 or more output XML file(s) and uploads to the database
3. Optionally lists all runs currently available in the database, ordered by the time they were entered
4. Optionally removes run(s) specified by run_date or index of being added
5. Optionally generates a dashboard HTML file that can be used to look at the stored results

## Dashboard HTML Features

The Robot Framework Dashboard HTML will provide information across your runs across all levels.
Currently available features:

- Global filters: run, run tag, run date
- Runs
  - Statistics: pass, fail, skip
  - Duration: total elapsed time
  - Overview: table overview of runs
- Suites
  - Filter: suite
  - Statistics: pass, fail, skip
  - Duration: total elapsed time
  - Most failed: top 10 failing suites
  - Overview: table overview of suites
- Tests
  - Filter: suite, test, test tags
  - Statistics: pass, fail, skip
  - Duration: total elapsed time
  - Duration Deviation: boxplot of elapsed time to find outliers
  - Most Flaky: top 10 flaky tests
  - Most failed: top 10 failing tests
  - Fail messages: top 10 fail messages
  - Overview: table overview of tests
- Keywords
  - Filter: keywords
  - Keyword statistics: pass, fail, skip
  - Keyword times run
  - Keyword total duration
  - Keyword average duration
  - Keyword min duration
  - Keyword max duration
  - Overview: table overview of keywords

## Version Details
  - Tested robot versions: 6.0, 6.0.1, 6.0.2, 6.1, 6.1.1, 7.0, 7.0.1, 7.1, 7.1.1
  - When running robotdashboard with robot 6.x installed, output files that are generated by robot 7.x will have no duration fields when processed, this is caused by changes in the Result Visitor model
  - When running robotdashboard with robot 7.x installed every output generated by any version above should be processed correctly

## Usage

Run robotdashboard through the command line to initialize your database and generate the report:
```
robotdashboard -o output.xml
```
For detailed command line options take a look at:
```
robotdashboard -h
```
or
```
robotdashboard --help
```
Advanced examples:
- Generate the report without adding new outputs
```
robotdashboard
```
- Add tags to your output.xmls
```
robotdashboard -o output1.xml:tag1 -o reports/output2.xml:tag1:tag2
```
- Add all \*output\*.xml in an entire folder tree to the database and provide all these runs with tags
```
robotdashboard -f ./reports
robotdashboard -f ../../some_folder/sub_folder/logs
robotdashboard -f C:/nightly_runs:tag1:tag2:tag3
```
- Do not list runs and/or do not create the dashboard HTML
```
robotdashboard -l false -g false
```
- Custom path/file name for your dashboard HTML
```
robotdashboard -n results/result_robot_dashboard.html
```
- Custom database path/file location
```
robotdashboard -d result_data/robot_result_database.db
```
- Remove data from the database, can be based on run_start, index, alias or tag
```
robotdashboard -r index=0,index=1:4;9,index=10    # will remove index 0,1,2,3,4,9,10
robotdashboard --removeruns 'run_start=2024-07-30 15:27:20.184407,index=20'    # use quotes when using spaces!
robotdashboard -r alias=some_cool_alias,tag=prod,tag=dev -r alias=alias12345
```
- Add a custom dashboard html title
```
robotdashboard -t "My Cool Title"
```
- Show milliseconds in the graphs in the dashboard html (setting excludemilliseconds to False as it defaults to True)
```
robotdashboard -e False
```
- Show aliases in the graphs in the dashboard html (setting aliases to False as it defaults to True). Aliases are created based on the filename, output_ and .xml are removed, everything that remains will be the output name. Duplicate aliases will get a number based on the order in the database to generate unique aliases in the dashboard.
```
robotdashboard -a True
robotdashboard --aliases true --outputpath output-20250313-002257.xml         # alias will be: output-20250313-002257
robotdashboard --aliases True --outputpath output_.xml                        # alias will be: Alias 1   (this is automatically generated to prevent dupes)
robotdashboard --aliases True --outputpath ./folder/output_My Cool Name.xml   # alias will be: My Cool Name   (only file basename is used)
```
- Make use of a custom DatabaseProcessor class see also the Custom Database Class section for examples and more details of the requirements.
```
robotdashboard -c ./path/to/custom_class.py
robotdashboard --databaseclass mysql.py
```
- Start the robotdashboard server, see also the Dashboard Server section for examples and more details of the requirements.
```
robotdashboard -s default
```

## Examples
Here are some examples of generated files/output:
- See robot_dashboard.html in the Example Folder in GitHub  -> Download and open in a browser to use it!
- See robot_results.db in the Example Folder in GitHub -> Download and use any tool to check the tables or use it as a base for using the "robotdashboard" command line interface
- Example Command Line Output (below)
  
This is an example after running robotdashboard for the first time. 3 outputs are added, stored and processed in the dashboard HTML.

Input:
```
robotdashboard -o output1.xml -o output2.xml -o output3.xml
```
Results:
```
======================================================================================
 ____   ___  ____   ___ _____ ____    _    ____  _   _ ____   ___    _    ____  ____  
|  _ \ / _ \| __ ) / _ |_   _|  _ \  / \  / ___|| | | | __ ) / _ \  / \  |  _ \|  _ \\
| |_) | | | |  _ \| | | || | | | | |/ _ \ \___ \| |_| |  _ \| | | |/ _ \ | |_) | | | |
|  _ <| |_| | |_) | |_| || | | |_| / ___ \ ___) |  _  | |_) | |_| / ___ \|  _ <| |_| |
|_| \_\\___/|____/ \___/ |_| |____/_/   \_|____/|_| |_|____/ \___/_/   \_|_| \_|____/

======================================================================================
 1. Database preparation
  created database connection: 'robot_results.db'
======================================================================================
 2. Processing output XML(s)
  Processing output XML 'output1.xml'
  Processed output XML 'output1.xml' in 0.04 seconds
  Processing output XML 'output2.xml'
  Processed output XML 'output2.xml' in 0.05 seconds
  Processing output XML 'output3.xml'
  Processed output XML 'output3.xml' in 0.05 seconds
======================================================================================
 3. Listing all available runs in the database
  Run 0   | 2024-10-17 15:05:04.563559 | RobotFramework-Project1
  Run 1   | 2024-10-18 16:43:12.772757 | Robotframework-Project2
  Run 2   | 2024-10-21 10:54:25.663094 | Robotframework-Project1
======================================================================================
 4. Removing runs from the database
  skipping step
======================================================================================
 5. Creating dashboard HTML
  created dashboard 'robot_dashboard_20241021-150726.html' in 0.01 seconds
```

## Custom Database Class
See the python files in the Example Folder in GitHub for some examples of custom database class implementations.

### Available examples
Currently available database type examples:
- template.py (completely empty only requirements are filled)
- sqlite3.py (for a sqlite3 database connection, this configuration is used by default in robotdashboard)
- mysql.py (for a mysql database connection)

If you have made an implementation that is not yet an example please feel free to add it through a pull request or submit it in an issue. This way you can help other people implement their own solutions!!

### Custom Class Requirements
- File: The filename can be anything as long as it is a **python file**
- Class: The you should name the **class DatabaseProcessor**
- Methods: 
    - **\_\_init\_\_(self, database_path: Path):**, should handle creation of the database and tables if necessary
    - **open_database(self):**, should open the database connection and set it like self.connection
    - **close_database(self):**, should close the database connection
    - **insert_output_data(self, output_data: dict, tags: list):**, should be able to handle the output_data dict and the run tags that are provided. Look at the example implementations for the content of output_data and tags.
    - **get_data(self):**, should retrieve all data (runs/suites/tests/keywords) from all tables in the form of a dictionary containing the 4 data types. In which each data type is a list of dicts with entries. Example:
    {'runs': [{"run_start": "2024-10-13 22:33:19", "full_name": "Robotframework-Dashboard", "name": "Robotframework-Dashboard", "total": 6, "passed": 4, "failed": 1, "skipped": 1, "elapsed_s": "6.313", "start_time": "2024-10-13 22:33:19.673821", "tags": ""}, {"run_start"...}]}
    - **list_runs(self):**, should print out the runs in the database with useful identiefiers. This function can be empty as long as it exists. It is purely for the command line overview.
    - **remove_runs(self, remove_runs):**, should be able to handle either indexes to be removed, or run_starts that are provided which can then be used to delete the data in the database.
- Do not use relative imports! This will not work on runtime!

## Dashboard Server
To be able to run robotdashboard on a separate machine it comes with some builtin server capabilities. If you set this up on an external machine it will then be possible to host the dashboard and add/remove outputs from other machines.

### Usage
Start the server with the desired options (all command line options can be used, only dashboard name and title will be overwritten by some defaults)
```
robotdashboard --server default
robotdashboard -s 127.0.0.1:8543   # this is the default, which can be changed
```
After starting the server you can open http://127.0.0.1:8543/ to view the admin page and check out the API Docs and the Dashboard.

### Features
- Facilitate an admin page to view/add/remove outputs in the database manually (/)
- Host the dashboard on an endpoint and refresh on every add/remove action (/dashboard)
- Facilitate an endpoint to get the outputs in the database (/get-outputs)
- Facilitate an endpoint to add outputs to the database (/add-outputs)
- Facilitate an endpoint to remove outputs from the database (/remove-outputs)
- The endpoint get/add/remove can be programmatically called if required, the documentation of the endpoints can be found on /docs

### Example scripts
In the example/server folder there are some examples of way to interact with the server API
- interact.http (simple http request formats)
- interact.robot (robot implementation)
- interact.py (python implementation)

## Listener
To be able to automatically follow up on the server implementation and not have to create your own scripts to interact with the API I created a **listener** that automatically updates robotdashboard with every run you execute.

### Usage
1. Download robotdashboardlistener.py from the github example/listener folder and place it somewhere in your project
2. Make sure the robotdashboard server is running see the Dashboard Server section for detailed instructions
3. Update your robot.toml (see also the exmaple robot.toml) or manual command line usage with "--listener path/to/robotdashboardlistener.py:tags=tag1,tag2"
4. Optionally you can also provide ":host=yourhost:port=yourport" if the defaults of robotdashboard server are not to your liking. See the comments in the listener
5. Optionally you can automatically limit the amount of runs in your database by providing ":limit=100" for example
6. Enjoy automatic dashboarding of your manual/pipeline runs! :)

## Contributing
Contributions are welcome! If you encounter any issues, have suggestions for improvements, or would like to add new features, feel free to open an issue or submit a pull request.

## License
This project is licensed under the MIT License.

Note: This project is not officially affiliated with or endorsed by robotframework.
""",
    long_description_content_type="text/markdown",
    classifiers=[
        "Framework :: Robot Framework",
        "Programming Language :: Python",
        "Topic :: Software Development",
    ],
    keywords="robotframework dashboard reporting database",
    author="Tim de Groot",
    author_email="tim-degroot@live.nl",
    url="https://github.com/timdegroot1996/robotframework-dashboard",
    license="MIT",
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        "robotframework>=6.0",
        "fastapi>=0.115.11",
        "uvicorn>=0.34.0",
    ],
    entry_points={
        "console_scripts": [
            "robotdashboard=robotframework_dashboard.main:main",
        ]
    },
)
