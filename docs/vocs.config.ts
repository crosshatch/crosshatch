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
      text: `v${PackageJson.version}`,
      items: [
        {
          text: "Changelog",
          link: "/changelog",
        },
      ],
    },
    // {
    //   text: "Wallet",
    //   link: "https://crosshatch.dev",
    //   external: true,
    // },
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
          {
            text: "Quickstart",
            link: "/quickstart",
            items: [
              { text: "Prerequisites", link: "/quickstart/prerequisites" },
              { text: "For Clients", link: "/quickstart/for-clients" },
              { text: "For Merchants", link: "/quickstart/for-merchants" },
            ],
          },
          { text: "Lifecycle", link: "/lifecycle" },
          { text: "Background", link: "/background" },
        ],
      },
      {
        text: "Core Types",
        items: [
          { text: "Asset", link: "/asset" },
          { text: "Required", link: "/required" },
          { text: "Payload", link: "/payload" },
          { text: "Extension", link: "/extension" },
        ],
      },
      {
        text: "Clients",
        items: [
          { text: "Payer Service", link: "/payer" },
          { text: "Fetch", link: "/fetch" },
          { text: "Effect HTTP Client", link: "/effect-http-client" },
          { text: "Effect AI", link: "/effect-ai" },
          { text: "Effect Atom", link: "/effect-atom" },
        ],
      },
      {
        text: "Merchants",
        items: [
          { text: "Effect HTTP", link: "/effect-http" },
          { text: "Effect RPC", link: "/effect-rpc" },
          { text: "Effect Socket", link: "/effect-socket" },
        ],
      },
      {
        text: "Settlement",
        items: [
          { text: "Facilitation", link: "/facilitation" },
          { text: "Immediate Settlement", link: "/immediate-settlement" },
          { text: "Deposit | Rebate", link: "/deposit-rebate" },
        ],
      },
      {
        text: "Observability",
        items: [
          { text: "OpenTelemetry", link: "/otel" },
          { text: "Payment Identifiers", link: "/payment-identifiers" },
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
