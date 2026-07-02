import { Effect, Encoding, ManagedRuntime, Schema as S } from "effect"
import * as Boundary from "liminal-util/Boundary"

import type { Payload } from "./Payload.ts"
import { Required, RequiredFromBase64JsonString } from "./Required.ts"

export const makeX402Fetch =
  <E, R>(
    propose: (required: typeof Required.Type) => Effect.Effect<{ readonly payload: typeof Payload.Type }, E, R>,
    fetch: typeof globalThis.fetch = globalThis.fetch,
  ) =>
  <ER>(runtime: ManagedRuntime.ManagedRuntime<R, ER>): typeof globalThis.fetch =>
  async (input, init) => {
    const headers = new Headers(init?.headers)
    const response = await fetch(input, { ...init, headers })
    if (response.status !== 402) {
      return response
    }
    return Effect.gen(function* () {
      const header = response.headers.get("PAYMENT-REQUIRED")
      const required = yield* header
        ? S.decodeEffect(RequiredFromBase64JsonString)(header)
        : Effect.promise(() => response.json()).pipe(
            Effect.flatMap(S.decodeUnknownEffect(S.toType(Required))),
            Effect.filterOrFail(({ x402Version }) => x402Version === 1),
          )
      const { payload } = yield* propose(required)
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
