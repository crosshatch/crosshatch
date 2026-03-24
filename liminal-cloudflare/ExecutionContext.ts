import { Context } from "effect"

export class ExecutionContext extends Context.Tag("liminal/ExecutionContext")<
  ExecutionContext,
  globalThis.ExecutionContext
>() {}
