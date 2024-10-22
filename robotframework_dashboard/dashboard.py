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

        # handle possible subdirectories
        path = Path(name_dashboard)
        path.parent.mkdir(exist_ok=True, parents=True)

        # write template
        with open(name_dashboard, "w") as file:
            file.write(dashboard_data)

        # warn in case of empty database
        if len(data["runs"]) == 0:
            print(f"  WARNING: There are no runs so the dashboard will be empty!")
