import type { HttpApi, HttpApiEndpoint, HttpApiGroup } from "effect/unstable/httpapi"

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
