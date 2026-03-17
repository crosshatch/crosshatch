import { Effect, Encoding, Exit, flow, Schema as S, Scope, Stream } from "effect"

import { DeclinedDecision } from "./Decision.ts"
import * as Facade from "./Facade.ts"
import { managedRuntime } from "./runtime.ts"
import {
  EscalationWidget,
  OnrampExplainerWidget,
  ThawAccountWidget,
  ThawAppWidget,
  RaiseAllowanceWidget,
} from "./widgets.ts"
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
      const facade = yield* Facade.Facade
      let decision = yield* facade.request(required)
      while (decision._tag !== "Approved") {
        const widget = {
          AppFrozen: ThawAppWidget,
          AccountFrozen: ThawAccountWidget,
          Escalation: EscalationWidget,
          InsufficientFunds: OnrampExplainerWidget,
          InsufficientAllowanceRemaining: RaiseAllowanceWidget,
        }[decision._tag]
        const scope = yield* Scope.make()
        yield* widget.stream(decision as never).pipe(
          Stream.runForEach(
            Effect.fn(function* (item) {
              if (item._tag === "Finished") {
                yield* Scope.close(scope, Exit.succeed(undefined))
              }
            }),
          ),
          Scope.use(scope),
        )
        decision = yield* facade.request(required)
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
