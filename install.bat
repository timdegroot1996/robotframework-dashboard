@REM pip install --upgrade pip setuptools build wheel
pip install .
rmdir /s /q .\dist\
rmdir /s /q .\build\
rmdir /s /q .\robotframework_dashboard.egg-info\

@REM release commands
@REM python -m build
@REM python -m twine upload --verbose --repository pypi dist/*