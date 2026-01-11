import { Effect, Encoding, flow, pipe, Schema as S } from "effect"
import { appUrl } from "./env.ts"

export type LinkConfig = typeof LinkConfig["Type"]
export const LinkConfig = S.Struct({
  challengeId: S.UUID,
  redirect: S.String,
  nonce: S.String,
  budget: S.Number,
  icon: S.String.pipe(S.optional),
})

export const make = ({ challengeId, redirect, nonce, budget }: {
  readonly challengeId: string
  readonly redirect?: string | undefined
  readonly nonce?: string | undefined
  readonly budget?: number | undefined
}): LinkConfig => ({
  challengeId,
  redirect: redirect ?? location.href,
  nonce: nonce ?? crypto.randomUUID(),
  budget: budget ?? 10,
})

export const toHref = (config: LinkConfig) => {
  const result = new URL("link", appUrl)
  result.searchParams.set(
    "config",
    pipe(
      S.encodeSync(LinkConfig)(config),
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
      S.decodeUnknown(LinkConfig),
    )),
  )
