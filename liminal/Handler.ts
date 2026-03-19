import type { RequestDefinition } from "@crosshatch/util/schema"

import { Effect, Types } from "effect"

export type Handler<Request extends RequestDefinition, R> = (
  request: Request["Type"],
) => Effect.Effect<Request["success"]["Type"], Request["failure"]["Type"], R>

export type Handlers<Requests extends ReadonlyArray<RequestDefinition>, R> = {
  [Tag in Types.Tags<Requests[number]>]: Handler<Types.ExtractTag<Requests[number], Tag>, R>
}

export const make = <D extends RequestDefinition, R>(_request: D, f: Handler<D, R>): Handler<D, R> => f
