import { Context, Config, Effect, Schema as S, Layer } from "effect"

export type Stage = `dev_${string}` | `staging-${number}` | "prod"
export const Stage = S.Union([
  S.TemplateLiteral(["dev_", S.String]),
  S.TemplateLiteral(["staging-", S.Finite]),
  S.Literal("prod"),
])

export class ChxStage extends Context.Service<ChxStage, Stage>()("crosshatch/CurrentStage") {}

export const layer = Layer.effect(
  ChxStage,
  Effect.gen(function* () {
    let stage = (
      import.meta as {
        readonly env?: undefined | { readonly VITE_PUBLIC_CHX_INTERNAL_STAGE?: string | undefined }
      }
    ).env?.VITE_PUBLIC_CHX_INTERNAL_STAGE
    stage ??= yield* Config.string("CHX_INTERNAL_STAGE")
    return yield* S.decodeUnknownEffect(Stage)(stage)
  }).pipe(Effect.orElseSucceed(() => "prod" as const)),
)
