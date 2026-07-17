import { flow, Types, Array, Effect, Schema as S, Record, Duration, UndefinedOr } from "effect"

import { Address } from "./Address.ts"
import * as Amount from "./Amount.ts"
import type { InvalidAmountError } from "./Amount.ts"
import { Asset, type Denomination, type LogicalAsset } from "./Asset.ts"
import { ChainId } from "./ChainId.ts"

export type Requirements = typeof Requirements.Type
export const Requirements = S.Struct({
  amount: Amount.Atomic,
  asset: Asset,
  extra: S.Record(S.String, S.Unknown).pipe(S.optional),
  maxTimeoutSeconds: S.Finite.check(S.isGreaterThan(0)),
  network: ChainId,
  payTo: Address,
  scheme: S.Literals(["exact", "upto"]),
})

export type RequirementsLike =
  | Requirements
  | Effect.Effect<Requirements, InvalidAmountError>
  | Array<Requirements>
  | Effect.Effect<Array<Requirements>, InvalidAmountError>

export const logical = Effect.fnUntraced(function* <A extends LogicalAsset>(
  asset: A,
  {
    amount,
    recipients,
    ttl,
  }: {
    readonly amount: Amount.Input
    readonly recipients: {
      readonly [K in keyof A]?: { readonly [K2 in keyof A[K]]?: typeof Address.Type | undefined } | undefined
    }
    readonly ttl?: Duration.Input | undefined
  },
) {
  const maxTimeoutSeconds = UndefinedOr.match(ttl, {
    onDefined: flow(Duration.fromInputUnsafe, Duration.toSeconds, Math.ceil),
    onUndefined: () => 300,
  })
  const nominal = yield* Amount.from(amount)
  return Record.toEntries(recipients).flatMap(([namespace, references]) =>
    references
      ? Record.toEntries(references).reduce((acc, [reference, payTo]) => {
          const physical = asset[namespace]?.[reference]
          if (!physical) return acc
          const { name, version } = physical
          return payTo
            ? acc.concat({
                amount: Amount.toAtomic(nominal, physical),
                asset: Asset.make(physical.asset, { disableChecks: true }),
                maxTimeoutSeconds,
                network: ChainId.make(`${namespace}:${reference}`, { disableChecks: true }),
                payTo,
                scheme: "exact",
                extra: { name, version },
              })
            : acc
        }, [] as ReadonlyArray<Requirements>)
      : [],
  )
})

export const denomination = <A extends Denomination>(
  denomination: A,
  config: {
    readonly amount: Amount.Input
    readonly recipients: Types.UnionToIntersection<
      {
        readonly [K in keyof A]: {
          readonly [K2 in keyof A[K]]?:
            | { readonly [K3 in keyof A[K][K2]]?: typeof Address.Type | undefined }
            | undefined
        }
      }[keyof A]
    >
    readonly ttl?: Duration.Input | undefined
  },
) =>
  Effect.all(Record.toEntries(denomination).map(([_k, logicalAsset]) => logical(logicalAsset, config as never))).pipe(
    Effect.map(Array.flatten),
  )
