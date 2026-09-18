import * as Proto from "./_Proto.ts"
import type * as Mechanism from "./Mechanism.ts"

const TypeId = Proto.id("MechanismConfig")

export interface MechanismConfig<Mechanism_ extends Mechanism.Any> {
  readonly [TypeId]: typeof TypeId

  readonly mechanism: Mechanism_

  readonly extra: Mechanism.Extra<Mechanism_>
}

export type Any = MechanismConfig<Mechanism.Any>

export const make = <Mechanism_ extends Mechanism.Any>(mechanism: Mechanism_, extra: Mechanism.Extra<Mechanism_>) => ({
  [TypeId]: TypeId,
  mechanism,
  extra,
})
