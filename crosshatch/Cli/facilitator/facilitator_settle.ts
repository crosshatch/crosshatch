import { Console, Data, Effect, Option, Schema as S } from "effect"
import { Argument, CliError, Command, Flag, Prompt } from "effect/unstable/cli"

import * as FacilitatorService from "../../Facilitator.ts"
import { SettleResponse } from "../../FacilitatorApi/SettleEndpoint.ts"
import * as Payload from "../../Payload.ts"
import * as PrintableError from "../../PrintableError.ts"
import * as Input from "../Input.ts"

export class StdinConfirmationRequiredError extends PrintableError.make(
  Data.TaggedError("StdinConfirmationRequiredError")<{}>,
  () => "The --stdin flag must be combined with --yes when settling a payment.",
) {}

export const settle = Command.make("settle", {
  payload: Argument.string("payment-payload-json").pipe(
    Argument.withDescription("Payment Payload JSON"),
    Argument.optional,
  ),
  stdin: Flag.boolean("stdin").pipe(Flag.withDescription("Read Payment Payload JSON from standard input")),
  baseUrl: Flag.string("url").pipe(
    Flag.withDescription("Facilitator base URL"),
    Flag.optional,
    Flag.map(Option.getOrUndefined),
  ),
  yes: Flag.boolean("yes").pipe(Flag.withAlias("y")),
}).pipe(
  Command.withDescription("Settle a payment payload"),
  Command.withHandler(
    Effect.fn(function* ({ baseUrl, payload, stdin, yes }) {
      if (stdin && !yes) return yield* new StdinConfirmationRequiredError()
      const input = yield* Input.read(payload, stdin, "payment-payload-json")
      const decoded = yield* S.decodeEffect(S.fromJsonString(S.toCodecJson(Payload.Payload)))(input).pipe(
        Effect.mapError((cause) => new CliError.UserError({ cause })),
      )
      if (!yes && !(yield* Prompt.confirm({ message: "Settle this payment?" }))) {
        yield* Console.error("Operation cancelled.")
        return
      }
      yield* Effect.gen(function* () {
        const response = yield* FacilitatorService.settle({ payload: decoded })
        const json = yield* S.encodeEffect(S.fromJsonString(S.toCodecJson(SettleResponse)))(response)
        yield* Console.log(json)
      }).pipe(Effect.provide(FacilitatorService.layer({ baseUrl })))
    }),
  ),
)
