import type { FieldsRecord } from "@crosshatch/util/schema"

import { Record, Context, Stream, Effect, Schema as S, PubSub, Data } from "effect"

import type { MethodDefinition } from "./Method.ts"

import * as Protocol from "./Protocol.ts"

export const TypeId = "~liminal/Client" as const

export interface ClientDefinition<
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
> {
  readonly methods: MethodDefinitions

  readonly events: EventDefinitions
}

export interface Service<
  ClientSelf,
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
> {
  readonly eventsPubsub: PubSub.PubSub<FieldsRecord.TaggedMember<EventDefinitions>>
  readonly f: F<ClientSelf, MethodDefinitions>
}

export class ConnectionError extends Data.TaggedError("ConnectionError")<{}> {}

export type F<ClientSelf, MethodDefinitions extends Record<string, MethodDefinition.Any>> = <
  Method extends keyof MethodDefinitions,
>(
  method: Method,
) => (
  payload: S.Struct<MethodDefinitions[Method]["payload"]>["Type"],
) => Effect.Effect<
  MethodDefinitions[Method]["success"]["Type"],
  MethodDefinitions[Method]["failure"]["Type"] | ConnectionError,
  ClientSelf
>

export interface Client<
  ClientSelf,
  ClientId extends string,
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
> extends Context.Tag<ClientSelf, Service<ClientSelf, MethodDefinitions, EventDefinitions>> {
  new (_: never): Context.TagClassShape<ClientId, Service<ClientSelf, MethodDefinitions, EventDefinitions>>

  readonly [TypeId]: typeof TypeId

  readonly definition: ClientDefinition<MethodDefinitions, EventDefinitions>

  readonly callSchema: S.Schema<Protocol.CallMessage<MethodDefinitions>, string>
  readonly successSchema: S.Schema<Protocol.SuccessMessage<MethodDefinitions>, string>
  readonly failureSchema: S.Schema<Protocol.FailureMessage<MethodDefinitions>, string>
  readonly eventSchema: S.Schema<Protocol.EventMessage<EventDefinitions>, string>
  readonly actorMessageSchema: S.Schema<
    | Protocol.SuccessMessage<MethodDefinitions>
    | Protocol.FailureMessage<MethodDefinitions>
    | Protocol.EventMessage<EventDefinitions>
    | typeof Protocol.DisconnectMessage.Type,
    string
  >

  readonly events: Stream.Stream<FieldsRecord.TaggedMember<EventDefinitions>, ConnectionError, ClientSelf>

  readonly f: F<ClientSelf, MethodDefinitions>
}

export const Service =
  <ClientSelf>() =>
  <
    ClientId extends string,
    MethodDefinitions extends Record<string, MethodDefinition.Any>,
    EventDefinitions extends FieldsRecord,
  >(
    id: ClientId,
    definition: ClientDefinition<MethodDefinitions, EventDefinitions>,
  ): Client<ClientSelf, ClientId, MethodDefinitions, EventDefinitions> => {
    const tag = Context.Tag(id)<ClientSelf, Service<ClientSelf, MethodDefinitions, EventDefinitions>>()

    const callSchema: S.Schema<Protocol.CallMessage<MethodDefinitions>, string> = S.parseJson(
      S.TaggedStruct("Call", {
        id: S.Int,
        payload: S.Union(
          ...Object.entries(definition.methods).map(([_tag, { payload }]) => S.TaggedStruct(_tag, payload)),
        ),
      }),
    ) as never

    const successSchema: S.Schema<Protocol.SuccessMessage<MethodDefinitions>, string> = S.parseJson(
      S.TaggedStruct("Success", {
        id: S.Int,
        value: S.Union(...Object.values(definition.methods).map(({ success }) => success)),
      }),
    )

    const failureSchema: S.Schema<Protocol.FailureMessage<MethodDefinitions>, string> = S.parseJson(
      S.TaggedStruct("Failure", {
        id: S.Int,
        cause: S.Union(...Object.values(definition.methods).map(({ failure }) => failure)),
      }),
    )

    const eventSchema: S.Schema<Protocol.EventMessage<EventDefinitions>, string> = S.parseJson(
      S.TaggedStruct("Event", {
        event: S.Union(...Object.entries(definition.events).map(([_tag, fields]) => S.TaggedStruct(_tag, fields))),
      }),
    ) as never

    const actorMessageSchema = S.Union(successSchema, failureSchema, eventSchema, Protocol.DisconnectMessage)

    const f: F<ClientSelf, MethodDefinitions> = (method) =>
      Effect.fnUntraced(function* (payload) {
        const { f } = yield* tag
        return yield* f(method)(payload)
      })

    const events = tag.pipe(
      Effect.map(({ eventsPubsub }) => Stream.fromPubSub(eventsPubsub)),
      Stream.unwrap,
    )

    return Object.assign(tag, {
      "": null!,
      [TypeId]: TypeId,
      definition,
      callSchema,
      successSchema,
      failureSchema,
      eventSchema,
      actorMessageSchema,
      events,
      f,
    })
  }
