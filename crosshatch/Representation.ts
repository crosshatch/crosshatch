import type * as Unit from "./Unit.ts"

const TypeId = "~crosshatch/Representation" as const

export interface Representation<U extends Unit.Any, K extends string> {
  readonly [TypeId]: typeof TypeId

  readonly unit: U

  readonly symbol: K
}

export type Any = Representation<Unit.Any, string>

export type RepresentationClass<K extends string, U extends Unit.Any> = new () => Representation<U, K>

export declare namespace RepresentationClass {
  export type Any = RepresentationClass<string, Unit.Any>
}

export declare const make: <K extends string, U extends Unit.Any>(symbol: K, unit: U) => RepresentationClass<K, U>
