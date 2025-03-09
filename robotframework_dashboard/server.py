from .robotdashboard import RobotDashboard
from fastapi import FastAPI
from uvicorn import run


class ApiServer:
    def __init__(
        self,
    ):
        self.app = FastAPI()
        self.robotdashboard: RobotDashboard

        @self.app.get("/")
        async def hello_world():
            return {"Hello": "World"}
        
        @self.app.get("/run")
        async def run_robotdashboard():
            # 1. Database preparation
            self.robotdashboard.initialize_database(supress=False, get_database=False)
            # 2. Processing output XML(s)
            self.robotdashboard.process_outputs()
            # 3. Listing all available runs in the database
            self.robotdashboard.print_runs()
            # 4. Removing runs from the database
            self.robotdashboard.remove_outputs()
            # 5. Creating dashboard HTML
            self.robotdashboard.create_dashboard()
            return {"success": "1"}

    def set_robotdashboard(self, robotdashboard: RobotDashboard):
        self.robotdashboard = robotdashboard

    def run(self):
        run(self.app, host="127.0.0.1", port=1234)


# 1. /robotdashboard -> host the latest robotdashboard.html
# 2. /add-output -> add output
# 3. /delete-output -> delete output
# 4.

# relevant args
#     database_class: Path,
#     database_path: Path,
#     dashboard_title: str,
#     exclude_milliseconds: bool,
