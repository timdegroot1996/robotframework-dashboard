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
            help="`string` Specifies 1 or more indexes, run_starts, aliases or tags to remove from the database. \
                            You can add multiple runs to remove in one call as long as you split with a comma (,). \
                            Do note that it is required to specify the type of data you are providing (index, run_start, alias or tag). \
                            Multiple types of data at once is allowed! With indexes you can use : for ranges and ; for singular indexes at once. \
                            Examples: -r index=0,index=1:4;9,index=10 or --removeruns 'run_start=2024-07-30 15:27:20.184407,index=20' \
                            or -r alias=some_cool_alias,tag=prod,tag=dev",
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
            "-j",
            "--jsonconfig",
            help="`path` Specifies a path to a a dashboard json config that will be used as default on first load if there is none already.",
            default=None,
        )
        parser.add_argument(
            "-t",
            "--dashboardtitle",
            help="`string` Specifies a custom dashboard html report title.",
            default="",
        )
        parser.add_argument(
            "-m",
            "--messageconfig",
            help="`path` Specifies the path to a config file that contains lines of messages with placeholders to 'bundle' test messages. \
                Example lines can be 'The test has failed on date: ${date}' or 'Expected ${x} but received: ${y}'. Placeholders match everything and the content is irrelevant.",
            default=None,
        )
        parser.add_argument(
            "-q",
            "--quantity",
            help="`integer` Specifies the default amount (Amount Filter) of runs that are shown in the dashboard on first load.",
            default=None,
        )
        parser.add_argument(
            "-u",
            "--uselogs",
            help="`boolean` Whether to enable clicking on graphs will open the logs. Providing this argument makes runs/suites/tests/keywords clickable.\
                The click will open the respective log file in a new tab. This feature uses the path to the output.xml file as a base to find the log.html files.\
                The log.html should be in the same folder as the output.xml file and should have a similar name. 'output' is replaced by 'log' and 'xml' is replaced by 'html' \
                Example: 'output-20250313-002134.xml' should have 'log-20250313-002134.html' in the same folder, '01-output.xml' expects '01-log.html' etc.",
            default=False,
        )
        parser.add_argument(
            "-g",
            "--generatedashboard",
            help="`boolean` Specifies if you want to generate the HTML \
                            dashboard. Default is True, override if you only require the database.",
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
                to start a server. See http://github.com/timdegroot1996/robotframework-dashboard?tab=readme-ov-file#Dashboard-Server for additional information!",
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
        if arguments.server:
            start_server = True
            if arguments.server != "default":
                server_host, server_port = arguments.server.split(":")
                server_port = int(server_port)
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
            "json_config": json_config,
            "message_config": message_config,
            "quantity": quantity,
            "use_logs": use_logs,
        }
        return dotdict(provided_args)
