import type { FieldsRecord, RequestDefinition } from "@crosshatch/util/schema"

import { Context, Stream, Effect, Schema as S, Types, PubSub, Data } from "effect"

export const TypeId = "~liminal/ActorClient" as const

export interface ActorClientDefinition<
  RequestDefinitions extends ReadonlyArray<RequestDefinition>,
  EventDefinitions extends FieldsRecord,
> {
  readonly requests: RequestDefinitions

  readonly events: EventDefinitions
}

export interface Service<
  _ActorClientSelf,
  _ActorClientId extends string,
  _RequestDefinitions extends ReadonlyArray<RequestDefinition>,
  EventDefinitions extends FieldsRecord,
> {
  readonly eventsPubsub: PubSub.PubSub<FieldsRecord.TaggedMember<EventDefinitions>>
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

export interface ActorClient<
  ActorClientSelf,
  ActorClientId extends string,
  RequestDefinitions extends ReadonlyArray<RequestDefinition>,
  EventDefinitions extends FieldsRecord,
> extends Context.Tag<ActorClientSelf, Service<ActorClientSelf, ActorClientId, RequestDefinitions, EventDefinitions>> {
  new (
    _: never,
  ): Context.TagClassShape<ActorClientId, Service<ActorClientSelf, ActorClientId, RequestDefinitions, EventDefinitions>>

  readonly "": Spec<RequestDefinitions, EventDefinitions>

  readonly [TypeId]: typeof TypeId

  readonly definition: ActorClientDefinition<RequestDefinitions, EventDefinitions>

  readonly request: <Tag extends Types.Tags<RequestDefinitions[number]>>(
    tag: Tag,
    payload: Omit<S.Struct<Types.ExtractTag<RequestDefinitions[number], Tag>["fields"]>["Type"], "_tag">,
  ) => Effect.Effect<
    this[""]["Responses"][Tag]["Success"],
    ConnectionError | this[""]["Responses"][Tag]["Failure"],
    ActorClientSelf
  >

  readonly events: Stream.Stream<FieldsRecord.TaggedMember<EventDefinitions>, ConnectionError, ActorClientSelf>

  readonly fn: <Tag extends Types.Tags<RequestDefinitions[number]>>(
    tag: Tag,
  ) => (
    payload: Omit<S.Struct<Types.ExtractTag<RequestDefinitions[number], Tag>["fields"]>["Type"], "_tag">,
  ) => Effect.Effect<this[""]["Responses"][Tag]["Success"], this[""]["Responses"][Tag]["Failure"], ActorClientSelf>
}

export const Service =
  <ActorClientSelf>() =>
  <
    ActorClientId extends string,
    RequestDefinitions extends ReadonlyArray<RequestDefinition>,
    EventDefinitions extends FieldsRecord,
  >(
    id: ActorClientId,
    definition: ActorClientDefinition<RequestDefinitions, EventDefinitions>,
  ): ActorClient<ActorClientSelf, ActorClientId, RequestDefinitions, EventDefinitions> => {
    const tag = Context.Tag(id)<
      ActorClientSelf,
      Service<ActorClientSelf, ActorClientId, RequestDefinitions, EventDefinitions>
    >()

    const request = Effect.fn(function* () {
      throw 0
    })

    const events = tag.pipe(
      Effect.map(({ eventsPubsub }) => Stream.fromPubSub(eventsPubsub)),
      Stream.unwrap,
    )

    const fn = () => {
      throw 0
    }

    return Object.assign(tag, {
      "": null!,
      [TypeId]: TypeId,
      definition,
      request,
      events,
      fn,
    })
  }
