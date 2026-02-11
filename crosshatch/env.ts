import { Config, Effect } from "effect"

export const env = Effect.gen(function*() {
  const dev = yield* Config.boolean("DEV").pipe(
    Config.withDefault(true),
  )
  const domain = `${dev ? "local." : ""}crosshatch.dev`
  const url = `https://${domain}`
  return {
    dev,
    domain,
    url,
    isCrosshatch: (origin: string) => origin === url,
    href: (subpath: string) => `${url}/${subpath}`,
  } as const
}).pipe(
  Effect.runSync,
)
