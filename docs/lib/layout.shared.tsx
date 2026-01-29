import { SearchToggleLg, SearchToggleSm } from "@/components/search-toggle"
import { ThemeToggle } from "@crosshatch/ui/components/ThemeToggle"
import { CrosshatchIcon, DiscordIcon, GithubIcon, XIcon } from "@crosshatch/ui/icons"
import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared"

export const githubLink: LinkItemType = {
  icon: <GithubIcon />,
  url: "https://github.com/crosshatch/crosshatch",
  text: "GitHub",
  type: "icon" as const,
}

export const xLink: LinkItemType = {
  icon: <XIcon />,
  url: "https://x.com/CrosshatchDev",
  text: "X",
  type: "icon" as const,
}

export const discordLink: LinkItemType = {
  icon: <DiscordIcon />,
  url: "https://discord.gg/qK5y4Kn6",
  text: "Discord",
  type: "icon" as const,
}

export const layoutPropsCommon: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <CrosshatchIcon className="stroke-[0.5]" />
        <span className="uppercase">Crosshatch</span>
      </>
    ),
  },
  themeSwitch: {
    component: <ThemeToggle />,
  },
  searchToggle: {
    components: {
      sm: <SearchToggleSm />,
      lg: <SearchToggleLg />,
    },
  },
}
