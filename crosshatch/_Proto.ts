import { Pipeable } from "effect"

export type id<K extends string> = `~crosshatch/${K}`
export const id = <K extends string>(key: K): id<K> => `~crosshatch/${key}`

export const make = <K extends string>(id: K): { [_ in K]: K } & Pipeable.Pipeable =>
  ({
    [id]: id,
    pipe() {
      return Pipeable.pipeArguments(this, arguments)
    },
  }) as never
