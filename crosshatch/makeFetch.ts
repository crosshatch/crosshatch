import { Effect, Encoding, Exit, flow, Schema as S, Scope, Stream } from "effect"

import { DeclinedDecision } from "./DeclinedDecision.ts"
import { FacadeClient } from "./FacadeClient.ts"
import { managedRuntime } from "./runtime.ts"
import { EscalationWidget, OnrampExplainerWidget, ThawWidget } from "./widgets.ts"
import { Required } from "./X402/Required.ts"
import { Version } from "./X402/Version.ts"

export class CrosshatchFetchError extends S.TaggedError<CrosshatchFetchError>()("CrosshatchFetchError", {
  decision: DeclinedDecision,
}) {}

export const makeFetch =
  (fetch: typeof globalThis.fetch): typeof globalThis.fetch =>
  async (input, init) => {
    const headers = new Headers(init?.headers)
    const response = await fetch(input, { ...init, headers })
    if (response.status !== 402) {
      return response
    }
    return Effect.gen(function* () {
      const header = response.headers.get("PAYMENT-REQUIRED")
      const required = yield* header
        ? Encoding.decodeBase64String(header).pipe(Effect.flatMap(flow(JSON.parse, S.decodeUnknown(Required))))
        : Effect.tryPromise(() => response.json()).pipe(
            Effect.flatMap(S.decodeUnknown(Required)),
            Effect.filterOrFail(({ x402Version }) => x402Version === 1),
          )
      const bridge = yield* FacadeClient
      let decision = yield* bridge("Propose", { required })
      while (decision._tag !== "Approved") {
        const widget = {
          AccountFrozen: ThawWidget,
          Escalation: EscalationWidget,
          InsufficientFunds: OnrampExplainerWidget,
        }[decision._tag]
        const scope = yield* Scope.make()
        yield* widget.stream(decision as never).pipe(
          Stream.tap(
            Effect.fn(function* (item) {
              if (item._tag === "Finished") {
                yield* Scope.close(scope, Exit.succeed(undefined))
              }
            }),
          ),
          Stream.runDrain,
          Scope.extend(scope),
        )
        decision = yield* bridge("Propose", { required })
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
      return yield* Effect.tryPromise(() => fetch(input, { ...init, headers }))
    }).pipe((x) =>
      managedRuntime.runPromise(x, {
        signal: init?.signal ?? undefined,
      }),
    )
  }
