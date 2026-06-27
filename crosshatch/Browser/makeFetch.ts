import { Effect, Encoding, flow, Schema as S, Data } from "effect"
import * as Boundary from "liminal-util/Boundary"

import { Required } from "../Required.ts"
import * as Facade from "./Facade/Facade.ts"
import type { ProposeError } from "./ProposeError.ts"
import { managedRuntime } from "./runtime.ts"
import { PrerequisitesWidget } from "./Widgets.ts"

export class CrosshatchFetchError extends Data.TaggedError("CrosshatchFetchError")<{
  readonly prerequisites: typeof ProposeError.Type
}> {}

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
        ? Encoding.decodeBase64String(header).pipe(
            Effect.fromResult,
            Effect.flatMap(flow(JSON.parse, S.decodeUnknownEffect(S.toType(Required)))),
          )
        : Effect.promise(() => response.json()).pipe(
            Effect.flatMap(S.decodeUnknownEffect(S.toType(Required))),
            Effect.filterOrFail(({ x402Version }) => x402Version === 1),
          )
      const make = Facade.FacadeClient.fn("Propose")({ required }).pipe(
        Effect.catchTags({
          AuditionError: Effect.die,
          ConnectionError: Effect.die,
          SchemaError: Effect.die,
          UnresolvedError: Effect.die,
        }),
      )
      const { payload } = yield* make.pipe(
        Effect.catchTags({
          PrerequisitesUnmetError: flow(PrerequisitesWidget.host, Effect.andThen(make)),
        }),
      )
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
    }).pipe(Effect.onError(Effect.logError), Boundary.span("crosshatch-fetch", import.meta.url), (effect) =>
      managedRuntime.runPromise(effect, { signal: init?.signal ?? undefined }),
    )
  }
