---
outline: deep
---

# Advanced CLI & Examples

Explore advanced CLI features such as combined options, tagging strategies, linking log.html files, customizing dashboard behavior, and grouping error messages. This section provides practical examples and real-world usage patterns.

## Combining Multiple Options in a Single Command

Often you want to perform several actions at once: process new XMLs, remove old runs, use log linking, and use a different database file.

Example of a combined workflow:

```bash
robotdashboard -o output1.xml:tag1 -o output2.xml:tag2 \
               -r index=0:2 -u true -n robot_dashboard.html \
               -t "Cool Robot Dashboard" -d ./data/robot_results.db
```

This command:

- Imports two XML files, each with its own tags  
- Removes the oldest 3 (first 3 added, so index 0, 1, 2) runs  
- Uses the log linking feature enable log opening through graphs
- Uses a custom report name and title
- Uses a custom database path  

Useful when integrating into automation pipelines.

## Advanced Tagging Strategies

Tags can be used to group and categorize runs. These strategies help organize large test repositories or CI environments.
Within the filters it is possible to use AND or OR logic and select these **run tags**.

### Tag multiple XML files differently

```bash
robotdashboard -o output1.xml:chrome \
               -o output2.xml:firefox:nightly \
               -o output3.xml:edge:smoke
```

### Tag entire folder of outputs

```bash
robotdashboard -f ./results:nightly:linux
```

### Project tagging

It is possible to create custom views in the Overview tab. By default runs in this tab are grouped by project name.
However if you want to combine differently and create custom project tags you can do that by prefixing your tag with **project_**.
```bash
robotdashboard -o output.xml:project_custom_name
robotdashboard -f ./results:project_1
```

## Aliases for Clean Dashboard Identification

Aliases help replace long timestamps with clean, readable names. They also significantly improve clarity in comparison views and general dashboard readability.

### How aliases work

- By default, the dashboard identifies runs using their `run_start` timestamp.
- Alias display can be enabled in the **Dashboard Settings**.
- Aliases are generated **during processing** when output files are added to the database.
- The alias is derived from the output filename by removing only:
  - the prefix `output_`
  - the suffix `.xml`
- If no meaningful alias can be generated (e.g., all files are simply `output.xml`), the dashboard will generate fallback aliases such as **Alias 1**, **Alias 2**, etc.

### Important details

- Only the exact strings `output_` and `.xml` are removed.  
- Variations such as `output.xml`, `output-file.xml`, `output-123.xml`, etc. **will keep their prefix in their alias** (`output` or `output-`).

### Apply alias to a single output

- The example below will result in **my_alias1** and **my_alias2**

```bash
robotdashboard -o output_my_alias1.xml
robotdashboard -o output_my_alias2.xml
```

### Apply alias when importing a folder

- The example below will search **all subfolders** of `nightly_runs` and process every file matching `*output*.xml`.
- Aliases are generated from each filename using:
  `{filename}.replace("output_", "").replace(".xml", "")`

```bash
robotdashboard -f ./nightly_runs    
```

## Advanced UseLogs Information

Enable interactive log navigation directly from dashboard graphs.

By default, graphs are not clickable, so opening log files must be done manually.
When UseLogs is enabled, you can open log files directly from run, suite, test, and keyword graphs.

### How it works

- Graph items become clickable when they point to exactly one run, suite, test, or keyword.
- If a graph point refers to multiple runs or multiple suites/tests across different runs, no log file will open.
- For logs to open correctly, the corresponding log.html file must exist in the same directory as the output.xml.
- The expected log filename is automatically derived by:
    - Replacing `output` with `log`
    - Replacing `.xml` with `.html`
- When clicking a suite or test node that maps to exactly one suite or test, the log file will open automatically at the correct suite or test location.
- For server behavior and storing logs on the server, see [Dashboard Server](/dashboard-server.md).

### Turning on clickable logs

```bash
robotdashboard -u true
```
Expected filename behavior is applied when clicking graphs
```bash
robotdashboard -u true -o path/to/output12345.xml
```
Log file that should exist: path/to/log12345.html
```bash
robotdashboard -u true -o some_test_output_file.xml
```
Log file that should exist: some_test_log_file.html

#### Reports
Robotframework report .htmls can be accessed through the log html:  
- Name the report html the same as the log html, following the logic explained above
    - Ensure the log and report are in the same directory
    - Make sure the filenames match, except `log` being `report`
- Then, the link to the report inside the log html at the top right corner should work

## Message Config Details

Message configuration allows grouping similar test error messages.
It is especially useful for grouping recurring errors with changing error messages.

- By default, each message is grouped **only when it is an exact match**.
- Using placeholders enables grouping messages that follow the same pattern, even when certain values differ.
- Placeholder values are not visible in the dashboard graphs.

Example `message_config.txt` contents:

```bash
Expected ${x} but received: ${y}
The test Normal Test ${number} has failed for some strange reason
This test failed on date: ${date}
```

### Use message config

```bash
robotdashboard -m message_config.txt
```

## Using a Custom Dashboard Config (JSON)

When you open the dashboard, a `settings` entry is automatically created in **localStorage**.  
This object stores various user preferences, including:

- Theme (dark or light)
- Default Graph View (e.g., timeline or bar)
- Last Opened Tab (e.g., Overview or Dashboard)
- Last Saved Toggle Settings (e.g., suite paths, project tags)
- Graph Settings (e.g., animations, legends, axis titles)
- Customized Layout Configuration (e.g., size and position of graphs and sections)

You can export this configuration from:  
**Settings → JSON → Copy settings JSON**

After saving it as a file such as `dashboard_config.json`, you can supply it to the dashboard using the `--jsonconfig` flag.

### How it loads

- If a `settings` item already exists in localStorage, **that** configuration is used.
- If no existing config is found, the provided JSON file becomes the default.
- This is especially useful for sharing a predefined dashboard layout or consistent UI appearance across teams.
- **Tip:** If you want to apply a new configuration but localStorage already contains an old one, go to **Settings → JSON** and paste the new JSON manually.

### Load a custom config on first dashboard load
```bash
robotdashboard -j ./configs/dashboard_config.json
```
This ensures a consistent dashboard experience for all users.

For basic CLI documentation see [Basic Command Line Interface (CLI)](/basic-command-line-interface-cli.md) and for more advanced usage, the [Dashboard Server](/dashboard-server.md) and [Custom Database Class](/custom-database-class.md) pages
