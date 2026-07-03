import { Effect, Schema as S, Record, Duration } from "effect"

import { Address } from "./Address.ts"
import * as Amount from "./Amount.ts"
import { Asset } from "./Asset.ts"
import { ChainId } from "./ChainId.ts"
import type { PhysicalAsset } from "./PhysicalAsset.ts"

export const Requirements = S.Struct({
  amount: Amount.Atomic,
  asset: Asset,
  extra: S.Record(S.String, S.Unknown).pipe(S.optional),
  maxTimeoutSeconds: S.Number,
  network: ChainId,
  payTo: Address,
  scheme: S.Literals(["exact", "upto"]),
})

export const group = Effect.fnUntraced(function* <A extends PhysicalAsset>(
  asset: A,
  {
    amount,
    recipients,
    ttl,
  }: {
    readonly amount: Amount.Input
    readonly recipients: {
      readonly [K in keyof A["deployments"]]: {
        readonly [K2 in keyof A["deployments"][K]]+?: typeof Address.Type | undefined
      }
    }
    readonly ttl?: Duration.Input | undefined
  },
) {
  const maxTimeoutSeconds = ttl ? Math.ceil(Duration.fromInputUnsafe(ttl).pipe(Duration.toSeconds)) : 300
  const nominal = yield* Amount.from(amount)
  return Record.toEntries(recipients).flatMap(([namespace, references]) =>
    Record.toEntries(references).reduce(
      (acc, [reference, payTo]) => {
        const deployment = asset.deployments[namespace]![reference]!
        const { name, version } = deployment
        return payTo
          ? acc.concat({
              amount: Amount.toAtomic(nominal, deployment),
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
})
