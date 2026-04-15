import { HttpApi, HttpApiEndpoint, HttpApiGroup } from "effect/unstable/httpapi"

type GroupsOf<Api extends HttpApi.Any> = Api extends HttpApi.HttpApi<any, infer Groups> ? Groups : never

type EndpointsOf<Api extends HttpApi.Any, GroupName extends HttpApiGroup.Name<GroupsOf<Api>>> = HttpApiGroup.Endpoints<
  HttpApiGroup.WithName<GroupsOf<Api>, GroupName>
>

export const handler = <
  Api extends HttpApi.Any,
  GroupName extends HttpApiGroup.Name<GroupsOf<Api>>,
  EndpointName extends HttpApiEndpoint.Name<EndpointsOf<Api, GroupName>>,
  R,
>(
  _api: Api,
  _group: GroupName,
  _endpoint: EndpointName,
  f: HttpApiEndpoint.HandlerWithName<EndpointsOf<Api, GroupName>, EndpointName, never, R>,
) => f
