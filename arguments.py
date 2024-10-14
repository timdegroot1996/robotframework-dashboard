import argparse
from datetime import datetime
from version import __version__


class ArgumentParser:
    def parse_arguments(self):
        parser = argparse.ArgumentParser(add_help=False)
        parser.add_argument(
            "-v",
            "--version",
            action="store_true",
            dest="version",
            help="Display application version information",
        )
        parser.add_argument(
            "-h",
            "--help",
            help="Provide additional information",
            action="help",
            default=argparse.SUPPRESS,
        )
        parser.add_argument(
            "-o",
            "--outputPath",
            help="Specifies  1 or more paths to output.xml. \
                            Specify every XML with -o if you are providing more than one.",
            action="append",
            nargs="*",
            default=None,
        )
        parser.add_argument(
            "-d",
            "--databasePath",
            help="Specifies the path to the database you want to \
                            store the results in.",
            default="./robot_results.db",
        )
        parser.add_argument(
            "-g",
            "--generateDashboard",
            help="Specifies if you want to generate the HTML \
                            dashboard. Default is True, override if you only require the database.",
            default=True,
        )
        parser.add_argument(
            "-n",
            "--nameDashboard",
            help="Specifies a custom HTML dashboard name",
            default="",
        )
        arguments = parser.parse_args()
        if arguments.version:
            print(__version__)
            exit(0)
        generate_dashboard = (
            True
            if arguments.generateDashboard == True
            or arguments.generateDashboard.lower() == "true"
            else False
        )
        if arguments.nameDashboard == "":
            dashboard_name = (
                f"robot_dashboard_{datetime.now().strftime('%Y%m%d-%H%M%S')}.html"
            )
        elif not arguments.nameDashboard.endswith(".html"):
            dashboard_name = f"{arguments.nameDashboard}.html"
        else:
            dashboard_name = arguments.nameDashboard
        return (
            arguments.outputPath,
            arguments.databasePath,
            generate_dashboard,
            dashboard_name,
        )
