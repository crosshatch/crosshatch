import { Effect } from "effect"

import type { Denomination } from "../../Asset.ts"
import { ChainId } from "../../ChainId.ts"
import { FacilitatorApi } from "../../Facilitator/FacilitatorApi.ts"
import * as KnownAssets from "../../KnownAssets/KnownAssets.ts"
import { handler } from "./_common.ts"

const knownAssetDenominations: ReadonlyArray<Denomination> = [KnownAssets.Usd]

const dummySigners = {
  "eip155:*": ["0x0000000000000000000000000000000000000001"],
  "solana:*": ["11111111111111111111111111111111"],
} as const

export const handleSupported = handler(FacilitatorApi, "facilitator", "supported", () =>
  Effect.succeed({
    kinds: knownAssetDenominations.flatMap((denomination) =>
      Object.values(denomination).flatMap((logicalAsset) =>
        Object.entries(logicalAsset).flatMap(([namespace, references]) =>
          Object.entries(references).map(([reference, physical]) => ({
            x402Version: 2,
            scheme: "exact",
            network: ChainId.make(`${namespace}:${reference}`, { disableChecks: true }),
            extra: {
              asset: physical.asset,
              name: physical.name,
              version: physical.version,
            },
          })),
        ),
      ),
    ),
    extensions: [],
    signers: dummySigners,
  }),
)
