import { Effect, Layer, flow } from "effect"
import { Client } from "liminal"

import { CreateTraceError, CreatePayloadError } from "../errors.ts"
import { Payer } from "../Payer.ts"
import { FacadeClient, reducers, FacadeWorker } from "./Facade/Facade.ts"
import { PrerequisitesWidget } from "./Widgets.ts"

export const layer = Layer.effect(
  Payer,
  Effect.gen(function* () {
    const client = yield* FacadeClient
    const fn = Client.fn(client)
    return {
      createTrace: flow(
        fn("CreateTrace"),
        Effect.mapError((cause) => new CreateTraceError({ cause })),
      ),
      createPayload: Effect.fnUntraced(
        function* ({ traceId, required }) {
          const propose = fn("Propose")({ traceId, required })
          const { payload } = yield* propose.pipe(
            Effect.catchTags({
              PrerequisitesUnmetError: flow(PrerequisitesWidget.host, Effect.andThen(propose)),
            }),
          )
          return { payload }
        },
        Effect.mapError((cause) => new CreatePayloadError({ cause })),
      ),
    } satisfies Payer["Service"]
  }),
).pipe(
  Layer.provideMerge(
    Client.layerWorker({
      client: FacadeClient,
      reducers,
    }).pipe(Layer.provide(FacadeWorker.layer)),
  ),
)
