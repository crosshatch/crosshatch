const TypeId = "~crosshatch/Unit" as const

export interface Unit<K extends string> {
  readonly [TypeId]: typeof TypeId

  readonly name: K
}

export type Any = Unit<string>

export declare const make: <K extends string>(name: K) => Unit<K>

export const USD = make("USD")
export const EUR = make("EUR")
export const JPY = make("JPY")
export const SGD = make("SGD")
