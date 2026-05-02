import { customType } from "drizzle-orm/pg-core"
import { Encoding, Schema as S } from "effect"

export const bytea = customType<{
  data: Uint8Array
  driverData: string
}>({
  dataType: () => "bytea",
  fromDriver: (v) => {
    // TODO: why not automatically decoding correctly?
    if (typeof v === "string") {
      return S.decodeSync(S.Uint8ArrayFromHex)((v as string).slice(2))
    }
    return v
  },
  toDriver: (v) => `\\x${Encoding.encodeHex(v)}`,
})
