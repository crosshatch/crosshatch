import { flow, Schema as S, Stream, Context, PubSub, Layer, Effect, Deferred } from "effect"
import { Rpc, RpcGroup } from "effect/unstable/rpc"

import { Bridge, Proposal, TraceConfig } from "../Bridge.ts"
import type { PaymentId } from "../Extensions/Extensions.ts"
import { PaymentIdExtension } from "../Extensions/PaymentId.ts"
import { settle } from "../Facilitator/settle.ts"
import { Payload } from "../Payload.ts"

export const ChxRpcEvent = S.TaggedUnion({
  CreateTrace: { config: TraceConfig },
  Propose: { proposal: Proposal },
})

export class ChxRpcGroup extends RpcGroup.make(
  Rpc.make("crosshatch_StreamEvents", {
    success: ChxRpcEvent,
    stream: true,
  }),
  Rpc.make("crosshatch_SendPayment", {
    payload: S.Struct({
      payload: Payload,
    }),
    success: S.Void,
    error: S.Never,
  }),
) {}

export class Events extends Context.Service<Events, PubSub.PubSub<typeof ChxRpcEvent.Type>>()(
  "crosshatch/ChxRpc/Events",
) {}

export class Invoices extends Context.Service<
  Invoices,
  Record<typeof PaymentId.PaymentId.Type, Deferred.Deferred<Payload>>
>()("crosshatch/ChxRpc/Invoices") {}

export const layer = Layer.mergeAll(
  Layer.effect(
    Bridge,
    Effect.gen(function* () {
      const deferreds = yield* Invoices
      const events = yield* Events
      return {
        createTrace: (config) => PubSub.publish(events, { _tag: "CreateTrace", config }),
        propose: Effect.fnUntraced(
          function* (proposal) {
            const { id } = yield* PaymentIdExtension.decodeRequired(proposal.required)
            const deferred = yield* Deferred.make<Payload>()
            deferreds[id!] = deferred
            yield* PubSub.publish(events, { _tag: "Propose", proposal })
            const payload = yield* Deferred.await(deferred)
            return { payload }
          },
          Effect.catchTags({
            SchemaError: Effect.die,
          }),
        ),
      }
    }),
  ),
  ChxRpcGroup.toLayer({
    crosshatch_StreamEvents: () => Events.pipe(Effect.map(Stream.fromPubSub), Stream.unwrap),
    crosshatch_SendPayment: flow(settle, Effect.asVoid, Effect.orDie),
  }),
).pipe(Layer.provideMerge([Layer.effect(Events, PubSub.unbounded()), Layer.succeed(Invoices, {})]))
