import { Config, Effect } from "effect"

export const dev = Config.boolean("DEV").pipe(
  Config.withDefault(true),
  Effect.runSync,
)
const prefix = dev ? "local." : ""

export const domain = `${prefix}crosshatch.dev`

export const docsDomain = `${prefix}docs.crosshatch.dev`

const urlLeading = (v: string) => `https://${v}`

export const appUrl = urlLeading(domain)
export const docsUrl = urlLeading(docsDomain)
