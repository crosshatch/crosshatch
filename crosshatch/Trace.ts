import { Option, Schema as S, Context, Effect, flow } from "effect"

export const TraceConfig = S.Struct({
  traceId: S.String,
  name: S.String,
  description: S.String,
})

export class Trace extends Context.Service<Trace, typeof TraceConfig.Type>()("crosshatch/Trace") {}

export const TraceId = Effect.serviceOption(Trace).pipe(
  Effect.map(
    flow(
      Option.map(({ traceId }) => traceId),
      Option.getOrUndefined,
    ),
  ),
)
