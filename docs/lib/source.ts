// TODO: parallelize

import { articles as articles_, create, docs } from "@/.source"
import { loader } from "fumadocs-core/source"
import * as icons from "lucide-static"

const icon = (icon: string | undefined) => {
  if (icon && icon in icons) return icons[icon as keyof typeof icons]
  return
}

export const source = loader({
  source: await create.sourceAsync(docs.doc, docs.meta),
  baseUrl: "/docs",
  icon,
})

export const articles = loader({
  source: await create.sourceAsync(articles_.doc, articles_.meta),
  baseUrl: "/articles",
  icon,
})
