@echo off
REM Release package using UV

REM 1. Remove old .venv if it exists
IF EXIST ".venv" (
    rmdir /s /q ".venv"
)

REM 2. Create a UV virtual environment using the default Python
uv venv --python python3 .venv

REM 3. Upgrade pip and install build tools inside the venv
uv pip install --upgrade pip setuptools build wheel twine

REM 4. Build the package
uv run python -m build

REM 5. Upload to PyPI (you'll be prompted for token if not set as env)
uv run python -m twine upload --verbose --repository pypi dist/*

REM 6. Cleanup build artifacts
rmdir /s /q .\dist\
rmdir /s /q .\robotframework_dashboard.egg-info\

echo -- Done. Package released using UV
