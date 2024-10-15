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
                            Specify every XML separately with -o if you are providing more than one.",
            action="append",
            nargs="*",
            default=None,
        )
        parser.add_argument(
            "-r",
            "--removeRuns",
            help="Specifies 1 or more indexes or run_start datetimes to remove from the database. \
                            Specify every run separately with -r if you are providing more than one. \
                            Examples: -r 0 -r 1 -r 10 or --removeRuns '2024-07-30 15:27:20.184407' -r 20",
            action="append",
            nargs="*",
            default=None,
        )
        parser.add_argument(
            "-d",
            "--databasePath",
            help="Specifies the path to the database you want to \
                            store the results in.",
            default=".\\robot_results.db",
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
        parser.add_argument(
            "-l",
            "--listRuns",
            help="Specifies if the runs should be listed",
            default=True,
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
        list_runs = (
            True
            if arguments.listRuns == True
            or arguments.listRuns.lower() == "true"
            else False
        )
        generation_datetime = datetime.now()
        if arguments.nameDashboard == "":
            dashboard_name = (
                f".\\robot_dashboard_{generation_datetime.strftime('%Y%m%d-%H%M%S')}.html"
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
            generation_datetime,
            list_runs,
            arguments.removeRuns,
        )
