#!/usr/bin/env bash
# release.sh
# Release/build your project using UV

set -e  # exit on any error

# 1. Remove old .venv if it exists
if [ -d ".venv" ]; then
    rm -rf .venv
fi

# 2. Create a UV virtual environment using the default Python
uv venv --python python3 .venv

# 3. Upgrade pip and install build tools inside the venv
uv pip install --upgrade pip setuptools build wheel twine

# 4. Build the package
uv run python -m build

# 5. Upload to PyPI (requires you to set TWINE_PASSWORD env variable or enter token manually)
uv run python -m twine upload --verbose --repository pypi dist/*

# 6. Cleanup build artifacts
rm -rf dist/
rm -rf robotframework_dashboard.egg-info/

echo "-- Done. Package released using UV"
