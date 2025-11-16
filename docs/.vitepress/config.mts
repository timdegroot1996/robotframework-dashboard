import { defineConfig } from 'vitepress'
import { readFileSync } from "fs";

const python_svg = readFileSync("docs/images/python.svg", "utf-8");
const slack_svg = readFileSync("docs/images/slack.svg", "utf-8");
const robotframework_svg = readFileSync("docs/images/robotframework.svg", "utf-8");

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "RobotDashboard",
  description: "Robot Framework Dashboard and Result Database command line tool",
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "images/robotframework.svg" }],
  ],
  base: '/robotframework-dashboard/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
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
      { icon: 'github', link: 'https://github.com/timdegroot1996/robotframework-dashboard' },
      { icon: { svg: python_svg }, link: 'https://pypi.org/project/robotframework-dashboard/' },
      { icon: { svg: slack_svg }, link: 'https://github.com/vuejs/vitepress' },
      { icon: { svg: robotframework_svg }, link: 'https://robotframework.slack.com/' }
    ]
  }
})
