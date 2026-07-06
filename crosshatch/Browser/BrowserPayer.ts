import { Effect, Layer, flow } from "effect"
import { Client } from "liminal"

import { Bridge, CreateTraceError, ProposeError } from "../Bridge.ts"
import * as Payer from "../Payer.ts"
import { FacadeClient, reducers, FacadeWorker } from "./Facade/Facade.ts"
import { PrerequisitesWidget } from "./Widgets.ts"

const BridgeLive = Layer.effect(
  Bridge,
  Effect.gen(function* () {
    const client = yield* FacadeClient
    const fn = Client.fn(client)
    return {
      createTrace: flow(
        fn("CreateTrace"),
        Effect.mapError((cause) => new CreateTraceError({ cause })),
      ),
      propose: Effect.fnUntraced(
        function* ({ traceId, required }) {
          const propose = fn("Propose")({ traceId, required })
          const { payload } = yield* propose.pipe(
            Effect.catchTags({
              PrerequisitesUnmetError: flow(PrerequisitesWidget.host, Effect.andThen(propose)),
            }),
          )
          return { payload }
        },
        Effect.mapError((cause) => new ProposeError({ cause })),
      ),
    }
  }),
).pipe(
  Layer.provideMerge(
    Client.layerWorker({
      client: FacadeClient,
      reducers,
    }).pipe(Layer.provide(FacadeWorker.layer)),
  ),
)

export const layer = Payer.layerBridge.pipe(Layer.provideMerge(BridgeLive))
