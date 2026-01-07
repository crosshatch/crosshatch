import { HttpApiSchema } from "@effect/platform"
import { Schema as S } from "effect"

export const id = <B extends symbol>(brand: B) => S.UUID.pipe(S.brand(brand))

export const param = <
  B extends symbol,
  K extends string = "id",
>(
  branded: S.brand<typeof S.UUID, B>,
  id: K = "id" as never,
) => HttpApiSchema.param(id, branded)
