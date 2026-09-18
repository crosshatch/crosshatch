import { EUR, JPY, SGD, USD } from "../units.ts"
import * as Family from "./Family.ts"

export interface DAI extends Family.Family<USD, "DAI"> {}
export const DAI: DAI = Family.make({ unit: USD, symbol: "DAI" })

export interface EURC extends Family.Family<EUR, "EURC"> {}
export const EURC: EURC = Family.make({ unit: EUR, symbol: "EURC" })

export interface EURT extends Family.Family<EUR, "EURT"> {}
export const EURT: EURT = Family.make({ unit: EUR, symbol: "EURT" })

export interface JPYC extends Family.Family<JPY, "JPYC"> {}
export const JPYC: JPYC = Family.make({ unit: JPY, symbol: "JPYC" })

export interface MEGAUSD extends Family.Family<USD, "MEGAUSD"> {}
export const MEGAUSD: MEGAUSD = Family.make({ unit: USD, symbol: "MEGAUSD" })

export interface MUSD extends Family.Family<USD, "MUSD"> {}
export const MUSD: MUSD = Family.make({ unit: USD, symbol: "MUSD" })

export interface PYUSD extends Family.Family<USD, "PYUSD"> {}
export const PYUSD: PYUSD = Family.make({ unit: USD, symbol: "PYUSD" })

export interface RLUSD extends Family.Family<USD, "RLUSD"> {}
export const RLUSD: RLUSD = Family.make({ unit: USD, symbol: "RLUSD" })

export interface SBC extends Family.Family<USD, "SBC"> {}
export const SBC: SBC = Family.make({ unit: USD, symbol: "SBC" })

export interface USDC extends Family.Family<USD, "USDC"> {}
export const USDC: USDC = Family.make({ unit: USD, symbol: "USDC" })

export interface USDCE extends Family.Family<USD, "USDCE"> {}
export const USDCE: USDCE = Family.make({ unit: USD, symbol: "USDCE" })

export interface USDS extends Family.Family<USD, "USDS"> {}
export const USDS: USDS = Family.make({ unit: USD, symbol: "USDS" })

export interface USDT extends Family.Family<USD, "USDT"> {}
export const USDT: USDT = Family.make({ unit: USD, symbol: "USDT" })

export interface USDT0 extends Family.Family<USD, "USDT0"> {}
export const USDT0: USDT0 = Family.make({ unit: USD, symbol: "USDT0" })

export interface USDe extends Family.Family<USD, "USDe"> {}
export const USDe: USDe = Family.make({ unit: USD, symbol: "USDe" })

export interface XSGD extends Family.Family<SGD, "XSGD"> {}
export const XSGD: XSGD = Family.make({ unit: SGD, symbol: "XSGD" })
