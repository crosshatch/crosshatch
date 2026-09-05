import { Effect, type Schema as S } from "effect"
import { Address as OxAddress, HdKey, Secp256k1 } from "ox"

import { Mnemonic, Address } from "../../index.ts"
import { Eip155 } from "./Eip155.ts"

export const fromMnemonic: (mnemonic: Mnemonic.Mnemonic) => Effect.Effect<Address.Address<Eip155>, S.SchemaError> = (
  mnemonic: Mnemonic.Mnemonic,
) =>
  Effect.sync(() => {
    const root = HdKey.fromSeed(Mnemonic.toSeed(mnemonic))
    const { privateKey } = root.derive("m/44'/60'/0'/0/0")
    return OxAddress.fromPublicKey(Secp256k1.getPublicKey({ privateKey }))
  }).pipe(Effect.flatMap((v) => Address.make(v, Eip155)))
