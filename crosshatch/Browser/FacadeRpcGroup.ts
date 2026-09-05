import { Schema as S } from "effect"
import { Rpc, RpcGroup } from "effect/unstable/rpc"

import { Remote, Payload, Trace } from "../index.ts"
import { BrowserProposeError } from "./BrowserProposeError.ts"
import { FacadeState } from "./FacadeState.ts"

export class FacadeRpcGroup extends RpcGroup.make(
  Rpc.make("StreamState", {
    success: FacadeState,
    stream: true,
  }),
  Rpc.make("Rescind", {}),
  Rpc.make("CreateTrace", {
    payload: Trace.TraceConfig,
  }),
  Rpc.make("Propose", {
    payload: Remote.Proposal,
    success: S.Struct({
      payload: Payload.Payload,
    }),
    error: BrowserProposeError,
  }),
) {}
