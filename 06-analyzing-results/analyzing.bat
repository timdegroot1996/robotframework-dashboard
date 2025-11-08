del robot_dashboard.html
del robot_results.db

robotdashboard -g false -f .\results\ui\:project_ui:prod
robotdashboard -f .\results\api\:project_api:dev -n robot_dashboard --uselogs true