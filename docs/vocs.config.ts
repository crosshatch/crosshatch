import PackageJson from "crosshatch/package.json" with { type: "json" }
import { VocsConfig } from "liminal-util/vocs"
import { defineConfig } from "vocs/config"

export default defineConfig({
  ...VocsConfig({
    title: "Crosshatch",
    repo: "crosshatch",
  }),
  description: PackageJson.description,
  topNav: [
    {
      link: "/",
      text: "Documentation",
    },
    {
      text: "Wallet",
      link: "https://crosshatch.dev",
      external: true,
    },
  ],
  iconUrl: "https://crosshatch.dev/favicon.ico",
  banner: {
    content: "Crosshatch is in preview. Join the discord for updates.",
    dismissable: false,
    href: "https://discord.gg/CSXCRUKjh9",
    variant: "tip",
  },
  baseUrl: "https://docs.crosshatch.dev",
  sidebar: {
    "/": [
      {
        text: "Introduction",
        items: [
          { text: "Quickstart", link: "/quickstart" },
          { text: "Examples" },
          { text: "Lifecycle", link: "/lifecycle" },
          { text: "Why Crosshatch?", link: "/why" },
        ],
      },
      {
        text: "Payment Flow",
        items: [
          { text: "Create Requirements" },
          { text: "Propose" },
          { text: "Settle Payloads" },
          { text: "Settlement Strategy", link: "/merchants/granular-settlement" },
          { text: "OpenTelemetry", link: "/merchants/opentelemetry" },
          { text: "Error Recovery" },
        ],
      },
      {
        text: "Integration Guides",
        items: [
          { text: "Effect HTTP", link: "/merchants/effect-http" },
          { text: "Effect RPC", link: "/merchants/effect-rpc" },
          { text: "Effect AI", link: "/merchants/effect-ai" },
          { text: "Effect Sockets", link: "/merchants/socket" },
        ],
      },
      {
        text: "Facilitation",
        items: [
          { text: "Local Development", link: "/development" },
          { text: "Custom Endpoint", link: "/facilitation" },
        ],
      },
    ],
    "/articles": [
      { link: "/articles", text: "All Articles" },
      { link: "/articles/hello_crosshatch", text: "Hello Crosshatch" },
    ],
  },
  socials: [
    { icon: "github", link: "https://github.com/crosshatch/crosshatch" },
    { icon: "discord", link: "https://discord.gg/CSXCRUKjh9" },
    { icon: "x", link: "https://x.com/CrosshatchDev" },
  ],
})
