import { Effect, Layer, Path, FileSystem } from "effect"
import { Etag, HttpPlatform, HttpRouter, HttpServerResponse } from "effect/unstable/http"
import type { HttpApi, HttpApiEndpoint, HttpApiGroup } from "effect/unstable/httpapi"

import { ChxDomain } from "./ChxDomain.ts"

type GroupsOf<Api extends HttpApi.Constraint> = Api extends HttpApi.HttpApi<any, infer Groups> ? Groups : never
type EndpointsOf<
  Api extends HttpApi.Constraint,
  GroupIdentifier extends HttpApiGroup.Identifier<GroupsOf<Api>>,
> = HttpApiGroup.Endpoints<HttpApiGroup.WithIdentifier<GroupsOf<Api>, GroupIdentifier>>

export const handler = <
  Api extends HttpApi.Constraint,
  GroupIdentifier extends HttpApiGroup.Identifier<GroupsOf<Api>>,
  EndpointIdentifier extends HttpApiEndpoint.Identifier<EndpointsOf<Api, GroupIdentifier>>,
  R,
>(
  _api: Api,
  _group: GroupIdentifier,
  _endpoint: EndpointIdentifier,
  f: HttpApiEndpoint.HandlerWithIdentifier<EndpointsOf<Api, GroupIdentifier>, EndpointIdentifier, never, R>,
) => f

export const layerApiCommon = Layer.mergeAll(
  ChxDomain.pipe(
    Effect.map(({ url }) =>
      HttpRouter.cors({
        allowedHeaders: ["*"],
        allowedMethods: ["*"],
        allowedOrigins: [url],
      }),
    ),
    Layer.unwrap,
  ),
  Etag.layer,
  Path.layer,
  HttpPlatform.layer.pipe(Layer.provideMerge(FileSystem.layerNoop({}))),
)

export const layerHealth = HttpRouter.add("GET", "/health", () => Effect.succeed(HttpServerResponse.text("ok")))
