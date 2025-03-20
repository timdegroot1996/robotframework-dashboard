from sys import exit
from os.path import exists
from requests import post
from requests.exceptions import ConnectionError

# usage:
# robot --listener path/to/robotdashboardlistener.py:tags=tag1,tag2 path/to/tests.robot

# most basic usage:
# robot --listener robotdashboardlistener.py tests.robot
# with run tags (comma separated):
# robot --listener robotdashboardlistener.py:tags=prod,dev tests.robot
# with changed server host/port:
# robot --listener robotdashboardlistener.py:tags=prod,dev:host=127.0.0.2:port=8544 tests.robot

class robotdashboardlistener:

    def __init__(self, tags: str = None, host: str = "127.0.0.1", port: str = "8543"):
        self.host = host
        self.port = port
        self.tags = tags.split(',') if tags != None else ['']
        self.output = ''

    def output_file(self, path):
        self.output = str(path)

    def close(self):
        if exists(self.output):
            print(f"robotdashboardlistener: found output.xml '{self.output}', starting processing...")
            body = {
            "output_path": self.output,
            "output_tags": self.tags
            }
            try:
                response = post(f'http://{self.host}:{self.port}/add-outputs', json=body)
            except ConnectionError as e:
                print(f'robotdashboardlistener: ERROR the server is not running or the url http://{self.host}:{self.port}/add-outputs is not correct!')
                exit(0)
            if response.status_code == 200:
                message_lines = response.json()['console'].split('\n')
                for message_line in message_lines:
                    if len(message_line) == 0: continue
                    print(f'robotdashboardlistener: {message_line}')
            else:
                print(f'robotdashboardlistener: ERROR something went wrong while sending results to the server')
                print(f'robotdashboardlistener: {response.json()}')
        else: 
            print(f"robotdashboardlistener: ERROR could not find output.xml '{self.output}', skipped automatic processing")