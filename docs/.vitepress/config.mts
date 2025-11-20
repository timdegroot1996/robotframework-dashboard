import { defineConfig } from 'vitepress'
import { readFileSync } from "fs";

const python_svg = readFileSync("docs/public/python.svg", "utf-8");
const slack_svg = readFileSync("docs/public/slack.svg", "utf-8");

export default defineConfig({
  title: "RobotDashboard",
  description: "Robot Framework Dashboard and Result Database command line tool",
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/robotframework-dashboard/robotframework.svg" }],
    ["meta", { name: "theme-color", content: "#5f67ee" }],

    // SEO
    ["title", {}, "RobotFramework Dashboard | Visualize and Analyze Test Results"],
    ["meta", { name: "description", content: "Interactive dashboard to visualize, analyze, and customize Robot Framework test results with charts, and tables" }],
    ["meta", { name: "keywords", content: "dashboard, analysis, robot-framework, html-report, robotframework, robotframework-dashboard" }],
    ["link", { rel: "canonical", href: "https://timdegroot1996.github.io/robotframework-dashboard/" }],

    // Open Graph
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "en" }],
    ["meta", { property: "og:title", content: "RobotFramework Dashboard | Visualize Robot Framework Results" }],
    ["meta", { property: "og:site_name", content: "RobotFramework Dashboard" }],
    ["meta", { property: "og:image", content: "/robotframework-dashboard/robotframework.svg" }],
    ["meta", { property: "og:url", content: "https://timdegroot1996.github.io/robotframework-dashboard/" }],

    // Twitter Card
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:title", content: "RobotFramework Dashboard | Visualize Robot Framework Results" }],
    ["meta", { name: "twitter:description", content: "Interactive dashboard to visualize and analyze Robot Framework test results." }],
    ["meta", { name: "twitter:image", content: "/robotframework-dashboard/robotframework.svg" }],

    // Structured data
    ["script", { type: "application/ld+json" }, `
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "RobotFramework Dashboard",
        "url": "https://timdegroot1996.github.io/robotframework-dashboard/",
        "description": "Interactive dashboard to visualize and analyze Robot Framework test results.",
        "applicationCategory": "DeveloperTool",
        "operatingSystem": "Web"
      }
    `]
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
