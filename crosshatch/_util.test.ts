import { assert, describe, it } from "@effect/vitest"

import { stringRaw } from "./_util.ts"

const template = (template: TemplateStringsArray, ...substitutions: Array<unknown>) =>
  [template, substitutions] as const

describe(import.meta.url, () => {
  it("strips template margins without preserving surrounding indentation", () => {
    const description = stringRaw(
      ...template`
      |
      | Description of the charge here.
      |
      | What is this charge for?
      |
      `,
    )
    assert.strictEqual(description, "Description of the charge here.\n\nWhat is this charge for?")
  })

  it("passes substitutions through String.raw while stripping template margins", () => {
    const charge = "subscription"
    const amount = 20
    const description = stringRaw(
      ...template`
      |
      | Charge type: ${charge}
      | Amount: $${amount}
      |
      `,
    )
    assert.strictEqual(description, "Charge type: subscription\nAmount: $20")
  })

  it("trims plain strings", () => {
    const description = stringRaw("  Description of the charge.  ", [])
    assert.strictEqual(description, "Description of the charge.")
  })
})
