import { Mermaid } from "@/components/mermaid"
import * as Twoslash from "fumadocs-twoslash/ui"
import { Accordion, Accordions } from "fumadocs-ui/components/accordion"
import { File, Files, Folder } from "fumadocs-ui/components/files"
import { GithubInfo } from "fumadocs-ui/components/github-info"
import { ImageZoom } from "fumadocs-ui/components/image-zoom"
import * as StepsComponents from "fumadocs-ui/components/steps"
import * as TabsComponents from "fumadocs-ui/components/tabs"
import defaultMdxComponents from "fumadocs-ui/mdx"
import * as icons from "lucide-react"
import type { MDXComponents } from "mdx/types"

export const components: MDXComponents = {
  ...(icons as never as MDXComponents),
  ...defaultMdxComponents,
  Mermaid,
  ...Twoslash,
  ...TabsComponents,
  ...StepsComponents,
  img: ImageZoom,
  GithubInfo,
  File,
  Files,
  Folder,
  Accordion,
  Accordions,
}
