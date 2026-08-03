import { Effect, Schema as S } from "effect"

import { Eip155Address } from "../Eip155/index.ts"
import type { Mnemonic } from "../index.ts"
import { SolanaAddress } from "../Solana/index.ts"

export type DerivedAddresses = typeof DerivedAddresses.Type
export const DerivedAddresses = S.Struct({
  eip155: Eip155Address.Eip155Address,
  solana: SolanaAddress.SolanaAddress,
})

export const fromMnemonic = (mnemonic: Mnemonic.Mnemonic): Effect.Effect<DerivedAddresses, S.SchemaError> =>
  Effect.all(
    {
      eip155: Eip155Address.fromMnemonic(mnemonic),
      solana: SolanaAddress.fromMnemonic(mnemonic),
    },
    { concurrency: "unbounded" },
  )
