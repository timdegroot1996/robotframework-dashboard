from sys import exit
from os.path import exists
from requests import post, get, delete
from requests.exceptions import ConnectionError

# for usage with a "robot.toml" see robot.toml in this folder

# usage with robot command line:
# robot --listener path/to/robotdashboardlistener.py:tags=tag1,tag2 path/to/tests.robot

# most basic usage:
# robot --listener robotdashboardlistener.py tests.robot
# with run tags (comma separated):
# robot --listener robotdashboardlistener.py:tags=prod,dev tests.robot
# with changed server host/port:
# robot --listener robotdashboardlistener.py:tags=prod,dev:host=127.0.0.2:port=8544 tests.robot
# with a database limit and automatic run deletion:
# robot --listener robotdashboardlistener.py:limit=1000 tests.robot


class robotdashboardlistener:

    def __init__(
        self,
        tags: str = None,
        host: str = "127.0.0.1",
        port: str = "8543",
        limit: str = "0",
    ):
        self.host = host
        self.port = port
        self.tags = tags.split(",") if tags != None else [""]
        self.limit = int(limit)

    def output_file(self, path):
        self._add_output_to_database(path=str(path))
        self._remove_runs_over_limi()

    def _add_output_to_database(self, path: str):
        if exists(path):
            self._print_listener(f"starting processing output.xml '{path}'")
            body = {"output_path": path, "output_tags": self.tags}
            try:
                response = post(
                    f"http://{self.host}:{self.port}/add-outputs", json=body
                )
            except ConnectionError as e:
                self._print_listener(
                    f"ERROR the server is not running or the url http://{self.host}:{self.port}/add-outputs is not correct!"
                )
                exit(0)
            if response.status_code == 200:
                self._print_console_message(response)
            else:
                self._print_listener(
                    f"ERROR something went wrong while sending results to the server: {response.json()}"
                )
        else:
            self._print_listener(
                f"ERROR could not find output.xml '{path}', skipped automatic processing"
            )

    def _remove_runs_over_limi(self):
        response = get(f"http://{self.host}:{self.port}/get-outputs")
        if response.status_code == 200:
            response_json = response.json()
            self._print_listener(
                f"amount of runs in the database: {len(response_json)}, limit {self.limit}"
            )
            if self.limit != 0 and len(response_json) > self.limit:
                amount_to_remove = len(response_json) - self.limit
                self._print_listener(
                    f"removing {amount_to_remove} run(s) from the database"
                )
                run_starts = []
                for i in range(0, amount_to_remove):
                    run_starts.append(response_json[i]["run_start"])
                body = {"runs": run_starts}
                response = delete("http://127.0.0.1:8543/remove-outputs", json=body)
                if response.status_code == 200:
                    self._print_console_message(response)
                else:
                    self._print_listener(
                        f"ERROR something went wrong while deleting the runs from the database: {response.json()}"
                    )
            else:
                self._print_listener(f"no runs have to be removed")
        else:
            self._print_listener(
                f"ERROR something went wrong while retrieving the outputs from the database: {response.json()}"
            )

    def _print_listener(self, value: str):
        print(f"robotdashboardlistener: {value}")

    def _print_console_message(self, response):
        message_lines = response.json()["console"].split("\n")
        for message_line in message_lines:
            if len(message_line) == 0:
                continue
            self._print_listener(f"{message_line}")
