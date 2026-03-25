import { defineRelations } from "drizzle-orm"

import * as T from "./T.ts"

export const relations = defineRelations(T, (_) => ({}))
