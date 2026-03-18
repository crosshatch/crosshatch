import { Context } from "effect"

export class Protocols extends Context.Tag("@crosshatch/util/SocketUtil/Protocol")<Protocols, Array<string>>() {}
