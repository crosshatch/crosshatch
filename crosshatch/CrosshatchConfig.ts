import { Effect, Encoding, flow, pipe, Schema as S } from "effect"
import { appUrl } from "./env.ts"

export type CrosshatchConfig = typeof CrosshatchConfig["Type"]
export const CrosshatchConfig = S.Struct({
  identityId: S.String,
  redirect: S.String,
  nonce: S.String,
  budget: S.Number,
  icon: S.String.pipe(S.optional),
})

export const make = ({ identityId, redirect, nonce, budget }: {
  readonly identityId: string
  readonly redirect?: string | undefined
  readonly nonce?: string | undefined
  readonly budget?: number | undefined
}): CrosshatchConfig => ({
  identityId,
  redirect: redirect ?? location.href,
  nonce: nonce ?? crypto.randomUUID(),
  budget: budget ?? 10,
})

export const toHref = (config: CrosshatchConfig) => {
  const result = new URL("link", appUrl)
  result.searchParams.set(
    "config",
    pipe(
      S.encodeSync(CrosshatchConfig)(config),
      JSON.stringify,
      Encoding.encodeBase64Url,
    ),
  )
  return result.href
}

export const fromString = (v: string) =>
  pipe(
    v,
    Encoding.decodeBase64UrlString,
    Effect.flatMap(flow(
      JSON.parse,
      S.decodeUnknown(CrosshatchConfig),
    )),
  )
