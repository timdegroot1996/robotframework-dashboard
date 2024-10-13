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
    def __init__(self, add_datetime):
        self.results = {}
        self.add_datetime = add_datetime

    def visit_total_statistics(self, stats):
        self.results = {
            "total": stats.total,
            "passed": stats.passed,
            "failed": stats.failed,
            "skipped": stats.skipped,
            "elapsed": stats.elapsed.microseconds,
        }

    def end_result(self, result):
        print("stats", self.add_datetime, self.results["elapsed"])


class SuiteProcessor(ResultVisitor):
    def __init__(self, add_datetime):
        self.results = []
        self.add_datetime = add_datetime

    def visit_suite(self, suite: TestSuite):
        self.results.append(
            {
                "full_name": suite.full_name,
                "name": suite.name,
                "test_count": suite.test_count,
                "passed": suite.passed,
                "failed": suite.failed,
                "skipped": suite.skipped,
                "elapsed_time": suite.elapsed_time.microseconds,
                "start_time": suite.start_time,
                "end_time": suite.end_time,
            }
        )

    def end_result(self, result):
        print("suites", self.add_datetime)
        for suite in self.results:
            print(suite["name"])


class TestProcessor(ResultVisitor):
    def __init__(self, add_datetime):
        self.results = []
        self.add_datetime = add_datetime

    def visit_test(self, test: TestCase):
        self.results.append(
            {
                "full_name": test.full_name,
                "name": test.name,
                "passed": test.passed,
                "failed": test.failed,
                "skipped": test.skipped,
                "elapsed_time": test.elapsed_time.microseconds,
                "start_time": test.start_time,
                "end_time": test.end_time,
                "tags": test.tags,
            }
        )

    def end_result(self, result):
        print("tests", self.add_datetime)
        for test in self.results:
            print(test["name"])


class KeywordProcessor(ResultVisitor):
    def __init__(self, add_datetime):
        self.results = []
        self.add_datetime = add_datetime

    def visit_keyword(self, keyword: Keyword):
        self.results.append(
            {
                "name": keyword.name,
                "passed": keyword.passed,
                "failed": keyword.failed,
                "skipped": keyword.skipped,
                "start_time": keyword.start_time,
                "end_time": keyword.end_time,
                "elapsedtime": keyword.elapsedtime,
                "tags": keyword.tags,
            }
        )

    def end_result(self, result):
        print("keywords", self.add_datetime)
        for keyword in self.results:
            print(keyword["name"])


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


def process_outputs(output_paths: list[list[str]]):
    if output_paths != None:
        for output_path in output_paths:
            output_path = output_path[0]
            print(f"2. Processing output XML(s): {basename(output_path)}")
            output = ExecutionResult(output_path)
            add_datetime = datetime.now()
            output.visit(StatisticsProcessor(add_datetime))
            output.visit(SuiteProcessor(add_datetime))
            output.visit(TestProcessor(add_datetime))
            output.visit(KeywordProcessor(add_datetime))
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
    process_outputs(output_paths)
    process_dashboard(generate_dashboard, name_dashboard)
