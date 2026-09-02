import { Schema as S, Effect } from "effect"
import { Address as OxAddress, HdKey, Secp256k1 } from "ox"

import { brand } from "../_common.ts"
import { Address, Mnemonic } from "../index.ts"

export type Eip155Address = typeof Eip155Address.Type
export const Eip155Address = Address.Address.check(S.isPattern(/^0x[a-fA-F0-9]{40}$/u)).pipe(
  brand("Eip155/Eip155Address"),
)

export const { fromString, config } = Address.factory(Eip155Address)

export const fromMnemonic = (mnemonic: Mnemonic.Mnemonic) =>
  Effect.sync(() => {
    const root = HdKey.fromSeed(Mnemonic.toSeed(mnemonic))
    const { privateKey } = root.derive("m/44'/60'/0'/0/0")
    const publicKey = Secp256k1.getPublicKey({ privateKey })
    return Eip155Address.make(OxAddress.fromPublicKey(publicKey), { disableChecks: true })
  })
