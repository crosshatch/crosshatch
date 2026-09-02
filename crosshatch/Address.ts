import { Schema as S, Config, flow, Effect } from "effect"

import { brand } from "./_common.ts"

export type Address = typeof Address.Type
export const Address = S.String.check(S.isPattern(/^[-.%a-zA-Z0-9]{1,128}$/u)).pipe(brand("Address"))

export const decodeEffect = S.decodeEffect(Address)
export const encodeEffect = S.encodeEffect(Address)

export const factory = <
  T extends S.Top & {
    readonly Encoded: string
    readonly DecodingServices: never
  },
>(
  addressSchema: T,
) => {
  const decodeEffect = S.decodeEffect(addressSchema)

  const fromString: (input: string) => Effect.Effect<T["Type"], S.SchemaError> = (input) => decodeEffect(input)

  const config = flow(
    Config.string,
    Config.mapOrFail(
      flow(
        fromString,
        Effect.mapError((cause) => new Config.ConfigError(cause)),
      ),
    ),
  )

  return { fromString, config }
}
