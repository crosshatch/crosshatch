import {
  Request,
  type DurableObjectNamespace,
  type DurableObjectState,
  WebSocketPair,
  WebSocket,
  Response,
} from "@cloudflare/workers-types"
import * as Mutex from "@crosshatch/util/Mutex"
import { HttpServerResponse } from "@effect/platform"
import {
  Layer,
  Effect,
  Scope,
  Schema as S,
  ParseResult,
  Context,
  ManagedRuntime,
  ConfigProvider,
  Duration,
} from "effect"

import type { FieldsRecord } from "./_type_util.ts"
import type * as Actor from "./Actor.ts"

import * as Binding from "./Binding.ts"
import * as ClientDirectory from "./ClientDirectory.ts"
import * as Intrinsic from "./Intrinsic.ts"
import * as Method from "./Method.ts"
import { NativeRequest } from "./NativeRequest.ts"

const TypeId = "~liminal/ActorRegistry" as const

export interface ActorRegistryDefinition<
  Binding_ extends string,
  ActorSelf,
  ActorId extends string,
  NameA,
  AttachmentFields extends S.Struct.Fields,
  ClientSelf,
  ClientId extends string,
  MethodDefinitions extends Record<string, Method.MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
  PreludeROut,
  PreludeE,
  HandlerROut,
  HandlerE,
> {
  readonly binding: Binding_

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

  readonly preludeLayer: Layer.Layer<PreludeROut, PreludeE>

  readonly requestLayer: Layer.Layer<HandlerROut, HandlerE, ActorSelf | PreludeROut>

  readonly handlers: Method.Handlers<
    MethodDefinitions,
    ActorSelf | HandlerROut | Intrinsic.Intrinsic | PreludeROut | Scope.Scope
  >

  readonly onConnect: Effect.Effect<
    void,
    never,
    ActorSelf | HandlerROut | Intrinsic.Intrinsic | PreludeROut | Scope.Scope
  >

  readonly hibernation?: Duration.DurationInput | undefined
}

export interface ActorRegistry<
  RegistrySelf,
  RegistryId extends string,
  Binding_ extends string,
  ActorSelf,
  ActorId extends string,
  NameA,
  AttachmentFields extends S.Struct.Fields,
  ClientSelf,
  ClientId extends string,
  MethodDefinitions extends Record<string, Method.MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
  PreludeROut,
  PreludeE,
  HandlerROut,
  HandlerE,
> extends Binding.Binding<RegistrySelf, RegistryId, Binding_, DurableObjectNamespace> {
  new (state: DurableObjectState<{}>): Context.TagClassShape<RegistryId, DurableObjectNamespace>

  readonly [TypeId]: typeof TypeId

  readonly definition: ActorRegistryDefinition<
    Binding_,
    ActorSelf,
    ActorId,
    NameA,
    AttachmentFields,
    ClientSelf,
    ClientId,
    MethodDefinitions,
    EventDefinitions,
    PreludeROut,
    PreludeE,
    HandlerROut,
    HandlerE
  >

  readonly upgrade: (
    name: NameA,
    attachments: S.Struct<AttachmentFields>["Type"],
  ) => Effect.Effect<HttpServerResponse.HttpServerResponse, ParseResult.ParseError, RegistrySelf | NativeRequest>
}

export const Service =
  <RegistrySelf>() =>
  <
    RegistryId extends string,
    Binding_ extends string,
    ActorSelf,
    ActorId extends string,
    NameA,
    AttachmentFields extends S.Struct.Fields,
    ClientSelf,
    ClientId extends string,
    MethodDefinitions extends Record<string, Method.MethodDefinition.Any>,
    EventDefinitions extends FieldsRecord,
    PreludeROut,
    PreludeE,
    HandlerROut,
    HandlerE,
  >(
    id: RegistryId,
    definition: ActorRegistryDefinition<
      Binding_,
      ActorSelf,
      ActorId,
      NameA,
      AttachmentFields,
      ClientSelf,
      ClientId,
      MethodDefinitions,
      EventDefinitions,
      PreludeROut,
      PreludeE,
      HandlerROut,
      HandlerE
    >,
  ): ActorRegistry<
    RegistrySelf,
    RegistryId,
    Binding_,
    ActorSelf,
    ActorId,
    NameA,
    AttachmentFields,
    ClientSelf,
    ClientId,
    MethodDefinitions,
    EventDefinitions,
    PreludeROut,
    PreludeE,
    HandlerROut,
    HandlerE
  > => {
    const { hibernation, actor, preludeLayer, requestLayer, handlers, binding, onConnect } = definition
    const {
      definition: { name: nameSchema, attachments: attachmentFields, client },
    } = actor

    const attachmentsSchema = S.Struct(attachmentFields) as never as S.Schema<
      S.Struct<AttachmentFields>["Type"],
      S.Struct<AttachmentFields>["Encoded"]
    >

    const paramsSchema = S.compose(
      S.StringFromBase64Url,
      S.parseJson(
        S.Struct({
          name: nameSchema,
          attachments: attachmentsSchema,
        }),
      ),
    )

    class tag extends Binding.Service<RegistrySelf>()(
      id,
      binding,
      (value): value is DurableObjectNamespace => "getByName" in value,
    ) {
      readonly state
      readonly runtime
      readonly directory = ClientDirectory.make(actor)

      constructor(state: DurableObjectState<{}>, env: unknown) {
        // @ts-ignore
        super(state, env)

        this.state = state
        if (hibernation) {
          state.setHibernatableWebSocketEventTimeout(Duration.toMillis(hibernation))
        }

        this.runtime = Effect.gen(this, function* () {
          this.#name = yield* Effect.tryPromise(() => this.state.storage.get("__liminal_name")).pipe(
            Effect.flatMap((v) =>
              typeof v === "string" ? S.decode(actor.definition.name)(v) : Effect.succeed(undefined),
            ),
          )
          for (const socket of this.state.getWebSockets()) {
            const attachments = yield* S.decodeUnknown(attachmentsSchema)(socket.deserializeAttachment())
            yield* this.directory.register(socket, attachments)
          }
          return Layer.mergeAll(
            preludeLayer,
            Intrinsic.layer,
            Layer.setConfigProvider(ConfigProvider.fromJson(env)),
            Mutex.layer,
          )
        }).pipe(Layer.unwrapEffect, ManagedRuntime.make)
      }

      #name?: NameA | undefined
      fetch(request: Request): Promise<Response> {
        return Effect.gen(this, function* () {
          const url = new URL(request.url)
          const { name, attachments } = yield* S.decodeUnknown(paramsSchema)(url.searchParams.get("__liminal"))
          if (!this.#name) {
            this.#name = name
            const encoded = yield* S.encode(nameSchema)(name)
            yield* Effect.promise(() => this.state.storage.put("__liminal_name", encoded))
          }
          const { 0: client, 1: server } = new WebSocketPair()
          this.state.acceptWebSocket(server)
          yield* this.directory.register(server, attachments)
          return new Response(null, {
            status: 101,
            webSocket: client,
          })
        }).pipe(this.runtime.runPromise)
      }

      webSocketMessage(socket: WebSocket, messageRaw: string | ArrayBuffer) {
        Effect.gen(this, function* () {
          const caller = yield* this.directory.look(socket)
          const name = yield* Effect.fromNullable(this.#name)
          const layer = Layer.succeed(actor, {
            name,
            clients: this.directory.handles,
            currentClient: caller,
          })
          const message = yield* S.decodeUnknown(S.parseJson(client.schema.client))(
            messageRaw instanceof ArrayBuffer ? new TextDecoder().decode(messageRaw) : messageRaw,
          )
          if (message === 0) {
            return yield* onConnect.pipe(Effect.provide(requestLayer.pipe(Layer.provideMerge(layer))))
          }
          const { id, payload } = message
          const { _tag } = payload
          yield* handlers[_tag](payload).pipe(
            Effect.provide(requestLayer.pipe(Layer.provideMerge(layer))),
            Effect.matchEffect({
              onSuccess: (value) =>
                S.encode(S.parseJson(client.schema.success))({
                  _tag: "Success",
                  id,
                  value,
                }),
              onFailure: (cause) =>
                S.encode(S.parseJson(client.schema.failure))({
                  _tag: "Failure",
                  id,
                  cause,
                }),
            }),
            Effect.andThen(socket.send),
          )
        }).pipe(Mutex.task, Effect.scoped, this.runtime.runFork)
      }

      webSocketClose(socket: WebSocket, _code: number, _reason: string, _wasClean: boolean) {
        this.directory.unregister(socket).pipe(this.runtime.runFork)
      }

      webSocketError(socket: WebSocket, cause: unknown) {
        this.directory.unregister(socket).pipe(
          Effect.andThen(() => Effect.fail(cause)),
          this.runtime.runFork,
        )
      }
    }

    const upgrade = Effect.fnUntraced(function* (name: NameA, attachments: S.Struct<AttachmentFields>["Type"]) {
      const namespace = yield* tag
      const nameEncoded = yield* S.encode(nameSchema)(name)
      const stub = namespace.getByName(nameEncoded)

      const request = yield* NativeRequest
      const url = new URL(request.url)
      const params = yield* S.encode(paramsSchema)({ name, attachments })
      url.searchParams.set("__liminal", params)

      return yield* Effect.promise(() => stub.fetch(new Request(url, request as never))).pipe(
        Effect.flatMap((v) => HttpServerResponse.fromWeb(v as never as globalThis.Response)),
      )
    })

    return Object.assign(tag, { [TypeId]: TypeId, definition, upgrade }) as never
  }
