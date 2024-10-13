import sqlite3
from pathlib import Path
from os.path import exists
from queries import *


class DatabaseProcessor:
    def create_database(self, database_path: Path):
        if not exists(database_path):
            print(f"1. Creating database (and directories): '{database_path}' created")
            # handle possible subdirectories before creating database with sqlite
            path = Path(database_path)
            path.parent.mkdir(exist_ok=True, parents=True)
            connection = sqlite3.connect(database_path)
            connection.cursor().execute(CREATE_STATS)
            connection.cursor().execute(CREATE_SUITES)
            connection.cursor().execute(CREATE_TESTS)
            connection.cursor().execute(CREATE_KEYWORDS)
            connection.commit()
            connection.close()
        else:
            print(
                f"1. Creating database (and directories): '{database_path}' already exists"
            )
