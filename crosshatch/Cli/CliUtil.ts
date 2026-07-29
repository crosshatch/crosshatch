import { flow, Option } from "effect"
import { Flag } from "effect/unstable/cli"

export const orUndefined = flow(Flag.optional, Flag.map(Option.getOrUndefined))
