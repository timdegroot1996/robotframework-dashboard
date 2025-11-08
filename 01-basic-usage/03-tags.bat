del robot_dashboard.html
del robot_results.db

robotdashboard -n robot_dashboard.html -f .\results\ui\:project_ui:prod
robotdashboard -n robot_dashboard.html -f .\results\api\:project_api:dev
