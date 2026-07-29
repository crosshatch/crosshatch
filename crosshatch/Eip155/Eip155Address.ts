import { Schema as S, Effect } from "effect"
import { Address as OxAddress, HdKey, Secp256k1 } from "ox"

import * as Address from "../Address.ts"
import * as Mnemonic from "../Mnemonic.ts"
import { brand } from "./_common.ts"

/** EIP155 account address — `0x` followed by 20 bytes of hex. */
export type Eip155Address = typeof Eip155Address.Type
export const Eip155Address = S.TemplateLiteral([S.Literal("0x"), S.String])
  .check(S.isPattern(/^0x[a-fA-F0-9]{40}$/u))
  .pipe(Address.brand, brand)

export const fromMnemonic = (mnemonic: Mnemonic.Mnemonic) =>
  Effect.sync(() => {
    const root = HdKey.fromSeed(Mnemonic.toSeed(mnemonic))
    const { privateKey } = root.derive("m/44'/60'/0'/0/0")
    const publicKey = Secp256k1.getPublicKey({ privateKey })
    return Eip155Address.make(OxAddress.fromPublicKey(publicKey), { disableChecks: true })
  })
