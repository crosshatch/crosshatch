import { Array, Schema as S, Context, Data, Effect, Layer, Record, Predicate, flow } from "effect"

import { Accept, type AcceptError } from "./Accept.ts"
import { AssetConfigurationRef } from "./AssetConfiguration.ts"
import { Bridge } from "./Bridge.ts"
import type { Chain } from "./Chain.ts"
import { ExtensionRegistry } from "./Extension.ts"
import type { Payload } from "./Payload.ts"
import type { Required } from "./Required.ts"

export class CreatePayloadError extends Data.TaggedError("CreatePayloadError")<{ readonly cause?: unknown }> {}

export class Payer extends Context.Service<
  Payer,
  {
    readonly createPayload: (config: {
      readonly required: typeof Required.Type
    }) => Effect.Effect<{ readonly payload: typeof Payload.Type }, AcceptError | CreatePayloadError>
  }
>()("crosshatch/Payer") {}

export const layer = (chain: Chain) =>
  Layer.effect(
    Payer,
    Effect.gen(function* () {
      const { accept } = yield* Accept
      const assetConfigurationRef = yield* AssetConfigurationRef
      const registry = yield* ExtensionRegistry
      return {
        createPayload: Effect.fnUntraced(function* ({ required }) {
          const { accepted } = yield* accept({ assetConfigurationRef, required })
          const { extensions: payloads = {} } = required
          const extensions = yield* Effect.forEach(
            Record.toEntries(payloads),
            Effect.fnUntraced(
              function* ([name, payload]) {
                const extension = registry.entries().find(([extension]) => extension.name === name)
                if (!extension) {
                  return
                }
                const [{ payload: Payload, success: Success }, f] = extension
                const parsed = yield* S.decodeUnknownEffect(S.toCodecJson(Payload))(payload)
                const result = yield* f(parsed).pipe(Effect.flatMap(S.encodeEffect(S.toCodecJson(Success))))
                return [name, result] as const
              },
              Effect.catchTags({
                SchemaError: () => Effect.undefined,
              }),
            ),
            { concurrency: "unbounded" },
          ).pipe(Effect.map(flow(Array.filter(Predicate.isNotUndefined), Record.fromEntries)))
          return yield* chain.createPayload({ accepted, extensions })
        }),
      }
    }),
  )

export const layerBridge = Effect.map(Bridge, ({ propose }) => ({
  createPayload: flow(
    propose,
    Effect.catchTags({
      ProposeError: (cause) => new CreatePayloadError({ cause }),
    }),
  ),
})).pipe(Layer.effect(Payer))
