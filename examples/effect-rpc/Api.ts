import { Payload } from "crosshatch"
import { Schema as S } from "effect"
import { Rpc, RpcGroup } from "effect/unstable/rpc"

export class Api extends RpcGroup.make(
  Rpc.make("SendPayment", {
    payload: S.Struct({
      payload: Payload.Payload,
    }),
    success: S.Void,
    error: S.Never,
  }),
) {}
