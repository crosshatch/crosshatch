import { Schema as S } from "effect"

export class BridgeReady extends S.TaggedClass<BridgeReady>()("BridgeReady", {}) {}

export class AppReady extends S.TaggedClass<AppReady>()("AppReady", {}) {}
