from .robotdashboard import RobotDashboard
from fastapi import FastAPI, Body
from fastapi.responses import HTMLResponse
from typing import Annotated
from pydantic import BaseModel
from uvicorn import run
from os.path import join, abspath, dirname
from os import remove
from .version import __version__


class ResponseMessage(BaseModel):
    """The response message model for Adding or Removing runs from the database"""

    success: str
    message: str
    console: str
    model_config = {
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


class GetOutput(BaseModel):
    """The response model that is returned when getting outputs"""

    run_start: str
    name: str
    alias: str
    tags: str
    model_config = {
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


class AddOutput(BaseModel):
    """The model that has to be provided when trying to add outputs to the database"""

    output_path: str = None
    output_data: str = None
    output_folder_path: str = None
    output_tags: list[str] = None
    output_alias: str = None
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "output_path": "C:\\users\\docs\\output.xml",
                    "output_tags": ["tag1", "cool-tag2", "production_tag"],
                },
                {
                    "output_data": """<?xml version="1.0" encoding="UTF-8"?>
<robot generator="Robot 7.2.2 (Python 3.12.9 on win32)" generated="2025-02-19T17:25:58.443716" rpa="false" schemaversion="5">
<suite id="s1" name="Scripts" source="C:\docs">
<suite id="s1-s1" name="Google" source="C:\docs\google.robot">
<test id="s1-s1-t1" name="Test 01" line="6">... etc""",
                    "output_tags": [],
                    "output_alias": "some_cool_alias",
                },
                {
                    "output_path": "C:\\users\\docs\\prod-outputs",
                    "output_tags": ["production-run"],
                },
            ]
        }
    }


class RemoveOutputs(BaseModel):
    """The model that has to be provided when trying to delete outputs from the database"""

    run_starts: list[str] = None
    indexes: list[str] = None
    aliases: list[str] = None
    tags: list[str] = None
    model_config = {
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


class ApiServer:
    """Robot Dashboard server implementation, this class handles the admin page and all functions related to the server"""

    def __init__(self, server_host: str, server_port: int):
        """Init function that starts up the fastapi app and initializes all the vars and endpoints"""
        self.app = FastAPI()
        self.robotdashboard: RobotDashboard
        self.server_host = server_host
        self.server_port = server_port

        @self.app.get("/", response_class=HTMLResponse, include_in_schema=False)
        async def admin_page():
            """Admin page endpoint function"""
            admin_file = join(dirname(abspath(__file__)), "templates", "admin.html")
            admin_html = open(admin_file, "r").read()
            admin_html = admin_html.replace('"placeholder_version"', __version__)
            return admin_html

        @self.app.get(
            "/dashboard", response_class=HTMLResponse, include_in_schema=False
        )
        async def dashboard_page():
            """Serve robotdashboard HTML endpoint function"""
            robot_dashboard_html = open("robot_dashboard.html", "r").read()
            return robot_dashboard_html

        @self.app.get("/get-outputs")
        async def get_outputs() -> list[GetOutput]:
            """Get a list of dictionaries containting the runs (run_starts) and names of the runs
            currently available in the database"""
            runs, names, aliases, tags = self.robotdashboard.get_runs()
            outputs = []
            for run, name, alias, tag in zip(runs, names, aliases, tags):
                outputs.append(
                    {"run_start": run, "name": name, "alias": alias, "tags": tag}
                )
            return outputs

        @self.app.post("/add-outputs")
        async def add_output_to_database(
            add_output: Annotated[
                AddOutput,
                Body(
                    openapi_examples={
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
<suite id="s1" name="Scripts" source="C:\docs">
<suite id="s1-s1" name="Google" source="C:\docs\google.robot">
<test id="s1-s1-t1" name="Test 01" line="6">... etc""",
                                "output_tags": [],
                                "output_alias": "some_cool_alias",
                            },
                        },
                        "output folder path": {
                            "summary": "When using an absolute folder path that contains output.xml's",
                            "description": "When using an absolute folder path that contains output.xml's",
                            "value": {
                                "output_path": "C:\\users\\docs\\prod-outputs",
                                "output_tags": ["production-run"],
                            },
                        },
                    },
                ),
            ],
        ) -> ResponseMessage:
            """Add output to database endpoint function
            The following combinations of parameters are valid:
            1. output_path: str valid path to output.xml + output_tags: list[str] tags for that output.xml
            2. output_data: str output.xml content + output_tags: list[str] tags for that output.xml + optional output_alias
            3. output_folder_path: str valid path to folder (might have subfolders) that contain output.xml (multiple allowed) + output_tags: list[str] tags for that output.xml
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
                if add_output.output_path != None:
                    input = add_output.output_path
                    outputs = [[add_output.output_path, add_output.output_tags]]
                    console = self.robotdashboard.process_outputs(outputs=outputs)
                if add_output.output_folder_path != None:
                    input = add_output.output_folder_path
                    output_folder_path = [
                        add_output.output_folder_path,
                        add_output.output_tags,
                    ]
                    console = self.robotdashboard.process_outputs(
                        output_folder_path=output_folder_path
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
                    outputs = [[output_path, add_output.output_tags]]
                    console = self.robotdashboard.process_outputs(outputs=outputs)
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
            remove_output: Annotated[
                RemoveOutputs,
                Body(
                    openapi_examples={
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
                    },
                ),
            ],
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
                print(remove_runs)
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

    def set_robotdashboard(self, robotdashboard: RobotDashboard):
        """Function to initialize the RobotDashboard class"""
        self.robotdashboard = robotdashboard

    def run(self):
        """Function to start up the FastAPI server through uvicorn"""
        run(self.app, host=self.server_host, port=self.server_port)
