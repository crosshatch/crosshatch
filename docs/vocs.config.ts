import PackageJson from "crosshatch/package.json" with { type: "json" }
import { defineConfig } from "vocs"

export default defineConfig({
  aiCta: false,
  banner: {
    backgroundColor: "#0E0D0F",
    content: "Crosshatch is in preview. Email harrysolovay@gmail.com for details.",
    dismissable: false,
    height: "28px",
    textColor: "white",
  },
  baseUrl: "https://docs.crosshatch.dev",
  blogDir: "./articles",
  description: PackageJson.description,
  editLink: {
    pattern: "https://github.com/crosshatch/crosshatch/edit/main/docs/pages/:path",
    text: "Edit on GitHub",
  },
  rootDir: ".",
  sidebar: [
    {
      link: "/start",
      text: "Quickstart",
    },
    {
      link: "/x402",
      text: "X402 Primer",
    },
    {
      link: "/allowances",
      text: "Allowances",
    },
    {
      link: "/purchases",
      text: "Purchases",
    },
    {
      link: "/facilitation",
      text: "Facilitation",
    },
    {
      link: "/merchants",
      text: "Merchants",
    },
  ],
  socials: [
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
      link: "/guides/start",
      text: "Guides",
    },
    {
      link: "/articles",
      text: "Articles",
    },
  ],
})
