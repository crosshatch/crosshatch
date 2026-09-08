import * as Proto from "../_Proto.ts"
import type * as Namespace from "./Namespace.ts"

const TypeId = Proto.id("Reference")

export interface ReferenceSpec<Namespace_ extends Namespace.Any, Reference_ extends string> {
  readonly _tag: Reference_

  readonly namespace: Namespace_
}

export interface Reference<Namespace_ extends Namespace.Any, Reference_ extends string> extends ReferenceSpec<
  Namespace_,
  Reference_
> {
  readonly [TypeId]: typeof TypeId
}

export type Any = Reference<Namespace.Any, string>

export const make = <Namespace_ extends Namespace.Any, Reference_ extends string>(
  spec: ReferenceSpec<Namespace_, Reference_>,
): Reference<Namespace_, Reference_> => ({ [TypeId]: TypeId, ...spec })
