import type { FieldsRecord, Fields } from "@crosshatch/util/schema"

import { WorkerRunner } from "@effect/platform"
import { Layer, Scope, Effect, Schema as S, Context } from "effect"

import type * as Actor from "../Actor.ts"
import type { MethodDefinition } from "../Method.ts"

import * as Method from "../Method.ts"

const TypeId = "~liminal/browser/ActorRegistry" as const

export interface ActorRegistryDefinition<
  ActorSelf,
  ActorId extends string,
  NameA,
  AttachmentFields extends Fields,
  ClientSelf,
  ClientId extends string,
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
  Handlers extends Method.Handlers<MethodDefinitions, any>,
> {
  readonly actor: Actor.Actor<
    ActorSelf,
    ActorId,
    NameA,
    AttachmentFields,
    ClientSelf,
    ClientId,
    MethodDefinitions,
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
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
  Handlers extends Method.Handlers<MethodDefinitions, any>,
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
    MethodDefinitions,
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
    MethodDefinitions extends Record<string, MethodDefinition.Any>,
    EventDefinitions extends FieldsRecord,
    Handlers extends Method.Handlers<MethodDefinitions, any>,
  >(
    id: RegistryId,
    definition: ActorRegistryDefinition<
      ActorSelf,
      ActorId,
      NameA,
      AttachmentFields,
      ClientSelf,
      ClientId,
      MethodDefinitions,
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
    MethodDefinitions,
    EventDefinitions,
    Handlers
  > => {
    const tag = Context.Tag(id)<RegistrySelf, Service>()
    return Object.assign(tag, { [TypeId]: TypeId, definition }) as never
  }
