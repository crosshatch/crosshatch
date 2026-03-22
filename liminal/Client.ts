import type { FieldsRecord, RequestDefinition } from "@crosshatch/util/schema"

import { Context, Stream, Effect, Schema as S, Types, PubSub, Data } from "effect"

import { DisconnectMessage } from "./Protocol.ts"

export const TypeId = "~liminal/Client" as const

export interface ClientDefinition<
  RequestDefinitions extends ReadonlyArray<RequestDefinition>,
  EventDefinitions extends FieldsRecord,
> {
  readonly requests: RequestDefinitions

  readonly events: EventDefinitions
}

export interface Service<
  ClientSelf,
  RequestDefinitions extends ReadonlyArray<RequestDefinition>,
  EventDefinitions extends FieldsRecord,
> {
  readonly eventsPubsub: PubSub.PubSub<FieldsRecord.TaggedMember<EventDefinitions>>
  readonly f: F<ClientSelf, RequestDefinitions>
}

export interface Spec<
  RequestDefinitions extends ReadonlyArray<RequestDefinition>,
  EventDefinitions extends FieldsRecord,
> {
  readonly Request: RequestDefinitions[number]["Type"]

  readonly Responses: {
    [Tag in Types.Tags<RequestDefinitions[number]>]: {
      Success: Types.ExtractTag<RequestDefinitions[number], Tag>["success"]["Type"]
      Failure: Types.ExtractTag<RequestDefinitions[number], Tag>["failure"]["Type"]
    }
  }

  readonly EventDefinitions: {
    [Tag in keyof EventDefinitions]: S.Struct<EventDefinitions[Tag]>["Type"]
  }
}

export class ConnectionError extends Data.TaggedError("ConnectionError")<{}> {}

export type RequestMessage<RequestDefinitions extends ReadonlyArray<RequestDefinition>> = {
  readonly _tag: "Request"
  readonly id: number
  readonly payload: RequestDefinitions[number]["Type"]
}
export type SuccessMessage<RequestDefinitions extends ReadonlyArray<RequestDefinition>> = {
  readonly _tag: "Success"
  readonly id: number
  readonly value: RequestDefinitions[number]["success"]["Type"]
}
export type FailureMessage<RequestDefinitions extends ReadonlyArray<RequestDefinition>> = {
  readonly _tag: "Failure"
  readonly id: number
  readonly cause: RequestDefinitions[number]["success"]["Type"]
}
export type EventMessage<EventDefinitions extends FieldsRecord> = {
  readonly _tag: "Event"
  readonly event: FieldsRecord.TaggedMember<EventDefinitions>
}

export type F<ClientSelf, RequestDefinitions extends ReadonlyArray<RequestDefinition>> = <
  Method extends Types.Tags<RequestDefinitions[number]>,
>(
  method: Method,
) => (
  payload: Omit<S.Struct<Types.ExtractTag<RequestDefinitions[number], Method>["fields"]>["Type"], "_tag">,
) => Effect.Effect<
  Types.ExtractTag<RequestDefinitions[number], Method>["success"]["Type"],
  Types.ExtractTag<RequestDefinitions[number], Method>["failure"]["Type"],
  ClientSelf
>

export interface Client<
  ClientSelf,
  ClientId extends string,
  RequestDefinitions extends ReadonlyArray<RequestDefinition>,
  EventDefinitions extends FieldsRecord,
> extends Context.Tag<ClientSelf, Service<ClientSelf, RequestDefinitions, EventDefinitions>> {
  new (_: never): Context.TagClassShape<ClientId, Service<ClientSelf, RequestDefinitions, EventDefinitions>>

  readonly "": Spec<RequestDefinitions, EventDefinitions>

  readonly [TypeId]: typeof TypeId

  readonly definition: ClientDefinition<RequestDefinitions, EventDefinitions>

  readonly requestSchema: S.Schema<RequestMessage<RequestDefinitions>, string>
  readonly successSchema: S.Schema<SuccessMessage<RequestDefinitions>, string>
  readonly failureSchema: S.Schema<FailureMessage<RequestDefinitions>, string>
  readonly eventSchema: S.Schema<EventMessage<EventDefinitions>, string>
  readonly actorMessageSchema: S.Schema<
    | SuccessMessage<RequestDefinitions>
    | FailureMessage<RequestDefinitions>
    | EventMessage<EventDefinitions>
    | typeof DisconnectMessage.Type,
    string
  >

  readonly events: Stream.Stream<FieldsRecord.TaggedMember<EventDefinitions>, ConnectionError, ClientSelf>

  readonly f: F<ClientSelf, RequestDefinitions>
}

export const Service =
  <ClientSelf>() =>
  <
    ClientId extends string,
    RequestDefinitions extends ReadonlyArray<RequestDefinition>,
    EventDefinitions extends FieldsRecord,
  >(
    id: ClientId,
    definition: ClientDefinition<RequestDefinitions, EventDefinitions>,
  ): Client<ClientSelf, ClientId, RequestDefinitions, EventDefinitions> => {
    const tag = Context.Tag(id)<ClientSelf, Service<ClientSelf, RequestDefinitions, EventDefinitions>>()

    const requestSchema = S.parseJson(
      S.TaggedStruct("Request", {
        id: S.Int,
        payload: S.Union(...definition.requests),
      }),
    )
    const successSchema = S.parseJson(
      S.TaggedStruct("Success", {
        id: S.Int,
        value: S.Union(...definition.requests.map(({ success }) => success)),
      }),
    )
    const failureSchema = S.parseJson(
      S.TaggedStruct("Failure", {
        id: S.Int,
        value: S.Union(...definition.requests.map(({ failure }) => failure)),
      }),
    )
    const eventSchema = S.parseJson(
      S.TaggedStruct("Event", {
        event: S.Union(...Object.entries(definition.events).map(([_tag, fields]) => S.TaggedStruct(_tag, fields))),
      }),
    )
    const actorMessageSchema = S.Union(successSchema, failureSchema, eventSchema, DisconnectMessage)

    const f: F<ClientSelf, RequestDefinitions> = (method) =>
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
      requestSchema,
      successSchema,
      failureSchema,
      eventSchema,
      actorMessageSchema,
      events,
      f,
    })
  }
