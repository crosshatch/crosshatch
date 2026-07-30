import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"

import { Mnemonic } from "../index.ts"
import * as Eip155Address from "./Eip155Address.ts"

describe(import.meta.url, () => {
  it.effect(
    "derives the standard EVM account",
    Effect.fn(function* () {
      const mnemonic = Mnemonic.fromText("test test test test test test test test test test test junk")
      expect(yield* Eip155Address.fromMnemonic(mnemonic)).toBe("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266")
    }),
  )
})
