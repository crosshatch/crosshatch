import type { FieldsRecord } from "@crosshatch/util/schema"

import { Layer } from "effect"

import type { MethodDefinition } from "../Method.ts"

import * as ActorClient from "../Client.ts"

export const layer = <
  ActorClientSelf,
  ActorClientId extends string,
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
>(
  _client: ActorClient.Client<ActorClientSelf, ActorClientId, MethodDefinitions, EventDefinitions>,
): Layer.Layer<ActorClientSelf> => null!
