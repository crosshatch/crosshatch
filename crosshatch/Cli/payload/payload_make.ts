import { Console, Effect, Layer, Schema as S } from "effect"
import { Argument, Command, Flag } from "effect/unstable/cli"

import * as Accept from "../../Accept.ts"
import { DefaultScheme } from "../../Defaults/Defaults.ts"
import * as HostMnemonic from "../../Host/HostMnemonic.ts"
import * as Known from "../../Known/Known.ts"
import * as Payer from "../../Payer.ts"
import * as Payload from "../../Payload.ts"
import * as Required from "../../Required.ts"
import * as Input from "../Input.ts"

const required = Argument.string("required").pipe(Argument.withDescription("Payment Required JSON"), Argument.optional)

export const payloadMake = Command.make("make", {
  required,
  stdin: Flag.boolean("stdin").pipe(Flag.withDescription("Read Payment Required JSON from standard input")),
  mnemonic: Flag.string("mnemonic").pipe(Flag.withDescription("Stored mnemonic name"), Flag.withDefault("default")),
}).pipe(
  Command.withDescription("Create a Payment Payload from Payment Required JSON"),
  Command.withHandler(
    Effect.fn(
      function* ({ required, stdin }) {
        const input = yield* Input.read(required, stdin, "required")
        const decoded = yield* S.decodeEffect(S.fromJsonString(S.toCodecJson(Required.Required)))(input).pipe(
          Effect.mapError((cause) => new Input.InvalidError({ name: "required", cause })),
        )
        const payer = yield* Payer.Payer
        const { payload } = yield* payer.createPayload({ required: decoded })
        const json = yield* S.encodeEffect(S.fromJsonString(S.toCodecJson(Payload.Payload)))(payload)
        yield* Console.log(json)
      },
      (effect, { mnemonic }) =>
        Effect.provide(
          effect,
          Payer.layerLocal({
            accept: Accept.first(Known),
            schemes: DefaultScheme.layer,
          }).pipe(Layer.provide(HostMnemonic.layer(mnemonic))),
        ),
    ),
  ),
)
