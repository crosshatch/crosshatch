import type { RequestDefinition, FieldsRecord, Fields } from "@crosshatch/util/schema"

import { WorkerRunner } from "@effect/platform"
import { Layer, Scope, Effect, Schema as S, Context } from "effect"

import type * as Actor from "../Actor.ts"

import * as Handler from "../Handler.ts"

const TypeId = "~liminal/browser/ActorRegistry" as const

export interface ActorRegistryDefinition<
  ActorSelf,
  ActorId extends string,
  NameA,
  AttachmentFields extends Fields,
  ClientSelf,
  ClientId extends string,
  RequestDefinitions extends ReadonlyArray<RequestDefinition>,
  EventDefinitions extends FieldsRecord,
  Handlers extends Handler.Handlers<RequestDefinitions, any>,
> {
  readonly actor: Actor.Actor<
    ActorSelf,
    ActorId,
    NameA,
    AttachmentFields,
    ClientSelf,
    ClientId,
    RequestDefinitions,
    EventDefinitions
  >

  readonly handlers: Handlers
}

export interface Service {}

export interface ActorRegistry<
  RegistrySelf,
  RegistryId extends string,
  ActorSelf,
  ActorId extends string,
  NameA,
  AttachmentFields extends Fields,
  ClientSelf,
  ClientId extends string,
  RequestDefinitions extends ReadonlyArray<RequestDefinition>,
  EventDefinitions extends FieldsRecord,
  Handlers extends Handler.Handlers<RequestDefinitions, any>,
> extends Context.Tag<RegistrySelf, Service> {
  new (): Context.TagClassShape<RegistryId, Service>

  readonly [TypeId]: typeof TypeId

  readonly definition: ActorRegistryDefinition<
    ActorSelf,
    ActorId,
    NameA,
    AttachmentFields,
    ClientSelf,
    ClientId,
    RequestDefinitions,
    EventDefinitions,
    Handlers
  >

  readonly launch: (
    name: NameA,
    attachments: S.Struct<AttachmentFields>["Type"],
  ) => Effect.Effect<
    void,
    Effect.Effect.Error<ReturnType<Handlers[keyof Handlers]>>,
    Exclude<Effect.Effect.Context<ReturnType<Handlers[keyof Handlers]>>, ActorSelf> | RegistrySelf | Scope.Scope
  >

  readonly layer: Layer.Layer<RegistrySelf, never, WorkerRunner.PlatformRunner>
}

export const Service =
  <RegistrySelf>() =>
  <
    RegistryId extends string,
    ActorSelf,
    ActorId extends string,
    NameA,
    AttachmentFields extends Fields,
    ClientSelf,
    ClientId extends string,
    RequestDefinitions extends ReadonlyArray<RequestDefinition>,
    EventDefinitions extends FieldsRecord,
    Handlers extends Handler.Handlers<RequestDefinitions, any>,
  >(
    id: RegistryId,
    definition: ActorRegistryDefinition<
      ActorSelf,
      ActorId,
      NameA,
      AttachmentFields,
      ClientSelf,
      ClientId,
      RequestDefinitions,
      EventDefinitions,
      Handlers
    >,
  ): ActorRegistry<
    RegistrySelf,
    RegistryId,
    ActorSelf,
    ActorId,
    NameA,
    AttachmentFields,
    ClientSelf,
    ClientId,
    RequestDefinitions,
    EventDefinitions,
    Handlers
  > => {
    const tag = Context.Tag(id)<RegistrySelf, Service>()
    return Object.assign(tag, { [TypeId]: TypeId, definition }) as never
  }
