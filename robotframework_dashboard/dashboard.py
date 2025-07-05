from os.path import join, abspath, dirname
from pathlib import Path
from datetime import datetime
from json import dumps
from .version import __version__
from zlib import compress
from base64 import b64encode


class DashboardGenerator:
    """Class that handles the generation of the dashboard HTML"""

    def generate_dashboard(
        self,
        name_dashboard: str,
        data: dict,
        generation_datetime: datetime,
        dashboard_title: str,
        server: bool,
        json_config: str,
        message_config: list,
        quantity: int,
        use_logs: bool,
    ):
        """Function that generates the dashboard"""
        # load template
        index_html = join(dirname(abspath(__file__)), "templates", "dashboard.html")
        with open(index_html, "r") as file:
            dashboard_data = file.read()
            dashboard_data = dashboard_data.replace(
                '"placeholder_version"', __version__
            )
            dashboard_data = dashboard_data.replace(
                '"placeholder_runs"', f'"{self.compress_and_encode(data["runs"])}"'
            )
            dashboard_data = dashboard_data.replace(
                '"placeholder_suites"', f'"{self.compress_and_encode(data["suites"])}"'
            )
            dashboard_data = dashboard_data.replace(
                '"placeholder_tests"', f'"{self.compress_and_encode(data["tests"])}"'
            )
            dashboard_data = dashboard_data.replace(
                '"placeholder_keywords"',
                f'"{self.compress_and_encode(data["keywords"])}"',
            )
            dashboard_data = dashboard_data.replace(
                '"placeholder_amount"', str(quantity)
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
                dashboard_data = dashboard_data.replace('"placeholder_server"', "true")
            else:
                dashboard_data = dashboard_data.replace('"placeholder_server"', "false")
            if message_config:
                dashboard_data = dashboard_data.replace(
                    '"placeholder_message_config"',
                    str(message_config).replace("'", '"'),
                )
            if json_config:
                dashboard_data = dashboard_data.replace(
                    '"placeholder_json_config"',
                    json_config,
                )
            if use_logs:
                dashboard_data = dashboard_data.replace(
                    '"placeholder_use_logs"', "true"
                )
            else:
                dashboard_data = dashboard_data.replace(
                    '"placeholder_use_logs"', "false"
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

    def compress_and_encode(self, obj):
        json_data = dumps(obj).encode("utf-8")
        compressed = compress(json_data)
        return b64encode(compressed).decode("utf-8")
