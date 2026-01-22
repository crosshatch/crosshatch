import { Prompt } from "@effect/ai"
import { customType } from "drizzle-orm/pg-core"
import { identity, Schema as S } from "effect"

export const message = customType<{
  data: Prompt.Message
  driverData: typeof Prompt.Message["Encoded"]
}>({
  dataType: () => "jsonb",
  toDriver: S.encodeSync(Prompt.Message),
  fromDriver: S.decodeSync(Prompt.Message),
})

export const bytea = customType<{
  data: Uint8Array
  driverData: Uint8Array
}>({
  dataType: () => "bytea",
  toDriver: identity,
  fromDriver: (v) => {
    // TODO: why not automatically decoding correctly?
    if (typeof v === "string") {
      return S.decodeSync(S.Uint8ArrayFromHex)(
        (v as string).slice(2),
      )
    }
    return v
  },
})
