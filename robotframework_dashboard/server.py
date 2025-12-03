from fastapi_offline import FastAPIOffline
from fastapi import Body, Depends, HTTPException, status
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pydantic import BaseModel
from uvicorn import run

from os.path import join, abspath, dirname, exists
from os import remove, mkdir, listdir
from pathlib import Path
from typing import List, Optional
from secrets import compare_digest

from .robotdashboard import RobotDashboard
from .dependencies import DependencyProcessor
from .version import __version__

response_message_model_config = {
    "json_schema_extra": {
        "examples": [
            {
                "success": "1",
                "message": "SUCCESS: processed C:\\docs\\output.xml, see the browser console for more details!",
                "console": """2. Processing output XML(s)
  Processing output XML 'output.xml'
  Processed output XML 'output' in 0.0 seconds
======================================================================================
 5. Creating dashboard HTML
  created dashboard 'C:\\docs\\robot_dashboard.html' in 0.02 seconds""",
            }
        ]
    }
}
get_output_model_config = {
    "json_schema_extra": {
        "examples": [
            {
                "run_start": "2024-10-14 22:32:59.580309",
                "name": "RobotFramework-Dashboard",
                "alias": "cool_run_alias",
                "tags": "prod,tag1,nightly",
            }
        ]
    }
}
add_output_model_config = {
    "json_schema_extra": {
        "examples": [
            {
                "output_path": "C:\\users\\docs\\output.xml",
                "output_tags": ["tag1", "cool-tag2", "production_tag"],
            },
            {
                "output_data": """<?xml version="1.0" encoding="UTF-8"?>
<robot generator="Robot 7.2.2 (Python 3.12.9 on win32)" generated="2025-02-19T17:25:58.443716" rpa="false" schemaversion="5">
<suite id="s1" name="Scripts" source="C:\\docs">
<suite id="s1-s1" name="Google" source="C:\\docs\\google.robot">
<test id="s1-s1-t1" name="Test 01" line="6">... etc""",
                "output_alias": "some_cool_alias",
            },
            {
                "output_path": "C:\\users\\docs\\prod-outputs",
                "output_tags": ["production-run"],
            },
        ]
    }
}
remove_outputs_model_config = {
    "json_schema_extra": {
        "examples": [
            {"indexes": ["0", "-1", "5", "10"]},
            {
                "run_starts": [
                    "2024-10-14 12:32:59.123456",
                    "2024-10-14 22:32:59.580309",
                ]
            },
            {
                "aliases": ["alias1", "alias2"],
                "indexes": ["0", "-1"],
                "tags": ["tag1", "tag2", "tag3"],
            },
        ]
    }
}
add_outputs_openapi_examples = {
    "output path": {
        "summary": "When using an absolute path of an output.xml",
        "description": "When using an absolute path of an output.xml",
        "value": {
            "output_path": "C:\\users\\docs\\output.xml",
            "output_tags": ["tag1", "cool-tag2", "production_tag"],
        },
    },
    "output xml data": {
        "summary": "When using the raw data of the output.xml and sending that directly",
        "description": "When using the raw data of the output.xml and sending that directly",
        "value": {
            "output_data": """<?xml version="1.0" encoding="UTF-8"?>
<robot generator="Robot 7.2.2 (Python 3.12.9 on win32)" generated="2025-02-19T17:25:58.443716" rpa="false" schemaversion="5">
<suite id="s1" name="Scripts" source="C:\\docs">
<suite id="s1-s1" name="Google" source="C:\\docs\\google.robot">
<test id="s1-s1-t1" name="Test 01" line="6">... etc""",
            "output_alias": "some_cool_alias",
        },
    },
    "output folder path": {
        "summary": "When using an absolute folder path that contains output.xml's",
        "description": "When using an absolute folder path that contains output.xml's",
        "value": {
            "output_folder_path": "C:\\users\\docs\\prod-outputs",
            "output_tags": ["production-run"],
        },
    },
}
remove_outputs_openapi_examples = {
    "indexes": {
        "summary": "When removing outputs based on indexes",
        "description": "when removing outputs based on indexes",
        "value": {"indexes": ["0", "-1", "5", "10"]},
    },
    "run_starts": {
        "summary": "When removing outputs based on run_starts",
        "description": "When removing outputs based on run_starts",
        "value": {
            "run_starts": [
                "2024-10-14 12:32:59.123456",
                "2024-10-14 22:32:59.580309",
            ]
        },
    },
    "aliases, indexes and tags": {
        "summary": "When removing outputs based on multiple types: aliases, indexes and tags",
        "description": "When removing outputs based on multiple types: aliases, indexes and tags",
        "value": {
            "aliases": ["alias1", "alias2"],
            "indexes": ["0", "-1"],
            "tags": ["tag1", "tag2", "tag3"],
        },
    },
}
add_log_model_config = {
    "json_schema_extra": {
        "examples": [
            {
                "log_name": "log-20250219-172527.html",
                "log_data": """<!DOCTYPE html><html lang="en"><head>...etc""",
            }
        ]
    }
}
remove_log_model_config = {
    "json_schema_extra": {
        "examples": [
            {
                "log_name": "log-20250219-172527.html",
            },
            {
                "log_name": "all",
            },
        ]
    }
}


class ResponseMessage(BaseModel):
    """The response message model for Adding or Removing runs from the database"""

    success: str
    message: str
    console: str
    model_config = response_message_model_config


class AdminJsonConfig(BaseModel):
    admin_json_config: str


class GetOutput(BaseModel):
    """The response model that is returned when getting outputs"""

    run_start: str
    name: str
    alias: str
    tags: str
    model_config = get_output_model_config


class AddOutput(BaseModel):
    """The model that has to be provided when trying to add outputs to the database"""

    output_path: Optional[str] = None
    output_data: Optional[str] = None
    output_folder_path: Optional[str] = None
    output_tags: Optional[List[str]] = None
    output_alias: Optional[str] = None
    model_config = add_output_model_config


class RemoveOutputs(BaseModel):
    """The model that has to be provided when trying to delete outputs from the database"""

    run_starts: Optional[List[str]] = None
    indexes: Optional[List[str]] = None
    aliases: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    model_config = remove_outputs_model_config


class AddLog(BaseModel):
    """The model to add log files to the server"""

    log_data: str
    log_name: str
    model_config = add_log_model_config


class RemoveLog(BaseModel):
    """The model to remove log files from the server"""

    log_name: str
    model_config = remove_log_model_config


class ApiServer:
    """Robot Dashboard server implementation, this class handles the admin page and all functions related to the server"""

    def __init__(
        self,
        server_host: str,
        server_port: int,
        server_user: str,
        server_pass: str,
        offline_dependencies: bool,
    ):
        """Init function that starts up the fastapi app and initializes all the vars and endpoints"""
        self.app = FastAPIOffline(title="Robot Framework Dashboard Server", version=__version__, favicon_url="https://robotframework.org/favicon.ico")
        self.security = HTTPBasic()
        self.robotdashboard: RobotDashboard
        self.server_host = server_host
        self.server_port = server_port
        self.server_user = server_user
        self.server_pass = server_pass
        self.offline = offline_dependencies
        self.admin_json_config = "{}"
        self.log_dir = "robot_logs"
        self.latest_log_dir = None

        self._setup_routes()
        self._setup_catch_all_route()

    def _get_admin_page(self):
        admin_file = join(dirname(abspath(__file__)), "./templates", "admin.html")
        admin_html = open(admin_file, "r").read()
        admin_html = admin_html.replace('"placeholder_version"', __version__)

        dependency_processor = DependencyProcessor(admin_page=True)
        admin_html = admin_html.replace(
            "<!-- placeholder_javascript -->", dependency_processor.get_js_block()
        )
        admin_html = admin_html.replace(
            "<!-- placeholder_css -->", dependency_processor.get_css_block()
        )
        admin_html = admin_html.replace(
            "<!-- placeholder_dependencies -->",
            dependency_processor.get_dependencies_block(self.offline),
        )
        admin_html = admin_html.replace('"placeholder_version"', __version__)
        return admin_html

    def _setup_routes(self):
        def authenticate(credentials: HTTPBasicCredentials = Depends(self.security)):
            if not self.server_user or not self.server_pass:
                return "anonymous"
            correct_username = compare_digest(credentials.username, self.server_user)
            correct_password = compare_digest(credentials.password, self.server_pass)
            if not (correct_username and correct_password):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid authentication credentials",
                    headers={"WWW-Authenticate": "Basic"},
                )
            return credentials.username

        if not self.server_user or not self.server_pass:

            @self.app.get("/", response_class=HTMLResponse, include_in_schema=False)
            async def admin_page():
                """Admin page endpoint function"""
                return self._get_admin_page()

        else:

            @self.app.get("/", response_class=HTMLResponse, include_in_schema=False)
            async def admin_page(username: str = Depends(authenticate)):
                """Admin page endpoint function"""
                return self._get_admin_page()

        @self.app.get(
            "/dashboard", response_class=HTMLResponse, include_in_schema=False
        )
        async def dashboard_page():
            """Serve robotdashboard HTML endpoint function"""
            robot_dashboard_html = open("robot_dashboard.html", "r").read()
            robot_dashboard_html = robot_dashboard_html.replace(
                '"placeholder_admin_json_config"', self.admin_json_config
            )
            return robot_dashboard_html

        @self.app.get("/log", response_class=HTMLResponse, include_in_schema=False)
        async def log_page(path: str):
            """Serve log HTML and store the log directory for resources."""
            try:
                log_path = Path(path).resolve()
                log_html = log_path.read_text(encoding="utf-8")
                self.latest_log_dir = log_path.parent

            except Exception:
                log_html = f"""<!DOCTYPE html>
                    <html lang="en">
                        <head><meta charset="UTF-8"><title>404 - File Not Found</title></head>
                        <body>
                            <h1>404 - File Not Found</h1>
                            <p>The file you are looking for ({path}) could not be found on the server!</p>
                        </body>
                    </html>
                """
            return HTMLResponse(content=log_html)

        @self.app.get("/get-admin-json-config", include_in_schema=False)
        async def get_admin_json_config() -> AdminJsonConfig:
            response = {
                "admin_json_config": self.admin_json_config,
            }
            return response

        @self.app.post("/set-admin-json-config", include_in_schema=False)
        async def set_admin_json_config(
            config: AdminJsonConfig,
        ) -> ResponseMessage:
            """Adds the config to the class variables for use when generating the dashboard"""
            console = "no console output"
            try:
                self.admin_json_config = config.admin_json_config
                console = self.robotdashboard.create_dashboard()
            except Exception as error:
                response = {
                    "success": "0",
                    "message": f"ERROR: something went wrong while setting the admin customized view config: {error}",
                    "console": console,
                }
                return response
            response = {
                "success": "1",
                "message": f"SUCCESS: set the new config and generated the report",
                "console": console,
            }
            return response

        @self.app.get("/get-outputs")
        async def get_outputs() -> List[GetOutput]:
            """Get a list of dictionaries containting the runs (run_starts) and names of the runs
            currently available in the database"""
            runs, names, aliases, tags = self.robotdashboard.get_runs()
            outputs = []
            for run, name, alias, tag in zip(runs, names, aliases, tags):
                outputs.append(
                    {
                        "run_start": str(run),
                        "name": str(name),
                        "alias": str(alias),
                        "tags": str(tag),
                    }
                )
            return outputs

        @self.app.post("/add-outputs")
        async def add_output_to_database(
            add_output: AddOutput = Body(
                ...,
                openapi_examples=add_outputs_openapi_examples,
            ),
        ) -> ResponseMessage:
            """Add output to database endpoint function
            The following combinations of parameters are valid:
            1. output_path: str valid path to output.xml (+ optional: output_tags: List[str] tags for that output.xml)
            2. output_data: str output.xml content (+ optional: output_tags: List[str] tags for that output.xml + optional output_alias)
            3. output_folder_path: str valid path to folder (might have subfolders) that contain output.xml (multiple allowed) (+ optional: output_tags: List[str] tags for that output.xml)
            """
            input = "provided input, overwritten on runtime"
            console = "no console output"
            try:
                if (
                    (
                        add_output.output_path != None
                        and add_output.output_folder_path != None
                    )
                    or (
                        add_output.output_path != None
                        and add_output.output_data != None
                    )
                    or (
                        add_output.output_data != None
                        and add_output.output_folder_path != None
                    )
                ):
                    input = "your input"
                    raise Exception(
                        "Please only provide output_path, output_data or output_folder_path, not more than 1 type at the same time!"
                    )
                output_tags = []
                if add_output.output_tags:
                    output_tags = add_output.output_tags
                if add_output.output_path != None:
                    input = add_output.output_path
                    outputs = [[add_output.output_path, output_tags]]
                    console = self.robotdashboard.process_outputs(
                        output_file_info_list=outputs
                    )
                if add_output.output_folder_path != None:
                    input = add_output.output_folder_path
                    output_folder_paths = [
                        [
                            add_output.output_folder_path,
                            output_tags,
                        ]
                    ]
                    console = self.robotdashboard.process_outputs(
                        output_folder_configs=output_folder_paths
                    )
                if add_output.output_data != None:
                    input = ""
                    if add_output.output_alias != None:
                        input = f"{add_output.output_alias}.xml"
                        file = open(input, "w", encoding="utf-8")
                        output_path = abspath(input)
                    else:
                        input = "temp_output.xml"
                        file = open(input, "w", encoding="utf-8")
                        output_path = abspath(input)
                    file.write(add_output.output_data)
                    file.close()
                    outputs = [[output_path, output_tags]]
                    console = self.robotdashboard.process_outputs(
                        output_file_info_list=outputs
                    )
                    remove(input)
                console += self.robotdashboard.create_dashboard()
                response = {
                    "success": "1",
                    "message": f"SUCCESS: processed {input}, see the browser console for more details!",
                    "console": console,
                }
            except Exception as error:
                message = f"Something went wrong while processing {input}, ERROR: {error}, see the browser console for more details!"
                response = {"success": "0", "message": message, "console": console}
            return response

        @self.app.delete("/remove-outputs")
        async def remove_outputs_from_database(
            remove_output: RemoveOutputs = Body(
                ...,
                openapi_examples=remove_outputs_openapi_examples,
            ),
        ) -> ResponseMessage:
            """Remove outputs from database endpoint function
            Can be either indexes or run_starts that are known in the database
            """
            console = "no console output"
            try:
                # Because the argparser makes use of the format: [[outputtoremove1], [outputtoremove2]]
                # We have to create a list of lists with 1 item to match the handling of the API
                remove_runs = []
                if remove_output.run_starts != None:
                    for run in remove_output.run_starts:
                        remove_runs.append(f"run_start={run}")
                if remove_output.indexes != None:
                    for run in remove_output.indexes:
                        remove_runs.append(f"index={run}")
                if remove_output.aliases != None:
                    for run in remove_output.aliases:
                        remove_runs.append(f"alias={run}")
                if remove_output.tags != None:
                    for run in remove_output.tags:
                        remove_runs.append(f"tag={run}")
                console = self.robotdashboard.remove_outputs(remove_runs)
                console += self.robotdashboard.create_dashboard()
                response = {
                    "success": "1",
                    "message": f"SUCCESS: processed {remove_output}, see the browser console for more details!",
                    "console": console,
                }
            except Exception as error:
                message = f"Something went wrong while processing {remove_output}, ERROR: {error}, see the browser console for more details!"
                response = {"success": "0", "message": message, "console": console}
            return response

        @self.app.post("/add-log")
        async def add_log(add_log: AddLog) -> ResponseMessage:
            """Adds the log file to a folder and updates the database for the required output
            IMPORTANT! The log_name that is provided should be similar to the output.xml that has been uploaded
            If you added 'output-123.xml' then the log should be 'log-123.html', otherwise the database won't update correctly!
            """
            console = ""
            try:
                if not exists(self.log_dir):
                    mkdir(self.log_dir)
                log_path = join(self.log_dir, add_log.log_name)
                console += self.robotdashboard.update_output_path(log_path)
                if "ERROR" in console:
                    raise Exception(
                        "A problem occurred while adding the log file, check the console message!"
                    )
                console += "======================================================================================\n"
                log_file = open(log_path, "w", encoding="utf-8")
                log_file.write(add_log.log_data)
                log_file.close()
                console += f"Added {add_log.log_name} to the folder {self.log_dir}\n"
                console += "======================================================================================\n"
                console += self.robotdashboard.create_dashboard()
                if "ERROR" in console:
                    raise Exception(
                        "A problem occurred while adding the log file, check the console message!"
                    )
            except Exception as error:
                response = {
                    "success": "0",
                    "message": f"ERROR: something went wrong while adding the log file or updating the database: {error}",
                    "console": console,
                }
                return response
            response = {
                "success": "1",
                "message": f"SUCCESS: the log file has been placed and the database was updated",
                "console": console,
            }
            return response

        @self.app.delete("/remove-log")
        async def remove_log(remove_log: RemoveLog) -> ResponseMessage:
            """Removes the log file from the folder on the server"""
            console = ""
            try:
                if remove_log.log_name.lower() == "all":
                    for file in listdir(self.log_dir):
                        remove(join(self.log_dir, file))
                        console += f"Removed {file} from the folder {self.log_dir}\n"
                else:
                    log_path = join(self.log_dir, remove_log.log_name)
                    remove(log_path)
                    console += f"Removed {remove_log.log_name} from the folder {self.log_dir}\n"
                console += "======================================================================================\n"
                console += self.robotdashboard.create_dashboard()
            except Exception as error:
                response = {
                    "success": "0",
                    "message": f"ERROR: something went wrong while removing the log file: {error}",
                    "console": console,
                }
                return response
            response = {
                "success": "1",
                "message": f"SUCCESS: the log file has been removed from the local folder",
                "console": console,
            }
            return response

    def _setup_catch_all_route(self):
        """Catch-all route for any resource after all other routes
        This will try to resolve based on screenshots that are relative to the log files
        If it doesn't find any matching file nothing will happen"""

        @self.app.get("/{full_path:path}", include_in_schema=False)
        async def catch_all(full_path: str):
            if self.latest_log_dir is None:
                raise HTTPException(404, "No log file opened yet")

            resource_path = (self.latest_log_dir / full_path).resolve()
            if not str(resource_path).startswith(str(self.latest_log_dir)):
                raise HTTPException(403, "Access denied")

            if not resource_path.exists():
                raise HTTPException(404, f"Resource {full_path} not found")

            return FileResponse(resource_path)

    def set_robotdashboard(self, robotdashboard: RobotDashboard):
        """Function to initialize the RobotDashboard class"""
        self.robotdashboard = robotdashboard

    def run(self):
        """Function to start up the FastAPI server through uvicorn"""
        run(self.app, host=self.server_host, port=self.server_port)
