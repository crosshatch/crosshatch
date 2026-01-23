import { Schema as S } from "effect"

export class DialogReady extends S.TaggedClass<DialogReady>("DialogReady")("DialogReady", {}) {}

export class DialogClose extends S.TaggedClass<DialogClose>("DialogClose")("DialogClose", {}) {}

export class BridgeReady extends S.TaggedClass<BridgeReady>("BridgeReady")("BridgeReady", {}) {}

export class AppReady extends S.TaggedClass<AppReady>("AppReady")("AppReady", {}) {}
