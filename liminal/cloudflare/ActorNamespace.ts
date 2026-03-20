import type { RequestDefinition, FieldsRecord, Fields } from "@crosshatch/util/schema"

import {
  Request,
  type DurableObjectNamespace,
  type DurableObjectState,
  WebSocketPair,
  WebSocket,
  Response,
} from "@cloudflare/workers-types"
import { HttpServerResponse, Headers } from "@effect/platform"
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

import type * as Actor from "../Actor.ts"

import * as ClientHandle from "../ClientHandle.ts"
import * as Handler from "../Handler.ts"
import * as Protocol from "../Protocol.ts"
import * as Binding from "./Binding.ts"
import * as Intrinsic from "./Intrinsic.ts"
import { NativeRequest } from "./NativeRequest.ts"

const TypeId = "~liminal/ActorNamespace" as const

export interface ActorNamespaceDefinition<
  Binding_ extends string,
  ActorSelf,
  ActorId extends string,
  NameA,
  AttachmentFields extends Fields,
  ClientSelf,
  ClientId extends string,
  RequestDefinitions extends ReadonlyArray<RequestDefinition>,
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
    RequestDefinitions,
    EventDefinitions
  >

  readonly preludeLayer: Layer.Layer<PreludeROut, PreludeE>

  readonly requestLayer: Layer.Layer<HandlerROut, HandlerE, ActorSelf | PreludeROut>

  readonly handlers: Handler.Handlers<
    RequestDefinitions,
    ActorSelf | HandlerROut | Intrinsic.Intrinsic | PreludeROut | Scope.Scope
  >

  readonly hibernation?: Duration.DurationInput | undefined
}

export interface ActorNamespace<
  ActorRunnerSelf,
  ActorRunnerId extends string,
  Binding_ extends string,
  ActorSelf,
  ActorId extends string,
  NameA,
  Attachments extends Fields,
  ActorClientSelf,
  ActorClientId extends string,
  RequestDefinitions extends ReadonlyArray<RequestDefinition>,
  EventDefinitions extends FieldsRecord,
  PreludeROut,
  PreludeE,
  HandlerROut,
  HandlerE,
> extends Binding.Binding<ActorRunnerSelf, ActorRunnerId, Binding_, DurableObjectNamespace> {
  new (state: DurableObjectState<{}>): Context.TagClassShape<ActorRunnerId, DurableObjectNamespace>

  readonly [TypeId]: typeof TypeId

  readonly definition: ActorNamespaceDefinition<
    Binding_,
    ActorSelf,
    ActorId,
    NameA,
    Attachments,
    ActorClientSelf,
    ActorClientId,
    RequestDefinitions,
    EventDefinitions,
    PreludeROut,
    PreludeE,
    HandlerROut,
    HandlerE
  >

  readonly upgrade: (
    name: NameA,
    attachments: S.Struct<Attachments>["Type"],
  ) => Effect.Effect<HttpServerResponse.HttpServerResponse, ParseResult.ParseError, ActorRunnerSelf | NativeRequest>
}

export const Service =
  <ActorRunnerSelf>() =>
  <
    ActorRunnerId extends string,
    Binding_ extends string,
    ActorSelf,
    ActorId extends string,
    NameA,
    AttachmentFields extends Fields,
    ActorClientSelf,
    ActorClientId extends string,
    RequestDefinitions extends ReadonlyArray<RequestDefinition>,
    EventDefinitions extends FieldsRecord,
    PreludeROut,
    PreludeE,
    HandlerROut,
    HandlerE,
  >(
    id: ActorRunnerId,
    definition: ActorNamespaceDefinition<
      Binding_,
      ActorSelf,
      ActorId,
      NameA,
      AttachmentFields,
      ActorClientSelf,
      ActorClientId,
      RequestDefinitions,
      EventDefinitions,
      PreludeROut,
      PreludeE,
      HandlerROut,
      HandlerE
    >,
  ): ActorNamespace<
    ActorRunnerSelf,
    ActorRunnerId,
    Binding_,
    ActorSelf,
    ActorId,
    NameA,
    AttachmentFields,
    ActorClientSelf,
    ActorClientId,
    RequestDefinitions,
    EventDefinitions,
    PreludeROut,
    PreludeE,
    HandlerROut,
    HandlerE
  > => {
    const { hibernation, actor, preludeLayer, requestLayer, handlers, binding } = definition
    const {
      definition: {
        name: nameSchema,
        client: {
          definition: { events },
        },
      },
    } = actor

    const $m = Protocol.messages(actor.definition.client.definition)
    const $a = Protocol.attachments(actor.definition)

    type ClientHandle_ = ClientHandle.ClientHandle<ActorSelf, AttachmentFields, EventDefinitions>

    class tag extends Binding.Service<ActorRunnerSelf>()(
      id,
      binding,
      (value): value is DurableObjectNamespace => "getByName" in value,
    ) {
      readonly state
      readonly runtime
      readonly sockets = new Map<WebSocket, ClientHandle_>()
      readonly handles = new Set<ClientHandle_>()

      constructor(state: DurableObjectState<{}>, env: unknown) {
        // @ts-ignore
        super(state, env)

        this.state = state
        if (hibernation) {
          state.setHibernatableWebSocketEventTimeout(Duration.toMillis(hibernation))
        }

        this.runtime = Effect.gen(this, function* () {
          const { sockets, handles } = this
          for (const socket of this.state.getWebSockets()) {
            const { headers, attachments } = yield* S.decodeUnknown($a.AttachmentsWrapper)(
              socket.deserializeAttachment(),
            )
            const handle = ClientHandle.make<ActorSelf>()({
              socket,
              headers,
              attachments,
              attachmentsSchema: $a.Attachments,
              events,
            })

            sockets.set(socket, handle)
            handles.add(handle)
          }
          return Layer.mergeAll(preludeLayer, Intrinsic.layer, Layer.setConfigProvider(ConfigProvider.fromJson(env)))
        }).pipe(Layer.unwrapEffect, ManagedRuntime.make)
      }

      disconnect = (socket: WebSocket) =>
        Effect.gen(this, function* () {
          const handle = yield* Effect.fromNullable(this.sockets.get(socket))
          this.sockets.delete(socket)
          this.handles.delete(handle)
        })

      #name?: NameA | undefined
      fetch(request: Request): Promise<Response> {
        return Effect.gen(this, function* () {
          const url = new URL(request.url)
          const { name, attachments } = yield* S.decodeUnknown($a.Params)(url.searchParams.get("__liminal"))
          if (!this.#name) {
            this.#name = name
            yield* Effect.promise(() => this.state.storage.put("__liminal_name", name))
          }

          const { 0: client, 1: server } = new WebSocketPair()
          this.state.acceptWebSocket(server)
          const headers = Headers.fromInput(request.headers)
          const handle = ClientHandle.make<ActorSelf>()({
            socket: server,
            headers,
            attachments,
            attachmentsSchema: $a.Attachments,
            events,
          })
          this.sockets.set(server, handle)
          this.handles.add(handle)
          return new Response(null, {
            status: 101,
            webSocket: client,
          })
        }).pipe(this.runtime.runPromise)
      }

      webSocketMessage(socket: WebSocket, messageRaw: string | ArrayBuffer) {
        Effect.gen(this, function* () {
          const caller = yield* Effect.fromNullable(this.sockets.get(socket))
          const name = yield* Effect.fromNullable(this.#name)
          const layer = Layer.succeed(actor, {
            name,
            handles: this.handles,
            sender: caller,
          })
          const { id, payload } = yield* S.decodeUnknown($m.RequestJson)(
            messageRaw instanceof ArrayBuffer ? new TextDecoder().decode(messageRaw) : messageRaw,
          )
          // TODO: fix inference
          const _tag = (payload as { readonly _tag: string })._tag
          const handler = handlers[_tag as keyof typeof handlers]
          const result = yield* handler(payload).pipe(
            Effect.provide(requestLayer.pipe(Layer.provideMerge(layer))),
            Effect.exit,
          )
          switch (result._tag) {
            case "Success": {
              const { value } = result
              const encoded = yield* S.encode($m.SuccessJson)({ _tag: "Success", id, value })
              socket.send(encoded)
              break
            }
            case "Failure": {
              const { cause } = result
              const encoded = yield* S.encode($m.FailureJson)({ _tag: "Failure", id, cause })
              socket.send(encoded)
              break
            }
          }
        }).pipe(Effect.scoped, this.runtime.runFork)
      }

      webSocketClose(socket: WebSocket, _code: number, _reason: string, _wasClean: boolean) {
        this.disconnect(socket).pipe(this.runtime.runFork)
      }

      webSocketError(socket: WebSocket, cause: unknown) {
        this.disconnect(socket).pipe(
          Effect.andThen(() => Effect.fail(cause)),
          this.runtime.runFork,
        )
      }
    }

    const upgrade = Effect.fn(function* (name: NameA, attachments: typeof $a.Attachments.Type) {
      const namespace = yield* tag
      const nameEncoded = yield* S.encode(nameSchema)(name)
      const stub = namespace.getByName(nameEncoded)

      const request = yield* NativeRequest
      const url = new URL(request.url)
      const params = yield* S.encode($a.Params)({ name, attachments })
      url.searchParams.set("__liminal", params)

      return yield* Effect.promise(() => stub.fetch(new Request(url, request as never))).pipe(
        Effect.flatMap((v) => HttpServerResponse.fromWeb(v as never as globalThis.Response)),
      )
    })

    return Object.assign(tag, { [TypeId]: TypeId, definition, upgrade }) as never
  }
