import { assert, describe, it } from "@effect/vitest"
import { Effect } from "effect"

import { Required } from "./index.ts"

describe(import.meta.url, () => {
  it.effect(
    "strips template margins without preserving surrounding indentation",
    Effect.fn(function* () {
      const required = yield* Required.make`
      |
      | Description of the charge here.
      |
      | What is this charge for?
      |
      `

      assert.strictEqual(required.resource.description, "Description of the charge here.\n\nWhat is this charge for?")
    }),
  )

  it.effect(
    "preserves plain string descriptions",
    Effect.fn(function* () {
      const required = yield* Required.make("  Description of the charge.  ")

      assert.strictEqual(required.resource.description, "  Description of the charge.  ")
    }),
  )
})
