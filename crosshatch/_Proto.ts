export type id<K extends string> = `~crosshatch/${K}`
export const id = <K extends string>(label: K): id<K> => `~crosshatch/${label}`
