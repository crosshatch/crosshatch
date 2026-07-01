import { Schema } from "effect"
import { Rpc, RpcGroup } from "effect/unstable/rpc"

export class Api extends RpcGroup.make(
  Rpc.make("buyThing", {
    success: Schema.String,
  }),
) {}
