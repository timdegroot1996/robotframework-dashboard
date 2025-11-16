---
outline: deep
---

# Command Line Interface (CLI)

The **RobotFramework Dashboard CLI** allows you to manage test result databases, process output XML files, and generate interactive dashboards directly from the command line.  

This page provides examples for each command and explains what happens when you run them.

## Display Version and Help

### Display version information
```bash
robotdashboard -v  
robotdashboard --version  
```
- Optional: `-v` or `--version` displays the current installed version of RobotFramework Dashboard.

### Display CLI help
```bash
robotdashboard -h  
robotdashboard --help  
```
- Optional: `-h` or `--help` provides detailed information about all CLI options.

## Adding Output XML Files

### Add one or multiple output XML files
```bash
robotdashboard -o output1.xml -o output2.xml -o output3.xml  
```
- Optional: Each `-o` or `--outputpath` option specifies a single output XML file.  
- The tool will read the files, upload the results to the database, and optionally generate a dashboard HTML file.  
- Tags can be added to group or categorize runs. See [Advanced CLI / Examples](/4-advanced-cli-examples) for more information on Tags!

### Add all output XMLs from a folder (including subfolders)
```bash
robotdashboard -f ./reports  
robotdashboard -f ../../some_folder/sub_folder/logs  
robotdashboard -f C:/nightly_runs:tag1:tag2:tag3  
```
- Optional: `-f` or `--outputfolderpath` specifies a folder; the CLI will process all `*output*.xml` files it finds.  
- Tags can be added to group or categorize runs. See [Advanced CLI / Examples](/4-advanced-cli-examples) for more information on Tags!

## Controlling Database and Dashboard Behavior

### Custom database path
```bash
robotdashboard -d result_data/robot_result_database.db  
```
- Optional: `-d` or `--databasepath` specifies a custom database file to store results.
- Default: database path is the **current folder** with **robot_results.db**.

### Custom dashboard HTML file
```bash
robotdashboard -n results/result_robot_dashboard.html  
```
- Optional: `-n` or `--namedashboard` specifies the file name and path for the generated dashboard HTML.
- Default: dashboard name is **robot_dashboard_YYYYMMDD-HHMMSS.html**.

### Skip listing runs and/or skip generating dashboard
```bash
robotdashboard -l false -g false  
```
- Optional: `-l` or `--listruns` disables listing runs in the console. 
- Default: true, valid values are True, TRUE, T (similar for False).
- Optional: `-g` or `--generatedashboard` disables generating the HTML dashboard.
- Default: true, valid values are True, TRUE, T (similar for False).

## Removing Runs from the Database

### Remove runs by index, run start, alias, or tag
```bash
robotdashboard -r index=0,index=1:4;9,index=10  
robotdashboard --removeruns 'run_start=2024-07-30 15:27:20.184407,index=20'  
robotdashboard -r alias=some_cool_alias,tag=prod,tag=dev -r alias=alias12345  
```
- Optional: `-r` or `--removeruns` specifies one or more runs to remove.  
- Runs can be identified by index, run_start, alias, or tag.  
- Multiple types of identifiers can be used at once.  
- Index ranges use `:` for ranges and `;` for singular indexes.  
- Quotation marks are required when spaces exist in identifiers.

## Customizing the Dashboard

### Set a custom HTML title
```bash
robotdashboard -t "My Cool Title"  
```
- Optional: `-t` or `--dashboardtitle` sets a custom HTML title for the dashboard.
- Default: title is **Robot Framework Dashboard - YYYY-MM-DD HH:MM:SS**.

### Use a JSON dashboard configuration file
```bash
robotdashboard -j ./path/to/config.json  
robotdashboard --jsonconfig default_settings.json  
```
- Optional: `-j` or `--jsonconfig` sets a JSON dashboard configuration file used on first load.

### Control number of runs displayed by default
```bash
robotdashboard -q 7  
robotdashboard --quantity 50  
```
- Optional: `-q` or `--quantity` sets the default number of runs shown in the dashboard on first load.
- Default: value in the dashboard is 20. This can be changed in the filters.

## Advanced Options

### Enable clickable log files in the dashboard
```bash
robotdashboard -u true  
robotdashboard --uselogs True  
```
- Optional: `-u` or `--uselogs` enables clickable graphs in the dashboard that open corresponding log.html files.  
- Requirements: log files must be in the same folder as their respective output.xml files, with `output` replaced by `log` and `.xml` replaced by `.html`.
- More details regarding this feature can be found in [Advanced CLI / Examples](/4-advanced-cli-examples).

### Add messages config for bundling test messages
```bash
robotdashboard -m message_config.txt  
robotdashboard --messageconfig path/to/message_config.txt  
```
- Optional: `-m` or `--messageconfig` specifies a file containing custom messages with placeholders like `${x}` or `${y}`.

### Use a custom database class
```bash
robotdashboard -c ./path/to/custom_class.py  
robotdashboard --databaseclass mysql.py  
```
- Optional: `-c` or `--databaseclass` specifies a custom database class implementation.  
- By default, Sqlite3 is used. See [Custom Database Class](/8-custom-database-class.md) for more information.

## Starting the Dashboard Server
```bash
robotdashboard --server default  
robotdashboard -s 0.0.0.0:8543  
```
- Optional: `-s` or `--server` starts the dashboard web server.  
- See [Dashboard Server](/7-dashboard-server.md) for advanced usage.  
- Docker users can bind to a specific host and port as shown.

### Deprecated options

- Exclude milliseconds: `-e False` (moved to dashboard Settings)  
- Aliases: `-a True` (moved to dashboard Settings)  


This concludes the **RobotFramework Dashboard CLI reference and examples**. For more advanced usage, see [Advanced CLI / Examples](/4-advanced-cli-examples), the [Dashboard Server](/7-dashboard-server.md) and [Custom Database Class](/8-custom-database-class.md) pages.
