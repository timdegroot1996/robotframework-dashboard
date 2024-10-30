from robot.api import ExecutionResult, ResultVisitor
from robot.result.model import TestCase, TestSuite, Keyword
from datetime import datetime
from pathlib import Path


class OutputProcessor:
    def get_output_data(self, output_path: Path):
        output = ExecutionResult(output_path)
        run_list, suite_list, test_list, keyword_list = [], [], [], []
        output.visit(RunProcessor(output.generation_time, run_list))
        output.visit(SuiteProcessor(output.generation_time, suite_list))
        output.visit(TestProcessor(output.generation_time, test_list))
        output.visit(KeywordProcessor(output.generation_time, keyword_list))
        average_keyword_list = self.calculate_keyword_averages(keyword_list)
        return {
            "runs": run_list,
            "suites": suite_list,
            "tests": test_list,
            "keywords": average_keyword_list,
        }

    def calculate_keyword_averages(self, keyword_list: list):
        average_keyword_dict = {}
        average_keyword_list = []
        for keyword in keyword_list:
            run_start = keyword[0]
            name = keyword[1]
            passed = int(keyword[2])
            failed = int(keyword[3])
            skipped = int(keyword[4])
            elapsed_s = keyword[5]
            if not name in average_keyword_dict.keys():
                average_keyword_dict[name] = {
                    "passed": passed,
                    "failed": failed,
                    "skipped": skipped,
                    "elapsed_s": [elapsed_s],
                }
            else:
                average_keyword_dict[name]["passed"] += passed
                average_keyword_dict[name]["failed"] += failed
                average_keyword_dict[name]["skipped"] += skipped
                average_keyword_dict[name]["elapsed_s"].append(elapsed_s)
        for name in average_keyword_dict.keys():
            elapsed_list = average_keyword_dict[name]["elapsed_s"]
            sum_elapsed_list = sum(elapsed_list)
            len_elapsed_list = len(elapsed_list)
            min_elapsed_list = min(elapsed_list)
            max_elapsed_list = max(elapsed_list)
            average_keyword_list.append(
                (
                    run_start,  # run_start
                    name,  # keyword name
                    average_keyword_dict[name]["passed"],  # amount of passes
                    average_keyword_dict[name]["failed"],  # amount of fails
                    average_keyword_dict[name]["skipped"],  # amount of skips
                    len_elapsed_list,  # times used
                    round(sum_elapsed_list, 3),  # total usage time
                    round(sum_elapsed_list / len_elapsed_list, 3),  # average usage time
                    round(min_elapsed_list, 3),  # fastest usage time
                    round(max_elapsed_list, 3),  # slowest usage time
                )
            )
        return average_keyword_list


class RunProcessor(ResultVisitor):
    def __init__(self, run_time: datetime, run_list: list):
        self.run_list = run_list
        self.run_time = run_time

    def visit_suite(self, suite: TestSuite):
        stats = suite.statistics
        self.run_list.append(
            (
                self.run_time,
                suite.full_name,
                suite.name,
                stats.total,
                stats.passed,
                stats.failed,
                stats.skipped,
                round(suite.elapsed_time.total_seconds(), 3),
                suite.start_time,
            )
        )


class SuiteProcessor(ResultVisitor):

    def __init__(self, run_time: datetime, suite_list: list):
        self.suite_list = suite_list
        self.run_time = run_time

    def start_suite(self, suite: TestSuite):
        if suite.tests:
            try:
                stats = suite.statistics.all
            except:
                stats = suite.statistics
            self.suite_list.append(
                (
                    self.run_time,
                    suite.longname,
                    suite.name,
                    stats.total,
                    stats.passed,
                    stats.failed,
                    stats.skipped,
                    round(suite.elapsed_time.total_seconds(), 3),
                    suite.start_time,
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
                round(test.elapsed_time.total_seconds(), 3),
                test.start_time,
                test.message[:150],
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
                round(keyword.elapsed_time.total_seconds(), 3),
            )
        )
