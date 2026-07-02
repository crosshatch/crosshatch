import { Data, Effect, flow, pipe } from "effect"

import { makeX402Fetch } from "../x402Fetch.ts"
import * as Facade from "./Facade/Facade.ts"
import type { ProposeError } from "./ProposeError.ts"
import { managedRuntime } from "./runtime.ts"
import { PrerequisitesWidget } from "./Widgets.ts"

export class CrosshatchFetchError extends Data.TaggedError("CrosshatchFetchError")<{
  readonly prerequisites: typeof ProposeError.Type
}> {}

export const makeFetch = (fetch: typeof globalThis.fetch): typeof globalThis.fetch =>
  pipe(
    managedRuntime,
    makeX402Fetch((required) => {
      const make = Facade.FacadeClient.fn("Propose")({ required }).pipe(
        Effect.catchTags({
          AuditionError: Effect.die,
          ConnectionError: Effect.die,
          SchemaError: Effect.die,
          UnresolvedError: Effect.die,
        }),
      )
      return make.pipe(
        Effect.catchTags({
          PrerequisitesUnmetError: flow(PrerequisitesWidget.host, Effect.andThen(make)),
        }),
      )
    }, fetch),
  )
