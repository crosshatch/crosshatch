import packageJson from "crosshatch/package.json" with { type: "json" }
import { defineConfig } from "vocs"

export default defineConfig({
  aiCta: false,
  title: "Crosshatch",
  description: packageJson.description,
  sidebar: [
    {
      text: "Quickstart",
      link: "/start",
    },
    {
      text: "X402 Primer",
      link: "/x402",
    },
    {
      text: "Allowances",
      link: "/allowances",
    },
    {
      text: "Purchases",
      link: "/purchases",
    },
    {
      text: "Facilitation",
      link: "/facilitation",
    },
    {
      text: "Merchants",
      link: "/merchants",
    },
  ],
  banner: {
    dismissable: true,
    backgroundColor: "#0E0D0F",
    content: "Crosshatch is in preview. Email harrysolovay@gmail.com for details.",
    height: "28px",
    textColor: "white",
  },
  baseUrl: "https://docs.crosshatch.dev",
  blogDir: "./articles",
  rootDir: ".",
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
  editLink: {
    pattern: "https://github.com/crosshatch/crosshatch/edit/main/docs/pages/:path",
    text: "Edit on GitHub",
  },
})
