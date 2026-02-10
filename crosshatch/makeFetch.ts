import { Effect, Encoding, flow, Schema as S, Stream } from "effect"
import { BridgeClient } from "./BridgeClient.ts"
import { DeclinedDecision } from "./DeclinedDecision.ts"
import { runtime } from "./Live.ts"
import { EscalationWidget, OnrampExplainerWidget, ThawWidget } from "./widgets.ts"
import { PaymentRequired, Version } from "./X402/schemas.ts"

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
    const required = yield* (
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
      required: required as never,
    })
    while (decision._tag !== "Approved") {
      const widget = {
        AccountFrozen: ThawWidget,
        InsufficientFunds: OnrampExplainerWidget,
        Escalation: EscalationWidget,
      }[decision._tag]
      yield* widget.stream(decision as never).pipe(
        Stream.runDrain,
      )
      decision = yield* bridge.propose({
        required: required as never,
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
