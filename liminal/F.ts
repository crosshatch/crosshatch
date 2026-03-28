import { Record, Effect, Schema as S } from "effect"

import type { MethodDefinition } from "./Method.ts"

import { ClosedBeforeResolvedError, AuditionError } from "./errors.ts"

export type F<ClientSelf, MethodDefinitions extends Record<string, MethodDefinition.Any>> = <
  Method extends keyof MethodDefinitions,
>(
  method: Method,
) => (
  payload: S.Struct<MethodDefinitions[Method]["payload"]>["Type"],
) => Effect.Effect<
  MethodDefinitions[Method]["success"]["Type"],
  MethodDefinitions[Method]["failure"]["Type"] | AuditionError | ClosedBeforeResolvedError,
  ClientSelf
>
