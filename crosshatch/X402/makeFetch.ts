import type { ClientError, UnresolvedError } from "liminal"

import { Schedule, Effect, Encoding, flow, Schema as S, Cause } from "effect"

import { CrosshatchEnv } from "../CrosshatchEnv.ts"
import { FacadeClient } from "../FacadeClient.ts"
import { AllowanceDenial, DeclinedDecision } from "../methods/Propose.ts"
import { managedRuntime } from "../runtime.ts"
import {
  EscalationWidget,
  OnrampExplainerWidget,
  ThawAccountWidget,
  ThawAppWidget,
  RaiseAllowanceWidget,
} from "../widgets.ts"
import { Payload } from "./Payload.ts"
import { Required } from "./Required.ts"
import { Version } from "./Version.ts"

export class CrosshatchFetchError extends S.TaggedErrorClass<CrosshatchFetchError>()("CrosshatchFetchError", {
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
        ? Encoding.decodeBase64String(header)
            .asEffect()
            .pipe(Effect.flatMap(flow(JSON.parse, S.decodeUnknownEffect(Required))))
        : Effect.tryPromise(() => response.json()).pipe(
            Effect.flatMap(S.decodeUnknownEffect(Required)),
            Effect.filterOrFail(({ x402Version }) => x402Version === 1),
          )
      const make: Effect.Effect<
        { readonly payload: typeof Payload.Type },
        S.SchemaError | Cause.NoSuchElementError | ClientError | UnresolvedError | AllowanceDenial,
        FacadeClient | CrosshatchEnv
      > = FacadeClient.f("Propose")({ required }).pipe(
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
      const version = yield* S.decodeUnknownEffect(Version)(payload.x402Version)
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
