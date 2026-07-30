import { Console, Effect, Schema as S } from "effect"
import { Argument, Command, Flag } from "effect/unstable/cli"

import * as FacilitatorService from "../../Facilitator.ts"
import { VerifyResponseJsonString } from "../../FacilitatorApi/FacilitatorApi.ts"
import * as Payload from "../../Payload.ts"
import * as Input from "../Input.ts"

export const verify = Command.make("verify", {
  payload: Argument.string("payload").pipe(Argument.withDescription("Payment Payload JSON"), Argument.optional),
  stdin: Flag.boolean("stdin").pipe(Flag.withDescription("Read Payment Payload JSON from standard input")),
  baseUrl: Flag.string("url").pipe(Flag.withDefault(undefined), Flag.withDescription("Facilitator base URL")),
}).pipe(
  Command.withDescription("Verify a payment payload without settling it"),
  Command.withHandler(({ baseUrl, payload, stdin }) =>
    Input.read(payload, stdin, "payload").pipe(
      Effect.flatMap(S.decodeEffect(Payload.PayloadJsonString)),
      Effect.flatMap((payload) => FacilitatorService.verify({ payload })),
      Effect.flatMap(S.encodeEffect(VerifyResponseJsonString)),
      Effect.andThen(Console.log),
      Effect.provide(FacilitatorService.layer({ baseUrl })),
    ),
  ),
)
