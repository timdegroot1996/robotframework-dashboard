import mysql.connector
from pathlib import Path
from robotframework_dashboard.abstract_db import AbstractDatabaseProcessor

# Some helper queries I used to create the initial database and tables directly in MySQL
# If you want another way of storing the data feel free to make your own tables and queries!

CREATE_RUNS = """ CREATE TABLE runs (`run_start` VARCHAR(26) UNIQUE, `full_name` text, `name` text, `total` int, `passed` int, `failed` int, `skipped` int, `elapsed_s` text, `start_time` text, `tags` text, `run_alias` text) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci; """
CREATE_SUITES = """ CREATE TABLE suites (`run_start` text, `full_name` text, `name` text, `total` int, `passed` int, `failed` int, `skipped` int, `elapsed_s` text, `start_time` text) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci; """
CREATE_TESTS = """ CREATE TABLE tests (`run_start` text, `full_name` text, `name` text, `passed` int, `failed` int, `skipped` int, `elapsed_s` text, `start_time` text, `message` text, `tags` text) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci; """
CREATE_KEYWORDS = """ CREATE TABLE keywords (`run_start` text, `name` text, `passed` int, `failed` int, `skipped` int, `times_run` text, `total_time_s` text, `average_time_s` text, `min_time_s` text, `max_time_s` text) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci; """

INSERT_INTO_RUNS = """ INSERT INTO runs (run_start, full_name, name, total, passed, failed, skipped, elapsed_s, start_time, tags, run_alias) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) """
INSERT_INTO_SUITES = """ INSERT INTO suites (run_start, full_name, name, total, passed, failed, skipped, elapsed_s, start_time) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s) """
INSERT_INTO_TESTS = """ INSERT INTO tests (run_start, full_name, name, passed, failed, skipped, elapsed_s, start_time, message, tags) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) """
INSERT_INTO_KEYWORDS = """ INSERT INTO keywords (run_start, name, passed, failed, skipped, times_run, total_time_s, average_time_s, min_time_s, max_time_s) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) """

SELECT_FROM_RUNS = """ SELECT * FROM runs """
SELECT_RUN_DATA = """ SELECT name, run_start, run_alias, tags FROM runs """
SELECT_FROM_SUITES = """ SELECT * FROM suites """
SELECT_FROM_TESTS = """ SELECT * FROM tests """
SELECT_FROM_KEYWORDS = """ SELECT * FROM keywords """

DELETE_FROM_RUNS = """ DELETE FROM runs WHERE run_start="{run_start}" """
DELETE_FROM_SUITES = """ DELETE FROM suites WHERE run_start="{run_start}" """
DELETE_FROM_TESTS = """ DELETE FROM tests WHERE run_start="{run_start}" """
DELETE_FROM_KEYWORDS = """ DELETE FROM keywords WHERE run_start="{run_start}" """

RUN_KEYS = [
    "run_start",
    "full_name",
    "name",
    "total",
    "passed",
    "failed",
    "skipped",
    "elapsed_s",
    "start_time",
    "tags",
]
SUITE_KEYS = [
    "run_start",
    "full_name",
    "name",
    "total",
    "passed",
    "failed",
    "skipped",
    "elapsed_s",
    "start_time",
]
TEST_KEYS = [
    "run_start",
    "full_name",
    "name",
    "passed",
    "failed",
    "skipped",
    "elapsed_s",
    "start_time",
    "message",
    "tags",
]
KEYWORD_KEYS = [
    "run_start",
    "name",
    "passed",
    "failed",
    "skipped",
    "times_run",
    "total_time_s",
    "average_time_s",
    "min_time_s",
    "max_time_s",
]


class DatabaseProcessor(AbstractDatabaseProcessor):
    def __init__(self, database_path: Path):
        """This function should handle the creation of the tables if required
        The use of the database_path variable might not be required but you should still keep it as an argument!
        """
        self.connection: mysql.connector

    def open_database(self):
        """This function should handle the setting of the connection to the database"""
        self.connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="password",
            database="robot_results",
        )
        self.connection.connect()

    def close_database(self):
        """This function is called to close the connection to the database"""
        self.connection.disconnect()
        self.connection.close()

    def insert_output_data(self, output_data: dict, tags: list, run_alias: str):
        """This function inserts the data of an output file into the database"""
        try:
            self._insert_runs(output_data["runs"], tags, run_alias)
            self._insert_suites(output_data["suites"])
            self._insert_tests(output_data["tests"])
            self._insert_keywords(output_data["keywords"])
        except Exception as error:
            print(
                f"   ERROR: you are probably trying to add the same output again, {error}"
            )

    def _insert_runs(self, runs: list, tags: list, run_alias: str):
        """Helper function to insert the run data with the run tags"""
        full_runs = []
        for run in runs:
            run += (",".join(tags),)
            run += (run_alias,)
            full_runs.append(run)
        self.connection.cursor().executemany(INSERT_INTO_RUNS, full_runs)
        self.connection.commit()

    def _insert_suites(self, suites: list):
        """Helper function to insert the suite data"""
        self.connection.cursor().executemany(INSERT_INTO_SUITES, suites)
        self.connection.commit()

    def _insert_tests(self, tests: list):
        """Helper function to insert the test data"""
        self.connection.cursor().executemany(INSERT_INTO_TESTS, tests)
        self.connection.commit()

    def _insert_keywords(self, keywords: list):
        """Helper function to insert the keyword data"""
        self.connection.cursor().executemany(INSERT_INTO_KEYWORDS, keywords)
        self.connection.commit()

    def get_data(self):
        """This function gets all the data in the database"""
        data, runs, suites, tests, keywords = {}, [], [], [], []
        cursor = self.connection.cursor()
        # Get runs from run table
        cursor.execute(SELECT_FROM_RUNS)
        run_rows = cursor.fetchall()
        for run_row in run_rows:
            runs.append(self._dict_from_row(run_row, RUN_KEYS))
        data["runs"] = runs
        # Get suites from run table
        cursor.execute(SELECT_FROM_SUITES)
        suite_rows = cursor.fetchall()
        for suite_row in suite_rows:
            suites.append(self._dict_from_row(suite_row, SUITE_KEYS))
        data["suites"] = suites
        # Get tests from run table
        cursor.execute(SELECT_FROM_TESTS)
        test_rows = cursor.fetchall()
        for test_row in test_rows:
            tests.append(self._dict_from_row(test_row, TEST_KEYS))
        data["tests"] = tests
        # Get tests from keywords table
        cursor.execute(SELECT_FROM_KEYWORDS)
        keyword_rows = cursor.fetchall()
        for keyword_row in keyword_rows:
            keywords.append(self._dict_from_row(keyword_row, KEYWORD_KEYS))
        data["keywords"] = keywords
        return data

    def _dict_from_row(self, row, keys):
        """Helper function create a dictionary object"""
        return dict(zip(keys, row))

    def _get_runs(self):
        """Helper function to get the run data"""
        cursor = self.connection.cursor()
        cursor.execute(SELECT_RUN_DATA)
        data = cursor.fetchall()
        runs, names, aliases, tags = [], [], [], []
        keys = ["name", "run_start", "run_alias", "tags"]
        for entry in data:
            entry = self._dict_from_row(entry, keys)
            runs.append(entry["run_start"])
            names.append(entry["name"])
            aliases.append(entry["run_alias"])
            tags.append(entry["tags"])
        return runs, names, aliases, tags

    def list_runs(self):
        """This function gets all available runs and prints them to the console"""
        run_starts, run_names, run_aliases, run_tags = self._get_runs()
        for index, run_start in enumerate(run_starts):
            print(
                f"  Run {str(index).ljust(3, ' ')} | {run_start} | {run_names[index]}"
            )
        if len(run_starts) == 0:
            print(f"  WARNING: There are no runs so the dashboard will be empty!")

    def remove_runs(self, remove_runs):
        """This function removes all provided runs and all their corresponding data"""
        run_starts, run_names, run_aliases, run_tags = self._get_runs()
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

    def update_output_path(self, log_path) -> None:
        return super().update_output_path(log_path)