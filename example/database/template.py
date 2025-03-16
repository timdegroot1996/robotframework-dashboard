from pathlib import Path

# Do not use relative imports! This will not work on runtime!


class DatabaseProcessor:
    def __init__(self, database_path: Path):
        """This function should handle the creation of the tables if required
        The use of the database_path variable might not be required but you should still keep it as an argument!
        """
        pass

    def open_database(self):
        """This function should handle the connection to the database and set it for other functions to use"""
        pass

    def close_database(self):
        """This function is called to close the connection to the database"""
        pass

    def insert_output_data(self, output_data: dict, tags: list):
        """This function inserts the data of an output file into the database"""
        pass

    def get_data(self):
        """This function gets all the data in the database"""
        pass

    def list_runs(self):
        """This function gets all available runs and prints them to the console"""
        pass

    def remove_runs(self, remove_runs):
        """This function removes all provided runs and all their corresponding data"""
        pass
