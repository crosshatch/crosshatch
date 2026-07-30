import { Effect, Layer, flow } from "effect"

import { Bridge, CreateTraceError, ProposeError } from "../Bridge.ts"
import * as Payer from "../Payer.ts"
import { FacadeClient } from "./Facade/FacadeClient.ts"
import * as FacadePrelude from "./Facade/FacadePrelude.ts"
import { PrerequisitesWidget } from "./Widgets.ts"

const layerBridge = Layer.effect(
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
)

export const layer = Payer.layerFromBridge.pipe(
  Layer.provideMerge(layerBridge),
  Layer.provideMerge(FacadePrelude.layer),
)
