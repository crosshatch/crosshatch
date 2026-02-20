import { Schema as S } from "effect"

export class Introduction extends S.TaggedClass<Introduction>()("Introduction", {}) {
  static decodeOption = S.decodeUnknownOption(this)
}

export class RequestIntroduction extends S.TaggedClass<RequestIntroduction>()("RequestIntroduction", {}) {
  static decodeOption = S.decodeUnknownOption(this)
}
