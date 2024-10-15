@REM pip install build wheel
python -m build
pip install .
rmdir /s /q .\dist\
rmdir /s /q .\build\
rmdir /s /q .\robotframework_dashboard.egg-info\