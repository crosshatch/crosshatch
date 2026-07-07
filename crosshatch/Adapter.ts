import { Context, Layer, type Effect } from "effect"

import type { CreatePayloadError } from "./Payer.ts"
import type { Requirements } from "./Requirements.ts"

export class Adapter extends Context.Service<
  Adapter,
  (config: {
    readonly accepted: typeof Requirements.Type
  }) => Effect.Effect<Record<string, unknown>, CreatePayloadError>
>()("crosshatch/Adapter") {}

export class AdapterRegistry extends Context.Reference<Map<Context.Service<any, Adapter>, Layer.Layer<Adapter>>>(
  "crosshatch/AdapterRegistry",
  { defaultValue: () => new Map() },
) {}
