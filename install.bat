@REM create package and cleanup installation folders

pip install .
rmdir /s /q .\dist\
rmdir /s /q .\build\
rmdir /s /q .\robotframework_dashboard.egg-info\