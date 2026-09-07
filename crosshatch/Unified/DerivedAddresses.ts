import { Effect, Pipeable, Schema as S } from "effect"

import { instance } from "../_instance.ts"
import * as Proto from "../_Proto.ts"
import type { Mnemonic } from "../index.ts"
import { Eip155, Eip155Address } from "../namespaces/Eip155/index.ts"
import { Solana, SolanaAddress } from "../namespaces/Solana/index.ts"

const TypeId = Proto.id("DerivedAddresses")

export type DerivedAddressesFields = typeof DerivedAddressesFields.Type
export const DerivedAddressesFields = S.Struct({
  eip155: instance(Eip155.Eip155).AddressString,
  solana: instance(Solana.Solana).AddressString,
})

export interface DerivedAddresses extends DerivedAddressesFields, Pipeable.Pipeable {
  readonly [TypeId]: typeof TypeId
}

export const fromMnemonic = (mnemonic: Mnemonic.Mnemonic): Effect.Effect<DerivedAddressesFields, S.SchemaError> =>
  Effect.all(
    {
      eip155: Eip155Address.fromMnemonic(mnemonic).pipe(Effect.map((v) => v.raw)),
      solana: SolanaAddress.fromMnemonic(mnemonic).pipe(Effect.map((v) => v.raw)),
    },
    { concurrency: "unbounded" },
  )
