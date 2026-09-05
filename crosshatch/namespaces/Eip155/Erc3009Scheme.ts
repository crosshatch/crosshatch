import { Effect, Schema as S } from "effect"

import { Scheme } from "../../index.ts"
import type * as Eip155 from "./Eip155.ts"
import * as Eip155Signer from "./Eip155Signer.ts"

const Extra = S.Struct({
  assetTransferMethod: S.Literal("eip3009").pipe(S.optional),
  name: S.String,
  version: S.String,
})

export class Erc3009Scheme extends Scheme.Service<Eip155.Eip155, Erc3009Scheme, typeof Extra.Type>()(
  "crosshatch/namespaces/Eip155/Erc3009Scheme",
) {}

export const layer = Erc3009Scheme.layer(
  Extra,
  Effect.fnUntraced(function* () {
    yield* Eip155Signer.Eip155Signer
    return null!
  }),
)
