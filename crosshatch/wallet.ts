import * as Facade from "./Facade/Facade.ts"

export const createTrace = Facade.FacadeClient.fn("CreateTrace")

export const propose = Facade.FacadeClient.fn("Propose")
