import type { Fields, FieldsRecord, RequestDefinition } from "@crosshatch/util/schema"

import { WorkerRunner } from "@effect/platform"
import { Effect, Scope } from "effect"

import * as Actor from "../Actor.ts"
import * as Handler from "../Handler.ts"

export declare const launch: <
  ActorSelf,
  ActorId extends string,
  NameA,
  AttachmentFields extends Fields,
  ClientSelf,
  ClientId extends string,
  RequestDefinitions extends ReadonlyArray<RequestDefinition>,
  EventDefinitions extends FieldsRecord,
  Handlers extends Handler.Handlers<RequestDefinitions, any>,
>(config: {
  actor: Actor.Actor<
    ActorSelf,
    ActorId,
    NameA,
    AttachmentFields,
    ClientSelf,
    ClientId,
    RequestDefinitions,
    EventDefinitions
  >
  handlers: Handlers
  name: NameA
}) => Effect.Effect<
  void,
  Effect.Effect.Error<ReturnType<Handlers[keyof Handlers]>>,
  | Exclude<Effect.Effect.Context<ReturnType<Handlers[keyof Handlers]>>, ActorSelf>
  | WorkerRunner.PlatformRunner
  | Scope.Scope
>
