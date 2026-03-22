import { Context } from "effect"

export class NativeRequest extends Context.Tag("liminal/NativeRequest")<NativeRequest, Request>() {}
