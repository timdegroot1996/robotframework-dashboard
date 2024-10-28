from os.path import join, abspath, dirname
from pathlib import Path
from datetime import datetime
from json import dumps


class DashboardGenerator:
    def generate_dashboard(
        self, name_dashboard: str, data: dict, generation_datetime: datetime
    ):
        # load template
        index_html = join(dirname(abspath(__file__)), "templates", "index.html")
        with open(index_html, "r") as file:
            dashboard_data = file.read()
        dashboard_data = dashboard_data.replace(
            '"placeholder_runs"', dumps(data["runs"])
        )
        dashboard_data = dashboard_data.replace(
            '"placeholder_suites"', dumps(data["suites"])
        )
        dashboard_data = dashboard_data.replace(
            '"placeholder_tests"', dumps(data["tests"])
        )
        dashboard_data = dashboard_data.replace(
            '"placeholder_keywords"', dumps(data["keywords"])
        )
        dashboard_data = dashboard_data.replace(
            '"placeholder_generation_date"', str(generation_datetime)[:-7]
        )
        dashboard_data = self._insert_css(dashboard_data, "static/style.css")
        dashboard_data = self._insert_js(dashboard_data, "static/styling.js")
        dashboard_data = self._insert_js(dashboard_data, "static/filters.js")
        dashboard_data = self._insert_js(dashboard_data, "static/graph_config.js")
        dashboard_data = self._insert_js(dashboard_data, "static/graph_data.js")
        dashboard_data = self._insert_js(dashboard_data, "static/run_graphs.js")
        dashboard_data = self._insert_js(dashboard_data, "static/suite_graphs.js")
        dashboard_data = self._insert_js(dashboard_data, "static/test_graphs.js")
        dashboard_data = self._insert_js(dashboard_data, "static/keyword_graphs.js")

        # handle possible subdirectories
        path = Path(name_dashboard)
        path.parent.mkdir(exist_ok=True, parents=True)

        # write template
        with open(name_dashboard, "w") as file:
            file.write(dashboard_data)

        # warn in case of empty database
        if len(data["runs"]) == 0:
            print(f"  WARNING: There are no runs so the dashboard will be empty!")

    def _insert_css(self, dashboard_data: str, path: str):
        css = open(join(dirname(abspath(__file__)), path), "r").read()
        dashboard_data = dashboard_data.replace(
            f'<link rel="stylesheet" type="text/css" href="../{path}" media="all" />',
            f"<style>{css}</style>",
        )
        return dashboard_data

    def _insert_js(self, dashboard_data: str, path: str):
        js = open(join(dirname(abspath(__file__)), path), "r").read()
        dashboard_data = dashboard_data.replace(
            f'<script type="text/javascript" src="../{path}"></script>',
            f'<script type="text/javascript">{js}</script>',
        )
        return dashboard_data
