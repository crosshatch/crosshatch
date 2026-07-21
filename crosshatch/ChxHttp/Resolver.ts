import { Data, type Effect } from "effect"
import type { HttpClientRequest } from "effect/unstable/http"

import type { Required } from "../Required.ts"

export class ResolverError extends Data.TaggedError("ResolverError")<{
  readonly cause?: unknown
}> {}

export type Resolver<R = never> = (input: {
  readonly request: HttpClientRequest.HttpClientRequest
  readonly required: Required
  readonly traceId?: string | undefined
}) => Effect.Effect<{ readonly headers: HeadersInit } | undefined, ResolverError, R>

export declare namespace Resolver {
  export type Any = Resolver<any>
  export type Context<T extends Any> = T extends Resolver<infer R> ? R : never
}
