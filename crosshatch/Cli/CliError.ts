import { Runtime } from "effect"

export const TypeId = "~crosshatch/CliError" as const

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
