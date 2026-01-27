import { Config, Effect } from "effect"

export const dev = Config.boolean("DEV").pipe(
  Config.withDefault(true),
  Effect.runSync,
)
const prefix = dev ? "local." : ""

export const appDomain = `${prefix}crosshatch.dev`
export const docsDomain = `${prefix}docs.crosshatch.dev`

const urlLeading = (v: string) => `https://${v}`

export const appUrl = urlLeading(appDomain)
export const docsUrl = urlLeading(docsDomain)
