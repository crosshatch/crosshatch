import type { RequestDefinition, FieldsRecord, Fields } from "@crosshatch/util/schema"

import { Context, Schema as S, Types, Effect } from "effect"

import type * as ActorClient from "./ActorClient.ts"
import type * as ClientHandle from "./ClientHandle.ts"

import * as Handler from "./Handler.ts"

export const TypeId = "~liminal/Actor" as const

export interface Service<ActorSelf, NameA, AttachmentFields extends Fields, EventDefinitions extends FieldsRecord> {
  readonly name: NameA

  readonly sender?: ClientHandle.ClientHandle<ActorSelf, AttachmentFields, EventDefinitions> | undefined

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

  readonly assertSender: Effect.Effect<
    ClientHandle.ClientHandle<ActorSelf, AttachmentFields, EventDefinitions>,
    never,
    ActorSelf
  >

  readonly sendAll: ClientHandle.Send<ActorSelf, EventDefinitions>

  readonly directory: Effect.Effect<
    ReadonlySet<ClientHandle.ClientHandle<ActorSelf, AttachmentFields, EventDefinitions>>,
    never,
    ActorSelf
  >

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
