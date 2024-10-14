from robot.api import ExecutionResult, ResultVisitor
from robot.result.model import TestCase, TestSuite, Keyword
from datetime import datetime
from pathlib import Path


class OutputProcessor:
    def get_output_data(self, output_path: Path):
        output = ExecutionResult(output_path)
        suite_list, test_list, keyword_list = [], [], []
        output.visit(SuiteProcessor(output.generation_time, suite_list))
        output.visit(TestProcessor(output.generation_time, test_list))
        output.visit(KeywordProcessor(output.generation_time, keyword_list))
        return {
            "suites": suite_list,
            "tests": test_list,
            "keywords": keyword_list,
        }


class SuiteProcessor(ResultVisitor):
    def __init__(self, run_time: datetime, suite_list: list):
        self.suite_list = suite_list
        self.run_time = run_time

    def visit_suite(self, suite: TestSuite):
        stats = suite.statistics
        self.suite_list.append(
            (
                self.run_time,
                suite.full_name,
                suite.name,
                stats.total,
                stats.passed,
                stats.failed,
                stats.skipped,
                suite.elapsed_time.seconds,
                suite.start_time,
                suite.end_time,
            )
        )


class TestProcessor(ResultVisitor):
    def __init__(self, run_time: datetime, test_list: list):
        self.test_list = test_list
        self.run_time = run_time

    def visit_test(self, test: TestCase):
        self.test_list.append(
            (
                self.run_time,
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


class KeywordProcessor(ResultVisitor):
    def __init__(self, run_time: datetime, keyword_list: list):
        self.keyword_list = keyword_list
        self.run_time = run_time

    def end_keyword(self, keyword: Keyword):
        self.keyword_list.append(
            (
                self.run_time,
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