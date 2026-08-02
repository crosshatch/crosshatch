import { Effect, flow, Struct, Option, Schema as S, SchemaGetter, Context, Layer } from "effect"
import { HttpServerRequest, Headers } from "effect/unstable/http"

export const SocketProtocols = S.String.pipe(
  S.decodeTo(S.Array(S.Trim), {
    decode: SchemaGetter.split({ separator: "," }),
    encode: SchemaGetter.transform((arr) => arr.join(",")),
  }),
)

export class CurrentSocketProtocols extends Context.Service<CurrentSocketProtocols>()(
  "@crosshatch/util/SocketProtocols",
  {
    make: HttpServerRequest.HttpServerRequest.pipe(
      Effect.flatMap(
        flow(
          Struct.get("headers"),
          Headers.get("Sec-WebSocket-Protocol"),
          Option.match({
            onSome: S.decodeEffect(SocketProtocols),
            onNone: () => Effect.undefined,
          }),
        ),
      ),
    ),
  },
) {
  static readonly layer = Layer.effect(this, this.make)
}
