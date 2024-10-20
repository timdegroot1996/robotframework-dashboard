from jinja2 import Environment, FileSystemLoader
from os.path import join, abspath, dirname
from pathlib import Path
from datetime import datetime
from codecs import open as codecs_open
from json import dumps


class DashboardGenerator:
    def generate_dashboard(
        self, name_dashboard: str, data: dict, generation_datetime: datetime
    ):
        # load template
        templates_dir = join(dirname(abspath(__file__)), "templates")
        file_loader = FileSystemLoader(templates_dir)
        env = Environment(loader=file_loader)
        template = env.get_template("index.html")

        # handle possible subdirectories
        path = Path(name_dashboard)
        path.parent.mkdir(exist_ok=True, parents=True)

        # warn in case of empty database
        if len(data["runs"]) == 0:
            print(f"  WARNING: There are no runs so the dashboard will be empty!")

        # write template
        with codecs_open(name_dashboard, "w", "utf-8") as dashboard_writer:
            dashboard_writer.write(
                template.render(
                    date=str(generation_datetime)[:-7],
                    runs=dumps(data["runs"]),
                    suites=dumps(data["suites"]),
                    tests=dumps(data["tests"]),
                    keywords=dumps(data["keywords"]),
                )
            )
