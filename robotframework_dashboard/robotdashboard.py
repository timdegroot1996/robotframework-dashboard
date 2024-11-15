from .arguments import ArgumentParser
from .processors import OutputProcessor
from .database import DatabaseProcessor
from .dashboard import DashboardGenerator
from os.path import basename, exists, join
from os import walk
from time import time


def main():
    (
        outputs,
        output_folder_path,
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
    if outputs or output_folder_path:
        print(f" 2. Processing output XML(s)")
        if outputs:
            for output in outputs:
                try:
                    output_path = output[0]
                    tags = output[1]
                    start = time()
                    print(f"  Processing output XML '{basename(output_path)}'")
                    output_data = OutputProcessor().get_output_data(output_path)
                    database.insert_output_data(output_data, tags)
                    end = time()
                    print(
                        f"  Processed output XML '{basename(output_path)}' in {round(end-start, 2)} seconds"
                    )
                except Exception as error:
                    print(
                        f"  ERROR: Could not process output XML '{basename(output_path)}', error: {error}"
                    )
        if output_folder_path:
            if exists(output_folder_path[0]):
                try:
                    for subdir, dirs, files in walk(output_folder_path[0]):
                        for file in files:
                            if "output" in file and ".xml" in file:
                                start = time()
                                print(f"  Processing output XML '{join(subdir, file)}'")
                                output_data = OutputProcessor().get_output_data(
                                    join(subdir, file)
                                )
                                database.insert_output_data(
                                    output_data, output_folder_path[1]
                                )
                                end = time()
                                print(
                                    f"  Processed output XML '{join(subdir, file)}' in {round(end-start, 2)} seconds"
                                )
                except Exception as error:
                    print(
                        f"  ERROR: Could not process output folder '{output_folder_path}', error: {error}"
                    )
            else:
                print(
                    f"  ERROR: Could not process output folder '{output_folder_path}', error: the path does not exist!"
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
