import { Address, ChainId, Asset } from "crosshatch"
import { Requirements } from "crosshatch/X402"
import { Record, Duration } from "effect"

import { usdToAtomic, usdFromNumber } from "./Amount.ts"
import type { PhysicalAsset } from "./PhysicalAsset.ts"

export const requirements = <A extends PhysicalAsset>(
  asset: A,
  {
    amount,
    recipients,
    ttl,
  }: {
    amount: number
    recipients: {
      [K in keyof A]: {
        [K2 in keyof A[K]]+?: typeof Address.Address.Type | undefined
      }
    }
    ttl?: Duration.Input | undefined
  },
): ReadonlyArray<typeof Requirements.Requirements.Type> => {
  const maxTimeoutSeconds = ttl ? Math.ceil(Duration.fromInputUnsafe(ttl).pipe(Duration.toSeconds)) : 300
  return Record.toEntries(recipients).flatMap(([namespace, references]) =>
    Record.toEntries(references).reduce(
      (acc, [reference, payTo]) => {
        const deployment = asset[namespace]![reference]!
        const { name, version } = deployment
        return [
          ...acc,
          ...(payTo
            ? [
                {
                  amount: usdToAtomic(usdFromNumber(amount), deployment),
                  asset: Asset.Asset.make(deployment.asset),
                  maxTimeoutSeconds,
                  network: ChainId.ChainId.make(`${namespace}:${reference}`),
                  payTo,
                  scheme: "exact",
                  extra: { name, version },
                } satisfies typeof Requirements.Requirements.Type,
              ]
            : []),
        ]
      },
      [] as ReadonlyArray<typeof Requirements.Requirements.Type>,
    ),
  )
}
