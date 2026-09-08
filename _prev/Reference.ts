import { Schema as S, type Pipeable, type Brand } from "effect"

import * as Proto from "./_Proto.ts"
import type * as Namespace from "./Namespace.ts"

const TypeId = Proto.id("Reference")

export type ReferenceString = typeof ReferenceString.Type
export const ReferenceString = S.String.check(S.isPattern(/^[-_a-zA-Z0-9]{1,32}$/u)).pipe(S.brand(TypeId))

export interface Reference<Namespace_ extends Namespace.Any, Reference_ extends string> extends Pipeable.Pipeable {
  readonly [TypeId]: typeof TypeId

  readonly namespace: Namespace_

  readonly "~reference": Brand.Branded<Brand.Branded<Reference_, typeof TypeId>, Namespace_["id"]>
}

export const make = <Namespace_ extends Namespace.Any, Reference_ extends string>(spec: {
  readonly namespace: Namespace_
  readonly reference: Reference_
}): Reference<Namespace_, Reference_> => {
  const { namespace, reference } = spec
  return {
    ...Proto.make(TypeId),
    namespace,
    "~reference": reference as never,
  }
}
