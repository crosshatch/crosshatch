import type { FieldsRecord, Fields } from "@crosshatch/util/schema"

import { Context, Schema as S, Effect } from "effect"

import type * as ActorClient from "./Client.ts"
import type * as ClientHandle from "./ClientHandle.ts"
import type { MethodDefinition } from "./Method.ts"

import * as Method from "./Method.ts"

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
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
> {
  readonly name: S.Schema<NameA, string>

  readonly attachments: AttachmentFields

  readonly client: ActorClient.Client<ClientSelf, ClientId, MethodDefinitions, EventDefinitions>
}

export interface Actor<
  ActorSelf,
  ActorId extends string,
  NameA,
  AttachmentFields extends Fields,
  ActorClientSelf,
  ActorClientId extends string,
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
> extends Context.Tag<ActorSelf, Service<ActorSelf, NameA, AttachmentFields, EventDefinitions>> {
  new (_: never): Context.TagClassShape<ActorId, Service<ActorSelf, NameA, AttachmentFields, EventDefinitions>>

  readonly [TypeId]: typeof TypeId

  readonly definition: ActorDefinition<
    NameA,
    AttachmentFields,
    ActorClientSelf,
    ActorClientId,
    MethodDefinitions,
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

  readonly handler: <K extends keyof MethodDefinitions, R>(
    tag: K,
    f: Method.Handler<MethodDefinitions[K], R>,
  ) => Method.Handler<MethodDefinitions[K], R>
}

export declare const Service: <ActorSelf>() => <
  ActorId extends string,
  NameA,
  AttachmentFields extends Fields,
  ClientSelf,
  ClientId extends string,
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
>(
  id: ActorId,
  definition: ActorDefinition<NameA, AttachmentFields, ClientSelf, ClientId, MethodDefinitions, EventDefinitions>,
) => Actor<ActorSelf, ActorId, NameA, AttachmentFields, ClientSelf, ClientId, MethodDefinitions, EventDefinitions>
