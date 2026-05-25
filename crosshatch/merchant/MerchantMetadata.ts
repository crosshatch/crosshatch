import { Context, Layer } from "effect"

export class MerchantMetadata extends Context.Service<
  MerchantMetadata,
  {
    readonly url: string
  }
>()("crosshatch/MerchantMetadata") {}

export const layer = (metadata: MerchantMetadata["Service"]) => Layer.succeed(MerchantMetadata, metadata)
