import { Context, Layer, Ref } from "effect"

import type { PhysicalAsset } from "./PhysicalAsset.ts"

export type AssetConfiguration = Readonly<Record<string, PhysicalAsset>>

export class AssetConfigurationRef extends Context.Service<AssetConfigurationRef, Ref.Ref<AssetConfiguration>>()(
  "crosshatch/AssetConfigurationRef",
) {}

export const layer = (config: AssetConfiguration) => Layer.effect(AssetConfigurationRef, Ref.make(config))
