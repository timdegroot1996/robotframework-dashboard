from .robotdashboard import RobotDashboard
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from uvicorn import run
from os.path import join, abspath, dirname


class ApiServer:
    """Robot Dashboard server implementation, this class handles the admin page and all functions related to the server"""

    def __init__(self, server_host: str, server_port: int):
        """Init function that starts up the fastapi app and initializes all the vars and endpoints"""
        self.app = FastAPI()
        self.robotdashboard: RobotDashboard
        self.server_host = server_host
        self.server_port = server_port

        @self.app.get("/", response_class=HTMLResponse)
        async def admin_page():
            """Admin page endpoint function"""
            admin_file = join(dirname(abspath(__file__)), "templates", "admin.html")
            admin_html = open(admin_file, "r").read()
            runs_table = self.get_runs_table()
            admin_html = admin_html.replace(
                '<table id="runsTable"></table>', runs_table
            )
            return admin_html

        @self.app.post("/add-output")
        async def add_output_to_database():
            """Add output to database endpoint function"""
            return {"success": "1", "message": "added successfully"}

        @self.app.post("/remove-output")
        async def remove_output_from_database():
            """Remove output from database endpoint function"""
            return {"success": "1", "message": "removed successfully"}

        @self.app.get("/dashboard", response_class=HTMLResponse)
        async def dashboard_page():
            """Serve robotdashboard HTML endpoint function"""
            robot_dashboard_html = open("robot_dashboard.html", "r").read()
            return robot_dashboard_html

    def set_robotdashboard(self, robotdashboard: RobotDashboard):
        """Function to initialize the RobotDashboard class"""
        self.robotdashboard = robotdashboard
        self.robotdashboard.server = True

    def run(self):
        """Function to start up the FastAPI server through uvicorn"""
        run(self.app, host=self.server_host, port=self.server_port)

    def get_runs_table(self):
        """Function to get an HTML table of the runs in the database"""
        runs, names = self.robotdashboard.get_runs()
        run_table = '<table class="table table-striped table-dark table-bordered" id="runsTable"><tr><th>Run ID</th><th>Run Start</th><th>Run Name</th></tr>'
        for index, run in enumerate(runs):
            run_table += (
                f"<tr><td>{index}</td><td>{run}</td><td>{names[index]}</td></tr>"
            )
        run_table += "</table>"
        return run_table
