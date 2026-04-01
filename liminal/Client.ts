import { Socket, Worker } from "@effect/platform"
import {
  Cause,
  Context,
  Encoding,
  Deferred,
  Effect,
  Exit,
  Layer,
  Option,
  ParseResult,
  PubSub,
  RcRef,
  Record,
  Ref,
  Scope,
  Stream,
  Take,
  Schema as S,
  Array,
} from "effect"

import type { FieldsRecord, Value } from "./_types.ts"
import type { F } from "./F.ts"
import type { MethodDefinition } from "./Method.ts"

import {
  type ClientError,
  AuditionError,
  ClosedBeforeResolvedError,
  ConnectionError,
  StartupClosedError,
} from "./errors.ts"
import * as Protocol from "./Protocol.ts"

export const TypeId = "~liminal/Client" as const

export interface ClientDefinition<
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
> {
  readonly methods: MethodDefinitions

  readonly events: EventDefinitions
}

export interface ReplayEventsOptions {
  readonly mode: "startup" | "all-subscribers"
  readonly limit?: number | undefined
}

interface EventEnvelope<Event, Error> {
  readonly seq: number
  readonly take: Take.Take<Event, Error>
}

interface ReplayState<Event, Error> {
  readonly startupOpen: boolean
  readonly buffer: ReadonlyArray<EventEnvelope<Event, Error>>
}

interface ServiceSession<
  ClientSelf,
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
> {
  readonly events: Stream.Stream<FieldsRecord.TaggedMember.Type<EventDefinitions>, ClientError>

  readonly f: F<ClientSelf, MethodDefinitions>
}

export type Service<
  ClientSelf,
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
> = RcRef.RcRef<ServiceSession<ClientSelf, MethodDefinitions, EventDefinitions>, ClientError>

export interface Client<
  ClientSelf,
  ClientId extends string,
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
> extends Context.Tag<ClientSelf, Service<ClientSelf, MethodDefinitions, EventDefinitions>> {
  new (_: never): Context.TagClassShape<ClientId, Service<ClientSelf, MethodDefinitions, EventDefinitions>>

  readonly [TypeId]: typeof TypeId

  readonly definition: ClientDefinition<MethodDefinitions, EventDefinitions>

  readonly schema: {
    readonly call: S.Schema<
      Protocol.CallMessage.Type<MethodDefinitions>,
      Protocol.CallMessage.Encoded<MethodDefinitions>
    >

    readonly success: S.Schema<
      Protocol.SuccessMessage.Type<MethodDefinitions>,
      Protocol.SuccessMessage.Encoded<MethodDefinitions>
    >

    readonly failure: S.Schema<
      Protocol.FailureMessage.Type<MethodDefinitions>,
      Protocol.FailureMessage.Encoded<MethodDefinitions>
    >

    readonly event: S.Schema<
      Protocol.EventMessage.Type<EventDefinitions>,
      Protocol.EventMessage.Encoded<EventDefinitions>
    >

    readonly actor: S.Schema<
      Protocol.ActorMessage.Type<MethodDefinitions, EventDefinitions>,
      Protocol.ActorMessage.Encoded<MethodDefinitions, EventDefinitions>
    >
  }

  readonly events: Stream.Stream<FieldsRecord.TaggedMember.Type<EventDefinitions>, ClientError, ClientSelf>

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
    const clientTag = Context.Tag(id)<ClientSelf, Service<ClientSelf, MethodDefinitions, EventDefinitions>>()

    const call: S.Schema<
      Protocol.CallMessage.Type<MethodDefinitions>,
      Protocol.CallMessage.Encoded<MethodDefinitions>
    > = S.TaggedStruct("Call", {
      id: S.Int,
      payload: S.Union(
        ...Record.toEntries(definition.methods).map(([_tag, { payload }]) =>
          S.TaggedStruct(_tag, { value: S.Struct(payload) }),
        ),
      ),
    }) as never

    const success: S.Schema<
      Protocol.SuccessMessage.Type<MethodDefinitions>,
      Protocol.SuccessMessage.Encoded<MethodDefinitions>
    > = S.TaggedStruct("Success", {
      id: S.Int,
      value: S.Union(
        ...Record.toEntries(definition.methods).map(([_tag, { success: value }]) => S.TaggedStruct(_tag, { value })),
      ),
    }) as never

    const failure: S.Schema<
      Protocol.FailureMessage.Type<MethodDefinitions>,
      Protocol.FailureMessage.Encoded<MethodDefinitions>
    > = S.TaggedStruct("Failure", {
      id: S.Int,
      cause: S.Union(
        ...Record.toEntries(definition.methods).map(([_tag, { failure: value }]) => S.TaggedStruct(_tag, { value })),
      ),
    }) as never

    const event: S.Schema<
      Protocol.EventMessage.Type<EventDefinitions>,
      Protocol.EventMessage.Encoded<EventDefinitions>
    > = S.TaggedStruct("Event", {
      event: S.Union(...Object.entries(definition.events).map(([_tag, fields]) => S.TaggedStruct(_tag, fields))),
    }) as never

    const actor = S.Union(success, failure, event, Protocol.AuditionSuccessMessage, Protocol.AuditionFailureMessage)

    const events: Stream.Stream<FieldsRecord.TaggedMember.Type<EventDefinitions>, ClientError, ClientSelf> = Effect.gen(
      function* () {
        const { events } = yield* clientTag.pipe(Effect.flatMap(RcRef.get))
        return events
      },
    ).pipe(Stream.unwrapScoped)

    const f: F<ClientSelf, MethodDefinitions> = (_tag) =>
      Effect.fnUntraced(function* (value) {
        const { f } = yield* clientTag.pipe(Effect.flatMap(RcRef.get))
        return yield* f(_tag)(value)
      }, Effect.scoped)

    return Object.assign(clientTag, {
      [TypeId]: TypeId,
      definition,
      schema: { call, success, failure, event, actor },
      events,
      f,
    })
  }

export interface Transport<
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
> {
  readonly listen: (
    publish: (
      message: Protocol.ActorMessage.Type<MethodDefinitions, EventDefinitions>,
    ) => Effect.Effect<void, ConnectionError>,
  ) => Effect.Effect<void, ClientError | ParseResult.ParseError, Scope.Scope>

  readonly send: (
    v: Protocol.CallMessage.Type<MethodDefinitions>,
  ) => Effect.Effect<void, ClientError | ParseResult.ParseError, never>
}

const make = <
  ClientSelf,
  ClientId extends string,
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
  R,
>(
  client: Client<ClientSelf, ClientId, MethodDefinitions, EventDefinitions>,
  build: Effect.Effect<Transport<MethodDefinitions, EventDefinitions>, ClientError, R | Scope.Scope>,
  replay?: ReplayEventsOptions | undefined,
) =>
  Effect.gen(function* () {
    const rcr: RcRef.RcRef<
      ServiceSession<ClientSelf, MethodDefinitions, EventDefinitions>,
      ClientError
    > = yield* RcRef.make({
      acquire: Effect.gen(function* () {
        const { listen, send } = yield* build

        const inflights: Record<
          string,
          Deferred.Deferred<
            Value<MethodDefinitions>["failure"]["Type"],
            Value<MethodDefinitions>["failure"]["Type"] | ClientError | ClosedBeforeResolvedError
          >
        > = {}

        const callId = yield* Ref.make(0)
        const takeCount = yield* Ref.make(0)
        const pubsub =
          yield* PubSub.unbounded<EventEnvelope<FieldsRecord.TaggedMember.Type<EventDefinitions>, ClientError>>()
        const audition = yield* Deferred.make<void, ClientError>()

        const replayState = yield* Ref.make<ReplayState<FieldsRecord.TaggedMember.Type<EventDefinitions>, ClientError>>(
          {
            startupOpen: true,
            buffer: [],
          },
        )

        const clientErrorFromCause = (cause: Cause.Cause<ClientError | ParseResult.ParseError>): ClientError =>
          Option.match(Cause.failureOption(cause), {
            onSome: (cause) => {
              switch (cause._tag) {
                case "AuditionError":
                case "ConnectionError": {
                  return cause
                }
                case "StartupClosedError": {
                  return cause
                }
              }
              return ConnectionError.make({ cause })
            },
            onNone: () => ConnectionError.make({ cause }),
          })

        const publishTake = (
          take: Take.Take<FieldsRecord.TaggedMember.Type<EventDefinitions>, ClientError>,
          options?: { readonly replay?: boolean | undefined },
        ) =>
          Effect.gen(function* () {
            const seq = yield* Ref.getAndUpdate(takeCount, (v) => v + 1)
            const envelope: EventEnvelope<FieldsRecord.TaggedMember.Type<EventDefinitions>, ClientError> = { seq, take }
            if (replay && options?.replay) {
              yield* Ref.update(replayState, (state) => {
                if (replay.mode === "startup" && !state.startupOpen) {
                  return state
                }

                const buffer =
                  replay.limit === undefined
                    ? [...state.buffer, envelope]
                    : [...(state.buffer.length >= replay.limit ? state.buffer.slice(1) : state.buffer), envelope]

                return {
                  startupOpen: state.startupOpen,
                  buffer,
                }
              })
            }
            yield* PubSub.publish(pubsub, envelope)
          })

        const events: Stream.Stream<FieldsRecord.TaggedMember.Type<EventDefinitions>, ClientError> = Effect.gen(
          function* () {
            const queue = yield* PubSub.subscribe(pubsub)
            const live = (
              replayCount: number,
            ): Stream.Stream<FieldsRecord.TaggedMember.Type<EventDefinitions>, ClientError> =>
              Stream.fromQueue(queue).pipe(
                Stream.filter((entry) => entry.seq > replayCount),
                Stream.map((entry) => entry.take),
                Stream.flattenTake,
              )
            if (!replay) {
              return live(-1)
            }
            const buffer =
              replay.mode === "all-subscribers"
                ? (yield* Ref.get(replayState)).buffer
                : yield* Ref.modify(replayState, (state) =>
                    state.startupOpen
                      ? [
                          state.buffer,
                          {
                            startupOpen: false,
                            buffer: [],
                          },
                        ]
                      : [[], state],
                  )
            const replayCount = Array.get(buffer, buffer.length - 1).pipe(
              Option.map(({ seq }) => seq),
              Option.getOrElse(() => -1),
            )
            const liveStream = live(replayCount)
            return buffer.length === 0
              ? liveStream
              : Stream.concat(
                  Stream.fromIterable(buffer).pipe(
                    Stream.map((entry) => entry.take),
                    Stream.flattenTake,
                  ),
                  liveStream,
                )
          },
        ).pipe(Stream.unwrapScoped)

        const closeInflights = () =>
          Effect.forEach(Object.values(inflights), (v) => Deferred.fail(v, ClosedBeforeResolvedError.make()), {
            concurrency: "unbounded",
          }).pipe(Effect.asVoid)

        const closeEvents = (terminal: Take.Take<FieldsRecord.TaggedMember.Type<EventDefinitions>, ClientError>) =>
          publishTake(terminal).pipe(Effect.andThen(PubSub.shutdown(pubsub)))

        const failStartupIfPending = (error: ClientError) => Deferred.fail(audition, error).pipe(Effect.asVoid)

        const teardownFromListenerExit = (exit: Exit.Exit<void, ClientError | ParseResult.ParseError>) => {
          const { terminal, startupFailure } = Exit.match(exit, {
            onSuccess: () => ({
              terminal: Take.end,
              startupFailure: Option.some<ClientError>(StartupClosedError.make()),
            }),
            onFailure: (cause) => {
              if (Cause.isInterruptedOnly(cause)) {
                return {
                  terminal: Take.end,
                  startupFailure: Option.none<ClientError>(),
                }
              }
              const error = clientErrorFromCause(cause)
              return {
                terminal: Take.fail(error),
                startupFailure: Option.some<ClientError>(error),
              }
            },
          })

          return Effect.all([
            closeInflights(),
            closeEvents(terminal),
            Option.match(startupFailure, {
              onSome: failStartupIfPending,
              onNone: () => Effect.void,
            }),
          ]).pipe(Effect.andThen(RcRef.invalidate(rcr)))
        }

        yield* listen(
          Effect.fnUntraced(function* (message) {
            switch (message._tag) {
              case "AuditionSucceeded": {
                return yield* Deferred.succeed(audition, void 0)
              }
              case "AuditionFailure": {
                const { actual, expected } = message
                return yield* Deferred.fail(audition, AuditionError.make({ value: { actual, expected } }))
              }
              case "Event": {
                const { event } = message
                return yield* publishTake(Take.of(event), { replay: true })
              }
              case "Success":
              case "Failure": {
                const { id } = message
                const deferred = inflights[id]
                if (deferred) {
                  delete inflights[id]
                  switch (message._tag) {
                    case "Success": {
                      yield* Deferred.succeed(deferred, message.value.value)
                      break
                    }
                    case "Failure": {
                      yield* Deferred.fail(deferred, message.cause.value)
                      break
                    }
                  }
                }
                return
              }
            }
          }),
        ).pipe(Effect.onExit(teardownFromListenerExit), Effect.forkScoped)

        yield* Deferred.await(audition)

        const f: F<ClientSelf, MethodDefinitions> = (_tag) =>
          Effect.fnUntraced(function* (value) {
            const id = yield* Ref.getAndUpdate(callId, (v) => v + 1)
            const inflight = yield* Deferred.make<
              Value<MethodDefinitions>["success"]["Type"],
              Value<MethodDefinitions>["failure"]["Type"]
            >()
            inflights[id] = inflight
            yield* send({
              _tag: "Call",
              id,
              payload: { _tag, value },
            })
            return yield* Deferred.await(inflight)
          }, Effect.scoped)

        return { events, f } satisfies ServiceSession<ClientSelf, MethodDefinitions, EventDefinitions>
      }),
    })
    return rcr
  }).pipe(Layer.scoped(client))

export const layerSocket = <
  ClientSelf,
  ClientId extends string,
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
>({
  client,
  url,
  protocols,
  replay,
}: {
  readonly client: Client<ClientSelf, ClientId, MethodDefinitions, EventDefinitions>
  readonly url: string
  readonly protocols?: string | Array<string> | undefined
  readonly replay?: ReplayEventsOptions | undefined
}): Layer.Layer<ClientSelf, never, Socket.WebSocketConstructor> =>
  make<ClientSelf, ClientId, MethodDefinitions, EventDefinitions, Socket.WebSocketConstructor>(
    client,
    Effect.gen(function* () {
      const socket = yield* Socket.makeWebSocket(url, {
        protocols: [
          "liminal",
          Encoding.encodeBase64Url(client.key),
          ...(protocols ? (Array.isArray(protocols) ? protocols : [protocols]) : []),
        ],
      })
      return {
        listen: Effect.fnUntraced(function* (publish) {
          yield* socket
            .runRaw(
              Effect.fnUntraced(function* (raw) {
                const message = yield* S.decodeUnknown(S.parseJson(client.schema.actor))(
                  raw instanceof Uint8Array ? new TextDecoder().decode(raw) : raw,
                )
                yield* publish(message)
              }),
            )
            .pipe(
              Effect.catchTag(
                "SocketError",
                Effect.fnUntraced(function* (cause) {
                  const { code, closeReason } = yield* S.decodeUnknown(
                    S.Struct({
                      code: S.Int.pipe(S.optional),
                      closeReason: S.String,
                    }),
                  )(cause)
                  switch (code) {
                    case 4003: {
                      const { actual, expected } = yield* S.decodeUnknown(S.parseJson(Protocol.AuditionFailureMessage))(
                        closeReason,
                      )
                      return yield* AuditionError.make({ value: { actual, expected } })
                    }
                    case 1000: {
                      return // graceful close
                    }
                    default: {
                      return yield* ConnectionError.make({ cause })
                    }
                  }
                }),
              ),
            )
        }),
        send: Effect.fnUntraced(function* (v) {
          const write = yield* socket.writer
          yield* S.encode(S.parseJson(client.schema.call))(v).pipe(
            Effect.flatMap(write),
            Effect.catchTag("SocketError", (cause) => ConnectionError.make({ cause })),
          )
        }, Effect.scoped),
      }
    }),
    replay,
  )

export const layerWorker = <
  ClientSelf,
  ClientId extends string,
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
>({
  client,
  replay,
}: {
  readonly client: Client<ClientSelf, ClientId, MethodDefinitions, EventDefinitions>
  readonly replay?: ReplayEventsOptions | undefined
}): Layer.Layer<ClientSelf, never, Worker.PlatformWorker | Worker.Spawner> =>
  make<ClientSelf, ClientId, MethodDefinitions, EventDefinitions, Worker.PlatformWorker | Worker.Spawner>(
    client,
    Effect.gen(function* () {
      const manager = yield* Worker.makeManager
      const worker = yield* manager
        .spawn<
          Protocol.CallMessage.Type<MethodDefinitions> | string,
          Protocol.ActorMessage.Type<MethodDefinitions, EventDefinitions> | 1,
          never
        >({})
        .pipe(Effect.catchTag("WorkerError", (cause) => ConnectionError.make({ cause })))

      const send = (message: Protocol.CallMessage.Type<MethodDefinitions>) =>
        worker.executeEffect(message).pipe(Effect.catchAll((cause) => new ConnectionError({ cause })))

      return {
        listen: Effect.fnUntraced(function* (publish) {
          yield* worker.execute(client.key).pipe(
            Stream.catchTag("WorkerError", (cause) => ConnectionError.make({ cause })),
            Stream.takeUntil((message) => message === 1),
            Stream.runForEach((message) => {
              if (message === 1) {
                return Effect.void
              }
              return publish(message)
            }),
          )
        }),
        send,
      }
    }),
    replay,
  )
