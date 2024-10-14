import sqlite3
from pathlib import Path
from queries import *
import time


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
        self.connection.cursor().execute(CREATE_SUITES)
        self.connection.cursor().execute(CREATE_TESTS)
        self.connection.cursor().execute(CREATE_KEYWORDS)
        self.connection.commit()

    def insert_output_data(self, output_path: str, output_data: dict):
        try:
            self.insert_suites(output_data[output_path]["suites"])
            self.insert_tests(output_data[output_path]["tests"])
            self.insert_keywords(output_data[output_path]["keywords"])
        except Exception as e:
            print(f" ERROR: you are probably trying to add the same output again, {e}")

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
        data, suites, tests, keywords = {}, [], [], []
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
