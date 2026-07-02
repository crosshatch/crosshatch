import { Effect, Encoding, flow, ManagedRuntime, Schema as S } from "effect"
import * as Boundary from "liminal-util/Boundary"

import type * as Payer from "../Payer.ts"
import * as Payload from "../Payload.ts"
import { Required } from "../Required.ts"

export const makeFetch =
  (
    runtime: ManagedRuntime.ManagedRuntime<Payer.Payer, never>,
    fetch: typeof globalThis.fetch = globalThis.fetch,
  ): typeof globalThis.fetch =>
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
      const { payload } = yield* Payload.make({ required })
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
      runtime.runPromise(effect, { signal: init?.signal ?? undefined }),
    )
  }
