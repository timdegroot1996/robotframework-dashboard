#!/usr/bin/env python

"""Usage: robotdashboard.py [outputPath] [databasePath] [generateDashboard] [nameDashboard]

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
- Optional `n` `nameDashboard` specifies a custom HTML dashboard name
"""

from robot.api import ExecutionResult, ResultVisitor
from robot.result.model import TestCase, TestSuites, TestSuite, Keyword

import argparse
from os.path import basename, exists, join, abspath, dirname
from pathlib import Path
from datetime import datetime

import sqlite3

from jinja2 import Environment, FileSystemLoader
import codecs


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
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('-h','--help', help='Provide additional information', action='help', default=argparse.SUPPRESS)
    parser.add_argument('-o','--outputPath', help='Specifies  1 or more paths to output.xml. \
                        Specify every XML with -o if you are providing more than one.', action='append', nargs='*',  default=None)
    parser.add_argument('-d','--databasePath', help='Specifies the path to the database you want to \
                        store the results in.', default='./robot_results.db')
    parser.add_argument('-g','--generateDashboard', help='Specifies if you want to generate the HTML \
                        dashboard. Default is True, override if you only require the database.', default=True)
    parser.add_argument('-n','--nameDashboard', help='Specifies a custom HTML dashboard name', default='')
    arguments = parser.parse_args()
    generate_dashboard = True if arguments.generateDashboard == True or arguments.generateDashboard.lower() == 'true' else False
    if arguments.nameDashboard == '':
        name_dashboard = f"robot_dashboard_{datetime.now().strftime('%Y%m%d-%H%M%S')}.html"
    elif not arguments.nameDashboard.endswith('.html'):
        name_dashboard = f"{arguments.nameDashboard}.html"
    else: 
        name_dashboard = arguments.nameDashboard
    return arguments.outputPath, arguments.databasePath, generate_dashboard, name_dashboard

def process_database(database_path: Path):
    if not exists(database_path):
        print(f"1. Creating database (and directories): '{database_path}' created")
        # handle possible subdirectories before creating database with sqlite
        path = Path(database_path)
        path.parent.mkdir(exist_ok=True, parents=True)
        sqlite3.connect(database_path).close()
    else:
        print(f"1. Creating database (and directories): '{database_path}' already exists")

def process_outputs(output_paths: list[list[str]]):
    if output_paths != None:
        for output_path in output_paths:
            output_path = output_path[0]
            print(f'2. Processing output XML(s): {basename(output_path)}')
            result = ExecutionResult(output_path)
            print(dir(result.statistics.suite.stat))
            print(result.statistics.suite.stat._name)
            print(result.statistics.suite.stat.elapsed)
            print(result.statistics.suite.stat.total)
            print(result.statistics.suite.stat.passed)
            print(result.statistics.suite.stat.failed)
            print(result.statistics.suite.stat.skipped)
            print(result.visit(SuiteProcessor()))
            print(result.visit(TestProcessor()))
            print(result.visit(KeywordProcessor()))
            print(f'3. Uploading results to database: {basename(output_path[0])}')
    else:
        print(f'2. Processing output XML(s): No output XML(s) were provided, skipping step')
        print(f'3. Uploading results to database: No output XML(s) were provided, skipping step')

def process_dashboard(generate_dashboard: bool, name_dashboard: str):
    if generate_dashboard == True:
        print('4. Creating dashboard HTML')
        
        # load template
        templates_dir = join(dirname(abspath(__file__)), 'templates')
        file_loader = FileSystemLoader(templates_dir)
        env = Environment( loader = file_loader )
        template = env.get_template('index.html')
        
        # handle possible subdirectories
        path = Path(name_dashboard)
        path.parent.mkdir(exist_ok=True, parents=True)
        
        # write template
        with codecs.open(name_dashboard,'w','utf-8') as dashboard_writer:
            dashboard_writer.write(template.render(
                data = 'This is placeholder data'
            ))
    else:
        print('4. Creating dashboard HTML: Skipping step')

if __name__ == '__main__':
    output_paths, database_path, generate_dashboard, name_dashboard = parse_arguments()
    process_database(database_path)
    process_outputs(output_paths)
    process_dashboard(generate_dashboard, name_dashboard)