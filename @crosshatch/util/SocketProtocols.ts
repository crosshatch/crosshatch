import { Layer, Effect, flow, Option, Schema as S, SchemaGetter, Context } from "effect"
import { HttpServerRequest, Headers } from "effect/unstable/http"

export const SocketProtocolsKey = "Sec-WebSocket-Protocol" as const

type SocketProtocols_ = typeof SocketProtocols_.Type
const SocketProtocols_ = S.String.pipe(
  S.decodeTo(S.Array(S.Trim), {
    decode: SchemaGetter.split({ separator: "," }),
    encode: SchemaGetter.transform((arr) => arr.join(",")),
  }),
)

// oxlint-disable-next-line typescript/no-empty-interface
export interface SocketProtocols extends SocketProtocols_ {}

export const SocketProtocols = Object.assign(
  Context.Service<SocketProtocols>()("@crosshatch/util/SocketProtocols", {
    make: HttpServerRequest.HttpServerRequest.pipe(
      Effect.flatMap(
        flow(
          (v) => v.headers,
          Headers.get(SocketProtocolsKey),
          Option.match({
            onSome: S.decodeEffect(SocketProtocols_),
            onNone: () => Effect.undefined,
          }),
        ),
      ),
    ),
  }),
  SocketProtocols_,
)

export const layer = Layer.effect(SocketProtocols, SocketProtocols.make)
