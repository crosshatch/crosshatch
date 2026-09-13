import { type Effect, Schema as S } from "effect"

import * as Accepts from "./Accepts.ts"
import { ExtensionsEnvelope } from "./ExtensionsEnvelope.ts"
import { ResourceInfo } from "./ResourceInfo.ts"
import { Version } from "./Version.ts"

export class Required extends S.Class<Required>("Required")({
  x402Version: Version,
  resource: ResourceInfo,
  accepts: Accepts.Accepts,
  error: S.String.pipe(S.optional),
  extensions: ExtensionsEnvelope.pipe(S.optional),
}) {}

export declare const describe: {
  <E = never, R = never>(
    accepts: Accepts.Accepts | Effect.Effect<Accepts.Accepts, E, R>,
    description?: string,
  ): Effect.Effect<Required, E, R>
  (
    e0?: TemplateStringsArray | string,
    ...substitutions: ReadonlyArray<unknown>
  ): <E = never, R = never>(
    accepts: Accepts.Accepts | Effect.Effect<Accepts.Accepts, E, R>,
  ) => Effect.Effect<Required, E, R>
}
