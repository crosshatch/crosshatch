import { Schema as S, Record, Duration } from "effect"

import { Address } from "./Address.ts"
import { usdToAtomic, usdFromNumber } from "./Amount.ts"
import { Asset } from "./Asset.ts"
import { ChainId } from "./ChainId.ts"
import type { PhysicalAsset } from "./PhysicalAsset.ts"

export const Requirements = S.Struct({
  amount: S.String,
  asset: Asset,
  extra: S.Record(S.String, S.Unknown).pipe(S.optional),
  maxTimeoutSeconds: S.Number,
  network: ChainId,
  payTo: Address,
  scheme: S.Literals(["exact", "upto"]),
})

export const group = <A extends PhysicalAsset>(
  asset: A,
  {
    amount,
    recipients,
    ttl,
  }: {
    amount: number
    recipients: {
      [K in keyof A]: {
        [K2 in keyof A[K]]+?: typeof Address.Type | undefined
      }
    }
    ttl?: Duration.Input | undefined
  },
): ReadonlyArray<typeof Requirements.Type> => {
  const maxTimeoutSeconds = ttl ? Math.ceil(Duration.fromInputUnsafe(ttl).pipe(Duration.toSeconds)) : 300
  return Record.toEntries(recipients).flatMap(([namespace, references]) =>
    Record.toEntries(references).reduce(
      (acc, [reference, payTo]) => {
        const deployment = asset[namespace]![reference]!
        const { name, version } = deployment
        return payTo
          ? acc.concat({
              amount: usdToAtomic(usdFromNumber(amount), deployment),
              asset: Asset.make(deployment.asset),
              maxTimeoutSeconds,
              network: ChainId.make(`${namespace}:${reference}`),
              payTo,
              scheme: "exact",
              extra: { name, version },
            })
          : acc
      },
      [] as ReadonlyArray<typeof Requirements.Type>,
    ),
  )
}
