import { Widget } from "@crosshatch/util"
import { PaymentRequired, Version } from "@crosshatch/x402"
import { Effect, Encoding, flow, Schema as S, Stream } from "effect"
import { BridgeClient } from "./BridgeClient.ts"
import { escalationHref, onrampExplainerHref, thawHref } from "./config.ts"
import { DeclinedDecision } from "./DeclinedDecision.ts"
import { runtime } from "./Live.ts"

export class CrosshatchFetchError extends S.TaggedError<CrosshatchFetchError>()("CrosshatchFetchError", {
  decision: DeclinedDecision,
}) {}

export const makeFetch = (fetch: typeof globalThis.fetch): typeof globalThis.fetch => async (input, init) =>
  Effect.gen(function*() {
    const headers = new Headers(init?.headers)
    const response = yield* Effect.promise(() => fetch(input, { ...init, headers }))
    if (response.status !== 402) {
      return response
    }
    const header = response.headers.get("PAYMENT-REQUIRED")
    const requirement = yield* (
      header
        ? Encoding.decodeBase64String(header).pipe(
          Effect.flatMap(flow(
            JSON.parse,
            S.decodeUnknown(PaymentRequired),
          )),
        )
        : Effect.tryPromise(() => response.json()).pipe(
          Effect.flatMap(S.decodeUnknown(PaymentRequired)),
          Effect.filterOrFail(({ x402Version }) => x402Version === 1),
        )
    )
    const bridge = yield* BridgeClient
    let decision = yield* bridge.propose({
      requirement: requirement as never,
    })
    while (decision._tag !== "Approved") {
      const src = yield* ({
        AccountFrozen: thawHref,
        InsufficientFunds: onrampExplainerHref,
        Escalation: escalationHref,
      }[decision._tag])(decision as never)
      yield* Widget.embed({
        src,
        schema: S.Void,
      }).pipe(
        Stream.runDrain,
      )
      decision = yield* bridge.propose({
        requirement: requirement as never,
      })
    }
    if (decision._tag !== "Approved") {
      throw new CrosshatchFetchError({ decision })
    }
    const { payload } = decision
    const version = yield* S.decodeUnknown(Version)(payload.x402Version)
    const value = Encoding.encodeBase64(JSON.stringify(payload))
    switch (version) {
      case 1: {
        headers.set("X-PAYMENT", value)
        break
      }
      case 2: {
        headers.set("PAYMENT-SIGNATURE", value)
        break
      }
    }

    return yield* Effect.promise(() => fetch(input, { ...init, headers }))
  }).pipe((x) =>
    runtime.runPromise(x, {
      signal: init?.signal ?? undefined,
    })
  )
