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
      { text: 'Examples', link: '/markdown-examples' }
    ],
    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
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
