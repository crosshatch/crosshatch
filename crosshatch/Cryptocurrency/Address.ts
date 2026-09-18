import { Config, Effect, Schema as S } from "effect"

import * as Proto from "../_Proto.ts"
import type * as Namespace from "./Namespace.ts"

export type Address = typeof Address.Type
export const Address = S.String.check(S.isPattern(/^[-.%a-zA-Z0-9]{1,128}$/u)).pipe(S.brand(Proto.id("Address")))

export const Namespaced = <Namespace_ extends Namespace.Any>(namespace: Namespace_): Namespace_["Address"] =>
  namespace.Address

export const fromConfig = <Namespace_ extends Namespace.Any = never>(
  namespace: Namespace_,
  name?: string | undefined,
): Config.Config<Address & ([Namespace_] extends [never] ? never : Namespace.NamespaceBrand<Namespace_["_tag"]>)> =>
  Config.string(name).pipe(
    Config.mapOrFail((v) =>
      namespace.Address.makeEffect(v).pipe(
        Effect.mapError((issue) => new Config.ConfigError(new S.SchemaError(issue))),
      ),
    ),
  ) as never
