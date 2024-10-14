import sqlite3
from pathlib import Path
from os.path import exists
from queries import *


class DatabaseProcessor:
    def __init__(self, database_path: Path):
        self.database_path = database_path
        # handle possible subdirectories before creating database with sqlite
        path = Path(self.database_path)
        path.parent.mkdir(exist_ok=True, parents=True)
        self.connection = sqlite3.connect(self.database_path)
    
    def close_database(self):
        self.connection.close()

    def create_database(self):
        print(
            f"1. Creating or using database: '{self.database_path}'"
        )
        self.connection.cursor().execute(CREATE_SUITES)
        self.connection.cursor().execute(CREATE_TESTS)
        self.connection.cursor().execute(CREATE_KEYWORDS)
        self.connection.commit()

    def insert_output_data(self, output_data: dict):
        
        for run in output_data:
            print(
            f"3. Inserting data into database: '{run}'"
            )
            try:
                self.insert_suites(output_data[run]["suites"])
                self.insert_tests(output_data[run]["tests"])
                self.insert_keywords(output_data[run]["keywords"])
            except Exception as e:
                print(f"ERROR: you are probably trying to add the same output again, {e}")

    def insert_suites(self, suites: list[tuple]):
        self.connection.executemany(INSERT_INTO_SUITES, suites)
        self.connection.commit()

    def insert_tests(self, tests: list[tuple]):
        self.connection.executemany(INSERT_INTO_TESTS, tests)
        self.connection.commit()

    def insert_keywords(self, keywords: list[tuple]):
        self.connection.executemany(INSERT_INTO_KEYWORDS, keywords)
        self.connection.commit()
