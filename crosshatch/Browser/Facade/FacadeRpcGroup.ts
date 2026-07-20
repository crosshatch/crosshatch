import { Schema as S } from "effect"
import { Rpc, RpcGroup } from "effect/unstable/rpc"

import { Proposal, TraceConfig } from "../../Bridge.ts"
import { Payload } from "../../Payload.ts"
import { BrowserProposeError } from "../BrowserProposeError.ts"
import { FacadeState } from "./FacadeState.ts"

export class FacadeRpcGroup extends RpcGroup.make(
  Rpc.make("StreamState", {
    success: FacadeState,
    stream: true,
  }),
  Rpc.make("Rescind", {}),
  Rpc.make("CreateTrace", {
    payload: TraceConfig,
  }),
  Rpc.make("Propose", {
    payload: Proposal,
    success: S.Struct({
      payload: Payload,
    }),
    error: BrowserProposeError,
  }),
) {}
