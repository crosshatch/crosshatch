import { Context, Schema as S, Effect, Cause } from "effect"

import type { FieldsRecord } from "./_type_util.ts"
import type * as ActorClient from "./Client.ts"
import type * as ClientHandle from "./ClientHandle.ts"
import type { MethodDefinition } from "./Method.ts"
import type { Send } from "./Send.ts"

import * as Method from "./Method.ts"

export const TypeId = "~liminal/Actor" as const

export interface Service<
  ActorSelf,
  NameA,
  AttachmentFields extends S.Struct.Fields,
  EventDefinitions extends FieldsRecord,
> {
  readonly name: NameA

  readonly currentClient?: ClientHandle.ClientHandle<ActorSelf, AttachmentFields, EventDefinitions> | undefined

  readonly clients: ReadonlySet<ClientHandle.ClientHandle<ActorSelf, AttachmentFields, EventDefinitions>>
}

export interface ActorDefinition<
  NameA,
  AttachmentFields extends S.Struct.Fields,
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
  AttachmentFields extends S.Struct.Fields,
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

  readonly assertCurrentClient: Effect.Effect<
    ClientHandle.ClientHandle<ActorSelf, AttachmentFields, EventDefinitions>,
    Cause.NoSuchElementException,
    ActorSelf
  >

  readonly sendAll: Send<ActorSelf, EventDefinitions>

  readonly handler: <K extends keyof MethodDefinitions, R>(
    tag: K,
    f: Method.Handler<MethodDefinitions[K], R>,
  ) => Method.Handler<MethodDefinitions[K], R>
}

export const Service =
  <ActorSelf>() =>
  <
    ActorId extends string,
    NameA,
    AttachmentFields extends S.Struct.Fields,
    ClientSelf,
    ClientId extends string,
    MethodDefinitions extends Record<string, MethodDefinition.Any>,
    EventDefinitions extends FieldsRecord,
  >(
    id: ActorId,
    definition: ActorDefinition<NameA, AttachmentFields, ClientSelf, ClientId, MethodDefinitions, EventDefinitions>,
  ): Actor<ActorSelf, ActorId, NameA, AttachmentFields, ClientSelf, ClientId, MethodDefinitions, EventDefinitions> => {
    const tag = Context.Tag(id)<ActorSelf, Service<ActorSelf, NameA, AttachmentFields, EventDefinitions>>()

    const assertCurrentClient = Effect.gen(function* () {
      const { currentClient } = yield* tag
      return yield* Effect.fromNullable(currentClient)
    })

    const sendAll: Send<ActorSelf, EventDefinitions> = Effect.fnUntraced(function* (key, payload) {
      const { clients } = yield* tag
      for (const client of clients) {
        yield* client.send(key, payload)
      }
    })

    const handler = <K extends keyof MethodDefinitions, R>(
      _tag: K,
      f: Method.Handler<MethodDefinitions[K], R>,
    ): Method.Handler<MethodDefinitions[K], R> => f

    return Object.assign(tag, {
      [TypeId]: TypeId,
      definition,
      assertCurrentClient,
      sendAll,
      handler,
    })
  }
