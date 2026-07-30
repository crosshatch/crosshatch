import { Schema as S } from "effect"
import { Rpc, RpcGroup } from "effect/unstable/rpc"

import { Bridge, Payload } from "../index.ts"
import { BrowserProposeError } from "./BrowserProposeError.ts"
import { FacadeState } from "./FacadeState.ts"

export class FacadeRpcGroup extends RpcGroup.make(
  Rpc.make("StreamState", {
    success: FacadeState,
    stream: true,
  }),
  Rpc.make("Rescind", {}),
  Rpc.make("CreateTrace", {
    payload: Bridge.TraceConfig,
  }),
  Rpc.make("Propose", {
    payload: Bridge.Proposal,
    success: S.Struct({
      payload: Payload.Payload,
    }),
    error: BrowserProposeError,
  }),
) {}
