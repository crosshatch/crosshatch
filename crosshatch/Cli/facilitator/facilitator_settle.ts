import { Console, Data, Effect, Schema as S } from "effect"
import { Argument, Command, Flag, Prompt } from "effect/unstable/cli"

import * as FacilitatorService from "../../Facilitator.ts"
import { SettleResponseJsonString } from "../../FacilitatorApi/index.ts"
import * as Payload from "../../Payload.ts"
import * as Input from "../Input.ts"

export class StdinConfirmationRequiredError extends Data.TaggedError("StdinConfirmationRequiredError") {
  override get message() {
    return "The --stdin flag must be combined with --yes when settling a payment."
  }
}

export const settle = Command.make("settle", {
  payload: Argument.string("payload").pipe(Argument.withDescription("Payment Payload JSON"), Argument.optional),
  stdin: Flag.boolean("stdin").pipe(Flag.withDescription("Read Payment Payload JSON from standard input")),
  baseUrl: Flag.string("url").pipe(Flag.withDefault(undefined), Flag.withDescription("Facilitator base URL")),
  yes: Flag.boolean("yes").pipe(Flag.withAlias("y")),
}).pipe(
  Command.withDescription("Settle a payment payload"),
  Command.withHandler(
    Effect.fn(
      function* ({ payload, stdin, yes }) {
        if (stdin && !yes) return yield* new StdinConfirmationRequiredError()
        if (!yes && !(yield* Prompt.confirm({ message: "Settle this payment?" }))) {
          yield* Console.error("Operation cancelled.")
          return
        }
        yield* Input.read(payload, stdin, "payload").pipe(
          Effect.flatMap(S.decodeEffect(S.fromJsonString(S.toCodecJson(Payload.Payload)))),
          Effect.flatMap((payload) => FacilitatorService.settle({ payload })),
          Effect.flatMap(S.encodeEffect(SettleResponseJsonString)),
          Effect.andThen(Console.log),
        )
      },
      (effect, { baseUrl }) => Effect.provide(effect, FacilitatorService.layer({ baseUrl })),
    ),
  ),
)
