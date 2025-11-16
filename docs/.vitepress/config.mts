import { defineConfig } from 'vitepress'
import { readFileSync } from "fs";

const python_svg = readFileSync("docs/images/python.svg", "utf-8");
const slack_svg = readFileSync("docs/images/slack.svg", "utf-8");

export default defineConfig({
  title: "RobotDashboard",
  description: "Robot Framework Dashboard and Result Database command line tool",
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/robotframework-dashboard/robotframework.svg" }],
  ],
  base: '/robotframework-dashboard/',
  themeConfig: {
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/1-getting-started.md' },
      { text: 'Example Dashboard', link: '/example/robot_dashboard.html' }
    ],
    sidebar: [
      {
        text: 'Setup',
        items: [
          { text: '1. Getting Started', link: '/1-getting-started.md' },
          { text: '2. Installation & Version Info', link: '/2-installation-version-info.md' },
        ]
      },
      {
        text: 'Command Line',
        items: [
          { text: '3. Basic Command Line Interface (CLI)', link: '/3-basic-command-line-interface-cli.md' },
          { text: '4. Advanced CLI / Examples', link: '/4-advanced-cli-examples.md' },
        ]
      },
      {
        text: 'Dashboard',
        items: [
          { text: '5. Dashboard Features', link: '/5-dashboard-features.md' },
          { text: '6. Dashboard Settings', link: '/6-dashboard-settings.md' },
        ]
      },
      {
        text: 'Advanced',
        items: [
          { text: '7. Dashboard Server', link: '/7-dashboard-server.md' },
          { text: '8. Custom Database Class', link: '/8-custom-database-class.md' },
          { text: '9. Listener Integration', link: '/9-listener-integration.md' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/timdegroot1996/robotframework-dashboard', ariaLabel: 'GitHub Repository' },
      { icon: { svg: python_svg }, link: 'https://pypi.org/project/robotframework-dashboard/', ariaLabel: 'Python Package on PyPI' },
      { icon: { svg: slack_svg }, link: 'https://robotframework.slack.com/', ariaLabel: 'Robot Framework Slack' },
    ]
  }
})
