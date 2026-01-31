import { Widget } from "@crosshatch/util"
import { PaymentRequired } from "@crosshatch/x402"
import { absurd, Data, Effect, Encoding, flow, Schema as S, Stream } from "effect"
import { BridgeClient } from "./BridgeClient.ts"
import { runtime } from "./BridgeClientLive.ts"
import { escalationHref } from "./config.ts"

export class InsufficientFundsError extends Data.TaggedError("InsufficientFundsError")<{}> {}
export class EscalationRejectedError extends Data.TaggedError("EscalationRejectedError")<{}> {}

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
    if (decision._tag === "Escalation") {
      yield* escalationHref(decision).pipe(
        Effect.flatMap((src) =>
          Widget.make({
            src,
            schema: S.Void,
          }).pipe(Stream.runDrain)
        ),
      )
      decision = yield* bridge.propose({
        requirement: requirement as never,
      })
      if (decision._tag === "Escalation") {
        throw new EscalationRejectedError()
      }
    }
    if (decision._tag === "InsufficientFunds") {
      throw new InsufficientFundsError()
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
    (x) =>
      runtime.runPromise(x, {
        signal: init?.signal ?? undefined,
      }),
  )
