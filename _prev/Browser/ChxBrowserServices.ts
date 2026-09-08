import { ChxStage, ChxDomain } from "@crosshatch/util"
import { Launcher, EmbedLauncher } from "@crosshatch/widget"
import { Stream, Effect, Layer, flow } from "effect"

import { Remote, Payer } from "../index.ts"
import { FacadeClient } from "./FacadeClient.ts"
import { FacadeStateRef } from "./FacadeStateRef.ts"
import { PrerequisitesWidget } from "./Widgets.ts"

const layerRemote = Layer.effect(
  Remote.Remote,
  Effect.gen(function* () {
    const facade = yield* FacadeClient
    const { launch } = yield* Launcher.Launcher
    return {
      createTrace: flow(
        facade.CreateTrace,
        Effect.mapError((cause) => Remote.CreateTraceError.make({ cause })),
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
        Effect.mapError((cause) => Remote.ProposeError.make({ cause })),
      ),
    }
  }),
)

export const layer = Payer.layerRemote.pipe(
  Layer.provideMerge(
    layerRemote.pipe(
      Layer.provideMerge(
        Layer.mergeAll(
          ChxDomain.ChxDomain.pipe(Effect.map(EmbedLauncher.layer), Layer.unwrap),
          FacadeStateRef.layer.pipe(Layer.provideMerge(FacadeClient.layer)),
        ).pipe(Layer.provideMerge(ChxDomain.layer("link.crosshatch.dev").pipe(Layer.provideMerge(ChxStage.layer)))),
      ),
    ),
  ),
)
