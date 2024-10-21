import sqlite3
from pathlib import Path
from .queries import *


class DatabaseProcessor:
    def __init__(self, database_path: Path):
        self.database_path = database_path
        # handle possible subdirectories before creating database with sqlite
        path = Path(self.database_path)
        path.parent.mkdir(exist_ok=True, parents=True)
        self.connection = sqlite3.connect(self.database_path)
        self.connection.row_factory = sqlite3.Row

    def close_database(self):
        self.connection.close()

    def create_database(self):
        self.connection.cursor().execute(CREATE_RUNS)
        self.connection.cursor().execute(CREATE_SUITES)
        self.connection.cursor().execute(CREATE_TESTS)
        self.connection.cursor().execute(CREATE_KEYWORDS)
        self.connection.commit()

    def insert_output_data(self, output_data: dict, tags: list):
        try:
            self.insert_runs(output_data["runs"], tags)
            self.insert_suites(output_data["suites"])
            self.insert_tests(output_data["tests"])
            self.insert_keywords(output_data["keywords"])
        except Exception as e:
            print(
                f"   ERROR: you are probably trying to add the same output again, {e}"
            )

    def insert_runs(self, runs: list[tuple], tags: list):
        full_runs = []
        for run in runs:
            run += (",".join(tags),)
            full_runs.append(run)
        self.connection.executemany(INSERT_INTO_RUNS, full_runs)
        self.connection.commit()

    def insert_suites(self, suites: list[tuple]):
        self.connection.executemany(INSERT_INTO_SUITES, suites)
        self.connection.commit()

    def insert_tests(self, tests: list[tuple]):
        self.connection.executemany(INSERT_INTO_TESTS, tests)
        self.connection.commit()

    def insert_keywords(self, keywords: list[tuple]):
        self.connection.executemany(INSERT_INTO_KEYWORDS, keywords)
        self.connection.commit()

    def get_data(self):
        data, runs, suites, tests, keywords = {}, [], [], [], []
        run_rows = self.connection.cursor().execute(SELECT_FROM_RUNS).fetchall()
        for run_row in run_rows:
            runs.append(self.dict_from_row(run_row))
        data["runs"] = runs
        suite_rows = self.connection.cursor().execute(SELECT_FROM_SUITES).fetchall()
        for suite_row in suite_rows:
            suites.append(self.dict_from_row(suite_row))
        data["suites"] = suites
        test_rows = self.connection.cursor().execute(SELECT_FROM_TESTS).fetchall()
        for test_row in test_rows:
            tests.append(self.dict_from_row(test_row))
        data["tests"] = tests
        keyword_rows = self.connection.cursor().execute(SELECT_FROM_KEYWORDS).fetchall()
        for keyword_row in keyword_rows:
            keywords.append(self.dict_from_row(keyword_row))
        data["keywords"] = keywords
        return data

    def dict_from_row(self, row):
        return dict(zip(row.keys(), row))

    def get_runs(self):
        data = self.connection.cursor().execute(SELECT_NAME_START_FROM_RUNS).fetchall()
        runs = []
        names = []
        for entry in data:
            entry = self.dict_from_row(entry)
            runs.append(entry["run_start"])
            names.append(entry["name"])
        return runs, names

    def list_runs(self):
        run_starts, run_names = self.get_runs()
        for index, run_start in enumerate(run_starts):
            print(
                f"  Run {str(index).ljust(3, ' ')} | {run_start} | {run_names[index]}"
            )
        if len(run_starts) == 0:
            print(f"  WARNING: There are no runs so the dashboard will be empty!")

    def remove_runs(self, remove_runs):
        run_starts, run_names = self.get_runs()
        for run in remove_runs:
            run = run[0]
            if run in run_starts:
                self.remove_run(run)
                print(f"  Removed run from the database: {run}")
            else:
                try:
                    run_index = int(run)
                    run_start = run_starts[run_index]
                    self.remove_run(run_start)
                    print(f"  Removed run from the database: {run_start}")
                except:
                    print(f"  ERROR: Could not find run to remove the database: {run}")

    def remove_run(self, run_start):
        self.connection.cursor().execute(DELETE_FROM_RUNS.format(run_start=run_start))
        self.connection.cursor().execute(DELETE_FROM_SUITES.format(run_start=run_start))
        self.connection.cursor().execute(DELETE_FROM_TESTS.format(run_start=run_start))
        self.connection.cursor().execute(
            DELETE_FROM_KEYWORDS.format(run_start=run_start)
        )
        self.connection.commit()
