import type { FieldsRecord, RequestDefinition } from "@crosshatch/util/schema"

import { Layer } from "effect"

import * as ActorClient from "../ActorClient.ts"

export const layer = <
  ActorClientSelf,
  ActorClientId extends string,
  RequestDefinitions extends ReadonlyArray<RequestDefinition>,
  EventDefinitions extends FieldsRecord,
>(
  _client: ActorClient.ActorClient<ActorClientSelf, ActorClientId, RequestDefinitions, EventDefinitions>,
): Layer.Layer<ActorClientSelf> => null!
