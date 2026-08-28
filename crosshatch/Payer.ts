import { Array, Schema as S, Context, Effect, Layer, Record, flow } from "effect"

import type { Accept, AcceptError } from "./Accept.ts"
import * as Bridge from "./Bridge.ts"
import { ExtensionRegistry } from "./Extension.ts"
import type { Payload } from "./Payload.ts"
import type { Required } from "./Required.ts"
import { CreatePayloadError } from "./Scheme.ts"

export class Payer extends Context.Service<
  Payer,
  {
    readonly createPayload: (config: {
      readonly trace?: Bridge.TraceInfo | undefined

      readonly required: Required
    }) => Effect.Effect<{ readonly payload: Payload }, AcceptError | CreatePayloadError>
  }
>()("crosshatch/Payer") {}

export const layerLocal = (accept: Accept) =>
  Layer.effect(
    Payer,
    Effect.gen(function* () {
      const registry = yield* ExtensionRegistry
      const context = yield* Effect.context()
      return {
        createPayload: Effect.fnUntraced(function* ({ required }) {
          const { accepted, adapt } = yield* accept({ required }).pipe(Effect.provideContext(context))
          const { extensions: envelopes = {} } = required
          const payload = yield* adapt
          const extensions = yield* Effect.forEach(
            Record.toEntries(envelopes),
            Effect.fnUntraced(
              function* ([identifier, envelope]) {
                const extension = registry.entries().find(([extension]) => extension.identifier === identifier)
                if (!extension) {
                  return
                }
                const [{ info: Info, enrichment: Enrichment }, f] = extension
                const info = yield* S.decodeEffect(S.toCodecJson(Info))(envelope.info)
                const enrichment = yield* f({ accepted, info, payload, required }).pipe(
                  Effect.flatMap(S.encodeEffect(S.toCodecJson(Enrichment))),
                )
                return [identifier, { info: enrichment, schema: envelope.schema }] as const
              },
              Effect.catchTags({
                SchemaError: () => Effect.undefined,
              }),
            ),
            { concurrency: "unbounded" },
          ).pipe(
            Effect.map(
              flow(
                Array.filter((v) => !!v),
                Record.fromEntries,
              ),
            ),
          )
          return {
            payload: {
              x402Version: 2 as const,
              payload,
              accepted,
              extensions,
            },
          }
        }),
      }
    }),
  )

export const layerFromBridge = Effect.map(Bridge.Bridge, ({ propose }) => ({
  createPayload: flow(
    propose,
    Effect.catchTags({
      ProposeError: (cause) => new CreatePayloadError({ cause }),
    }),
  ),
})).pipe(Layer.effect(Payer))
