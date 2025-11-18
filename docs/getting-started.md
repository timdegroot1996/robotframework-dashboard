---
outline: deep
---

# Getting Started

Welcome to **RobotFramework Dashboard**! This tool helps you **store, manage, and visualize Robot Framework test results** from multiple runs. It is designed to make test result analysis easier, faster, and more interactive by centralizing your outputs in a single database and generating a visual HTML dashboard.

## Why RobotDashboard?

When working with Robot Framework tests, it can be difficult to keep track of multiple test runs, compare results across runs, and share results with your team. **RobotDashboard solves this problem** by:

- Automatically preparing a results database
- Uploading output XMLs into a central database
- Listing, removing, and managing test runs in the database
- Generating an interactive self-contained HTML dashboard for easy visualization  

This allows you to **quickly see trends, identify failures, and share insights** without manually sifting through XML output files.

## Quick Installation
To install RobotFramework Dashboard, run:
```bash
pip install robotframework-dashboard
```
For full installation details, dependencies, and version requirements, see [Installation & Version Info](/installation-version-info.md).

## Basic Command Line Usage

Once installed, you can start adding Robot Framework output files to the database using the command line. The simplest usage is:
```bash
robotdashboard --outputpath output1.xml --outputpath output2.xml --outputpath output3.xml
```
### What happens when you run this command:

1. **Database Preparation**  
   - Creates `robot_results.db` (or your specified database) if it does not exist  
   - Connects to the database  

2. **Processing Output XML Files**  
   - Each specified XML file is read and uploaded to the database  
   - You will see a confirmation message for each processed file  
   - When you try to upload duplicate runs this is prevented and an error will show

3. **Listing Available Runs**  
   - Lists all runs currently stored in the database, ordered by the time they were added  

4. **Removing Runs**  
   - Remove runs from the database, this step is skipped when there is no removal argument provided

5. **Creating Dashboard HTML**  
   - Generates a dashboard file, e.g., `robot_dashboard_20241021-150726.html`  
   - This HTML file can be opened in any browser to explore test results interactively  
   - You can send this file to anyone to use as the file is self-contained

### Example Output
```bash
======================================================================================
 ____   ___  ____   ___ _____ ____    _    ____  _   _ ____   ___    _    ____  ____  
|  _ \ / _ \| __ ) / _ |_   _|  _ \  / \  / ___|| | | | __ ) / _ \  / \  |  _ \|  _ \
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

## Next Steps

After adding your first outputs:

- Explore the generated `robot_dashboard_*.html` file in your browser  
- Use additional CLI options to manage the database or influence your dashboard
- Refer to the [Command Line Interface](/basic-command-line-interface-cli.md) page for detailed usage examples  

