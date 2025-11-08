del robot_dashboard.html
del robot_results.db

robotdashboard -g false -f .\results\ui\:project_ui:prod
robotdashboard -n robot_dashboard -f .\results\api\:project_api:dev -u true