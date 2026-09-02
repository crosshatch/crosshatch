import { Schema as S, Effect } from "effect"

import { Scheme } from "../index.ts"
import type { Eip155 } from "./Eip155.ts"
import * as Eip155Signer from "./Eip155Signer.ts"

const Extra = S.Struct({
  assetTransferMethod: S.Literal("permit2"),
  name: S.String,
  version: S.String,
})

export class Permit2Scheme extends Scheme.Adapt<Eip155, Permit2Scheme, typeof Extra.Type>()(
  "crosshatch/Eip155/Permit2Scheme",
) {}

export const layer = Permit2Scheme.layer(
  Extra,
  Effect.fnUntraced(function* () {
    yield* Eip155Signer.Eip155Signer
    return null!
  }),
)
