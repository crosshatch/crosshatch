import { Effect, Layer, flow } from "effect"
import { Client } from "liminal"

import { CreateTraceError, CreatePayloadError } from "../errors.ts"
import { Payer } from "../Payer.ts"
import { FacadeClient, reducers, FacadeWorker } from "./Facade/Facade.ts"

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
      createPayload: flow(
        fn("Propose"),
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
