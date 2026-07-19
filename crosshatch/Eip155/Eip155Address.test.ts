import { describe, expect, it } from "@effect/vitest"

import * as Mnemonic from "../Mnemonic.ts"
import * as Eip155Address from "./Eip155Address.ts"

describe(import.meta.url, () => {
  it("derives the standard EVM account", () => {
    const mnemonic = Mnemonic.fromText("test test test test test test test test test test test junk")
    expect(Eip155Address.fromMnemonic(mnemonic)).toBe("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266")
  })
})
