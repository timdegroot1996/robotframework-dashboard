#!/usr/bin/env python

"""Usage: robotdashboard.py [outputPath] [databasePath] [generateDashboard]

1. Creates robot_results.db or specified database if it does not yet exist
2. Reads test execution result from 1 or more output XML file(s)
3. Uploads test execution results from the output XML file(s) to the database
4. Generates a dashboard HTML file that can be used to look at the stored results

Arguments
- Optional `-o` `outputPath` can be 1 or more paths to output.xml.
  Specify every XML with -o if you are providing more than one.
- Optional `-d` `databasePath` specifies the path to the database you want to
  store the results in.
- Optional `g` `generateDashboard` specifies if you want to generate the HTML
  dashboard. Default is True, override if you only require the database.
"""

from robot.api import ExecutionResult, ResultVisitor
from robot.result.model import TestCase, TestSuites, TestSuite, Keyword

import argparse
from os.path import basename, exists
from pathlib import Path

import sqlite3

class SuiteProcessor(ResultVisitor):

    def visit_suite(self, suite: TestSuite):
        print('suite')
        print(suite.full_name, suite.passed, suite.failed, suite.elapsed_time, suite.start_time, suite.end_time)
        print(suite.suites)
        print(suite.all_tests)

class TestProcessor(ResultVisitor):

    def visit_test(self, test: TestCase):
        print('test')
        print(test.full_name, test.passed, test.failed, test.elapsed_time, test.start_time, test.end_time)

class KeywordProcessor(ResultVisitor):

    def visit_keyword(self, keyword: Keyword):
        print('keyword')
        print(keyword.full_name, keyword.passed, keyword.failed, keyword.elapsed_time, keyword.start_time, keyword.end_time)

def parse_arguments():
    parser = argparse.ArgumentParser()
    parser.add_argument('-o','--outputPath', help=__doc__, action='append', nargs='*',  default=None)
    parser.add_argument('-d','--databasePath', help=__doc__, default='./robot_results.db')
    parser.add_argument('-g','--generateDashboard', help=__doc__, default=True)
    arguments = parser.parse_args()
    generate_dashboard = True if arguments.generateDashboard.lower() == 'true' or arguments.generateDashboard == True else False
    return arguments.outputPath, arguments.databasePath, generate_dashboard

def process_database(database_path: Path):
    if not exists(database_path):
        print(f"1. Creating database (and directories): '{database_path}' created")
        path = Path(database_path)
        path.parent.mkdir(exist_ok=True, parents=True)
        sqlite3.connect(database_path).close()
    else:
        print(f"1. Creating database (and directories): '{database_path}' already exists")

def process_outputs(output_paths: list[list[str]]):
    if output_paths != None:
        for output_path in output_paths:
            print(f'2. Processing output XML(s): {basename(output_path[0])}')
            
            
            print(f'3. Uploading results to database: {basename(output_path[0])}')
    
    
    else:
        print(f'2. Processing output XML(s): No output XML(s) were provided, skipping step')
        print(f'3. Uploading results to database: No output XML(s) were provided, skipping step')

    # result = ExecutionResult(*sys.argv[1:])
    # print(dir(result.statistics.suite.stat))
    # print(result.statistics.suite.stat._name)
    # print(result.statistics.suite.stat.elapsed)
    # print(result.statistics.suite.stat.total)
    # print(result.statistics.suite.stat.passed)
    # print(result.statistics.suite.stat.failed)
    # print(result.statistics.suite.stat.skipped)
    # print(result.visit(SuiteProcessor()))
    # print(result.visit(TestProcessor()))
    # # print(result.visit(KeywordProcessor()))





def process_dashboard(generate_dashboard: bool):
    if generate_dashboard == True:
        print('4. Creating dashboard HTML')
    else:
        print('4. Creating dashboard HTML: Skipping step')

if __name__ == '__main__':
    output_paths, database_path, generate_dashboard = parse_arguments()
    process_database(database_path)
    process_outputs(output_paths)
    process_dashboard(generate_dashboard)