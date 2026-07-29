import { Effect, Schema as S } from "effect"

import * as Eip155Address from "../Eip155/Eip155Address.ts"
import type * as Mnemonic from "../Mnemonic.ts"
import type { Reference } from "../Reference.ts"
import * as SolanaAddress from "../Solana/SolanaAddress.ts"

export type DerivedAddresses = typeof DerivedAddresses.Type
export const DerivedAddresses = S.Struct({
  eip155: Eip155Address.Eip155Address,
  solana: SolanaAddress.SolanaAddress,
})

export const fromMnemonic = (
  mnemonic: Mnemonic.Mnemonic,
  _reference?: Reference,
): Effect.Effect<DerivedAddresses, S.SchemaError> =>
  Effect.all(
    {
      eip155: Eip155Address.fromMnemonic(mnemonic),
      solana: SolanaAddress.fromMnemonic(mnemonic),
    },
    { concurrency: "unbounded" },
  )
