import { Schema as S } from "effect"

export class EnclaveProxyReady extends S.TaggedClass<EnclaveProxyReady>("EnclaveProxyReady")("EnclaveProxyReady", {}) {}

export class ParentPortReady extends S.TaggedClass<ParentPortReady>("ParentPortReady")("ParentPortReady", {}) {}

export class GrandparentPortReady
  extends S.TaggedClass<GrandparentPortReady>("GrandparentPortReady")("GrandparentPortReady", {
    origin: S.String,
  })
{}
