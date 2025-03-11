from .processors import OutputProcessor
from .database import DatabaseProcessor
from .dashboard import DashboardGenerator
from os.path import basename, exists, join, abspath
from os import walk
from time import time
from pathlib import Path
from datetime import datetime


class RobotDashboard:
    """Class that provides all functionality that robotdashboard has to offer
    Is used in the 'normal' mode when just using the cli directly and in the 'server' mode continuously
    """

    def __init__(
        self,
        outputs: list,
        output_folder_path: Path,
        database_path: Path,
        generate_dashboard: bool,
        dashboard_name: Path,
        generation_datetime: datetime,
        list_runs: bool,
        remove_runs: list,
        dashboard_title: str,
        exclude_milliseconds: bool,
        database_class: Path,
    ):
        """Sets the parameters provided in the command line"""
        self.outputs = outputs
        self.output_folder_path = output_folder_path
        self.database_path = database_path
        self.generate_dashboard = generate_dashboard
        self.dashboard_name = dashboard_name
        self.generation_datetime = generation_datetime
        self.list_runs = list_runs
        self.remove_runs = remove_runs
        self.dashboard_title = dashboard_title
        self.exclude_milliseconds = exclude_milliseconds
        self.database_class = database_class
        self.server = False

    def initialize_database(self, get_database=True, supress=True) -> DatabaseProcessor:
        """Function that initializes the database if it does not exist
        Also makes a connection that is returned by default and used internally in the RobotDashboard class functions
        """
        if not supress:
            print(f" 1. Database preparation")
        if not self.database_class:
            database = DatabaseProcessor(self.database_path)
        else:
            if not supress:
                print(f"  using provided databaseclass: {self.database_class}")
            import importlib.util

            spec = importlib.util.spec_from_file_location(
                "DatabaseProcessor", self.database_class
            )
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            database = module.DatabaseProcessor(self.database_path)
        if not supress:
            print(f"  created database: '{self.database_path}'")
        if not supress:
            print(
                "======================================================================================"
            )
        # if used internally in the class return the database for usage
        if get_database:
            return database
        # if used externally we do not want to return a connection and just close the database after the checks
        else:
            database.close_database()

    def process_outputs(self):
        """Function that processes the outputs and output_folder_path that were set when instantiating the RobotDashboard class"""
        database = self.initialize_database()
        if self.outputs or self.output_folder_path:
            print(f" 2. Processing output XML(s)")
            if self.outputs:
                for output in self.outputs:
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
            if self.output_folder_path:
                if exists(self.output_folder_path[0]):
                    try:
                        for subdir, dirs, files in walk(self.output_folder_path[0]):
                            for file in files:
                                if "output" in file and ".xml" in file:
                                    start = time()
                                    print(
                                        f"  Processing output XML '{join(subdir, file)}'"
                                    )
                                    output_data = OutputProcessor().get_output_data(
                                        join(subdir, file)
                                    )
                                    database.insert_output_data(
                                        output_data, self.output_folder_path[1]
                                    )
                                    end = time()
                                    print(
                                        f"  Processed output XML '{join(subdir, file)}' in {round(end-start, 2)} seconds"
                                    )
                    except Exception as error:
                        print(
                            f"  ERROR: Could not process output folder '{self.output_folder_path}', error: {error}"
                        )
                else:
                    print(
                        f"  ERROR: Could not process output folder '{self.output_folder_path}', error: the path does not exist!"
                    )
        else:
            print(f" 2. Processing output XML(s)\n  skipping step")
        print(
            "======================================================================================"
        )
        database.close_database()

    def print_runs(self):
        """Function that prints the runs currently in the database to the console"""
        if self.list_runs:
            print(f" 3. Listing all available runs in the database")
            database = self.initialize_database()
            database.list_runs()
            database.close_database()
        else:
            print(f" 3. Listing all available runs in the database\n  skipping step")
        print(
            "======================================================================================"
        )

    def get_runs(self):
        """Function that gets the runs and corresponding names from the database"""
        database = self.initialize_database()
        runs, names = database._get_runs()
        database.close_database()
        return runs, names

    def remove_outputs(self):
        """Function that removes the remove_runs that were set when instantiating the RobotDashboard class"""
        if self.remove_runs != None:
            print(f" 4. Removing runs from the database")
            database = self.initialize_database()
            database.remove_runs(self.remove_runs)
            database.close_database()
        else:
            print(f" 4. Removing runs from the database\n  skipping step")
        print(
            "======================================================================================"
        )

    def create_dashboard(self):
        """Function that creates the dashboard HTML"""
        if self.generate_dashboard:
            start = time()
            print(f" 5. Creating dashboard HTML")
            database = self.initialize_database()
            dashboard_data = database.get_data()
            database.close_database()
            DashboardGenerator().generate_dashboard(
                self.dashboard_name,
                dashboard_data,
                self.generation_datetime,
                self.dashboard_title,
                self.exclude_milliseconds,
                self.server,
            )
            end = time()
            print(
                f"  created dashboard '{abspath(self.dashboard_name)}' in {round(end-start, 2)} seconds"
            )
        else:
            print(" 5. Creating dashboard HTML\n  skipping step")
