import argparse
from datetime import datetime
from sys import exit
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
        parser = argparse.ArgumentParser(
            add_help=False,
            formatter_class=argparse.RawTextHelpFormatter,
            epilog="For full documentation, visit: https://timdegroot1996.github.io/robotframework-dashboard/",
        )
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
            help=(
                "`path`  Specifies one or more paths to output.xml.\n"
                "        If providing multiple XML files, specify -o for each file."
            ),
            action="append",
            nargs="*",
            default=None,
        )
        parser.add_argument(
            "-f",
            "--outputfolderpath",
            help=(
                "`path`  Specifies a directory path. All folders and subfolders will be\n"
                "        scanned for *output*.xml files to be processed into the database."
            ),
            default=None,
        )
        parser.add_argument(
            "-r",
            "--removeruns",
            help=(
                "`string` Specifies one or more indexes, run_starts, aliases, or tags to remove\n"
                "         from the database. Multiple runs can be provided when separated by\n"
                "         commas (,).\n\n"
                "         You must specify the data type (index, run_start, alias, or tag).\n"
                "         Multiple types may be combined.\n\n"
                "         Indexes support ranges using ':' and multiple values using ';'.\n\n"
                "         Examples:\n"
                "           -r index=0,index=1:4;9,index=10\n"
                "           --removeruns 'run_start=2024-07-30 15:27:20.184407,index=20'\n"
                "           -r alias=some_cool_alias,tag=prod,tag=dev"
            ),
            action="append",
            nargs="*",
            default=None,
        )
        parser.add_argument(
            "-d",
            "--databasepath",
            help=(
                "`path`  Specifies the path to the database in which results are stored."
            ),
            default="robot_results.db",
        )
        parser.add_argument(
            "-n",
            "--namedashboard",
            help="`path`  Specifies a custom HTML dashboard file name.",
            default="",
        )
        parser.add_argument(
            "-j",
            "--jsonconfig",
            help=(
                "`path`  Specifies a path to a dashboard JSON config. It is used as the\n"
                "        default on first load if no config exists yet."
            ),
            default=None,
        )
        parser.add_argument(
            "-t",
            "--dashboardtitle",
            help="`string` Specifies a custom HTML report title for the dashboard.",
            default="",
        )
        parser.add_argument(
            "-m",
            "--messageconfig",
            help=(
                "`path`  Specifies a config file containing message lines with placeholders\n"
                "        used to 'bundle' test messages.\n\n"
                "        Example message lines:\n"
                "          'The test has failed on date: ${date}'\n"
                "          'Expected ${x} but received: ${y}'\n\n"
                "        Placeholders match any value; actual content does not matter."
            ),
            default=None,
        )
        parser.add_argument(
            "-q",
            "--quantity",
            help=(
                "`integer` Specifies the default number of runs shown in the dashboard on\n"
                "          initial load (Amount Filter)."
            ),
            default=None,
        )
        parser.add_argument(
            "-u",
            "--uselogs",
            help=(
                "`boolean` Enables clickable graphs that open the corresponding log files.\n\n"
                "          The log.html file must exist in the same folder as output.xml.\n"
                "          Naming rules:\n"
                "            Replace 'output' → 'log'\n"
                "            Replace 'xml'    → 'html'\n\n"
                "          Examples:\n"
                "            output-20250313-002134.xml  → log-20250313-002134.html\n"
                "            01-output.xml               → 01-log.html"
            ),
            default=False,
        )
        parser.add_argument(
            "-g",
            "--generatedashboard",
            help=(
                "`boolean` Whether to generate the HTML dashboard.\n"
                "          Default: True. Override if only the database is needed."
            ),
            default=True,
        )
        parser.add_argument(
            "-l",
            "--listruns",
            help=(
                "`boolean` Whether runs should be listed.\n"
                "          Default: True. Override if only the database is needed."
            ),
            default=True,
        )
        parser.add_argument(
            "-c",
            "--databaseclass",
            help=(
                "`path`  Specifies the path to a custom database class implementation.\n"
                "        If omitted, the default SQLite3 implementation is used.\n\n"
                "        Useful for custom or non-SQLite databases.\n\n"
            ),
            default=None,
        )
        parser.add_argument(
            "-s",
            "--server",
            help=(
                "Provide the server argument in one of the following forms:\n\n"
                "  robotdashboard --server default[:username:password]\n"
                "  robotdashboard --server host:port[:username:password]\n\n"
                "Examples:\n"
                "  robotdashboard --server default:admin:secret\n"
                "  robotdashboard --server 0.0.0.0:8080:admin:secret\n\n"
                "If username:password is omitted, security is disabled."
            ),
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

        # handles the processing of --removeruns
        remove_runs = None
        if arguments.removeruns:
            remove_runs = []
            for runs in arguments.removeruns:
                parts = str(runs[0]).split(",")
                for part in parts:
                    remove_runs.append(part)

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

        # handles the boolean handling of --uselogs
        use_logs = None
        if isinstance(arguments.uselogs, str) and arguments.uselogs.lower() == "true":
            use_logs = True
        else:
            use_logs = False

        # generates the datetime used in the file dashboard name and the html title
        generation_datetime = datetime.now()

        # handles the custom test message handling
        message_config = []
        if arguments.messageconfig:
            with open(arguments.messageconfig) as file:
                for line in file:
                    message_config.append(line.strip())

        # handles the json config
        json_config = []
        if arguments.jsonconfig:
            with open(arguments.jsonconfig) as file:
                json_config = file.read()

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
        server_port = 8543
        server_user = ""
        server_pass = ""
        if arguments.server:
            start_server = True
            parts = arguments.server.split(":")

            if parts[0] == "default":
                # e.g. default[:username:password]
                if len(parts) == 3:
                    server_user = parts[1]
                    server_pass = parts[2]
            else:
                # e.g. host:port or host:port:username:password
                server_host = parts[0]
                server_port = int(parts[1])
                if len(parts) == 4:
                    server_user = parts[2]
                    server_pass = parts[3]
        else:
            start_server = False

        # handles the quantity argument
        quantity = arguments.quantity
        if quantity == None:
            quantity = 20
        else:
            int(quantity)

        # return all provided arguments
        provided_args = {
            "outputs": outputs,
            "output_folder_path": outputfolderpath,
            "database_path": arguments.databasepath,
            "generate_dashboard": generate_dashboard,
            "dashboard_name": dashboard_name,
            "generation_datetime": generation_datetime,
            "list_runs": list_runs,
            "remove_runs": remove_runs,
            "dashboard_title": arguments.dashboardtitle,
            "database_class": database_class,
            "start_server": start_server,
            "server_host": server_host,
            "server_port": server_port,
            "server_user": server_user,
            "server_pass": server_pass,
            "json_config": json_config,
            "message_config": message_config,
            "quantity": quantity,
            "use_logs": use_logs,
        }
        return dotdict(provided_args)
