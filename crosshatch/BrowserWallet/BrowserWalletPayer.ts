import { Effect, Layer, flow } from "effect"
import { Client } from "liminal"

import { Payer, CreatePayloadError, CreateTraceError } from "../Payer.ts"
import { FacadeClient } from "./Facade/Facade.ts"

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
)
