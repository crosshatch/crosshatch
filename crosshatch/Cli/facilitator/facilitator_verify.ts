import { Console, Effect, Option, Schema as S } from "effect"
import { Argument, Command, Flag } from "effect/unstable/cli"

import * as FacilitatorService from "../../Facilitator.ts"
import { VerifyResponse } from "../../FacilitatorApi/VerifyEndpoint.ts"
import * as Payload from "../../Payload.ts"
import * as Input from "../Input.ts"

export const verify = Command.make("verify", {
  payload: Argument.string("payload").pipe(Argument.withDescription("Payment Payload JSON"), Argument.optional),
  stdin: Flag.boolean("stdin").pipe(Flag.withDescription("Read Payment Payload JSON from standard input")),
  baseUrl: Flag.string("url").pipe(
    Flag.withDescription("Facilitator base URL"),
    Flag.optional,
    Flag.map(Option.getOrUndefined),
  ),
}).pipe(
  Command.withDescription("Verify a payment payload without settling it"),
  Command.withHandler(
    Effect.fn(({ baseUrl, payload, stdin }) =>
      Effect.gen(function* () {
        const input = yield* Input.read(payload, stdin, "payload")
        const decoded = yield* S.decodeEffect(S.fromJsonString(S.toCodecJson(Payload.Payload)))(input).pipe(
          Effect.mapError((cause) => new Input.InvalidError({ name: "payload", cause })),
        )
        const response = yield* FacilitatorService.verify({ payload: decoded })
        const json = yield* S.encodeEffect(S.fromJsonString(S.toCodecJson(VerifyResponse)))(response)
        yield* Console.log(json)
      }).pipe(Effect.provide(FacilitatorService.layer({ baseUrl }))),
    ),
  ),
)
