from abc import ABC, abstractmethod
from pathlib import Path

class AbstractDatabaseProcessor(ABC):
    
    @abstractmethod
    def __init__(self, database_path: Path) -> None:
        """This function should handle the creation of the tables if required
        The use of the database_path variable might not be required but you should still keep it as an argument!
        """
        pass

    @abstractmethod
    def open_database(self) -> None:
        """This function should handle the connection to the database and set it for other functions to use"""
        pass

    @abstractmethod
    def close_database(self) -> None:
        """This function is called to close the connection to the database"""
        pass

    @abstractmethod
    def insert_output_data(
        self, output_data: dict, tags: list, run_alias: str, path: Path
    ) -> None:
        """This function inserts the data of an output file into the database"""
        pass

    @abstractmethod
    def get_data(self) -> dict:
        """This function gets all the data in the database"""
        pass

    @abstractmethod
    def list_runs(self) -> None:
        """This function gets all available runs and prints them to the console"""
        pass

    @abstractmethod
    def remove_runs(self, remove_runs) -> None:
        """This function removes all provided runs and all their corresponding data"""
        pass

    @abstractmethod
    def update_output_path(self, log_path) -> None:
        pass