import { PaymentRequired } from "@crosshatch/x402"
import { absurd, Effect, Encoding, flow, Schema as S } from "effect"
import { BridgeClient } from "./BridgeClient.ts"

export const makeFetch = (fetch: typeof globalThis.fetch): typeof globalThis.fetch => async (input, init) =>
  Effect.gen(function*() {
    // TODO: remove this header manipulation
    const headers = new Headers(init?.headers)
    headers.delete("traceparent")
    headers.delete("tracestate")
    headers.delete("b3")
    headers.delete("x-b3-traceid")
    headers.delete("x-b3-spanid")
    headers.delete("x-b3-sampled")
    headers.delete("http-referrer")

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
    const decision = yield* bridge.payment({
      requirement: requirement as never,
    })
    if (decision._tag !== "Approved") {
      // TODO: escalation
      return absurd<never>(null!)
    }
    const { payload } = decision
    const value = Encoding.encodeBase64(JSON.stringify(payload))
    switch (payload.x402Version) {
      case 1: {
        headers.set("X-PAYMENT", value)
        break
      }
      case 2: {
        headers.set("PAYMENT-SIGNATURE", value)
        break
      }
      default: {
        absurd<never>(null!)
      }
    }

    return yield* Effect.promise(() => fetch(input, { ...init, headers }))
  }).pipe(
    Effect.provide(BridgeClient.Default),
    (x) =>
      Effect.runPromise(x, {
        signal: init?.signal ?? undefined,
      }),
  )
