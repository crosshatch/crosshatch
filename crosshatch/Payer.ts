import { Array, Schema as S, Context, Effect, Layer, Record, Predicate, flow } from "effect"

import type { Accept, AcceptError } from "./Accept.ts"
import type { Denomination } from "./Asset.ts"
import { Bridge } from "./Bridge.ts"
import { ExtensionRegistry } from "./Extension.ts"
import type { Payload } from "./Payload.ts"
import type { Required } from "./Required.ts"
import { CreatePayloadError } from "./Scheme.ts"

export class Payer extends Context.Service<
  Payer,
  {
    readonly createPayload: (config: {
      readonly traceId?: string | undefined
      readonly required: Required
    }) => Effect.Effect<{ readonly payload: Payload }, AcceptError | CreatePayloadError>
  }
>()("crosshatch/Payer") {}

export const layerLocal = <ROut, E, RIn>({
  assets,
  accept,
  schemes,
}: {
  readonly assets: Denomination
  readonly schemes: Layer.Layer<ROut, E, RIn>
  readonly accept: Accept
}) =>
  Layer.effect(
    Payer,
    Effect.gen(function* () {
      const registry = yield* ExtensionRegistry
      const context = yield* Effect.context<RIn>()
      const schemesContext = yield* Layer.build(schemes)
      return {
        createPayload: Effect.fnUntraced(function* ({ required }) {
          const { accepted, adapt } = yield* accept({ required, assets }).pipe(
            Effect.provideContext(Context.mergeAll(context, schemesContext)),
          )
          const { extensions: infos = {} } = required
          const payload = yield* adapt
          const extensions = yield* Effect.forEach(
            Record.toEntries(infos),
            Effect.fnUntraced(
              function* ([identifier, infoJson]) {
                const extension = registry.entries().find(([extension]) => extension.identifier === identifier)
                if (!extension) {
                  return
                }
                const [{ info: Info, enrichment: Enrichment }, f] = extension
                const info = yield* S.decodeUnknownEffect(S.toCodecJson(Info))(infoJson)
                const enrichment = yield* f({ accepted, info, payload, required }).pipe(
                  Effect.flatMap(S.encodeEffect(S.toCodecJson(Enrichment))),
                )
                return [identifier, enrichment] as const
              },
              Effect.catchTags({
                SchemaError: () => Effect.undefined,
              }),
            ),
            { concurrency: "unbounded" },
          ).pipe(Effect.map(flow(Array.filter(Predicate.isNotUndefined), Record.fromEntries)))
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

export const layerBridge = Effect.map(Bridge, ({ propose }) => ({
  createPayload: flow(
    propose,
    Effect.catchTags({
      ProposeError: (cause) => new CreatePayloadError({ cause }),
    }),
  ),
})).pipe(Layer.effect(Payer))
