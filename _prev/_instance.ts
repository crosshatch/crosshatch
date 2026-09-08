const lookup = new WeakMap()

export const instance = <T>(class_: new () => T): T => lookup.getOrInsertComputed(class_, () => new class_()) as T
