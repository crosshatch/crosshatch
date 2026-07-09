import { Array, Schema as S, Context, Effect, Layer, Record, Predicate, flow } from "effect"

import { Accept, type AcceptError } from "./Accept.ts"
import { CreatePayloadError } from "./Adapter.ts"
import { Bridge } from "./Bridge.ts"
import { ExtensionRegistry } from "./Extension.ts"
import type { Payload } from "./Payload.ts"
import type { Required } from "./Required.ts"

export class Payer extends Context.Service<
  Payer,
  {
    readonly createPayload: (config: {
      readonly traceId?: string | undefined
      readonly required: typeof Required.Type
    }) => Effect.Effect<{ readonly payload: typeof Payload.Type }, AcceptError | CreatePayloadError>
  }
>()("crosshatch/Payer") {}

export const layer = Layer.effect(
  Payer,
  Effect.gen(function* () {
    const accept = yield* Accept
    const registry = yield* ExtensionRegistry
    return {
      createPayload: Effect.fnUntraced(function* ({ required }) {
        const { accepted, adapt } = yield* accept({ required })
        const { extensions: infos = {} } = required
        const payload = yield* adapt
        const extensions = yield* Effect.forEach(
          Record.toEntries(infos),
          Effect.fnUntraced(
            function* ([identifier, info]) {
              const extension = registry.entries().find(([extension]) => extension.identifier === identifier)
              if (!extension) {
                return
              }
              const [{ info: Info, echo: Echo }, f] = extension
              const parsed = yield* S.decodeUnknownEffect(S.toCodecJson(Info))(info)
              const echo = yield* f(parsed).pipe(Effect.flatMap(S.encodeEffect(S.toCodecJson(Echo))))
              return [identifier, echo] as const
            },
            Effect.catchTags({
              SchemaError: () => Effect.undefined,
            }),
          ),
          { concurrency: "unbounded" },
        ).pipe(Effect.map(flow(Array.filter(Predicate.isNotUndefined), Record.fromEntries)))
        return {
          payload: { x402Version: 2, payload, accepted, extensions },
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
