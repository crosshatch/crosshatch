import { Schema as S } from "effect"

export class Introduction extends S.TaggedClass<Introduction>("Introduction")("Introduction", {}) {}

export class RequestIntroduction
  extends S.TaggedClass<RequestIntroduction>("RequestIntroduction")("RequestIntroduction", {})
{}

export class DialogClose extends S.TaggedClass<DialogClose>("DialogClose")("DialogClose", {}) {}

export class BridgeReady extends S.TaggedClass<BridgeReady>("BridgeReady")("BridgeReady", {}) {}

export class AppReady extends S.TaggedClass<AppReady>("AppReady")("AppReady", {}) {}
