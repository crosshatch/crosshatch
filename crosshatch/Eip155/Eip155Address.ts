import { Redacted, Schema as S } from "effect"
import { Address as OxAddress, HdKey, Secp256k1, Mnemonic as OxMnemonic } from "ox"

import * as Address from "../Address.ts"
import * as Mnemonic from "../Mnemonic.ts"
import { brand } from "./_common.ts"

/** EIP155 account address — `0x` followed by 20 bytes of hex. */
export const Eip155Address = S.TemplateLiteral([S.Literal("0x"), S.String])
  .check(S.isPattern(/^0x[a-fA-F0-9]{40}$/u))
  .pipe(Address.brand, brand)

export const fromMnemonic = (mnemonic: Mnemonic.Mnemonic): typeof Eip155Address.Type => {
  const seed = OxMnemonic.toSeed(Redacted.value(mnemonic))
  const root = HdKey.fromSeed(seed)
  const { privateKey } = root.derive("m/44'/60'/0'/0/0")
  const publicKey = Secp256k1.getPublicKey({ privateKey })
  return Eip155Address.make(OxAddress.fromPublicKey(publicKey))
}
