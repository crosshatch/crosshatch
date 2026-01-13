import { txFactory } from "@crosshatch/drizzle"
import * as schema from "./schema.ts"
import { Store } from "./Store.ts"

export const tx = txFactory(schema, Store._)
