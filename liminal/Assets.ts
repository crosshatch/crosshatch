import type { HttpServerResponse } from "@effect/platform"

import { Effect } from "effect"

import type { NativeRequest } from "./NativeRequest.ts"

import * as Binding from "./Binding.ts"

export class Assets extends Binding.Service<Assets>()(
  "Assets",
  "ASSETS",
  (value): value is { fetch: typeof fetch } => "fetch" in value,
) {
  static readonly forward: Effect.Effect<HttpServerResponse.HttpServerResponse, never, NativeRequest>
}
