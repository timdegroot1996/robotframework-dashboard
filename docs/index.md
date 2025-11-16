---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "RobotDashboard"
  text: "Robot Framework Dashboard and Result Database command line tool"
  tagline: Visualize and analyze Robot Framework test results across multiple runs with an interactive dashboard
  actions:
    - theme: brand
      text: Get Started
      link: /markdown-examples
    - theme: alt
      text: View on PyPi
      link: https://pypi.org/project/robotframework-dashboard/
    - theme: alt
      text: Star on GitHub
      link: https://github.com/timdegroot1996/robotframework-dashboard

features:
  - title: 1. Getting Started
    details: Quick setup instructions to install Robot Framework and RobotDashboard.
    link: /1-getting-started.md
  - title: 2. Installation & Version Info
    details: Install the dashboard via pip or check requirements and version information.
    link: /2-installation-version-info.md
  - title: 3. Basic Command Line Interface (CLI)
    details: Run, update, and manage your test results directly from the CLI.
    link: /3-basic-command-line-interface-cli.md
  - title: 4. Advanced CLI / Examples
    details: Examples of custom commands, tags, filters, and dashboard generation.
    link: /4-advanced-cli-examples.md
  - title: 5. Dashboard Features
    details: Visualize test results with interactive graphs, tables, and comparisons.
    link: /5-dashboard-features.md
  - title: 6. Dashboard Settings
    details: Configure dashboard preferences, user settings, and display options.
    link: /6-dashboard-settings.md
  - title: 7. Dashboard Server
    details: Host the dashboard for multi-user access and automated updates.
    link: /7-dashboard-server.md
  - title: 8. Custom Database Class
    details: Extend or replace the database backend to suit your storage needs.
    link: /8-custom-database-class.md
  - title: 9. Listener Integration
    details: Automatically update the dashboard with every executed test run.
    link: /9-listener-integration.md

---

<!-- 1. Getting Started
Overview (what the tool does, main benefits)
Example Dashboard Screenshot
Quick link to fully working dashboard
2. Installation
Install Robot Framework
Install Robot Framework Dashboard
Basic setup instructions
3. Command Line Interface (CLI)
Database initialization
Adding/removing runs
Generating dashboard
Options summary (detailed options can link to CLI reference page)
4. Dashboard Features
Pages (Overview, Dashboard, Compare)
Settings (light/dark mode, graph options, filters)
Graphs & metrics (Runs, Suites, Tests, Keywords)
5. Advanced Usage / Examples
Advanced command-line examples
Aliases, custom config JSON
Message config usage
6. Custom Database Class
How to implement custom database class
Required methods
Examples (abstractdb, sqlite3, mysql)
7. Dashboard Server
Starting the server
Endpoints (/dashboard, /get-outputs, etc.)
Example scripts
Listener integration -->