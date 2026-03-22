import { WorkerRunner } from "@effect/platform"
import { Scope, Effect, Schema as S } from "effect"

import type { FieldsRecord } from "./_type_util.ts"

import * as Actor from "./Actor.ts"
import * as Method from "./Method.ts"

export const launch = <
  ActorSelf,
  ActorId extends string,
  NameA,
  AttachmentFields extends S.Struct.Fields,
  ActorClientSelf,
  ActorClientId extends string,
  MethodDefinitions extends Record<string, Method.MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
  Handlers extends Method.Handlers<MethodDefinitions, any>,
>(_config: {
  readonly actor: Actor.Actor<
    ActorSelf,
    ActorId,
    NameA,
    AttachmentFields,
    ActorClientSelf,
    ActorClientId,
    MethodDefinitions,
    EventDefinitions
  >
  readonly name: NameA
  readonly attachments: S.Struct<AttachmentFields>["Type"]
  readonly handlers: Handlers
}): Effect.Effect<
  void,
  Effect.Effect.Error<ReturnType<Handlers[keyof Handlers]>>,
  | Exclude<Effect.Effect.Context<ReturnType<Handlers[keyof Handlers]>>, ActorSelf>
  | Scope.Scope
  | WorkerRunner.PlatformRunner
> => null!
