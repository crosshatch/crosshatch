import { dev } from "@crosshatch/drizzle/dev"

import { relations } from "./relations.ts"
import * as schema from "./T.ts"

dev({ relations, schema })
