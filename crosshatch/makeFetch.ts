import type { ClientError, UnresolvedError } from "liminal"

import { Payload, Required } from "@crosshatch/x402"
import { Schedule, Effect, Encoding, flow, Schema as S, Cause } from "effect"

import * as Facade from "./Facade/Facade.ts"
import { InternalEnv } from "./InternalEnv.ts"
import { managedRuntime } from "./runtime.ts"
import {
  EscalationWidget,
  OnrampExplainerWidget,
  ThawAccountWidget,
  ThawAppWidget,
  RaiseAllowanceWidget,
} from "./widgets.ts"

export class CrosshatchFetchError extends S.TaggedErrorClass<CrosshatchFetchError>()("CrosshatchFetchError", {
  decision: Facade.DeclinedDecision,
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
        : Effect.tryPromise(() => response.json()).pipe(
            Effect.flatMap(S.decodeUnknownEffect(S.toType(Required.Required))),
            Effect.filterOrFail(({ x402Version }) => x402Version === 1),
          )
      const make: Effect.Effect<
        { readonly payload: typeof Payload.Payload.Type },
        S.SchemaError | Cause.NoSuchElementError | ClientError | UnresolvedError | Facade.AllowanceDenial,
        Facade.FacadeClient | InternalEnv
      > = Facade.FacadeClient.f("Propose")({ required }).pipe(
        (x) =>
          Effect.catchTags(x, {
            AppFrozen: ThawAppWidget.runDrain,
            AccountFrozen: ThawAccountWidget.runDrain,
            InsufficientFunds: OnrampExplainerWidget.runDrain,
            Escalation: EscalationWidget.runDrain,
            InsufficientAllowanceRemaining: RaiseAllowanceWidget.runDrain,
          }).pipe(Effect.andThen(make), Effect.catchTag("UrlParamsError", Effect.die)),
        Effect.retry(Schedule.forever),
      )
      const { payload } = yield* make
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
      return yield* Effect.tryPromise(() => fetch(input, { ...init, headers }))
    }).pipe((x) =>
      managedRuntime.runPromise(x, {
        signal: init?.signal ?? undefined,
      }),
    )
  }
