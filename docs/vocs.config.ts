import PackageJson from "crosshatch/package.json" with { type: "json" }
import rehypeMermaid from "rehype-mermaid"
import { defineConfig } from "vocs"

export default defineConfig({
  vite: {
    server: {
      host: "127.0.0.1",
      port: 7776,
      strictPort: true,
      allowedHosts: [".localhost"],
    },
  },
  markdown: {
    rehypePlugins: [[rehypeMermaid, { strategy: "inline-svg" }]],
  },
  logoUrl: "https://crosshatch.dev/favicon.ico",
  aiCta: false,
  banner: {
    backgroundColor: "#0E0D0F",
    content: "Crosshatch is in preview; harry@crosshatch.dev for details.",
    dismissable: false,
    height: "28px",
    textColor: "white",
  },
  blogDir: "./pages/articles",
  baseUrl: "https://docs.crosshatch.dev",
  description: PackageJson.description,
  editLink: {
    pattern: "https://github.com/crosshatch/crosshatch/edit/main/docs/pages/:path",
    text: "Edit on GitHub",
  },
  rootDir: ".",
  sidebar: {
    "/": [
      {
        link: "/",
        text: "Quickstart",
      },
    ],
  },
  socials: [
    {
      icon: "discord",
      link: "https://discord.gg/CSXCRUKjh9",
    },
    {
      icon: "github",
      link: "https://github.com/crosshatch/crosshatch",
    },
    {
      icon: "x",
      link: "https://x.com/CrosshatchDev",
    },
  ],
  title: "Crosshatch",
  topNav: [
    {
      link: "/",
      text: "Guides",
    },
    {
      link: "/articles",
      text: "Articles",
    },
  ],
})
