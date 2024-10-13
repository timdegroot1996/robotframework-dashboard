#!/usr/bin/env python

"""Usage: robotdashboard.py [outputPath] [databasePath] [generateDashboard] [nameDashboard]

1. Creates robot_results.db or specified database if it does not yet exist
2. Optionally Reads test execution result from 1 or more output XML file(s) and uploads to the database
3. Optionally Generates a dashboard HTML file that can be used to look at the stored results

For specific argument usage take a look at the -h or --help
"""

from robot.api import ExecutionResult, ResultVisitor
from robot.result.model import TestCase, TestSuite, Keyword

import argparse
from os.path import basename, exists, join, abspath, dirname
from pathlib import Path
from datetime import datetime

import sqlite3

from jinja2 import Environment, FileSystemLoader
import codecs

from queries import *


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


#####################################################################################


def parse_arguments():
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument(
        "-h",
        "--help",
        help="Provide additional information",
        action="help",
        default=argparse.SUPPRESS,
    )
    parser.add_argument(
        "-o",
        "--outputPath",
        help="Specifies  1 or more paths to output.xml. \
                        Specify every XML with -o if you are providing more than one.",
        action="append",
        nargs="*",
        default=None,
    )
    parser.add_argument(
        "-d",
        "--databasePath",
        help="Specifies the path to the database you want to \
                        store the results in.",
        default="./robot_results.db",
    )
    parser.add_argument(
        "-g",
        "--generateDashboard",
        help="Specifies if you want to generate the HTML \
                        dashboard. Default is True, override if you only require the database.",
        default=True,
    )
    parser.add_argument(
        "-n",
        "--nameDashboard",
        help="Specifies a custom HTML dashboard name",
        default="",
    )
    arguments = parser.parse_args()
    generate_dashboard = (
        True
        if arguments.generateDashboard == True
        or arguments.generateDashboard.lower() == "true"
        else False
    )
    if arguments.nameDashboard == "":
        name_dashboard = (
            f"robot_dashboard_{datetime.now().strftime('%Y%m%d-%H%M%S')}.html"
        )
    elif not arguments.nameDashboard.endswith(".html"):
        name_dashboard = f"{arguments.nameDashboard}.html"
    else:
        name_dashboard = arguments.nameDashboard
    return (
        arguments.outputPath,
        arguments.databasePath,
        generate_dashboard,
        name_dashboard,
    )


def process_database(database_path: Path):
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


def process_outputs(output_paths: list[list[str]], database_path: Path):
    if output_paths != None:
        for output_path in output_paths:
            output_path = output_path[0]
            print(f"2. Processing output XML(s): {basename(output_path)}")
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


def process_dashboard(generate_dashboard: bool, name_dashboard: str):
    if generate_dashboard == True:
        print("3. Creating dashboard HTML")

        # load template
        templates_dir = join(dirname(abspath(__file__)), "templates")
        file_loader = FileSystemLoader(templates_dir)
        env = Environment(loader=file_loader)
        template = env.get_template("index.html")

        # handle possible subdirectories
        path = Path(name_dashboard)
        path.parent.mkdir(exist_ok=True, parents=True)

        # write template
        with codecs.open(name_dashboard, "w", "utf-8") as dashboard_writer:
            dashboard_writer.write(template.render(data="This is placeholder data"))
    else:
        print("3. Creating dashboard HTML: Skipping step")


if __name__ == "__main__":
    output_paths, database_path, generate_dashboard, name_dashboard = parse_arguments()
    process_database(database_path)
    process_outputs(output_paths, database_path)
    process_dashboard(generate_dashboard, name_dashboard)
