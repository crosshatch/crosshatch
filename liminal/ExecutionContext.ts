import type { ExecutionContext as ExecutionContext_ } from "@cloudflare/workers-types"

import { Context } from "effect"

export class ExecutionContext extends Context.Tag("liminal/ExecutionContext")<ExecutionContext, ExecutionContext_>() {}
