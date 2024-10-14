"""Usage: robotdashboard.py [outputPath] [databasePath] [generateDashboard] [nameDashboard]

1. Creates robot_results.db or specified database if it does not yet exist
2. Optionally Reads test execution result from 1 or more output XML file(s) and uploads to the database
3. Inserting data into database, automatic when providing output XML file(s)
4. Optionally Generates a dashboard HTML file that can be used to look at the stored results

For specific argument usage take a look at the -h or --help
"""

from arguments import ArgumentsParser
from processors import OutputProcessor
from database import DatabaseProcessor
from dashboard import DashboardGenerator

if __name__ == "__main__":
    output_paths, database_path, generate_dashboard, name_dashboard = (
        ArgumentsParser().parses_arguments()
    )
    database = DatabaseProcessor(database_path)
    database.create_database()
    if output_paths:
        output_data = OutputProcessor().get_output_data(output_paths)
        database.insert_output_data(output_data)
    else:
        print(f"2. Processing output XML: skipping step")
        print(f"3. Inserting data into database: skipping step")
    database.close_database()
    DashboardGenerator().generate_dashboard(generate_dashboard, name_dashboard)
