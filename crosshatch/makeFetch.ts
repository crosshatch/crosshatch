import { Required } from "@crosshatch/x402"
import { Effect, Encoding, flow, Schema as S } from "effect"

import * as Facade from "./Facade/Facade.ts"
import { managedRuntime } from "./runtime.ts"
import { EscalationWidget, OnrampWidget, ThawAccountWidget, ThawAppWidget, RaiseAllowanceWidget } from "./widgets.ts"

export class CrosshatchFetchError extends S.TaggedErrorClass<CrosshatchFetchError>()("CrosshatchFetchError", {
  decision: Facade.DeclinedError,
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
        ? Encoding.decodeBase64String(header)
            .asEffect()
            .pipe(Effect.flatMap(flow(JSON.parse, S.decodeUnknownEffect(S.toType(Required.Required)))))
        : Effect.promise(() => response.json()).pipe(
            Effect.flatMap(S.decodeUnknownEffect(S.toType(Required.Required))),
            Effect.filterOrFail(({ x402Version }) => x402Version === 1),
          )
      const make = Facade.FacadeClient.fn("Propose")({ required }).pipe(
        Effect.catchTags({
          AppFrozenError: ThawAppWidget.host,
          AccountFrozenError: ThawAccountWidget.host,
          InsufficientFundsError: OnrampWidget.host,
          EscalationError: EscalationWidget.host,
          InsufficientAllowanceRemainingError: RaiseAllowanceWidget.host,
        }),
      )
      const result = yield* make
      if (!result) {
        return yield* Effect.die("TODO retry")
      }
      const { payload } = result
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
      }
      return yield* Effect.promise(() => fetch(input, { ...init, headers }))
    }).pipe((x) => managedRuntime.runPromise(x, { signal: init?.signal ?? undefined }))
  }
