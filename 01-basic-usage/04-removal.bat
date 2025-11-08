del robot_dashboard.html
del robot_results.db

robotdashboard -g false -f .\results\ui\:project_ui:prod
robotdashboard -g false -f .\results\api\:project_api:dev

@REM robotdashboard --generatedashboard false --removeruns index=1:4
@REM robotdashboard --generatedashboard false --removeruns "run_start=2025-11-08 17:45:10.956029"
@REM robotdashboard --generatedashboard false --removeruns alias=api-output-09
@REM robotdashboard --generatedashboard false --removeruns tag=dev

robotdashboard --generatedashboard false --removeruns "index=1:4,run_start=2025-11-08 17:45:10.956029,alias=api-output-09,tag=dev"