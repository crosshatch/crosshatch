import { type Effect, Context } from "effect"

import type { CreatePayloadError } from "./errors.ts"
import type { Payload } from "./Payload.ts"
import type { Requirements } from "./Requirements.ts"

export interface Chain {
  readonly createPayload: ({
    accepted,
    extensions,
  }: {
    readonly accepted: typeof Requirements.Type
    readonly extensions?: Record<string, unknown> | undefined
  }) => Effect.Effect<
    {
      readonly payload: typeof Payload.Type
    },
    CreatePayloadError
  >
}

// TODO: model as true service subclass
// readonly address: S.Top & { readonly Type: string & Brand.Brand<string> }
export const Service =
  <Self>() =>
  <Id extends string>(id: Id) =>
    Context.Service<Self, Chain>()(id)
