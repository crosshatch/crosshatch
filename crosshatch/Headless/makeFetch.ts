import { type ManagedRuntime, pipe } from "effect"

import type * as Payer from "../Payer.ts"
import * as Payload from "../Payload.ts"
import { makeX402Fetch } from "../x402Fetch.ts"

export const makeFetch = (
  runtime: ManagedRuntime.ManagedRuntime<Payer.Payer, never>,
  fetch: typeof globalThis.fetch = globalThis.fetch,
): typeof globalThis.fetch =>
  pipe(
    runtime,
    makeX402Fetch((required) => Payload.make({ required }), fetch),
  )
