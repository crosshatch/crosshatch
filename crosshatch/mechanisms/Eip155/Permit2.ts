import { Schema as S, Effect } from "effect"

import { Mechanism } from "../../index.ts"

const Extra = S.Struct({
  assetTransferMethod: S.Literal("permit2"),
  name: S.String,
  version: S.String,
  supportsEip2612: S.Boolean.pipe(S.optionalKey),
})

export class Permit2 extends Mechanism.Service<
  Permit2,
  typeof Extra.Type,
  {
    readonly signature: string
    readonly permit2Authorization: {
      readonly from: string
      readonly permitted: {
        readonly token: string
        readonly amount: string
      }
      readonly spender: string
      readonly nonce: string
      readonly deadline: string
      readonly witness: {
        readonly to: string
        readonly validAfter: string
      }
    }
  }
>()("crosshatch/networks/Eip155/Permit2") {}

export const layer = Mechanism.layer(
  Permit2,
  Effect.fnUntraced(function* () {
    return null!
  }),
)
