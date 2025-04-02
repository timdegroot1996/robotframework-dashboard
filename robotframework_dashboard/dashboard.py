from os.path import join, abspath, dirname
from pathlib import Path
from datetime import datetime
from json import dumps
from .version import __version__


class DashboardGenerator:
    """Class that handles the generation of the dashboard HTML"""

    def generate_dashboard(
        self,
        name_dashboard: str,
        data: dict,
        generation_datetime: datetime,
        dashboard_title: str,
        exclude_milliseconds: bool,
        server: bool,
        use_run_aliases: bool,
    ):
        """Function that generates the dashboard"""
        # update the dashboard data to exclude milliseconds if needed
        if exclude_milliseconds:
            for index, run in enumerate(data["runs"]):
                data["runs"][index]["run_start"] = data["runs"][index][
                    "run_start"
                ].split(".")[0]
            for index, suite in enumerate(data["suites"]):
                data["suites"][index]["run_start"] = data["suites"][index][
                    "run_start"
                ].split(".")[0]
            for index, test in enumerate(data["tests"]):
                data["tests"][index]["run_start"] = data["tests"][index][
                    "run_start"
                ].split(".")[0]
            for index, keyword in enumerate(data["keywords"]):
                data["keywords"][index]["run_start"] = data["keywords"][index][
                    "run_start"
                ].split(".")[0]

        # load template
        index_html = join(dirname(abspath(__file__)), "templates", "dashboard.html")
        with open(index_html, "r") as file:
            dashboard_data = file.read()
            dashboard_data = dashboard_data.replace(
                '"placeholder_version"', __version__
            )
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
            if dashboard_title != "":
                dashboard_data = dashboard_data.replace(
                    '"placeholder_dashboard_title"', dashboard_title
                )
            else:
                dashboard_data = dashboard_data.replace(
                    '"placeholder_dashboard_title"',
                    f"Robot Framework Dashboard - {str(generation_datetime)[:-7]}",
                )
            if server:
                dashboard_data = dashboard_data.replace(
                    'hidden="placeholder_server_admin_page"', ""
                )
            else:
                dashboard_data = dashboard_data.replace(
                    'hidden="placeholder_server_admin_page"', "hidden"
                )
            if use_run_aliases:
                dashboard_data = dashboard_data.replace(
                    "const use_run_aliases = false", "const use_run_aliases = true"
                )

        # handle possible subdirectories
        path = Path(name_dashboard)
        path.parent.mkdir(exist_ok=True, parents=True)

        # write template
        with open(name_dashboard, "w") as file:
            file.write(dashboard_data)

        # warn in case of empty database
        if len(data["runs"]) == 0:
            print(f"  WARNING: There are no runs so the dashboard will be empty!")
