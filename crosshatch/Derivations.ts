import { Effect } from "effect"

import * as Eip155Address from "./Eip155/Eip155Address.ts"
import type * as Mnemonic from "./Mnemonic.ts"
import type { Reference } from "./Reference.ts"
import * as SolanaAddress from "./Solana/SolanaAddress.ts"

export const make = (mnemonic: Mnemonic.Mnemonic, _reference?: Reference) =>
  Effect.all(
    {
      eip155: Effect.sync(() => Eip155Address.fromMnemonic(mnemonic)),
      solana: SolanaAddress.fromMnemonic(mnemonic),
    },
    { concurrency: "unbounded" },
  )
