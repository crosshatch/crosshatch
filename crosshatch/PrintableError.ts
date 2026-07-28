import { Runtime, Predicate } from "effect"

export const TypeId = "~crosshatch/PrintableError" as const

export interface PrintableErrorLike {
  readonly [TypeId]: typeof TypeId
  readonly message: string
}

export const make = <Base extends new (...args: Array<any>) => Error>(
  Base: Base,
  message: (self: InstanceType<Base>) => string,
) =>
  class extends Base {
    readonly [TypeId] = TypeId
    override readonly [Runtime.errorReported] = false
    override readonly [Runtime.errorExitCode] = 1
    override get message() {
      return message(this as never)
    }
  }

export const is = (v: unknown): v is PrintableErrorLike => Predicate.hasProperty(v, TypeId)
