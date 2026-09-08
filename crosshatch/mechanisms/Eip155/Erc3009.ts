import type { HexString } from "@crosshatch/util"
import { Effect, Schema as S } from "effect"

import { Mechanism } from "../../index.ts"

const Extra = S.Struct({
  assetTransferMethod: S.Literal("eip3009").pipe(S.optionalKey),
  name: S.String,
  version: S.String,
})

export class Erc3009 extends Mechanism.Service<
  Erc3009,
  typeof Extra.Type,
  {
    readonly signature: string
    readonly authorization: {
      readonly from: HexString
      readonly to: HexString
      readonly value: string
      readonly validAfter: string
      readonly validBefore: string
      readonly nonce: HexString
    }
  }
>()("crosshatch/namespaces/Eip155/Erc3009") {}

export const layer = Mechanism.layer(
  Erc3009,
  Effect.fnUntraced(function* () {
    return null!
  }),
)
