import { Context, Effect, Layer } from "effect"

import type { Chain } from "./Chain.ts"
import { CreatePayloadError, CreateTraceError, NoSuchSupportedAssetError, RequirementSelectionError } from "./errors.ts"
import type { Payload } from "./Payload.ts"
import type { Required } from "./Required.ts"
import type { TraceConfig } from "./traced.ts"
import { Treasurer } from "./Treasurer.ts"

export class Payer extends Context.Service<
  Payer,
  {
    readonly createTrace?: undefined | ((config: typeof TraceConfig.Type) => Effect.Effect<void, CreateTraceError>)

    readonly createPayload: (config: {
      readonly traceId?: string | undefined
      readonly required: typeof Required.Type
    }) => Effect.Effect<
      { readonly payload: typeof Payload.Type },
      RequirementSelectionError | NoSuchSupportedAssetError | CreatePayloadError
    >
  }
>()("crosshatch/Payer") {}

export const layer = (chain: Chain) =>
  Layer.effect(
    Payer,
    Effect.gen(function* () {
      const { select } = yield* Treasurer
      return {
        createPayload: Effect.fnUntraced(function* ({ required }) {
          const { config } = yield* select(required)
          return yield* chain.createPayload(config)
        }),
      }
    }),
  )
