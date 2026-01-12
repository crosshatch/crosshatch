import { HttpApiSchema } from "@effect/platform"
import { Schema as S } from "effect"

export const param = <
  B extends symbol,
  K extends string = "id",
>(
  branded: S.brand<typeof S.UUID, B>,
  id: K = "id" as never,
) => HttpApiSchema.param(id, branded)
