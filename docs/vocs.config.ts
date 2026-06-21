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
        text: "Start Here",
        items: [
          { text: "Overview", link: "/" },
          { text: "Quickstart", link: "/quickstart" },
          { text: "x402 Lifecycle", link: "/lifecycle" },
          { text: "Why Crosshatch?", link: "/why" },
        ],
      },
      {
        text: "Core x402 Toolkit",
        items: [
          { text: "Schemas", link: "/x402/schemas" },
          { text: "Requirements", link: "/x402/requirements" },
          { text: "Payment Payloads", link: "/x402/payloads" },
          { text: "Amounts & Assets", link: "/x402/assets" },
          { text: "CAIP Identifiers", link: "/x402/caip" },
        ],
      },
      {
        text: "HTTP 402",
        items: [
          { text: "Effect HTTP", link: "/http/effect-http" },
          { text: "Middleware", link: "/http/middleware" },
          { text: "Headers", link: "/http/headers" },
          { text: "Custom Servers", link: "/http/custom" },
        ],
      },
      {
        text: "Effect Integrations",
        items: [
          { text: "Effect RPC", link: "/effect/rpc" },
          { text: "Effect AI", link: "/effect/ai" },
          { text: "Effect Sockets", link: "/effect/sockets" },
          { text: "Tracing", link: "/effect/tracing" },
        ],
      },
      {
        text: "Facilitation",
        items: [
          { text: "Overview", link: "/facilitation" },
          { text: "Verify", link: "/facilitation/verify" },
          { text: "Settle", link: "/facilitation/settle" },
          { text: "Supported Payments", link: "/facilitation/supported" },
          { text: "Custom Facilitator", link: "/facilitation/custom" },
        ],
      },
      {
        text: "Settlement Patterns",
        items: [
          { text: "Granular Settlement", link: "/merchants/granular-settlement" },
          { text: "Deposit + Rebate", link: "/merchants/deposit-rebate" },
          { text: "OpenTelemetry", link: "/merchants/opentelemetry" },
        ],
      },
      {
        text: "Browser Wallet",
        items: [
          { text: "Overview", link: "/browser-wallet" },
          { text: "Fetch Wrapper", link: "/browser-wallet/fetch" },
          { text: "Allowances", link: "/allowances" },
          { text: "Escalations", link: "/escalations" },
          { text: "Widgets", link: "/browser-wallet/widgets" },
        ],
      },
      {
        text: "Development",
        items: [{ text: "Local Development", link: "/development" }],
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
