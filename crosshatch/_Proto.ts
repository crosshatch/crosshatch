export type key<K extends string> = `crosshatch/${K}`
export const key = <K extends string>(label: K): key<K> => `crosshatch/${label}`

export type id<K extends string> = `~${key<K>}`
export const id = <K extends string>(label: K): id<K> => `~${key(label)}`
