import { Schema as S, SchemaGetter, Effect } from "effect"

import * as Namespace from "./Namespace.ts"
import * as Reference from "./Reference.ts"

const TypeId = "~crosshatch/Chain" as const

export type Chain = typeof Chain.Type
export const Chain = S.Struct({
  [TypeId]: S.tag(TypeId),
  namespace: Namespace.Namespace,
  reference: Reference.Reference,
})

export type ChainParts = typeof ChainParts.Type
export const ChainParts = S.TemplateLiteralParser([Namespace.Namespace, ":", Reference.Reference])

export const ChainFromString = ChainParts.pipe(
  S.decodeTo(Chain, {
    decode: SchemaGetter.transformOrFail(([namespace, _1, reference]) => Chain.makeEffect({ namespace, reference })),
    encode: SchemaGetter.transformOrFail(({ namespace, reference }) =>
      Effect.all(
        [
          Namespace.Namespace.makeEffect(namespace),
          Effect.succeed(":" as const),
          Reference.Reference.makeEffect(reference),
        ],
        { concurrency: "unbounded" },
      ).pipe(Effect.flatMap((v) => ChainParts.makeEffect(v))),
    ),
  }),
)
