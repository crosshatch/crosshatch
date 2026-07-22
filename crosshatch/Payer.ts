import { Array, Schema as S, Context, Effect, Layer, Record, Predicate, Result, flow, pipe } from "effect"

import { Accept, type AcceptError } from "./Accept.ts"
import { Bridge } from "./Bridge.ts"
import { ExtensionRegistry } from "./Extension.ts"
import type { Payload } from "./Payload.ts"
import type { Required } from "./Required.ts"
import { CreatePayloadError } from "./Scheme.ts"
import { Base64JsonString } from "./_util.ts"

export class Payer extends Context.Service<
  Payer,
  {
    readonly createPayload: (config: {
      readonly traceId?: string | undefined
      readonly required: Required
      readonly request?: Request | undefined
    }) => Effect.Effect<
      { readonly payload: Payload; readonly headers?: Record<string, string> | undefined },
      AcceptError | CreatePayloadError
    >
  }
>()("crosshatch/Payer") {}

export const layer = Layer.effect(
  Payer,
  Effect.gen(function* () {
    const accept = yield* Accept
    const registry = yield* ExtensionRegistry
    return {
      createPayload: Effect.fnUntraced(function* ({ required, request }) {
        const { accepted, adapt } = yield* accept({ required })
        const { extensions: infos = {} } = required
        const payload = yield* adapt

        const resolved = yield* Effect.forEach(
          Record.toEntries(infos),
          Effect.fnUntraced(
            function* ([identifier, infoJson]) {
              const extension = registry.entries().find(([extension]) => extension.identifier === identifier)
              if (!extension) {
                return
              }
              const [{ info: Info, enrichment: Enrichment, header }, f] = extension
              const info = yield* S.decodeUnknownEffect(S.toCodecJson(Info))(infoJson)
              const enrichment = yield* f({ accepted, info, payload, required, request })
              if (header) {
                const value = yield* S.encodeEffect(Base64JsonString(Enrichment))(enrichment)
                return { kind: "header" as const, header, value }
              }
              const value = yield* S.encodeEffect(S.toCodecJson(Enrichment))(enrichment)
              return { kind: "payload" as const, identifier, value }
            },
            Effect.catchTags({
              SchemaError: () => Effect.undefined,
            }),
          ),
          { concurrency: "unbounded" },
        ).pipe(Effect.map(Array.filter(Predicate.isNotUndefined)))

        // Array.partition returns failures first, then successes. Payload entries fail the
        // filter and header entries pass it.
        const [extensions, headers] = pipe(
          Array.partition(resolved, (item) => (item.kind === "header" ? Result.succeed(item) : Result.fail(item))),
          ([extensionEntries, headerEntries]) => [
            Record.fromEntries(extensionEntries.map(({ identifier, value }) => [identifier, value])),
            Record.fromEntries(headerEntries.map(({ header, value }) => [header, value])),
          ],
        )

        return {
          payload: { x402Version: 2, payload, accepted, extensions } satisfies Payload,
          ...(Record.size(headers) > 0 ? { headers } : {}),
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
