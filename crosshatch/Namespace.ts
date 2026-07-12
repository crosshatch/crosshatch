import { Schema as S } from "effect"

/** CAIP-2 namespace (e.g. `eip155`, `cosmos`, `bip122`). */
export const Namespace = S.String.check(S.isPattern(/^[-a-z0-9]{3,8}$/u)).pipe(S.brand("crosshatch/Namespace"))
