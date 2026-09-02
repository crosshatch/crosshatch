import { Schema as S, type Context } from "effect"

import { brand } from "./_common.ts"
import type * as Address from "./Address.ts"

export type Namespace = typeof Namespace.Type
export const Namespace = S.String.check(S.isPattern(/^[-a-z0-9]{3,8}$/u)).pipe(brand("Namespace"))

export const decodeEffect = S.decodeEffect(Namespace)

const TypeId = "~crosshatch/Namespace" as const

export interface NamespaceShape<
  Identifier extends string,
  Client,
  K extends string,
  Address_ extends Address.Address,
  Uniform,
> extends Context.ServiceClass.Shape<Identifier, Client> {
  readonly ""?: [Address_]
  readonly _tag: K
  readonly address: Address_
  readonly uniform: Uniform
}

export declare namespace NamespaceShape {
  export type Any = NamespaceShape<string, any, string, Address.Address, boolean>
}

export interface NamespaceClass<
  Self,
  Identifier extends string,
  Client,
  K extends string,
  Address_ extends Address.Address,
  Uniform extends boolean,
> extends Context.Service<Self, Client> {
  new (_: never): NamespaceShape<Identifier, Client, K, Address_, Uniform>

  readonly [TypeId]: typeof TypeId
}

export declare const Service: <Self, Client, Address_ extends Address.Address>() => <
  Id extends string,
  K extends string,
  Uniform extends boolean = false,
>(
  id: Id,
  config: {
    readonly _tag: K
    readonly uniform: Uniform
  },
) => NamespaceClass<Self, Id, Client, K, Address_, Uniform>
