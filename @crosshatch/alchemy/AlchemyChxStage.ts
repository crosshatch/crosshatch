import { ChxStage, Stage } from "@crosshatch/util/ChxStage"
import * as Alchemy from "alchemy"
import { Layer, Effect, Schema as S } from "effect"

export const layer = Layer.effect(
  ChxStage,
  Alchemy.Stage.pipe(Effect.flatMap(S.decodeUnknownEffect(Stage)), Effect.orDie),
)
