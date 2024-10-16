# robotframework-dashboard
Robot Framework Dashboard and Result Database command line tool

Usage: robotdashboard.py [outputpath] [databasepath] [removerun] [namedashboard] [generatedashboard] [listruns]

1. Database preparation creates robot_results.db or specified database if it does not yet exist
2. Optionally Reads test execution result from 1 or more output XML file(s) and uploads to the database
3. Lists all runs currently available in the database, ordered by the time they were entered
4. Optionally Removes run(s) specified by run_date or index of being added
5. Optionally Generates a dashboard HTML file that can be used to look at the stored results

For specific argument usage take a look at the -h or --help