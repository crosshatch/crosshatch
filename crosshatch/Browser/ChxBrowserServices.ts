import { ChxStage, ChxDomain } from "@crosshatch/util"
import { Launcher, EmbedLauncher } from "@crosshatch/widget"
import { Stream, Effect, Layer, flow } from "effect"

import { Bridge, Payer } from "../index.ts"
import { FacadeClient } from "./FacadeClient.ts"
import { FacadeStateRef } from "./FacadeStateRef.ts"
import { PrerequisitesWidget } from "./Widgets.ts"

const layerBridge = Layer.effect(
  Bridge.Bridge,
  Effect.gen(function* () {
    const facade = yield* FacadeClient
    const { launch } = yield* Launcher.Launcher
    return {
      createTrace: flow(
        facade.CreateTrace,
        Effect.mapError((cause) => Bridge.CreateTraceError.make({ cause })),
      ),
      propose: Effect.fnUntraced(
        function* ({ required, trace }) {
          const propose = facade.Propose({ required, trace })
          const { payload } = yield* propose.pipe(
            Effect.catchTags({
              PrerequisitesUnmetError: ({ prerequisites }) =>
                launch(PrerequisitesWidget, { prerequisites }).pipe(Stream.runDrain, Effect.andThen(propose)),
            }),
          )
          return { payload }
        },
        Effect.mapError((cause) => Bridge.ProposeError.make({ cause })),
      ),
    }
  }),
)

export const layer = Payer.layerFromBridge.pipe(
  Layer.provideMerge(
    layerBridge.pipe(
      Layer.provideMerge(
        Layer.mergeAll(
          ChxDomain.ChxDomain.pipe(Effect.map(EmbedLauncher.layer), Layer.unwrap),
          FacadeStateRef.layer.pipe(Layer.provideMerge(FacadeClient.layer)),
        ).pipe(Layer.provideMerge(ChxDomain.layer("link.crosshatch.dev").pipe(Layer.provideMerge(ChxStage.layer)))),
      ),
    ),
  ),
)
