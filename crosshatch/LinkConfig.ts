import { Effect, Encoding, flow, pipe, Schema as S } from "effect"
import { LinkChallengeId } from "./ChallengeId.ts"
import { appUrl } from "./env.ts"

export const AllowanceWindow = S.Literal("Day", "Week", "Month", "Year", "Ever")

export const Allowance = S.Struct({
  window: AllowanceWindow,
  amount: S.BigInt,
})

export const LinkConfig = S.Struct({
  challengeId: LinkChallengeId,
  redirectHref: S.String,
  nonce: S.UUID,
  suggestedAllowance: Allowance,
  icon: S.String.pipe(S.optional),
})

export const makeLinkHref = (config: typeof LinkConfig.Type) => {
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

export const parseLinkConfig = (v: string) =>
  pipe(
    v,
    Encoding.decodeBase64UrlString,
    Effect.flatMap(flow(
      JSON.parse,
      S.decodeUnknown(LinkConfig),
    )),
  )
