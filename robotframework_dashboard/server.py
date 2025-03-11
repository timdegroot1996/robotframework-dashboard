from .robotdashboard import RobotDashboard
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from uvicorn import run
from os.path import join, abspath, dirname


class ApiServer:
    def __init__(self, server_host: str, server_port: int):
        self.app = FastAPI()
        self.robotdashboard: RobotDashboard
        self.server_host = server_host
        self.server_port = server_port

        @self.app.get("/", response_class=HTMLResponse)
        async def admin_page():
            admin_file = join(dirname(abspath(__file__)), "templates", "admin.html")
            admin_html = open(admin_file, "r").read()
            runs_table = self.get_runs_table()
            admin_html = admin_html.replace(
                '<table id="runsTable"></table>', runs_table
            )
            return admin_html

        @self.app.post("/add-output")
        async def add_output_to_database():
            return {"success": "1", "message": "added successfully"}

        @self.app.post("/remove-output")
        async def remove_output_from_database():
            return {"success": "1", "message": "removed successfully"}

        @self.app.get("/dashboard", response_class=HTMLResponse)
        async def dashboard_page():
            robot_dashboard_html = open("robot_dashboard.html", "r").read()
            return robot_dashboard_html

    def set_robotdashboard(self, robotdashboard: RobotDashboard):
        self.robotdashboard = robotdashboard
        self.robotdashboard.dashboard_name = "robot_dashboard.html"
        self.robotdashboard.dashboard_title = "Robot Framework Dashboard"
        self.robotdashboard.server = True
        self.robotdashboard.supress = True
        # make sure the database and the dashboard html exist
        self.robotdashboard.initialize_database(get_database=False)
        self.robotdashboard.create_dashboard()

    def run(self):
        run(self.app, host=self.server_host, port=self.server_port)

    def get_runs_table(self):
        runs, names = self.robotdashboard.get_runs()
        run_table = '<table class="table table-striped table-dark table-bordered" id="runsTable"><tr><th>Run ID</th><th>Run Start</th><th>Run Name</th></tr>'
        for index, run in enumerate(runs):
            run_table += (
                f"<tr><td>{index}</td><td>{run}</td><td>{names[index]}</td></tr>"
            )
        run_table += "</table>"
        return run_table
