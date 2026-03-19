import type { Fields, FieldsRecord, RequestDefinition } from "@crosshatch/util/schema"

import { Headers } from "@effect/platform"
import { Schema as S } from "effect"

import type * as ActorClient from "./ActorClient.ts"

import * as Actor from "./Actor.ts"

export const attachments = <
  NameA,
  AttachmentFields extends Fields,
  ActorClientSelf,
  ActorClientId extends string,
  RequestDefinitions extends ReadonlyArray<RequestDefinition>,
  EventDefinitions extends FieldsRecord,
>({
  attachments,
  name,
}: Actor.ActorDefinition<
  NameA,
  AttachmentFields,
  ActorClientSelf,
  ActorClientId,
  RequestDefinitions,
  EventDefinitions
>) => {
  const Attachments = S.Struct(attachments) as never as S.Schema<
    S.Struct<AttachmentFields>["Type"],
    S.Struct<AttachmentFields>["Encoded"]
  >

  const Params = S.compose(
    S.StringFromBase64Url,
    S.parseJson(
      S.Struct({
        name,
        attachments: Attachments,
      }),
    ),
  )

  const AttachmentsWrapper = S.Struct({
    headers: Headers.schema,
    attachments: Attachments,
  })

  return { Attachments, Params, AttachmentsWrapper }
}

export const messages = <
  RequestDefinitions extends ReadonlyArray<RequestDefinition>,
  EventDefinitions extends FieldsRecord,
>({
  requests,
  events,
}: ActorClient.ActorClientDefinition<RequestDefinitions, EventDefinitions>) => {
  const RequestRaw = S.Union(...requests) as S.Schema<
    RequestDefinitions[number]["Type"],
    RequestDefinitions[number]["Encoded"]
  >
  const Request = S.TaggedStruct("Request", {
    id: S.Number,
    payload: RequestRaw,
  })
  const RequestJson = S.parseJson(Request)

  const SuccessRaw = S.Union(...requests.map(({ success }) => success)) as S.Schema<
    RequestDefinitions[number]["success"]["Type"],
    RequestDefinitions[number]["success"]["Encoded"]
  >
  const Success = S.TaggedStruct("Success", {
    id: S.Number,
    value: SuccessRaw,
  })
  const SuccessJson = S.parseJson(Success)

  const FailureRaw = S.Union(...requests.map(({ failure }) => failure)) as S.Schema<
    RequestDefinitions[number]["failure"]["Type"],
    RequestDefinitions[number]["failure"]["Encoded"]
  >
  const Failure = S.TaggedStruct("Failure", {
    id: S.Number,
    cause: FailureRaw,
  })
  const FailureJson = S.parseJson(Failure)

  const Disconnect = S.TaggedStruct("Disconnect", {})
  const DisconnectJson = S.parseJson(Disconnect)

  const EventRaw = S.Union(
    ...Object.entries(events).map(([key, fields]) => S.TaggedStruct(key, fields)),
  ) as never as S.Schema<
    FieldsRecord.TaggedMember<EventDefinitions>,
    {
      [K in keyof EventDefinitions]: { readonly _tag: K } & S.Struct<EventDefinitions[K]>["Encoded"]
    }[keyof EventDefinitions]
  >
  const Event = S.TaggedStruct("Event", {
    event: EventRaw,
  })
  const EventJson = S.parseJson(Event)

  const ActorMessage = S.Union(Success, Failure, Event, Disconnect)
  const ActorMessageJson = S.Union(SuccessJson, FailureJson, EventJson, DisconnectJson)

  return {
    Request,
    RequestJson,
    Disconnect,
    DisconnectJson,
    Success,
    SuccessJson,
    Failure,
    FailureJson,
    Event,
    EventJson,
    ActorMessage,
    ActorMessageJson,
  }
}
