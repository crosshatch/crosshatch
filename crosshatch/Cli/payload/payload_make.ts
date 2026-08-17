import { Config, Console, Effect, Layer, Schema as S } from "effect"
import { Argument, Command, Flag } from "effect/unstable/cli"

import * as Accept from "../../Accept.ts"
import { MnemonicStore } from "../../index.ts"
import * as Known from "../../Known/index.ts"
import * as Payer from "../../Payer.ts"
import * as Payload from "../../Payload.ts"
import * as Required from "../../Required.ts"
import { UnifiedSchemes } from "../../Unified/index.ts"
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
        const payer = yield* Payer.Payer
        yield* Input.read(required, stdin, "required").pipe(
          Effect.flatMap(S.decodeEffect(Required.RequiredFromJsonString)),
          Effect.flatMap((required) => payer.createPayload({ required })),
          Effect.flatMap(({ payload }) => S.encodeEffect(Payload.PayloadJson)(payload)),
          Effect.map((v) => JSON.stringify(v, null, 2)),
          Effect.andThen(Console.log),
        )
      },
      (effect, { mnemonic }) =>
        Effect.provide(
          effect,
          Payer.layerLocal(Accept.first(Known)).pipe(
            Layer.provide(
              UnifiedSchemes.layer({
                solana: { rpc: Config.string("SOLANA_RPC_URL").pipe(Config.withDefault(undefined)) },
              }).pipe(Layer.provide(MnemonicStore.layerMnemonicFromName(mnemonic))),
            ),
          ),
        ),
    ),
  ),
)
