import { PaymentRequired } from "@crosshatch/x402"
import { absurd, Effect, Encoding, flow, Schema as S } from "effect"
import { BridgeClient } from "./BridgeClient.ts"

export const makeFetch = (fetch: typeof globalThis.fetch): typeof globalThis.fetch => async (input, init) =>
  Effect.gen(function*() {
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
    const enclave = yield* BridgeClient
    const decision = yield* enclave.payment({
      requirement: requirement as never,
    })
    if (decision._tag !== "Approved") {
      // TODO: escalation
      return absurd<never>(null!)
    }
    const { payload } = decision
    const value = Encoding.encodeBase64(JSON.stringify(payload))
    const paymentHeaders = yield* Effect.fromNullable(
      {
        1: { "X-PAYMENT": value },
        2: { "PAYMENT-SIGNATURE": value },
      }[payload.x402Version],
    )
    const newInit = {
      ...init,
      headers: {
        ...headers,
        ...paymentHeaders,
        "Access-Control-Expose-Headers": "PAYMENT-RESPONSE,X-PAYMENT-RESPONSE",
      },
    }
    return yield* Effect.promise(() => fetch(input, newInit))
  }).pipe(
    Effect.provide(BridgeClient.Default),
    (x) =>
      Effect.runPromise(x, {
        signal: init?.signal ?? undefined,
      }),
  )
