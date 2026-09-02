const TypeId = "~crosshatch/Unit" as const

export interface Unit<K extends string> {
  readonly [TypeId]: typeof TypeId

  readonly name: K
}

export type Any = Unit<string>

export declare const make: <K extends string>(name: K) => Unit<K>
