import { makeId } from "@crosshatch/util/schema"
import { Schema as S } from "effect"

import { make } from "./make.ts"

export const AccountIdTypeId = Symbol()
export const AccountId = makeId("AccountId")

export const Account = make(AccountId, S.Struct({ updated: S.Date }))
