// TODO

import { NetworkId } from "./schemas.ts"

export const NetworkTypeId = Symbol()

export interface Network {
  [NetworkTypeId]: typeof NetworkTypeId
  id: NetworkId
}
