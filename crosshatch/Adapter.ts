import { Context, Layer, type Effect } from "effect"

import type { ExtensionsInfo } from "./Extension.ts"
import type { CreatePayloadError } from "./Payer.ts"
import type { Payload } from "./Payload.ts"
import type { Requirements } from "./Requirements.ts"

export class Adapter extends Context.Service<
  Adapter,
  (config: {
    readonly accepted: typeof Requirements.Type
    readonly extensions?: typeof ExtensionsInfo.Type | undefined
  }) => Effect.Effect<{ readonly payload: typeof Payload.Type }, CreatePayloadError>
>()("crosshatch/Adapter") {}

export class AdapterRegistry extends Context.Reference<Map<Context.Service<any, Adapter>, Layer.Layer<Adapter>>>(
  "crosshatch/AdapterRegistry",
  { defaultValue: () => new Map() },
) {}
