import { Schema as S, Context, Effect, flow, Option } from "effect"

export type TraceInfo = typeof TraceInfo.Type
export const TraceInfo = S.Struct({
  traceId: S.String,
  spanId: S.String,
})

export type TraceConfig = typeof TraceConfig.Type
export const TraceConfig = S.Struct({
  trace: TraceInfo,
  name: S.String,
  description: S.String,
})

export class Trace extends Context.Service<Trace, TraceConfig>()("crosshatch/Trace") {}

export const TraceId = Effect.serviceOption(Trace).pipe(
  Effect.map(
    flow(
      Option.map((v) => v.trace),
      Option.getOrUndefined,
    ),
  ),
)
