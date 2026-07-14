import { Types, Array, Effect, Schema as S, Record, Duration } from "effect"

import { Address } from "./Address.ts"
import * as Amount from "./Amount.ts"
import type { InvalidAmountError } from "./Amount.ts"
import { Asset, type Namespaces, type Peg } from "./Asset.ts"
import { ChainId } from "./ChainId.ts"

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
  | typeof Requirements.Type
  | Effect.Effect<typeof Requirements.Type, InvalidAmountError>
  | Array<typeof Requirements.Type>
  | Effect.Effect<Array<typeof Requirements.Type>, InvalidAmountError>

export const asset = Effect.fnUntraced(function* <A extends Namespaces>(
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
  const maxTimeoutSeconds = ttl ? Math.ceil(Duration.fromInputUnsafe(ttl).pipe(Duration.toSeconds)) : 300
  const nominal = yield* Amount.from(amount)
  return Record.toEntries(recipients).flatMap(([namespace, references]) =>
    references
      ? Record.toEntries(references).reduce(
          (acc, [reference, payTo]) => {
            const deployment = asset[namespace]![reference]!
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
        )
      : [],
  )
})

export const peg = <A extends Peg>(
  peg: A,
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
  Effect.all(Record.toEntries(peg).map(([_k, namespaces]) => asset(namespaces, config as never))).pipe(
    Effect.map(Array.flatten),
  )
