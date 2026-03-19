import type { RequestDefinition, FieldsRecord, Fields } from "@crosshatch/util/schema"
import type { WorkerRunner } from "@effect/platform"

import { Context, Schema as S, Types, Effect, Scope } from "effect"

import type * as ActorClient from "./ActorClient.ts"
import type * as ClientHandle from "./ClientHandle.ts"

import * as Handler from "./Handler.ts"

export const TypeId = "~liminal/Actor" as const

export interface Service<ActorSelf, NameA, AttachmentFields extends Fields, EventDefinitions extends FieldsRecord> {
  readonly name: NameA

  readonly caller: ClientHandle.ClientHandle<ActorSelf, AttachmentFields, EventDefinitions>

  readonly handles: ReadonlySet<ClientHandle.ClientHandle<ActorSelf, AttachmentFields, EventDefinitions>>
}

export interface ActorDefinition<
  NameA,
  AttachmentFields extends Fields,
  ClientSelf,
  ClientId extends string,
  RequestDefinitions extends ReadonlyArray<RequestDefinition>,
  EventDefinitions extends FieldsRecord,
> {
  readonly name: S.Schema<NameA, string>

  readonly attachments: AttachmentFields

  readonly client: ActorClient.ActorClient<ClientSelf, ClientId, RequestDefinitions, EventDefinitions>
}

export interface Actor<
  ActorSelf,
  ActorId extends string,
  NameA,
  AttachmentFields extends Fields,
  ActorClientSelf,
  ActorClientId extends string,
  RequestDefinitions extends ReadonlyArray<RequestDefinition>,
  EventDefinitions extends FieldsRecord,
> extends Context.Tag<ActorSelf, Service<ActorSelf, NameA, AttachmentFields, EventDefinitions>> {
  new (_: never): Context.TagClassShape<ActorId, Service<ActorSelf, NameA, AttachmentFields, EventDefinitions>>

  readonly "": ActorClient.Spec<RequestDefinitions, EventDefinitions> & {
    readonly Name: NameA

    readonly Attachments: S.Struct<AttachmentFields>["Type"]
  }

  readonly [TypeId]: typeof TypeId

  readonly definition: ActorDefinition<
    NameA,
    AttachmentFields,
    ActorClientSelf,
    ActorClientId,
    RequestDefinitions,
    EventDefinitions
  >

  readonly announce: ClientHandle.Send<EventDefinitions, ActorSelf>

  readonly handler: <K extends Types.Tags<RequestDefinitions[number]>, R>(
    tag: K,
    f: Handler.Handler<Types.ExtractTag<RequestDefinitions[number], K>, R>,
  ) => Handler.Handler<Types.ExtractTag<RequestDefinitions[number], K>, R>
}

export declare const Service: <ActorSelf>() => <
  ActorId extends string,
  NameA,
  AttachmentFields extends Fields,
  ClientSelf,
  ClientId extends string,
  RequestDefinitions extends ReadonlyArray<RequestDefinition>,
  EventDefinitions extends FieldsRecord,
>(
  id: ActorId,
  definition: ActorDefinition<NameA, AttachmentFields, ClientSelf, ClientId, RequestDefinitions, EventDefinitions>,
) => Actor<ActorSelf, ActorId, NameA, AttachmentFields, ClientSelf, ClientId, RequestDefinitions, EventDefinitions>

export declare const listen: <
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
  actor: Actor<ActorSelf, ActorId, NameA, AttachmentFields, ClientSelf, ClientId, RequestDefinitions, EventDefinitions>,
  handlers: Handlers,
) => Effect.Effect<
  void,
  Effect.Effect.Error<ReturnType<Handlers[keyof Handlers]>>,
  | Exclude<Effect.Effect.Context<ReturnType<Handlers[keyof Handlers]>>, ActorSelf>
  | Scope.Scope
  | WorkerRunner.PlatformRunner
>
