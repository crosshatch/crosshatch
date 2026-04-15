import { Schema as S, Redacted } from "effect"
import { Address as OxAddress, HdKey, Mnemonic, Secp256k1 } from "ox"

import { Address } from "./Address.ts"
import { ChainId } from "./ChainId.ts"
import { Namespace } from "./Namespace.ts"

export const Derivation = S.Struct({
  address: Address,
  chainId: ChainId,
  namespace: Namespace,
})

export const deriveCommon = (mnemonic: Redacted.Redacted<string>): Array<typeof Derivation.Type> => {
  const seed = Mnemonic.toSeed(Redacted.value(mnemonic).trim())
  const root = HdKey.fromSeed(seed)
  const { privateKey } = root.derive("m/44'/60'/0'/0/0")
  const publicKey = Secp256k1.getPublicKey({ privateKey })
  const address = OxAddress.fromPublicKey(publicKey)
  return [
    {
      address,
      chainId: 8453,
      namespace: "eip155",
    },
  ]
}
