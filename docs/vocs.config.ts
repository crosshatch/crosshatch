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
  iconUrl: "/icon.svg",
  banner: {
    content: "Crosshatch is in preview. Join the discord for updates.",
    dismissable: false,
    href: "https://discord.gg/CSXCRUKjh9",
    variant: "tip",
  },
  baseUrl: "https://crosshatch.dev",
  sidebar: {
    "/": [
      {
        text: "Introduction",
        items: [
          {
            text: "Quickstart",
            link: "/quickstart",
            items: [
              { text: "For Clients", link: "/quickstart/for-clients" },
              { text: "For Merchants", link: "/quickstart/for-merchants" },
            ],
          },
          { text: "Lifecycle", link: "/lifecycle" },
        ],
      },
      {
        text: "Core Types",
        items: [
          { text: "Asset", link: "/asset" },
          { text: "Mnemonic", link: "/mnemonic" },
          { text: "Required", link: "/required" },
          { text: "Payload", link: "/payload" },
          { text: "Extension", link: "/extension" },
        ],
      },
      {
        text: "Payment Capability",
        items: [
          { text: "Bridge", link: "/bridge" },
          { text: "Payer", link: "/payer" },
          {
            text: "Adapter",
            link: "/adapter",
            collapsed: true,
            items: [
              { text: "EIP-155", link: "/eip155" },
              { text: "Solana", link: "/solana" },
            ],
          },
        ],
      },
    ],
    "/articles": [{ link: "/articles", text: "All Articles" }],
  },
  socials: [
    { icon: "github", link: "https://github.com/crosshatch/crosshatch" },
    { icon: "discord", link: "https://discord.gg/CSXCRUKjh9" },
    { icon: "x", link: "https://x.com/CrosshatchDev" },
  ],
})
