import { Schema as S } from "effect"

export interface Extension<
  K extends string,
  Payload extends S.Top,
  Success extends S.Top & { readonly Type: Payload["Type"] },
> {
  readonly identifier: K
  readonly payload: Payload
  readonly success: Success
}

export declare namespace Extension {
  export type Any = Extension<string, S.Top, S.Top>
}

export const make = <
  K extends string,
  Payload extends S.Top,
  Success extends S.Top & { readonly Type: Payload["Type"] },
>(
  identifier: K,
  {
    payload,
    success,
  }: {
    readonly payload: Payload
    readonly success: Success
  },
): Extension<K, Payload, Success> => ({ identifier, payload, success })
