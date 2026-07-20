import type { Effect } from "effect"
import type { HttpClientRequest } from "effect/unstable/http"

import type { Required } from "../Required.ts"

export type Resolver<E = never, R = never> = (input: {
  readonly request: HttpClientRequest.HttpClientRequest
  readonly required: Required
  readonly traceId?: string | undefined
}) => Effect.Effect<{ readonly headers: HeadersInit } | undefined, E, R>

export declare namespace Resolver {
  export type Any = Resolver<any, any>
  export type Context<T extends Any> = T extends Resolver<infer _E, infer R> ? R : never
}
