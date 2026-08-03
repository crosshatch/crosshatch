import { Schema as S, Stream, Context, PubSub, Layer, Effect } from "effect"
import { Rpc, RpcGroup } from "effect/unstable/rpc"

import * as Bridge from "./Bridge.ts"
import { Invoices, PaymentId } from "./Extensions/index.ts"
import { Payload } from "./Payload.ts"

export const ChxEvent = S.TaggedUnion({
  CreateTrace: { config: Bridge.TraceConfig },
  Propose: { proposal: Bridge.Proposal },
})

export class ChxEvents extends Context.Service<ChxEvents, PubSub.PubSub<typeof ChxEvent.Type>>()(
  "crosshatch/ChxRpc/ChxEvents",
) {}

export class ChxRpcGroup extends RpcGroup.make(
  Rpc.make("crosshatch_StreamEvents", {
    success: ChxEvent,
    stream: true,
  }),
  Rpc.make("crosshatch_SendPayment", {
    payload: S.Struct({
      traceId: S.String.pipe(S.optional),
      payload: Payload,
    }),
    success: S.Void,
    error: S.Never,
  }),
) {}

export const layer = Layer.mergeAll(
  Layer.effect(
    Bridge.Bridge,
    Effect.gen(function* () {
      const invoices = yield* Invoices.Invoices
      const events = yield* ChxEvents
      return {
        createTrace: (config) => PubSub.publish(events, { _tag: "CreateTrace", config }),
        propose: Effect.fnUntraced(function* (proposal) {
          const { id } = yield* PaymentId.FromMerchant.decodeRequired(proposal.required)
          yield* invoices.add(proposal.required.accepts, id)
          yield* PubSub.publish(events, { _tag: "Propose", proposal })
          const payload = yield* invoices.await(id)
          return { payload }
        }, Effect.orDie),
      }
    }),
  ),
  ChxRpcGroup.toLayer({
    crosshatch_StreamEvents: () => ChxEvents.pipe(Effect.map(Stream.fromPubSub), Stream.unwrap),
    crosshatch_SendPayment: Effect.fnUntraced(function* ({ payload }) {
      const invoices = yield* Invoices.Invoices
      const id = yield* PaymentId.FromMerchant.decodePayload(payload).pipe(
        Effect.flatMap(({ id }) => Effect.fromNullishOr(id)),
      )
      yield* invoices.resolve(id, payload)
    }, Effect.orDie),
  }),
).pipe(Layer.provideMerge([Layer.effect(ChxEvents, PubSub.unbounded())]))
