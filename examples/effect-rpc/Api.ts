import * as Schema from "effect/Schema"
import * as Rpc from "effect/unstable/rpc/Rpc"
import * as RpcGroup from "effect/unstable/rpc/RpcGroup"

export class Api extends RpcGroup.make(
  Rpc.make("buyThing", {
    success: Schema.String,
  }),
) {}
