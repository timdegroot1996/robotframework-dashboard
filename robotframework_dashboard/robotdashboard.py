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
        database_path: Path,
        generate_dashboard: bool,
        dashboard_name: Path,
        generation_datetime: datetime,
        list_runs: bool,
        dashboard_title: str,
        exclude_milliseconds: bool,
        database_class: Path,
        use_run_aliases: bool,
        message_config: list,
        quantity: int,
        user_log_folder: Path
    ):
        """Sets the parameters provided in the command line"""
        self.database_path = database_path
        self.generate_dashboard = generate_dashboard
        self.dashboard_name = dashboard_name
        self.generation_datetime = generation_datetime
        self.list_runs = list_runs
        self.dashboard_title = dashboard_title
        self.exclude_milliseconds = exclude_milliseconds
        self.database_class = database_class
        self.use_run_aliases = use_run_aliases
        self.message_config = message_config
        self.quantity = quantity
        self.user_log_folder = user_log_folder
        self.server = False
        self.database = None

    def initialize_database(self, suppress=True):
        """Function that initializes the database if it does not exist
        Also makes a connection that is used internally in the RobotDashboard class functions
        """
        console = ""
        if not suppress:
            console += self._print_console(f" 1. Database preparation")
        if not self.database_class:
            self.database = DatabaseProcessor(self.database_path)
        else:
            if not suppress:
                console += self._print_console(
                    f"  using provided databaseclass: {self.database_class}"
                )
            import importlib.util

            spec = importlib.util.spec_from_file_location(
                "DatabaseProcessor", self.database_class
            )
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            self.database = module.DatabaseProcessor(self.database_path)
        if not suppress:
            console += self._print_console(
                f"  created database: '{self.database_path}'"
            )
        if not suppress:
            console += self._print_console(
                "======================================================================================"
            )
        return console

    def process_outputs(self, outputs=None, output_folder_path=None):
        """Function that processes the outputs and output_folder_path that were set when instantiating the RobotDashboard class"""
        self.database.open_database()
        console = ""
        if outputs or output_folder_path:
            console += self._print_console(f" 2. Processing output XML(s)")
            if outputs:
                for output in outputs:
                    try:
                        output_path = output[0]
                        tags = output[1]
                        start = time()
                        console += self._print_console(
                            f"  Processing output XML '{basename(output_path)}'"
                        )
                        output_data = OutputProcessor().get_output_data(output_path)
                        run_alias = (
                            str(basename(output_path))
                            .replace("output_", "")
                            .replace(".xml", "")
                        )
                        self.database.insert_output_data(output_data, tags, run_alias)
                        end = time()
                        console += self._print_console(
                            f"  Processed output XML '{basename(output_path)}' in {round(end-start, 2)} seconds"
                        )
                    except Exception as error:
                        console += self._print_console(
                            f"  ERROR: Could not process output XML '{basename(output_path)}', error: {error}"
                        )
            if output_folder_path:
                if exists(output_folder_path[0]):
                    for subdir, dirs, files in walk(output_folder_path[0]):
                        for file in files:
                            try:
                                if "output" in file and ".xml" in file:
                                    start = time()
                                    console += self._print_console(
                                        f"  Processing output XML '{join(subdir, file)}'"
                                    )
                                    output_data = OutputProcessor().get_output_data(
                                        join(subdir, file)
                                    )
                                    run_alias = (
                                        str(basename(file))
                                        .replace("output_", "")
                                        .replace(".xml", "")
                                    )
                                    self.database.insert_output_data(
                                        output_data, output_folder_path[1], run_alias
                                    )
                                    end = time()
                                    console += self._print_console(
                                        f"  Processed output XML '{join(subdir, file)}' in {round(end-start, 2)} seconds"
                                    )
                            except Exception as error:
                                console += self._print_console(
                                    f"  ERROR: Could not process found output file '{file}', error: {error}"
                                )
                else:
                    console += self._print_console(
                        f"  ERROR: Could not process output folder '{output_folder_path}', error: the path does not exist!"
                    )
        else:
            console += self._print_console(
                f" 2. Processing output XML(s)\n  skipping step"
            )
        console += self._print_console(
            "======================================================================================"
        )
        self.database.close_database()
        return console

    def print_runs(self):
        """Function that prints the runs currently in the database to the console"""
        console = ""
        if self.list_runs:
            console += self._print_console(
                f" 3. Listing all available runs in the database"
            )
            self.database.open_database()
            self.database.list_runs()
            self.database.close_database()
        else:
            console += self._print_console(
                f" 3. Listing all available runs in the database\n  skipping step"
            )
        console += self._print_console(
            "======================================================================================"
        )
        return console

    def get_runs(self):
        """Function that gets the runs and corresponding names from the database"""
        self.database.open_database()
        runs, names, aliases, tags = self.database._get_runs()
        self.database.close_database()
        return runs, names, aliases, tags

    def remove_outputs(self, remove_runs=None):
        """Function that removes the remove_runs that were set when instantiating the RobotDashboard class"""
        console = ""
        if remove_runs != None:
            console += self._print_console(f" 4. Removing runs from the database")
            self.database.open_database()
            console += self.database.remove_runs(remove_runs)
            self.database.close_database()
        else:
            console += self._print_console(
                f" 4. Removing runs from the database\n  skipping step"
            )
        console += self._print_console(
            "======================================================================================"
        )
        return console

    def create_dashboard(self):
        """Function that creates the dashboard HTML"""
        console = ""
        if self.generate_dashboard:
            start = time()
            console += self._print_console(f" 5. Creating dashboard HTML")
            self.database.open_database()
            dashboard_data = self.database.get_data()
            self.database.close_database()
            DashboardGenerator().generate_dashboard(
                self.dashboard_name,
                dashboard_data,
                self.generation_datetime,
                self.dashboard_title,
                self.exclude_milliseconds,
                self.server,
                self.use_run_aliases,
                self.message_config,
                self.quantity,
                self.user_log_folder,
            )
            end = time()
            console += self._print_console(
                f"  created dashboard '{abspath(self.dashboard_name)}' in {round(end-start, 2)} seconds"
            )
        else:
            console += self._print_console(
                " 5. Creating dashboard HTML\n  skipping step"
            )
        return console

    def _print_console(self, message):
        print(message)
        return message + "\n"
