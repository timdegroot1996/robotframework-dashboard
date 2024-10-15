"""Usage: robotdashboard.py [outputPath] [databasePath] [removeRun] [nameDashboard] [generateDashboard] [listRuns]

1. Creates robot_results.db or specified database if it does not yet exist
2. Optionally Reads test execution result from 1 or more output XML file(s) and uploads to the database
3. Lists all runs currently available in the database, ordered by the time they were entered
4. Optionally Removes run(s) specified by run_date or index of being added
5. Optionally Generates a dashboard HTML file that can be used to look at the stored results

For specific argument usage take a look at the -h or --help
"""

from .arguments import ArgumentParser
from .processors import OutputProcessor
from .database import DatabaseProcessor
from .dashboard import DashboardGenerator
from os.path import basename


def main():
    (
        output_paths,
        database_path,
        generate_dashboard,
        dashboard_name,
        generation_datetime,
        list_runs,
        remove_runs,
    ) = ArgumentParser().parse_arguments()
    print(
        "=============================================================================="
    )
    print(f" 1. Creating or using database\n  '{database_path}'")
    database = DatabaseProcessor(database_path)
    database.create_database()

    print(
        "=============================================================================="
    )
    if output_paths:
        output_data = {}
        print(f" 2. Processing output XML(s)")
        for output_path in output_paths:
            output_path = output_path[0]
            print(f"  Processing output XML: '{basename(output_path)}'")
            output_data[output_path] = OutputProcessor().get_output_data(output_path)
            print(f"  Inserting output data into database: '{basename(output_path)}'")
            database.insert_output_data(output_path, output_data)
    else:
        print(f" 2. Processing output XML(s): skipping step")

    print(
        "=============================================================================="
    )
    if list_runs:
        print(f" 3. Listing all available runs in the database")
        database.list_runs()
    else:
        print(f" 3. Listing all available runs in the database: skipping step")

    print(
        "=============================================================================="
    )
    if remove_runs != None:
        print(f" 4. Removing runs from the database")
        database.remove_runs(remove_runs)
    else:
        print(f" 4. Removing runs from the database: skipping step")

    print(
        "=============================================================================="
    )
    if generate_dashboard:
        dashboard_data = database.get_data()
        print(f" 5. Creating dashboard HTML\n  '{dashboard_name}'")
        DashboardGenerator().generate_dashboard(
            dashboard_name, dashboard_data, generation_datetime
        )
    else:
        print(" 5. Creating dashboard HTML: skipping step")
    database.close_database()


if __name__ == "__main__":
    main()
