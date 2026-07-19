import { describe, expect, it } from "@effect/vitest"
import { Effect, Layer } from "effect"
import { Hash, TypedData } from "ox"

import * as Mnemonic from "../Mnemonic.ts"
import { Eip155Signer, layerMnemonic } from "./Eip155Signer.ts"

const mnemonicText = "test test test test test test test test test test test junk"

const typedData = {
  domain: {
    name: "Crosshatch",
    version: "1",
    chainId: 1,
    verifyingContract: "0x0000000000000000000000000000000000000001",
  },
  types: {
    Transfer: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
  },
  primaryType: "Transfer",
  message: {
    to: "0x0000000000000000000000000000000000000002",
    amount: 42n,
  },
} as const

const expectedAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
const expectedHash = "0x05eba886292a4c246364a828777391d1d478f046fe53e55cc4d3bc78bece22d4"
const expectedSignature =
  "0xce2df803735f41cc51f540549ba547f55fa767d64ad6a988de734b32571d3a7075b1bbdd6b6fb01c2f9b88cc674b5f5e197212f997b159892f55c577342ecb5b1b"

describe(import.meta.url, () => {
  it.effect(
    "signs typed data with a recoverable deterministic signature",
    Effect.fn(function* () {
      const signer = yield* Eip155Signer.pipe(
        Effect.provide(layerMnemonic.pipe(Layer.provide(Mnemonic.layerText(mnemonicText)))),
      )
      expect(Hash.keccak256(TypedData.encode(typedData))).toBe(expectedHash)
      expect(signer.address).toBe(expectedAddress)
      expect(signer.signTypedData(typedData)).toBe(expectedSignature)
    }),
  )
})
