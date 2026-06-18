import { Context } from "effect"

export class Settlement extends Context.Service<Settlement, {}>()("@crosshatch/merchant/Settlement") {}
