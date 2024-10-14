from jinja2 import Environment, FileSystemLoader
from os.path import join, abspath, dirname
from pathlib import Path
from datetime import datetime
import codecs


class DashboardGenerator:
    def generate_dashboard(self, name_dashboard: str, data: dict, generation_datetime: datetime):
        # load template
        templates_dir = join(dirname(abspath(__file__)), "templates")
        file_loader = FileSystemLoader(templates_dir)
        env = Environment(loader=file_loader)
        template = env.get_template("index.html")

        # handle possible subdirectories
        path = Path(name_dashboard)
        path.parent.mkdir(exist_ok=True, parents=True)

        # write template
        with codecs.open('robot_dashboard.html', "w", "utf-8") as dashboard_writer:
            dashboard_writer.write(
                template.render(
                    date=generation_datetime,
                    suites=data["suites"],
                    tests=data["tests"],
                    keywords=data["keywords"],
                )
            )
