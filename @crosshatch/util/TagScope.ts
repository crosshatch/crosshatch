export const TagScope =
  <A extends string>(a: A): (<B extends string>(value: B) => `${A}:${B}`) =>
  (b) =>
    `${a}:${b}`
