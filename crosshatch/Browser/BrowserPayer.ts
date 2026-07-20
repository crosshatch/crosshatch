import { Effect, Layer, flow } from "effect"

import { Bridge, CreateTraceError, ProposeError } from "../Bridge.ts"
import * as Payer from "../Payer.ts"
import { FacadeClient } from "./Facade/Facade.ts"
import { PrerequisitesWidget } from "./Widgets.ts"

const BridgeLive = Layer.effect(
  Bridge,
  Effect.gen(function* () {
    const facade = yield* FacadeClient
    return {
      createTrace: flow(
        facade.CreateTrace,
        Effect.mapError((cause) => new CreateTraceError({ cause })),
      ),
      propose: Effect.fnUntraced(
        function* ({ traceId, required }) {
          const propose = facade.Propose({ traceId, required })
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
).pipe(Layer.provide(FacadeClient.layer))

export const layer = Payer.layerBridge.pipe(Layer.provideMerge(BridgeLive))
