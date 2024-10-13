from robot.api import ExecutionResult, ResultVisitor
from robot.result.model import TestCase, TestSuite, Keyword
from datetime import datetime
from pathlib import Path
from os.path import basename
import sqlite3
from queries import *


class OutputProcessor:
    def process_outputs(self, output_paths: list[list[str]], database_path: Path):
        if output_paths != None:
            for output_path in output_paths:
                output_path = output_path[0]
                print(f"2. Processing output XML: {basename(output_path)}")
                output = ExecutionResult(output_path)
                add_datetime = datetime.now()
                try:
                    output.visit(
                        StatisticsProcessor(
                            add_datetime, database_path, output.generation_time
                        )
                    )
                    output.visit(SuiteProcessor(add_datetime, database_path))
                    output.visit(TestProcessor(add_datetime, database_path))
                    output.visit(KeywordProcessor(add_datetime, database_path))
                except Exception as e:
                    print(
                        f"ERROR: you are probably trying to add the same output again, {e}"
                    )
        else:
            print(
                f"2. Processing output XML(s): No output XML(s) were provided, skipping step"
            )


class StatisticsProcessor(ResultVisitor):
    def __init__(
        self, add_datetime: datetime, database_path: Path, generation_time: datetime
    ):
        self.results = {}
        self.add_datetime = add_datetime
        self.database_path = database_path
        self.generation_time = generation_time

    def visit_total_statistics(self, stats):
        self.results = [
            (
                self.add_datetime,
                stats.total,
                stats.passed,
                stats.failed,
                stats.skipped,
                self.generation_time,
                self.generation_time + stats.elapsed,
                stats.elapsed.seconds,
            )
        ]

    def end_result(self, result):
        connection = sqlite3.connect(self.database_path)
        connection.executemany(INSERT_INTO_STATS, self.results)
        connection.commit()
        connection.close()


class SuiteProcessor(ResultVisitor):
    def __init__(self, add_datetime: datetime, database_path: Path):
        self.results = []
        self.add_datetime = add_datetime
        self.database_path = database_path

    def visit_suite(self, suite: TestSuite):
        self.results.append(
            (
                self.add_datetime,
                suite.full_name,
                suite.name,
                suite.test_count,
                suite.passed,
                suite.failed,
                suite.skipped,
                suite.elapsed_time.seconds,
                suite.start_time,
                suite.end_time,
            )
        )

    def end_result(self, result):
        connection = sqlite3.connect(self.database_path)
        connection.executemany(INSERT_INTO_SUITES, self.results)
        connection.commit()
        connection.close()


class TestProcessor(ResultVisitor):
    def __init__(self, add_datetime: datetime, database_path: Path):
        self.results = []
        self.add_datetime = add_datetime
        self.database_path = database_path

    def visit_test(self, test: TestCase):
        self.results.append(
            (
                self.add_datetime,
                test.full_name,
                test.name,
                test.passed,
                test.failed,
                test.skipped,
                test.elapsed_time.seconds,
                test.start_time,
                test.end_time,
                ",".join(test.tags),
            )
        )

    def end_result(self, result):
        connection = sqlite3.connect(self.database_path)
        connection.executemany(INSERT_INTO_TESTS, self.results)
        connection.commit()
        connection.close()


class KeywordProcessor(ResultVisitor):
    def __init__(self, add_datetime: datetime, database_path: Path):
        self.results = []
        self.add_datetime = add_datetime
        self.database_path = database_path

    def visit_keyword(self, keyword: Keyword):
        self.results.append(
            (
                self.add_datetime,
                keyword.name,
                keyword.passed,
                keyword.failed,
                keyword.skipped,
                keyword.elapsedtime,
                keyword.start_time,
                keyword.end_time,
                ",".join(keyword.tags),
            )
        )

    def end_result(self, result):
        connection = sqlite3.connect(self.database_path)
        connection.executemany(INSERT_INTO_KEYWORDS, self.results)
        connection.commit()
        connection.close()
