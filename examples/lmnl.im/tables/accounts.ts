import { id, updated } from "@crosshatch/drizzle"
import { pgTable } from "drizzle-orm/pg-core"
import { Account, AccountId } from "lmnl-im-models/Account"

import { columns } from "./_columns.ts"

export const accounts = pgTable(
  "accounts",
  columns.struct<typeof Account.Type>()({
    ...id(AccountId),
    updated,
  }),
)
