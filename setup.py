from setuptools import setup, find_packages

setup(
    name="robotframework-dashboard",
    version="0.1.1",
    description="Output processor and dashboard generator for Robot Framework output files",
    long_description="""# Robot Framework Dashboard

## Overview

The Robot Framework Dashboard is a tool for [Robot Framework](https://robotframework.org/) that provides insight of your test results across multiple runs. The tool makes use of the built in Robot Framework [Result Visitor API](https://robot-framework.readthedocs.io/en/stable/_modules/robot/result/visitor.html) to analyse output.xml files, stores these in a simple sqlite3 database and finally creates a HTML dashboard that makes use of [Chart.js](https://www.chartjs.org/docs/latest/) and [Datatables](https://datatables.net/) for the graphs and tables and makes use of [Bootstrap](https://getbootstrap.com/) for styling.

If you need help, have suggestions or want to discuss anything, feel free to contact through the [slack channel](https://robotframework.slack.com/).

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
- Suites
- - Filter: suite
  - Statistics: pass, fail, skip
  - Duration: total elapsed time
- Tests
  - Filter: suite, test
  - Statistics: pass, fail, skip
  - Duration: total elapsed time
- Keywords
  - Table overview of keywords
  - Filter: keywords
  - Keyword statistics: pass, fail, skip
  - Keyword times run
  - Keyword total duration
  - Keyword average duration
  - Keyword min duration
  - Keyword max duration

## Installation

1. Install Robot Framework 6.0.0 or higher (if not already installed):
2. Install Robot Framework Dashboard

```
pip install robotframework-dashboard
```

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
- Remove data from the database, can be based on run number (index) or run start time
```
robotdashboard -r 0
robotdashboard -r -1 -r "2024-10-17 15:05:04.563559"
```

## Example usage output
This is an example after running robotdashboard for the first time. 3 outputs are added, stored and processed in the dashboard HTML.

Input:
```
robotdashboard -o output1.xml -o output2.xml -o output3.xml
```
Results:
```
==============================================================================
 1. Database preparation
  created database connection: '.\robot_results.db'
==============================================================================
 2. Processing output XML(s)
  Processing output XML 'output1.xml'
  Processed output XML 'output1.xml' in 0.04 seconds
  Processing output XML 'output2.xml'
  Processed output XML 'output2.xml' in 0.05 seconds
  Processing output XML 'output3.xml'
  Processed output XML 'output3.xml' in 0.05 seconds
==============================================================================
 3. Listing all available runs in the database
  Run 0   | 2024-10-17 15:05:04.563559 | RobotFramework-Project1
  Run 1   | 2024-10-18 16:43:12.772757 | Robotframework-Project2
  Run 2   | 2024-10-21 10:54:25.663094 | Robotframework-Project1
==============================================================================
 4. Removing runs from the database
  skipping step
==============================================================================
 5. Creating dashboard HTML
  created dashboard '.\robot_dashboard_20241021-150726.html' in 0.01 seconds
```

## Contributing
Contributions are welcome! If you encounter any issues, have suggestions for improvements, or would like to add new features, feel free to open an issue or submit a pull request.

## License
This project is licensed under the MIT License.

Note: This project is not officially affiliated with or endorsed by robotframework.""",
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
        "robotframework>=7.0.0",
    ],
    entry_points={
        "console_scripts": [
            "robotdashboard=robotframework_dashboard.robotdashboard:main",
        ]
    },
)
