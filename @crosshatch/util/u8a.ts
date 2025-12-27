import { Schema as S } from "effect"

export type u8a = Uint8Array<ArrayBuffer>
export const u8a = S.Uint8Array as S.Schema<u8a, ReadonlyArray<number>>
