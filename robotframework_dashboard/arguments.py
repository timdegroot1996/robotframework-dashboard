import argparse
from datetime import datetime
from re import split
from os import getcwd
from os.path import join, exists
from .version import __version__


class dotdict(dict):
    """dot.notation access to dictionary attributes"""

    __getattr__ = dict.get
    __setattr__ = dict.__setitem__
    __delattr__ = dict.__delitem__


class ArgumentParser:
    """Parse the input arguments that can be provided to robotdashboard
    Only get_arguments is called, all other functions are helper functions"""

    def get_arguments(self):
        """The function that handles the complete parsing process"""
        try:
            arguments = self._parse_arguments()
            arguments = self._process_arguments(arguments)
        except Exception as error:
            print(
                f" ERROR: There was an issue during the parsing of the provided arguments"
            )
            print(error)
            exit(0)
        return arguments

    def _parse_arguments(self):
        """Parses the actual arguments"""
        parser = argparse.ArgumentParser(add_help=False)
        parser.add_argument(
            "-v",
            "--version",
            action="store_true",
            dest="version",
            help="Display application version information.",
        )
        parser.add_argument(
            "-h",
            "--help",
            help="Provide additional information.",
            action="help",
            default=argparse.SUPPRESS,
        )
        parser.add_argument(
            "-o",
            "--outputpath",
            help="`path` Specifies  1 or more paths to output.xml. \
                            Specify every XML separately with -o if you are providing more than one.",
            action="append",
            nargs="*",
            default=None,
        )
        parser.add_argument(
            "-f",
            "--outputfolderpath",
            help="`path` Specifies a path to a directory in which it will \
                look in all folders and subfolders for *output*.xml files to be processed into the database",
            default=None,
        )
        parser.add_argument(
            "-r",
            "--removeruns",
            help="`string` Specifies 1 or more indexes or run_start datetimes to remove from the database. \
                            Specify every run separately with -r if you are providing more than one. \
                            Examples: -r 0 -r 1 -r 10 or --removeRuns '2024-07-30 15:27:20.184407' -r 20",
            action="append",
            nargs="*",
            default=None,
        )
        parser.add_argument(
            "-d",
            "--databasepath",
            help="`path` Specifies the path to the database you want to \
                            store the results in.",
            default="robot_results.db",
        )
        parser.add_argument(
            "-n",
            "--namedashboard",
            help="`path` Specifies a custom HTML dashboard file name.",
            default="",
        )
        parser.add_argument(
            "-t",
            "--dashboardtitle",
            help="`string` Specifies a custom dashboard html report title.",
            default="",
        )
        parser.add_argument(
            "-e",
            "--excludemilliseconds",
            help="`boolean` Default is True, specifies if the dashboard html shows \
                milliseconds in the graphs. The database will always contain milliseconds.",
            default=True,
        )
        parser.add_argument(
            "-l",
            "--listruns",
            help="`boolean` Specifies if the runs should be listed. \
                Default is True, override if you only require the database.",
            default=True,
        )
        parser.add_argument(
            "-g",
            "--generatedashboard",
            help="`boolean` Specifies if you want to generate the HTML \
                            dashboard. Default is True, override if you only require the database.",
            default=True,
        )
        parser.add_argument(
            "-c",
            "--databaseclass",
            help="`path` Specifies the path to your implementation of the databaseclass. \
                If nothing is provided default Sqlite3 implementation is used. Use this when you \
                want to use a custom implementation or you have your own database type.\
                See https://github.com/timdegroot1996/robotframework-dashboard?tab=readme-ov-file#Custom-Database-Class for additional information!",
            default=None,
        )
        parser.add_argument(
            "-s",
            "--server",
            help="Provide the server argument like 'robotdashboard --server default' or 'robotdashboard --server yourhost:yourport' \
                to start a server. See http://github.com/timdegroot1996/robotframework-dashboard?tab=readme-ov-file#Dashboard-Server for additional information! ",
            default=None,
        )
        return parser.parse_args()

    def _process_arguments(self, arguments):
        """handles the version execution"""
        if arguments.version:
            print(__version__)
            exit(0)

        # handles possible tags on all provided --outputpath
        outputs = None
        if arguments.outputpath:
            outputs = []
            for output in arguments.outputpath:
                splitted = split(r":(?!(\/|\\))", output[0])
                while None in splitted:
                    splitted.remove(
                        None
                    )  # None values are found by re.split because of the 2 conditions
                path = splitted[0]
                tags = splitted[1:]
                outputs.append([path, tags])

        # handles possible tags on all provided --outputfolderpath
        outputfolderpath = None
        if arguments.outputfolderpath:
            splitted = split(r":(?!(\/|\\))", arguments.outputfolderpath)
            while None in splitted:
                splitted.remove(
                    None
                )  # None values are found by re.split because of the 2 conditions
            path = splitted[0]
            tags = splitted[1:]
            outputfolderpath = [path, tags]

        # handles the boolean handling of --generatedashboard
        generate_dashboard = (
            True
            if arguments.generatedashboard == True
            or arguments.generatedashboard.lower() == "true"
            else False
        )

        # handles the boolean handling of --listruns
        list_runs = (
            True
            if arguments.listruns == True or arguments.listruns.lower() == "true"
            else False
        )

        # handles the boolean handling of --excludemilliseconds
        exclude_milliseconds = (
            True
            if arguments.excludemilliseconds == True
            or arguments.excludemilliseconds.lower() == "true"
            else False
        )

        # generates the datetime used in the file dashboard name and the html title
        generation_datetime = datetime.now()

        # handles the custom dashboard name
        if arguments.namedashboard == "":
            dashboard_name = (
                f"robot_dashboard_{generation_datetime.strftime('%Y%m%d-%H%M%S')}.html"
            )
        elif not arguments.namedashboard.endswith(".html"):
            dashboard_name = f"{arguments.namedashboard}.html"
        else:
            dashboard_name = arguments.namedashboard

        # handles the databaseclass implementation and provides the complete path to the module
        database_class = None
        if arguments.databaseclass:
            database_class = join(getcwd(), arguments.databaseclass).replace(
                "\\.\\", "\\"
            )
            if not exists(database_class):
                raise Exception(
                    f"  ERROR: the provided database class did not exist in the expected path: {database_class}"
                )

        # handles the server argument
        server_host = "127.0.0.1"
        server_port = 76268
        if arguments.server != None:
            start_server = True
            if arguments.server != "default":
                server_host, server_port = arguments.server.split(":")
                server_port = int(server_port)
        else:
            start_server = False

        # return all provided arguments
        provided_args = {
            "outputs": outputs,
            "output_folder_path": outputfolderpath,
            "database_path": arguments.databasepath,
            "generate_dashboard": generate_dashboard,
            "dashboard_name": dashboard_name,
            "generation_datetime": generation_datetime,
            "list_runs": list_runs,
            "remove_runs": arguments.removeruns,
            "dashboard_title": arguments.dashboardtitle,
            "exclude_milliseconds": exclude_milliseconds,
            "database_class": database_class,
            "start_server": start_server,
            "server_host": server_host,
            "server_port": server_port,
        }
        return dotdict(provided_args)
