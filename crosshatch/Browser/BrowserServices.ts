import { Effect, Layer, flow } from "effect"

import { Bridge, Payer } from "../index.ts"
import { FacadeClient, layerFacadeClient } from "./Facade/Facade.ts"
import { PrerequisitesWidget } from "./Widgets.ts"

const layerBridge = Layer.effect(
  Bridge.Bridge,
  Effect.gen(function* () {
    const facade = yield* FacadeClient
    return {
      createTrace: flow(
        facade.CreateTrace,
        Effect.mapError((cause) => new Bridge.CreateTraceError({ cause })),
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
        Effect.mapError((cause) => new Bridge.ProposeError({ cause })),
      ),
    }
  }),
)

export const layer = Payer.layerFromBridge.pipe(Layer.provideMerge(layerBridge), Layer.provideMerge(layerFacadeClient))
