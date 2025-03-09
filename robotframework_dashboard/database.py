import sqlite3
from pathlib import Path
from .queries import *


class DatabaseProcessor:
    def __init__(self, database_path: Path):
        """This function should handle the connection to the database
        And if required the creation of the tables"""
        self.database_path = database_path
        # handle possible subdirectories before creating database with sqlite
        path = Path(self.database_path)
        path.parent.mkdir(exist_ok=True, parents=True)
        self.connection = sqlite3.connect(self.database_path)
        self.connection.row_factory = sqlite3.Row
        self._create_database()

    def _create_database(self):
        """Helper function to create the tables (they use IF NOT EXISTS to not override)"""
        self.connection.cursor().execute(CREATE_RUNS)
        self.connection.cursor().execute(CREATE_SUITES)
        self.connection.cursor().execute(CREATE_TESTS)
        self.connection.cursor().execute(CREATE_KEYWORDS)
        self.connection.commit()

    def close_database(self):
        """This function is called to close the connection to the database"""
        self.connection.close()

    def insert_output_data(self, output_data: dict, tags: list):
        """This function inserts the data of an output file into the database"""
        try:
            self._insert_runs(output_data["runs"], tags)
            self._insert_suites(output_data["suites"])
            self._insert_tests(output_data["tests"])
            self._insert_keywords(output_data["keywords"])
        except Exception as error:
            print(
                f"   ERROR: you are probably trying to add the same output again, {error}"
            )

    def _insert_runs(self, runs: list, tags: list):
        """Helper function to insert the run data with the run tags"""
        full_runs = []
        for run in runs:
            run += (",".join(tags),)
            full_runs.append(run)
        self.connection.executemany(INSERT_INTO_RUNS, full_runs)
        self.connection.commit()

    def _insert_suites(self, suites: list):
        """Helper function to insert the suite data"""
        self.connection.executemany(INSERT_INTO_SUITES, suites)
        self.connection.commit()

    def _insert_tests(self, tests: list):
        """Helper function to insert the test data"""
        self.connection.executemany(INSERT_INTO_TESTS, tests)
        self.connection.commit()

    def _insert_keywords(self, keywords: list):
        """Helper function to insert the keyword data"""
        self.connection.executemany(INSERT_INTO_KEYWORDS, keywords)
        self.connection.commit()

    def get_data(self):
        """This function gets all the data in the database"""
        data, runs, suites, tests, keywords = {}, [], [], [], []
        # Get runs from run table
        run_rows = self.connection.cursor().execute(SELECT_FROM_RUNS).fetchall()
        for run_row in run_rows:
            runs.append(self._dict_from_row(run_row))
        data["runs"] = runs
        # Get suites from run table
        suite_rows = self.connection.cursor().execute(SELECT_FROM_SUITES).fetchall()
        for suite_row in suite_rows:
            suites.append(self._dict_from_row(suite_row))
        data["suites"] = suites
        # Get tests from run table
        test_rows = self.connection.cursor().execute(SELECT_FROM_TESTS).fetchall()
        for test_row in test_rows:
            tests.append(self._dict_from_row(test_row))
        data["tests"] = tests
        # Get keywords from run table
        keyword_rows = self.connection.cursor().execute(SELECT_FROM_KEYWORDS).fetchall()
        for keyword_row in keyword_rows:
            keywords.append(self._dict_from_row(keyword_row))
        data["keywords"] = keywords
        return data

    def _dict_from_row(self, row):
        """Helper function create a dictionary object"""
        return dict(zip(row.keys(), row))

    def _get_runs(self):
        """Helper function to get the run data"""
        data = self.connection.cursor().execute(SELECT_NAME_START_FROM_RUNS).fetchall()
        runs = []
        names = []
        for entry in data:
            entry = self._dict_from_row(entry)
            runs.append(entry["run_start"])
            names.append(entry["name"])
        return runs, names

    def list_runs(self):
        """This function gets all available runs and prints them to the console"""
        run_starts, run_names = self._get_runs()
        for index, run_start in enumerate(run_starts):
            print(
                f"  Run {str(index).ljust(3, ' ')} | {run_start} | {run_names[index]}"
            )
        if len(run_starts) == 0:
            print(f"  WARNING: There are no runs so the dashboard will be empty!")

    def remove_runs(self, remove_runs):
        """This function removes all provided runs and all their corresponding data"""
        run_starts, run_names = self._get_runs()
        for run in remove_runs:
            run = run[0]
            if run in run_starts:
                self._remove_run(run)
                print(f"  Removed run from the database: {run}")
            else:
                try:
                    run_index = int(run)
                    run_start = run_starts[run_index]
                    self._remove_run(run_start)
                    print(f"  Removed run from the database: {run_start}")
                except:
                    print(f"  ERROR: Could not find run to remove the database: {run}")

    def _remove_run(self, run_start):
        """Helper function to remove the data from all tables"""
        self.connection.cursor().execute(DELETE_FROM_RUNS.format(run_start=run_start))
        self.connection.cursor().execute(DELETE_FROM_SUITES.format(run_start=run_start))
        self.connection.cursor().execute(DELETE_FROM_TESTS.format(run_start=run_start))
        self.connection.cursor().execute(
            DELETE_FROM_KEYWORDS.format(run_start=run_start)
        )
        self.connection.commit()
