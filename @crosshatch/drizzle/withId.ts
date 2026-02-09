import { Brand, Schema as S } from "effect"

// TODO: delete this util
export const withId =
  <B extends symbol>(_id: S.brand<typeof S.UUID, B>) =>
  <A extends { id?: string | undefined }, I>(schema: S.Schema<A, I>): S.Schema<
    A & {
      id?: (string & Brand.Brand<B>) | undefined
    },
    I
  > => schema as never
