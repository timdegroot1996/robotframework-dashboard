@REM release package

python -m pip install --upgrade pip setuptools build wheel twine
python -m build
python -m twine upload --verbose --repository pypi dist/*
@REM after this manually enter PYPI token