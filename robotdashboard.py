"""Usage: robotdashboard.py [outputPath] [databasePath] [generateDashboard] [nameDashboard]

1. Creates robot_results.db or specified database if it does not yet exist
2. Optionally Reads test execution result from 1 or more output XML file(s) and uploads to the database
3. Inserting output data into database, automatic step when providing output XML file(s)
4. Optionally Generates a dashboard HTML file that can be used to look at the stored results

For specific argument usage take a look at the -h or --help
"""

from arguments import ArgumentParser
from processors import OutputProcessor
from database import DatabaseProcessor
from dashboard import DashboardGenerator
from os.path import basename

if __name__ == "__main__":
    output_paths, database_path, generate_dashboard, dashboard_name, generation_datetime = (
        ArgumentParser().parse_arguments()
    )
    print(f"1. Creating or using database: '{database_path}'")
    database = DatabaseProcessor(database_path)
    database.create_database()
    if output_paths:
        output_data = {}
        for output_path in output_paths:
            output_path = output_path[0]
            print(f"2. Processing output XML: '{basename(output_path)}'")
            output_data[output_path] = OutputProcessor().get_output_data(output_path)
        for output_path in output_data:
            print(f"3. Inserting output data into database: '{basename(output_path)}'")
            database.insert_output_data(output_path, output_data)
    else:
        print(f"2. Processing output XML: skipping step")
        print(f"3. Inserting output data into database: skipping step")
    if generate_dashboard:
        dashboard_data = database.get_data()
        print(f"4. Creating dashboard HTML: {dashboard_name}")
        DashboardGenerator().generate_dashboard(dashboard_name, dashboard_data, generation_datetime)
    else:
        print("4. Creating dashboard HTML: skipping step")
    database.close_database()
