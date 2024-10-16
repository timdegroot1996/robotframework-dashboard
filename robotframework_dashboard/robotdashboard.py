"""Usage: robotdashboard.py [outputpath] [databasepath] [removerun] [namedashboard] [generatedashboard] [listruns]

1. Database preparation creates robot_results.db or specified database if it does not yet exist
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
from time import time


def main():
    (
        outputs,
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
    print(f" 1. Database preparation")
    database = DatabaseProcessor(database_path)
    database.create_database()
    print(f"  created database connection: '{database_path}'")

    print(
        "=============================================================================="
    )
    if outputs:
        output_data = {}
        print(f" 2. Processing output XML(s)")
        for output in outputs:
            output_path = output[0]
            tags = output[1]
            start = time()
            print(f"  Processing output XML '{basename(output_path)}'")
            output_data[output_path] = OutputProcessor().get_output_data(output_path)
            database.insert_output_data(output_path, output_data, tags)
            end = time()
            print(
                f"  Processed output XML '{basename(output_path)}' in {round(end-start, 2)} seconds"
            )
    else:
        print(f" 2. Processing output XML(s)\n  skipping step")

    print(
        "=============================================================================="
    )
    if list_runs:
        print(f" 3. Listing all available runs in the database")
        database.list_runs()
    else:
        print(f" 3. Listing all available runs in the database\n  skipping step")

    print(
        "=============================================================================="
    )
    if remove_runs != None:
        print(f" 4. Removing runs from the database")
        database.remove_runs(remove_runs)
    else:
        print(f" 4. Removing runs from the database\n  skipping step")

    print(
        "=============================================================================="
    )
    if generate_dashboard:
        start = time()
        print(f" 5. Creating dashboard HTML")
        dashboard_data = database.get_data()
        DashboardGenerator().generate_dashboard(
            dashboard_name, dashboard_data, generation_datetime
        )
        end = time()
        print(
            f"  created dashboard '{dashboard_name}' in {round(end-start, 2)} seconds"
        )
    else:
        print(" 5. Creating dashboard HTML\n  skipping step")
    database.close_database()
