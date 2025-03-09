from .arguments import ArgumentParser
from .robotdashboard import RobotDashboard
from .server import ApiServer


def main():
    """Main function that runs robotdashboard. Everything is orcestrated from here!"""
    print(
        "======================================================================================"
    )
    print(
        """ ____   ___  ____   ___ _____ ____    _    ____  _   _ ____   ___    _    ____  ____  
|  _ \ / _ \| __ ) / _ |_   _|  _ \  / \  / ___|| | | | __ ) / _ \  / \  |  _ \|  _ \ 
| |_) | | | |  _ \| | | || | | | | |/ _ \ \___ \| |_| |  _ \| | | |/ _ \ | |_) | | | |
|  _ <| |_| | |_) | |_| || | | |_| / ___ \ ___) |  _  | |_) | |_| / ___ \|  _ <| |_| |
|_| \_\\\\___/|____/ \___/ |_| |____/_/   \_|____/|_| |_|____/ \___/_/   \_|_| \_|____/ 
"""
    )
    print(
        "======================================================================================"
    )
    arguments = ArgumentParser().get_arguments()
    robotdashboard = RobotDashboard(
        arguments.outputs,
        arguments.output_folder_path,
        arguments.database_path,
        arguments.generate_dashboard,
        arguments.dashboard_name,
        arguments.generation_datetime,
        arguments.list_runs,
        arguments.remove_runs,
        arguments.dashboard_title,
        arguments.exclude_milliseconds,
        arguments.database_class,
    )
    if arguments.start_server:
        server = ApiServer()
        server.set_robotdashboard(robotdashboard)
        server.run()
    else:
        # 1. Database preparation
        robotdashboard.initialize_database(supress=False, get_database=False)
        # 2. Processing output XML(s)
        robotdashboard.process_outputs()
        # 3. Listing all available runs in the database
        robotdashboard.print_runs()
        # 4. Removing runs from the database
        robotdashboard.remove_outputs()
        # 5. Creating dashboard HTML
        robotdashboard.create_dashboard()
