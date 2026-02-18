import { describe, it } from "@effect/vitest"
import { Effect } from "effect"

describe(import.meta.url, () => {
  it.effect(
    "todo",
    Effect.fn(function* () {
      yield* Effect.void
    }),
  )
})
