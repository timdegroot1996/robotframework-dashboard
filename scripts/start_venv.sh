#!/bin/bash
# robotdashboard-venv-matrix.sh
# Usage: ./robotdashboard-venv-matrix.sh <python_version> <robotframework_version> [extras]

set -e

PYTHON_VERSION=$1
ROBOT_VERSION=$2
EXTRAS=$3

if [ -z "$PYTHON_VERSION" ] || [ -z "$ROBOT_VERSION" ]; then
    echo "Usage: $0 <python_version> <robotframework_version> [extras]"
    exit 1
fi

echo "-- Using Python $PYTHON_VERSION and Robot Framework $ROBOT_VERSION"
if [ -n "$EXTRAS" ]; then
    echo "-- Extras: $EXTRAS"
else
    echo "-- No extras specified"
fi

# Remove existing .venv
rm -rf .venv

# Create new virtual environment
uv venv --python python$PYTHON_VERSION .venv

# Install package in editable mode with optional extras
if [ -z "$EXTRAS" ]; then
    uv pip install -e . "robotframework==$ROBOT_VERSION"
else
    uv pip install -e .[$EXTRAS] "robotframework==$ROBOT_VERSION"
fi

echo "-- Done. .venv now uses Python $PYTHON_VERSION, Robot Framework $ROBOT_VERSION, Extras: $EXTRAS"
