import { describe, expect, it } from "@effect/vitest"
import { Effect, Layer } from "effect"
import { Address, Hash, Secp256k1, Signature, TypedData } from "ox"

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

describe(import.meta.url, () => {
  it.effect(
    "signs typed data with a recoverable deterministic signature",
    Effect.fn(function* () {
      const signer = yield* Eip155Signer.pipe(
        Effect.provide(layerMnemonic.pipe(Layer.provide(Mnemonic.layerText(mnemonicText)))),
      )
      const signature = signer.signTypedData(typedData)
      const payload = Hash.keccak256(TypedData.encode(typedData))
      const recovered = Secp256k1.recoverAddress({
        payload,
        signature: Signature.fromHex(signature),
      })
      expect(signer.address).toBe("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
      expect(Address.isEqual(recovered, signer.address)).toBeTruthy()
      expect(signature).toBe(signer.signTypedData(typedData))
    }),
  )
})
