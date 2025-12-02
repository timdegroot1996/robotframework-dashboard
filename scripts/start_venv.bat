@echo off
REM Usage: ./scripts/start_venv.bat 3.8 6.0 [EXTRAS]

SET PythonVersion=%1
SET RobotVersion=%2
SET Extras=%3

IF "%PythonVersion%"=="" (
    echo ERROR: Python version not specified.
    echo Usage: %0 PYTHON_VERSION ROBOT_VERSION [EXTRAS]
    exit /b 1
)

IF "%RobotVersion%"=="" (
    echo ERROR: Robot Framework version not specified.
    echo Usage: %0 PYTHON_VERSION ROBOT_VERSION [EXTRAS]
    exit /b 1
)

echo -- Using Python %PythonVersion% and Robot Framework %RobotVersion%
IF "%Extras%"=="" (
    echo -- No extras specified
) ELSE (
    echo -- Extras: %Extras%
)

REM Remove existing .venv
IF EXIST ".venv" (
    rmdir /s /q ".venv"
)

REM Create new virtual environment
uv venv --python python%PythonVersion% .venv

REM Install package in editable mode with optional extras
IF "%Extras%"=="" (
    uv pip install -e . "robotframework==%RobotVersion%"
) ELSE (
    uv pip install -e .[%Extras%] "robotframework==%RobotVersion%"
)

echo -- Done. .venv now uses Python %PythonVersion%, Robot Framework %RobotVersion%, Extras: %Extras%
