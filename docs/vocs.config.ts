import PackageJson from "crosshatch/package.json" with { type: "json" }
import { Changelog, defineConfig, McpSource } from "vocs/config"

export default defineConfig({
  title: "Crosshatch",
  titleTemplate: "%s ⋅ Crosshatch",
  accentColor: "light-dark(#6D5BD0, #A99BFF)",
  codeHighlight: {
    themes: {
      light: "github-light",
      dark: "tokyo-night",
    },
  },
  checkDeadlinks: true,
  changelog: Changelog.github({
    repo: "crosshatch/crosshatch",
    prereleases: true,
  }),
  editLink: {
    link: "https://github.com/crosshatch/crosshatch/edit/main/docs/src/pages/:path",
    text: "Edit on GitHub",
  },
  renderStrategy: "full-static",
  mcp: {
    enabled: true,
    sources: [McpSource.github({ repo: "crosshatch/crosshatch" })],
  },
  description: PackageJson.description,
  twoslash: { explicitTrigger: false },
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
  ],
  iconUrl: "/icon.svg",
  banner: {
    content: "Crosshatch is in preview. Join the discord for updates.",
    dismissable: false,
    href: "https://discord.gg/CSXCRUKjh9",
    variant: "tip",
  },
  ogImageUrl: "https://crosshatch.dev/og.png",
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
          { text: "Facilitation", link: "/facilitation" },
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
          { text: "Payer", link: "/payer" },
          { text: "Bridge", link: "/bridge" },
          { text: "ChxRpc", link: "/chx-rpc" },
          { text: "Scheme", link: "/scheme" },
        ],
      },
      {
        text: "Schemes",
        items: [
          { text: "EIP-155", link: "/eip155" },
          { text: "Solana", link: "/solana" },
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
