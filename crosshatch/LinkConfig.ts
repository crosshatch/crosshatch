import { Effect, flow, Schema as S } from "effect"
import { appUrl } from "./env.ts"
import { LinkChallenge } from "./LinkChallenge.ts"

export const Presentation = S.Literal("Redirect", "Embedded", "Popup")

export const AllowanceWindow = S.Literal("Day", "Week", "Month", "Year", "Ever")

export const Allowance = S.Struct({
  window: AllowanceWindow,
  amount: S.BigInt,
})

export const LinkConfig = S.Struct({
  presentation: Presentation,
  window: AllowanceWindow,
  amount: S.BigInt,
  referrer: S.String,
}).pipe(
  S.extend(LinkChallenge),
)

export const linkHref = flow(
  S.encode(LinkConfig),
  Effect.map((c) => {
    const result = new URL("id", appUrl)
    Object.entries(c).forEach(([k, v]) => result.searchParams.set(k, v))
    return result.href
  }),
)
