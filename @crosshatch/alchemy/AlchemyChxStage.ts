import { ChxStage } from "@crosshatch/util"
import * as Alchemy from "alchemy"
import { Layer, Effect, Schema as S } from "effect"

export const layer = Layer.effect(
  ChxStage.ChxStage,
  Alchemy.Stage.pipe(Effect.flatMap(S.decodeUnknownEffect(ChxStage.Stage)), Effect.orDie),
)
