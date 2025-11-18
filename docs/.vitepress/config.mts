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
      { text: 'Documentation', link: '/getting-started.md' },
      { text: 'Example Dashboard', link: '/example/robot_dashboard.html', target: '_self' }
    ],
    sidebar: [
      {
        text: 'Setup',
        items: [
          { text: '🚀 Getting Started', link: '/getting-started.md' },
          { text: '📦 Installation & Version Info', link: '/installation-version-info.md' },
        ]
      },
      {
        text: 'Command Line',
        items: [
          { text: '💻 Basic Command Line Interface (CLI)', link: '/basic-command-line-interface-cli.md' },
          { text: '⚡ Advanced CLI & Examples', link: '/advanced-cli-examples.md' },
        ]
      },
      {
        text: 'Dashboard',
        items: [
          { text: '🗂️ Tabs / Pages', link: '/tabs-pages.md' },
          { text: '📊 Graphs & Tables', link: '/graphs-tables.md' },
          { text: '🔍 Filtering', link: '/filtering.md' },
          { text: '🎨 Customization', link: '/customization.md' },
          { text: '⚙️ Settings', link: '/settings.md' },
        ]
      },
      {
        text: 'Advanced',
        items: [
          { text: '🖥️ Dashboard Server', link: '/dashboard-server.md' },
          { text: '🗄️ Custom Database Class', link: '/custom-database-class.md' },
          { text: '🔔 Listener Integration', link: '/listener-integration.md' },
        ]
      },
        { text: '🤝 Contributions', link: '/contributions.md' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/timdegroot1996/robotframework-dashboard', ariaLabel: 'GitHub Repository' },
      { icon: { svg: python_svg }, link: 'https://pypi.org/project/robotframework-dashboard/', ariaLabel: 'Python Package on PyPI' },
      { icon: { svg: slack_svg }, link: 'https://robotframework.slack.com/', ariaLabel: 'Robot Framework Slack' },
    ]
  }
})
