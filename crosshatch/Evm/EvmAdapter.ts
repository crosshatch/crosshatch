import { Effect, Layer, Schema as S } from "effect"

import * as Adapter from "../Adapter.ts"
import * as Erc3009Payload from "./Erc3009Payload.ts"
import { EvmSigner } from "./EvmSigner.ts"
import * as Permit2Payload from "./Permit2Payload.ts"

export class Eip3009Adapter extends Adapter.Service<Eip3009Adapter>()("crosshatch/Evm/Eip3009Adapter") {}

export const layer = Eip3009Adapter.layer(
  Effect.fnUntraced(function* (requirements) {
    const decoded = yield* S.decodeUnknownEffect(
      S.Struct({
        name: S.String,
        version: S.String,
      }),
    )(requirements.extra).pipe(Effect.option)
    return decoded
  }),
  Effect.fnUntraced(function* ({ name, version }) {
    const signer = yield* EvmSigner
    Erc3009Payload.make(signer, accepted)
  }),
)

export const layerSigner = Layer.succeed(
  Adapter.Adapter,
  Effect.fnUntraced(function* ({ accepted }) {
    const method = accepted.extra?.assetTransferMethod ?? "eip3009"
    return yield* (method === "permit2" ? Permit2Payload : Erc3009Payload).make(signer, accepted)
  }),
)
