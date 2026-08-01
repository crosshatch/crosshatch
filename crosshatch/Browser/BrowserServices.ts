import * as ChxDomain from "@crosshatch/util/ChxDomain"
import * as ChxStage from "@crosshatch/util/ChxStage"
import { Launcher, EmbedLauncher } from "@crosshatch/widget"
import { Stream, Effect, Layer, flow } from "effect"

import { Bridge, Payer } from "../index.ts"
import { CurrentFacadeState } from "./CurrentFacadeState.ts"
import { FacadeClient } from "./FacadeClient.ts"
import { PrerequisitesWidget } from "./Widgets.ts"

const layerBridge = Layer.effect(
  Bridge.Bridge,
  Effect.gen(function* () {
    const facade = yield* FacadeClient
    const { launch } = yield* Launcher.Launcher
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
              PrerequisitesUnmetError: ({ prerequisites }) =>
                launch(PrerequisitesWidget, { prerequisites }).pipe(Stream.runDrain, Effect.andThen(propose)),
            }),
          )
          return { payload }
        },
        Effect.mapError((cause) => new Bridge.ProposeError({ cause })),
      ),
    }
  }),
)

export const layer = Payer.layerFromBridge.pipe(
  Layer.provideMerge([
    layerBridge.pipe(
      Layer.provideMerge([
        EmbedLauncher.layer({ url: "link.crosshatch.dev" }),
        CurrentFacadeState.layer.pipe(
          Layer.provideMerge(
            FacadeClient.layer.pipe(
              Layer.provideMerge(ChxDomain.layer("link.crosshatch.dev").pipe(Layer.provideMerge(ChxStage.layer))),
            ),
          ),
        ),
      ]),
    ),
  ]),
)
