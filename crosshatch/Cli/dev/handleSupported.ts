import { Effect, Record, Struct } from "effect"

import type { Denomination } from "../../Asset.ts"
import { ChainId } from "../../ChainId.ts"
import { FacilitatorApi } from "../../FacilitatorApi/FacilitatorApi.ts"
import * as KnownAssets from "../../KnownAssets/KnownAssets.ts"
import { handler } from "./_common.ts"

const knownAssetDenominations: ReadonlyArray<Denomination> = [KnownAssets.Usd]

export const handleSupported = handler(FacilitatorApi, "facilitator", "supported", () =>
  Effect.succeed({
    kinds: knownAssetDenominations.flatMap((denomination) =>
      Record.values(denomination).flatMap((logicalAsset) =>
        Record.toEntries(logicalAsset).flatMap(([namespace, references]) =>
          Record.toEntries(references).map(([reference, physical]) => ({
            x402Version: 2,
            scheme: "exact",
            network: ChainId.make(`${namespace}:${reference}`, { disableChecks: true }),
            extra: Struct.pick(physical, ["asset", "name", "version"]),
          })),
        ),
      ),
    ),
    extensions: [],
    signers: {
      "eip155:*": ["0x0000000000000000000000000000000000000001"],
      "solana:*": ["11111111111111111111111111111111"],
    },
  }),
)
