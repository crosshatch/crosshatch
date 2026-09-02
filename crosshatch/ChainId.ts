import { Schema as S, SchemaGetter, Effect } from "effect"

import { brand } from "./_common.ts"
import * as Namespace from "./Namespace.ts"
import * as Reference from "./Reference.ts"

export type ChainId = typeof ChainId.Type
export const ChainId = S.TemplateLiteralParser([Namespace.Namespace, ":", Reference.Reference]).pipe(
  S.decodeTo(
    S.Struct({
      namespace: Namespace.Namespace,
      reference: Reference.Reference,
    }),
    {
      decode: SchemaGetter.transform(([namespace, _1, reference]) => ({ namespace, reference })),
      encode: SchemaGetter.transformOrFail(({ namespace, reference }) =>
        Effect.all([
          Namespace.decodeEffect(namespace),
          Effect.succeed(":" as const),
          Reference.decodeEffect(reference),
        ]).pipe(Effect.mapError((e) => e.issue)),
      ),
    },
  ),
)
