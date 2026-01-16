import { makeId } from "@crosshatch/util"
import { Effect, Encoding, flow, Schema as S } from "effect"
import { appUrl } from "./env.ts"

export const ChallengeIdTypeId = Symbol()
export const ChallengeId = makeId(ChallengeIdTypeId, "LinkChallengeId")

export const AllowanceWindow = S.Literal("Day", "Week", "Month", "Year", "Ever")

export const Allowance = S.Struct({
  window: AllowanceWindow,
  amount: S.BigInt,
})

export const LinkChallenge = S.Struct({
  id: ChallengeId,
  nonce: S.UUID,
})

export const LinkConfig = S.Struct({
  challenge: LinkChallenge,
  context: S.Union(
    S.TaggedStruct("TopLevel", {}),
    S.TaggedStruct("Embedded", {}),
  ),
  referrer: S.String.pipe(S.optional),
  suggestedAllowance: Allowance.pipe(S.optional),
})

export const encode = flow(
  S.encode(LinkConfig),
  Effect.map(flow(
    JSON.stringify,
    Encoding.encodeHex,
  )),
)

export const decode = flow(
  Encoding.decodeHexString,
  Effect.flatMap(flow(
    JSON.parse,
    S.decodeUnknown(LinkConfig),
  )),
)

export const toHref = flow(
  encode,
  Effect.map((c) => {
    const result = new URL("id", appUrl)
    result.searchParams.set("c", c)
    return result.href
  }),
)

export const SearchParams = S.Struct({ c: S.String })
