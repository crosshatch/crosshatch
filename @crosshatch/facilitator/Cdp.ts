// @ts-nocheck

import * as Data from "effect/Data"
import * as Effect from "effect/Effect"
import type { SchemaError } from "effect/Schema"
import * as Schema from "effect/Schema"
import type * as HttpClient from "effect/unstable/http/HttpClient"
import * as HttpClientError from "effect/unstable/http/HttpClientError"
import * as HttpClientRequest from "effect/unstable/http/HttpClientRequest"
import * as HttpClientResponse from "effect/unstable/http/HttpClientResponse"
// recursive declarations
export type AbiParameter = {
  readonly name?: string
  readonly type: string
  readonly internalType?: string
  readonly components?: ReadonlyArray<AbiParameter>
}
export const AbiParameter = Schema.suspend((): Schema.Codec<AbiParameter> => __recursive_AbiParameter)
// non-recursive definitions
export type AccountType = "prime" | "business" | "cdp"
export const AccountType = Schema.Literals(["prime", "business", "cdp"]).annotate({
  description: "The type of the Account.",
})
export type AccountId = string
export const AccountId = Schema.String.annotate({
  description: "The ID of the Account, which is a UUID prefixed by the string `account_`.",
}).check(Schema.isPattern(new RegExp("^account_[a-f0-9\\-]{36}$")))
export type Owner = string
export const Owner = Schema.String.annotate({
  description:
    "The Owner ID of the Account.\nOwner IDs are UUIDs prefixed with the Owner Type as follows:\n* **Entity**: `entity_` - If the Owner is your Entity, e.g. `entity_af2937b0-9846-4fe7-bfe9-ccc22d935114`.\nSupport for Customer-owned accounts (`customer_` prefix) is in development.",
}).check(
  Schema.isPattern(new RegExp("^(entity|customer)_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$")),
)
export type AccountName = string
export const AccountName = Schema.String.annotate({
  description:
    "An optional name for the account. Must be 1-64 characters and can only contain alphanumeric characters, hyphens, and spaces.",
})
  .check(Schema.isMaxLength(64))
  .check(Schema.isPattern(new RegExp("^[a-zA-Z0-9 -]{1,64}$")))
export type ErrorType =
  | "already_exists"
  | "authorization_expired"
  | "bad_gateway"
  | "capture_expired"
  | "client_closed_request"
  | "customer_not_authorized"
  | "endpoint_unavailable"
  | "faucet_limit_exceeded"
  | "forbidden"
  | "idempotency_error"
  | "internal_server_error"
  | "invalid_request"
  | "invalid_sql_query"
  | "invalid_signature"
  | "malformed_transaction"
  | "not_found"
  | "payment_method_required"
  | "payment_required"
  | "settlement_failed"
  | "rate_limit_exceeded"
  | "request_canceled"
  | "service_unavailable"
  | "timed_out"
  | "unauthorized"
  | "unsupported_tos_language"
  | "policy_violation"
  | "policy_in_use"
  | "account_limit_exceeded"
  | "network_not_tradable"
  | "guest_permission_denied"
  | "guest_region_forbidden"
  | "guest_transaction_limit"
  | "guest_transaction_count"
  | "phone_number_verification_expired"
  | "document_verification_failed"
  | "recipient_allowlist_violation"
  | "recipient_allowlist_pending"
  | "refund_expired"
  | "travel_rules_recipient_violation"
  | "source_account_invalid"
  | "target_account_invalid"
  | "source_account_not_found"
  | "target_account_not_found"
  | "source_asset_not_supported"
  | "target_asset_not_supported"
  | "target_email_invalid"
  | "target_onchain_address_invalid"
  | "transfer_amount_invalid"
  | "transfer_asset_not_supported"
  | "transfer_quote_expired"
  | "insufficient_balance"
  | "metadata_too_many_entries"
  | "metadata_key_too_long"
  | "metadata_value_too_long"
  | "travel_rules_field_missing"
  | "asset_mismatch"
  | "mfa_already_enrolled"
  | "mfa_invalid_code"
  | "mfa_flow_expired"
  | "mfa_required"
  | "mfa_not_enrolled"
  | "order_quote_expired"
  | "order_already_filled"
  | "order_already_canceled"
  | "account_not_ready"
  | "insufficient_liquidity"
  | "insufficient_allowance"
  | "transaction_simulation_failed"
  | "delegation_not_found"
  | "delegation_expired"
  | "delegation_revoked"
  | "delegation_not_authorized"
  | "delegation_not_enabled"
  | "network_mismatch"
  | "already_enabled"
export const ErrorType = Schema.Literals([
  "already_exists",
  "authorization_expired",
  "bad_gateway",
  "capture_expired",
  "client_closed_request",
  "customer_not_authorized",
  "endpoint_unavailable",
  "faucet_limit_exceeded",
  "forbidden",
  "idempotency_error",
  "internal_server_error",
  "invalid_request",
  "invalid_sql_query",
  "invalid_signature",
  "malformed_transaction",
  "not_found",
  "payment_method_required",
  "payment_required",
  "settlement_failed",
  "rate_limit_exceeded",
  "request_canceled",
  "service_unavailable",
  "timed_out",
  "unauthorized",
  "unsupported_tos_language",
  "policy_violation",
  "policy_in_use",
  "account_limit_exceeded",
  "network_not_tradable",
  "guest_permission_denied",
  "guest_region_forbidden",
  "guest_transaction_limit",
  "guest_transaction_count",
  "phone_number_verification_expired",
  "document_verification_failed",
  "recipient_allowlist_violation",
  "recipient_allowlist_pending",
  "refund_expired",
  "travel_rules_recipient_violation",
  "source_account_invalid",
  "target_account_invalid",
  "source_account_not_found",
  "target_account_not_found",
  "source_asset_not_supported",
  "target_asset_not_supported",
  "target_email_invalid",
  "target_onchain_address_invalid",
  "transfer_amount_invalid",
  "transfer_asset_not_supported",
  "transfer_quote_expired",
  "insufficient_balance",
  "metadata_too_many_entries",
  "metadata_key_too_long",
  "metadata_value_too_long",
  "travel_rules_field_missing",
  "asset_mismatch",
  "mfa_already_enrolled",
  "mfa_invalid_code",
  "mfa_flow_expired",
  "mfa_required",
  "mfa_not_enrolled",
  "order_quote_expired",
  "order_already_filled",
  "order_already_canceled",
  "account_not_ready",
  "insufficient_liquidity",
  "insufficient_allowance",
  "transaction_simulation_failed",
  "delegation_not_found",
  "delegation_expired",
  "delegation_revoked",
  "delegation_not_authorized",
  "delegation_not_enabled",
  "network_mismatch",
  "already_enabled",
]).annotate({
  description:
    "The code that indicates the type of error that occurred. These error codes can be used to determine how to handle the error.",
})
export type CapabilityName =
  | "custodyCrypto"
  | "custodyFiat"
  | "custodyStablecoin"
  | "tradeCrypto"
  | "tradeStablecoin"
  | "transferCrypto"
  | "transferFiat"
  | "transferStablecoin"
export const CapabilityName = Schema.Literals([
  "custodyCrypto",
  "custodyFiat",
  "custodyStablecoin",
  "tradeCrypto",
  "tradeStablecoin",
  "transferCrypto",
  "transferFiat",
  "transferStablecoin",
]).annotate({
  description:
    "The name of a capability. Capabilities represent granular functional permissions\nthat determine what actions a customer can perform. Each capability must be\nexplicitly requested before use.\n",
})
export type Asset = string
export const Asset = Schema.String.annotate({ description: "The symbol of the asset (e.g., eth, usd, usdc, usdt)." })
  .check(Schema.isMinLength(1))
  .check(Schema.isMaxLength(42))
export type AssetType = "fiat" | "crypto"
export const AssetType = Schema.Literals(["fiat", "crypto"]).annotate({ description: "The type of the asset." })
export type AmountDetail = { readonly available: string; readonly total: string }
export const AmountDetail = Schema.Struct({
  available: Schema.String.annotate({ description: "The amount that is currently available to be used." }),
  total: Schema.String.annotate({ description: "The total amount, including the amount that is currently on hold." }),
}).annotate({ description: "Available and total amounts for a specific currency." })
export type DepositDestinationType = "crypto"
export const DepositDestinationType = Schema.Literal("crypto")
export type DepositDestinationId = string
export const DepositDestinationId = Schema.String.annotate({
  description: "The ID of the Deposit Destination, which is a UUID prefixed by the string `depositDestination_`.",
}).check(Schema.isPattern(new RegExp("^depositDestination_[a-f0-9\\-]{36}$")))
export type Network =
  | "base"
  | "ethereum"
  | "solana"
  | "aptos"
  | "arbitrum"
  | "arbitrum-sepolia"
  | "optimism"
  | "polygon"
  | "world"
  | "world-sepolia"
export const Network = Schema.Literals([
  "base",
  "ethereum",
  "solana",
  "aptos",
  "arbitrum",
  "arbitrum-sepolia",
  "optimism",
  "polygon",
  "world",
  "world-sepolia",
]).annotate({
  description:
    "The blockchain network for the payment. Supported networks depend on the account type. See [API and Network Support](https://docs.cdp.coinbase.com/api-reference/payment-apis/supported-networks-assets#by-asset-and-network) for more details.",
})
export type BlockchainAddress = string
export const BlockchainAddress = Schema.String.annotate({
  description: "A blockchain address. Format varies by network (e.g., 0x-prefixed for EVM, base58 for Solana).",
})
  .check(Schema.isMinLength(1))
  .check(Schema.isMaxLength(128))
export type DepositDestinationTargetAccount = { readonly accountId?: string; readonly asset: string }
export const DepositDestinationTargetAccount = Schema.Struct({
  accountId: Schema.optionalKey(
    Schema.String.annotate({
      description: "The ID of the Account, which is a UUID prefixed by the string `account_`.",
    }).check(Schema.isPattern(new RegExp("^account_[a-f0-9\\-]{36}$"))),
  ),
  asset: Schema.String.annotate({ description: "The symbol of the asset (e.g., eth, usd, usdc, usdt)." })
    .check(Schema.isMinLength(1))
    .check(Schema.isMaxLength(42)),
}).annotate({
  title: "Target Account",
  description: "The account and asset where incoming deposits should be credited.",
})
export type DepositDestinationStatus = "active" | "inactive" | "pending"
export const DepositDestinationStatus = Schema.Literals(["active", "inactive", "pending"]).annotate({
  description: "The status of the deposit destination.",
})
export type Metadata = { readonly [x: string]: string }
export const Metadata = Schema.Record(
  Schema.String,
  Schema.String.check(Schema.isMinLength(0)).check(Schema.isMaxLength(500)),
)
  .annotate({
    description:
      "Optional metadata as key-value pairs. Use this to store additional structured information on a resource, such as customer IDs, order references, or any application-specific data. Up to 10 key/value pairs may be provided. Keys and values are both strings. Keys must be ≤ 40 characters; values must be ≤ 500 characters.",
  })
  .check(Schema.isMaxProperties(10))
export type TransferStatus = "quoted" | "processing" | "completed" | "failed"
export const TransferStatus = Schema.Literals(["quoted", "processing", "completed", "failed"]).annotate({
  description:
    "The current status of the transfer, indicating what action you need to take next. Required when validateOnly is false.",
})
export type Email = string
export const Email = Schema.String.annotate({
  description:
    "An email address. Maximum length 254 characters per [RFC 5321](https://www.rfc-editor.org/rfc/rfc5321).",
  format: "email",
}).check(Schema.isMaxLength(254))
export type OriginatingBankAccountUS = {
  readonly bankName: string
  readonly accountLast4: string
  readonly currency: string
}
export const OriginatingBankAccountUS = Schema.Struct({
  bankName: Schema.String.annotate({ description: "The name of the bank that originated the deposit." }),
  accountLast4: Schema.String.annotate({
    description: "The last 4 digits of the originating bank account number.",
  }).check(Schema.isPattern(new RegExp("^[0-9]{4}$"))),
  currency: Schema.String.annotate({ description: "The fiat currency of the deposit (e.g., `usd`)." }),
}).annotate({
  title: "Originating Bank Account (US)",
  description:
    "The originating US bank account details for the transfer source. Present when funds were deposited from an external bank account into a deposit destination. Only the last 4 digits of the account number are exposed.",
})
export type EmailInstrument = { readonly email: string; readonly asset: string }
export const EmailInstrument = Schema.Struct({
  email: Schema.String.annotate({
    description:
      "An email address. Maximum length 254 characters per [RFC 5321](https://www.rfc-editor.org/rfc/rfc5321).",
    format: "email",
  }).check(Schema.isMaxLength(254)),
  asset: Schema.String.annotate({ description: "The symbol of the asset (e.g., eth, usd, usdc, usdt)." })
    .check(Schema.isMinLength(1))
    .check(Schema.isMaxLength(42)),
}).annotate({ title: "Email Address", description: "The target of the payment is an email address." })
export type TransferExchangeRate = { readonly sourceAsset: string; readonly targetAsset: string; readonly rate: string }
export const TransferExchangeRate = Schema.Struct({
  sourceAsset: Schema.String.annotate({ description: "The symbol of the asset (e.g., eth, usd, usdc, usdt)." })
    .check(Schema.isMinLength(1))
    .check(Schema.isMaxLength(42)),
  targetAsset: Schema.String.annotate({ description: "The symbol of the asset (e.g., eth, usd, usdc, usdt)." })
    .check(Schema.isMinLength(1))
    .check(Schema.isMaxLength(42)),
  rate: Schema.String.annotate({
    description:
      "The exchange rate value as a decimal string. Indicates how many units of the target asset equal one unit of the source asset.",
  }),
}).annotate({
  description:
    "Exchange rate information for currency conversion. The rate indicates how much of the target asset is equivalent to one unit of the source asset.",
})
export type TransferFee = {
  readonly type: "bank" | "conversion" | "network" | "other"
  readonly amount: string
  readonly asset: string
}
export const TransferFee = Schema.Struct({
  type: Schema.Literals(["bank", "conversion", "network", "other"]).annotate({
    description: "The type of the fee, indicating its purpose.",
  }),
  amount: Schema.String.annotate({ description: "The amount of the fee in units of the asset specified by `asset`." }),
  asset: Schema.String.annotate({ description: "The symbol of the asset (e.g., eth, usd, usdc, usdt)." })
    .check(Schema.isMinLength(1))
    .check(Schema.isMaxLength(42)),
}).annotate({ description: "A single fee for a transfer." })
export type TravelRuleStatus = "incomplete" | "completed"
export const TravelRuleStatus = Schema.Literals(["incomplete", "completed"]).annotate({
  description: "The status of a travel rule submission.",
})
export type PhysicalAddress = {
  readonly line1?: string
  readonly line2?: string
  readonly city?: string
  readonly state?: string
  readonly postCode?: string
  readonly countryCode?: string
}
export const PhysicalAddress = Schema.Struct({
  line1: Schema.optionalKey(Schema.String.annotate({ description: "Primary street address." })),
  line2: Schema.optionalKey(Schema.String.annotate({ description: "Secondary address information." })),
  city: Schema.optionalKey(Schema.String.annotate({ description: "City or locality." })),
  state: Schema.optionalKey(Schema.String.annotate({ description: "State, province, or region." })),
  postCode: Schema.optionalKey(Schema.String.annotate({ description: "Postal or ZIP code." })),
  countryCode: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "ISO 3166-1 alpha-2 country code (2 characters). See https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes.",
    })
      .check(Schema.isMinLength(2))
      .check(Schema.isMaxLength(2)),
  ),
}).annotate({
  description:
    "A physical address with standard address components including street, city, state/province, postal code, and country.",
})
export type DepositTravelRuleVasp = { readonly identifier?: string; readonly name?: string }
export const DepositTravelRuleVasp = Schema.Struct({
  identifier: Schema.optionalKey(
    Schema.String.annotate({
      description: "The Legal Entity Identifier (LEI) of the Virtual Asset Service Provider (VASP).",
    }),
  ),
  name: Schema.optionalKey(
    Schema.String.annotate({ description: "The name of the Virtual Asset Service Provider (VASP)." }),
  ),
}).annotate({
  description: "Information about the Virtual Asset Service Provider (VASP) for a deposit travel rule submission.",
})
export type DateOfBirth = { readonly day?: string; readonly month?: string; readonly year?: string }
export const DateOfBirth = Schema.Struct({
  day: Schema.optionalKey(
    Schema.String.annotate({ description: "Day of birth (01-31)." })
      .check(Schema.isMinLength(2))
      .check(Schema.isMaxLength(2))
      .check(Schema.isPattern(new RegExp("^[0-9]{2}$"))),
  ),
  month: Schema.optionalKey(
    Schema.String.annotate({ description: "Month of birth (01-12)." })
      .check(Schema.isMinLength(2))
      .check(Schema.isMaxLength(2))
      .check(Schema.isPattern(new RegExp("^[0-9]{2}$"))),
  ),
  year: Schema.optionalKey(
    Schema.String.annotate({ description: "Year of birth (four digits)." })
      .check(Schema.isMinLength(4))
      .check(Schema.isMaxLength(4))
      .check(Schema.isPattern(new RegExp("^[0-9]{4}$"))),
  ),
}).annotate({ description: "Date of birth." })
export type DepositTravelRuleBeneficiary = { readonly name?: string }
export const DepositTravelRuleBeneficiary = Schema.Struct({
  name: Schema.optionalKey(Schema.String.annotate({ description: "Full name of the beneficiary." })),
}).annotate({ description: "Beneficiary information for a deposit travel rule submission." })
export type EmailAuthentication = { readonly type: "email"; readonly email: string }
export const EmailAuthentication = Schema.Struct({
  type: Schema.Literal("email").annotate({ description: "The type of authentication information." }),
  email: Schema.String.annotate({
    description:
      "An email address. Maximum length 254 characters per [RFC 5321](https://www.rfc-editor.org/rfc/rfc5321).",
    format: "email",
  }).check(Schema.isMaxLength(254)),
}).annotate({
  title: "EmailAuthentication",
  description: "Information about an end user who authenticates using a one-time password sent to their email address.",
})
export type PhoneNumber = string
export const PhoneNumber = Schema.String.annotate({
  description: "A phone number in [E.164](https://en.wikipedia.org/wiki/E.164) format.",
}).check(Schema.isPattern(new RegExp("^\\+[1-9]\\d{1,14}$")))
export type SmsAuthentication = { readonly type: "sms"; readonly phoneNumber: string }
export const SmsAuthentication = Schema.Struct({
  type: Schema.Literal("sms").annotate({ description: "The type of authentication information." }),
  phoneNumber: Schema.String.annotate({
    description: "A phone number in [E.164](https://en.wikipedia.org/wiki/E.164) format.",
  }).check(Schema.isPattern(new RegExp("^\\+[1-9]\\d{1,14}$"))),
}).annotate({
  title: "SmsAuthentication",
  description:
    "Information about an end user who authenticates using a one-time password sent to their phone number via SMS.",
})
export type DeveloperJWTAuthentication = { readonly type: "jwt"; readonly kid: string; readonly sub: string }
export const DeveloperJWTAuthentication = Schema.Struct({
  type: Schema.Literal("jwt").annotate({ description: "The type of authentication information." }),
  kid: Schema.String.annotate({ description: "The key ID of the JWK used to sign the JWT." }),
  sub: Schema.String.annotate({
    description: "The unique identifier for the end user that is captured in the `sub` claim of the JWT.",
  }),
}).annotate({
  title: "DeveloperJWTAuthentication",
  description: "Information about an end user who authenticates using a JWT issued by the developer.",
})
export type OAuth2ProviderType = "google" | "apple" | "x" | "telegram" | "github"
export const OAuth2ProviderType = Schema.Literals(["google", "apple", "x", "telegram", "github"]).annotate({
  description: "The type of OAuth2 provider.",
})
export type SiweAuthentication = { readonly type: "siwe"; readonly address: string }
export const SiweAuthentication = Schema.Struct({
  type: Schema.Literal("siwe").annotate({ description: "The type of authentication information." }),
  address: Schema.String.annotate({
    description: "A blockchain address. Format varies by network (e.g., 0x-prefixed for EVM, base58 for Solana).",
  })
    .check(Schema.isMinLength(1))
    .check(Schema.isMaxLength(128)),
}).annotate({
  title: "SiweAuthentication",
  description: "Information about an end user who authenticates using Sign In With Ethereum (EIP-4361).",
})
export type MFAMethods = {
  readonly enrollmentPromptedAt?: string
  readonly totp?: { readonly enrolledAt: string }
  readonly sms?: { readonly enrolledAt: string }
}
export const MFAMethods = Schema.Struct({
  enrollmentPromptedAt: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "The date and time when the end user was prompted for MFA enrollment, in ISO 8601 format. If the this field exists, and the user has no other enrolled MFA methods, then the user skipped MFA enrollment.",
      format: "date-time",
    }),
  ),
  totp: Schema.optionalKey(
    Schema.Struct({
      enrolledAt: Schema.String.annotate({
        description: "The date and time when the method was enrolled, in ISO 8601 format.",
        format: "date-time",
      }),
    }).annotate({ description: "An object containing information about the end user's TOTP enrollment." }),
  ),
  sms: Schema.optionalKey(
    Schema.Struct({
      enrolledAt: Schema.String.annotate({
        description: "The date and time when the method was enrolled, in ISO 8601 format.",
        format: "date-time",
      }),
    }).annotate({ description: "An object containing information about the end user's SMS MFA enrollment." }),
  ),
}).annotate({ description: "Information about the end user's MFA enrollments.\n" })
export type EndUserEvmAccount = { readonly address: string; readonly createdAt: string }
export const EndUserEvmAccount = Schema.Struct({
  address: Schema.String.annotate({ description: "The address of the EVM account." }).check(
    Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$")),
  ),
  createdAt: Schema.String.annotate({
    description: "The date and time when the account was created, in ISO 8601 format.",
    format: "date-time",
  }),
}).annotate({ description: "Information about an EVM account associated with an end user." })
export type EndUserEvmSmartAccount = {
  readonly address: string
  readonly ownerAddresses: ReadonlyArray<string>
  readonly createdAt: string
}
export const EndUserEvmSmartAccount = Schema.Struct({
  address: Schema.String.annotate({ description: "The address of the EVM smart account." }).check(
    Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$")),
  ),
  ownerAddresses: Schema.Array(
    Schema.String.annotate({ description: "The address of an EVM EOA account that owns this smart account." }).check(
      Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$")),
    ),
  ).annotate({
    description:
      "The addresses of the EVM EOA accounts that own this smart account. Smart accounts can have multiple owners, such as when spend permissions are enabled.",
  }),
  createdAt: Schema.String.annotate({
    description: "The date and time when the account was created, in ISO 8601 format.",
    format: "date-time",
  }),
}).annotate({ description: "Information about an EVM smart account associated with an end user." })
export type EndUserSolanaAccount = { readonly address: string; readonly createdAt: string }
export const EndUserSolanaAccount = Schema.Struct({
  address: Schema.String.annotate({ description: "The base58 encoded address of the Solana account." }).check(
    Schema.isPattern(new RegExp("^[1-9A-HJ-NP-Za-km-z]{32,44}$")),
  ),
  createdAt: Schema.String.annotate({
    description: "The date and time when the account was created, in ISO 8601 format.",
    format: "date-time",
  }),
}).annotate({ description: "Information about a Solana account associated with an end user." })
export type EIP712Domain = {
  readonly name?: string
  readonly version?: string
  readonly chainId?: number
  readonly verifyingContract?: string
  readonly salt?: string
}
export const EIP712Domain = Schema.Struct({
  name: Schema.optionalKey(Schema.String.annotate({ description: "The name of the DApp or protocol." })),
  version: Schema.optionalKey(Schema.String.annotate({ description: "The version of the DApp or protocol." })),
  chainId: Schema.optionalKey(
    Schema.Number.annotate({ description: "The chain ID of the EVM network.", format: "int64" }).check(Schema.isInt()),
  ),
  verifyingContract: Schema.optionalKey(
    Schema.String.annotate({ description: "The 0x-prefixed EVM address of the verifying smart contract." }).check(
      Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$")),
    ),
  ),
  salt: Schema.optionalKey(
    Schema.String.annotate({ description: "The optional 32-byte 0x-prefixed hex salt for domain separation." }).check(
      Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{64}$")),
    ),
  ),
}).annotate({ description: "The domain of the EIP-712 typed data." })
export type EIP712Types = {}
export const EIP712Types = Schema.Struct({}).annotate({
  description:
    'A mapping of struct names to an array of type objects (name + type).\nEach key corresponds to a type name (e.g., "`EIP712Domain`", "`PermitTransferFrom`").\n',
})
export type EvmEip7702DelegationNetwork =
  | "base-sepolia"
  | "base"
  | "arbitrum"
  | "optimism"
  | "polygon"
  | "ethereum"
  | "ethereum-sepolia"
export const EvmEip7702DelegationNetwork = Schema.Literals([
  "base-sepolia",
  "base",
  "arbitrum",
  "optimism",
  "polygon",
  "ethereum",
  "ethereum-sepolia",
]).annotate({ description: "The network for the EIP-7702 delegation." })
export type EvmUserOperationNetwork =
  | "base-sepolia"
  | "base"
  | "arbitrum"
  | "optimism"
  | "zora"
  | "polygon"
  | "bnb"
  | "avalanche"
  | "ethereum"
  | "ethereum-sepolia"
export const EvmUserOperationNetwork = Schema.Literals([
  "base-sepolia",
  "base",
  "arbitrum",
  "optimism",
  "zora",
  "polygon",
  "bnb",
  "avalanche",
  "ethereum",
  "ethereum-sepolia",
]).annotate({ description: "The network the user operation is for." })
export type EvmCall = {
  readonly to: string
  readonly value: string
  readonly data: string
  readonly overrideGasLimit?: string
}
export const EvmCall = Schema.Struct({
  to: Schema.String.annotate({ description: "The address the call is directed to." }).check(
    Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$")),
  ),
  value: Schema.String.annotate({ description: "The amount of ETH to send with the call, in wei." }),
  data: Schema.String.annotate({
    description:
      "The call data to send. This is the hex-encoded data of the function call consisting of the method selector and the function arguments.",
  }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]*$"))),
  overrideGasLimit: Schema.optionalKey(
    Schema.String.annotate({
      description: "The override gas limit to use for the call instead of the bundler's estimated gas limit.",
    }),
  ),
})
export type UserOperationReceiptRevert = { readonly data: string; readonly message: string }
export const UserOperationReceiptRevert = Schema.Struct({
  data: Schema.String.annotate({ description: "The 0x-prefixed raw hex string." }).check(
    Schema.isPattern(new RegExp("^0x[0-9a-fA-F]*$")),
  ),
  message: Schema.String.annotate({ description: "Human-readable revert reason if able to decode." }),
}).annotate({ description: "The revert data if the user operation has reverted." })
export type EvmAccount = {
  readonly address: string
  readonly name?: string
  readonly policies?: ReadonlyArray<string>
  readonly createdAt?: string
  readonly updatedAt?: string
}
export const EvmAccount = Schema.Struct({
  address: Schema.String.annotate({ description: "The 0x-prefixed, checksum EVM address." }).check(
    Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$")),
  ),
  name: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "An optional name for the account.\nAccount names can consist of alphanumeric characters and hyphens, and be between 2 and 36 characters long.\nAccount names are guaranteed to be unique across all EVM accounts in the developer's CDP Project.",
    }).check(Schema.isPattern(new RegExp("^[A-Za-z0-9][A-Za-z0-9-]{0,34}[A-Za-z0-9]$"))),
  ),
  policies: Schema.optionalKey(
    Schema.Array(
      Schema.String.check(
        Schema.isPattern(new RegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")),
      ),
    ).annotate({
      description:
        "The list of policy IDs that apply to the account. This will include both the project-level policy and the account-level policy, if one exists.",
    }),
  ),
  createdAt: Schema.optionalKey(
    Schema.String.annotate({
      description: "The UTC ISO 8601 timestamp at which the account was created.",
      format: "date-time",
    }),
  ),
  updatedAt: Schema.optionalKey(
    Schema.String.annotate({
      description: "The UTC ISO 8601 timestamp at which the account was last updated.",
      format: "date-time",
    }),
  ),
})
export type EvmSmartAccount = {
  readonly address: string
  readonly owners: ReadonlyArray<string>
  readonly name?: string
  readonly policies?: ReadonlyArray<string>
  readonly createdAt?: string
  readonly updatedAt?: string
}
export const EvmSmartAccount = Schema.Struct({
  address: Schema.String.annotate({ description: "The 0x-prefixed, checksum address of the Smart Account." }).check(
    Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$")),
  ),
  owners: Schema.Array(Schema.String.check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$")))).annotate({
    description:
      "Today, only a single owner can be set for a Smart Account, but this is an array to allow having multiple owners in the future. The address is a 0x-prefixed, checksum address.",
  }),
  name: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "An optional name for the account.\nAccount names can consist of alphanumeric characters and hyphens, and be between 2 and 36 characters long.\nAccount names are guaranteed to be unique across all Smart Accounts in the developer's CDP Project.",
    }).check(Schema.isPattern(new RegExp("^[A-Za-z0-9][A-Za-z0-9-]{0,34}[A-Za-z0-9]$"))),
  ),
  policies: Schema.optionalKey(
    Schema.Array(
      Schema.String.check(
        Schema.isPattern(new RegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")),
      ),
    ).annotate({
      description:
        "The list of policy IDs that apply to the smart account. This will include both the project-level policy and the account-level policy, if one exists.",
    }),
  ),
  createdAt: Schema.optionalKey(
    Schema.String.annotate({
      description: "The UTC ISO 8601 timestamp at which the account was created.",
      format: "date-time",
    }),
  ),
  updatedAt: Schema.optionalKey(
    Schema.String.annotate({
      description: "The UTC ISO 8601 timestamp at which the account was last updated.",
      format: "date-time",
    }),
  ),
})
export type SpendPermissionNetwork =
  | "base"
  | "base-sepolia"
  | "ethereum"
  | "ethereum-sepolia"
  | "optimism"
  | "arbitrum"
  | "avalanche"
  | "polygon"
export const SpendPermissionNetwork = Schema.Literals([
  "base",
  "base-sepolia",
  "ethereum",
  "ethereum-sepolia",
  "optimism",
  "arbitrum",
  "avalanche",
  "polygon",
]).annotate({ description: "The network the spend permission is on." })
export type SpendPermission = {
  readonly account: string
  readonly spender: string
  readonly token: string
  readonly allowance: string
  readonly period: string
  readonly start: string
  readonly end: string
  readonly salt: string
  readonly extraData: string
}
export const SpendPermission = Schema.Struct({
  account: Schema.String.annotate({ description: "Smart account this spend permission is valid for." }).check(
    Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$")),
  ),
  spender: Schema.String.annotate({ description: "Entity that can spend account's tokens." }).check(
    Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$")),
  ),
  token: Schema.String.annotate({
    description: "Token address (ERC-7528 native token address or ERC-20 contract).",
  }).check(Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$"))),
  allowance: Schema.String.annotate({
    description: "Maximum allowed value to spend, in atomic units for the specified token, within each period.",
  }),
  period: Schema.String.annotate({
    description: "Time duration for resetting used allowance on a recurring basis (seconds).",
  }),
  start: Schema.String.annotate({ description: "The start time for this spend permission, in Unix seconds." }),
  end: Schema.String.annotate({ description: "The expiration time for this spend permission, in Unix seconds." }),
  salt: Schema.String.annotate({
    description: "An arbitrary salt to differentiate unique spend permissions with otherwise identical data.",
  }),
  extraData: Schema.String.annotate({ description: "Arbitrary data to include in the permission." }),
}).annotate({ description: "The core spend permission." })
export type EvmSwapsNetwork = "base" | "ethereum" | "arbitrum" | "optimism" | "polygon"
export const EvmSwapsNetwork = Schema.Literals(["base", "ethereum", "arbitrum", "optimism", "polygon"]).annotate({
  description: "The network on which to perform the swap.",
})
export type ToToken = string
export const ToToken = Schema.String.annotate({
  description: "The 0x-prefixed contract address of the token to receive.",
}).check(Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$")))
export type FromToken = string
export const FromToken = Schema.String.annotate({
  description: "The 0x-prefixed contract address of the token to send.",
}).check(Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$")))
export type FromAmount = string
export const FromAmount = Schema.String.annotate({
  description:
    "The amount of the `fromToken` to send in atomic units of the token. For example, `1000000000000000000` when sending ETH equates to 1 ETH, `1000000` when sending USDC equates to 1 USDC, etc.",
}).check(Schema.isPattern(new RegExp("^\\d+$")))
export type Taker = string
export const Taker = Schema.String.annotate({
  description:
    "The 0x-prefixed address that holds the `fromToken` balance and has the `Permit2` allowance set for the swap.",
}).check(Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$")))
export type SignerAddress = string
export const SignerAddress = Schema.String.annotate({
  description:
    "The 0x-prefixed Externally Owned Account (EOA) address that will sign the `Permit2` EIP-712 permit message. This is only needed if `taker` is a smart contract.",
}).check(Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$")))
export type GasPrice = string
export const GasPrice = Schema.String.annotate({
  description:
    "The target gas price for the swap transaction, in Wei. For EIP-1559 transactions, this value should be seen as the `maxFeePerGas` value. If not provided, the API will use an estimate based on the current network conditions.",
}).check(Schema.isPattern(new RegExp("^\\d+$")))
export type SlippageBps = number
export const SlippageBps = Schema.Number.annotate({
  description:
    "The maximum acceptable slippage of the `toToken` in basis points. If this parameter is set to 0, no slippage will be tolerated. If not provided, the default slippage tolerance is 100 bps (i.e., 1%).",
  default: 100,
})
  .check(Schema.isInt())
  .check(Schema.isGreaterThanOrEqualTo(0))
  .check(Schema.isLessThanOrEqualTo(10000))
export type GetSwapPriceResponse = {
  readonly blockNumber: string
  readonly toAmount: string
  readonly toToken: string
  readonly fees: {
    readonly gasFee: { readonly amount: string; readonly token: string }
    readonly protocolFee: { readonly amount: string; readonly token: string }
  }
  readonly issues: {
    readonly allowance: { readonly currentAllowance: string; readonly spender: string }
    readonly balance: { readonly token: string; readonly currentBalance: string; readonly requiredBalance: string }
    readonly simulationIncomplete: boolean
  }
  readonly liquidityAvailable: true
  readonly minToAmount: string
  readonly fromAmount: string
  readonly fromToken: string
  readonly gas: string
  readonly gasPrice: string
}
export const GetSwapPriceResponse = Schema.Struct({
  blockNumber: Schema.String.annotate({
    description: "The block number at which the liquidity conditions were examined.",
  }).check(Schema.isPattern(new RegExp("^[1-9]\\d*$"))),
  toAmount: Schema.String.annotate({
    description:
      "The amount of the `toToken` that will be received in atomic units of the `toToken`. For example, `1000000000000000000` when receiving ETH equates to 1 ETH, `1000000` when receiving USDC equates to 1 USDC, etc.",
  }).check(Schema.isPattern(new RegExp("^(0|[1-9]\\d*)$"))),
  toToken: Schema.String.annotate({
    description: "The 0x-prefixed contract address of the token that will be received.",
  }).check(Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$"))),
  fees: Schema.Struct({
    gasFee: Schema.Struct({
      amount: Schema.String.annotate({
        description:
          "The estimated amount of the fee in atomic units of the `token`. For example, `1000000000000000` if the fee is in ETH equates to 0.001 ETH, `10000` if the fee is in USDC equates to 0.01 USDC, etc.",
      }).check(Schema.isPattern(new RegExp("^\\d+$"))),
      token: Schema.String.annotate({
        description:
          "The contract address of the token that the fee is paid in. The address `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE` is used for the native token of the network (e.g. ETH).",
      }).check(Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$"))),
    }).annotate({ description: "The estimated gas fee for the swap." }),
    protocolFee: Schema.Struct({
      amount: Schema.String.annotate({
        description:
          "The estimated amount of the fee in atomic units of the `token`. For example, `1000000000000000` if the fee is in ETH equates to 0.001 ETH, `10000` if the fee is in USDC equates to 0.01 USDC, etc.",
      }).check(Schema.isPattern(new RegExp("^\\d+$"))),
      token: Schema.String.annotate({
        description:
          "The contract address of the token that the fee is paid in. The address `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE` is used for the native token of the network (e.g. ETH).",
      }).check(Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$"))),
    }).annotate({ description: "The estimated protocol fee for the swap." }),
  }).annotate({ description: "The estimated fees for the swap." }),
  issues: Schema.Struct({
    allowance: Schema.Struct({
      currentAllowance: Schema.String.annotate({
        description: "The current allowance of the `fromToken` by the `taker`.",
      }).check(Schema.isPattern(new RegExp("^\\d+$"))),
      spender: Schema.String.annotate({ description: "The 0x-prefixed address of to set the allowance on." }).check(
        Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$")),
      ),
    }).annotate({
      description:
        "Details of the allowances that the taker must set in order to execute the swap successfully. Null if no allowance is required.",
    }),
    balance: Schema.Struct({
      token: Schema.String.annotate({ description: "The 0x-prefixed contract address of the token." }).check(
        Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$")),
      ),
      currentBalance: Schema.String.annotate({
        description: "The current balance of the `fromToken` by the `taker`.",
      }).check(Schema.isPattern(new RegExp("^\\d+$"))),
      requiredBalance: Schema.String.annotate({
        description: "The amount of the token that the `taker` must hold.",
      }).check(Schema.isPattern(new RegExp("^\\d+$"))),
    }).annotate({
      description:
        "Details of the balance of the `fromToken` that the `taker` must hold. Null if the `taker` has a sufficient balance.",
    }),
    simulationIncomplete: Schema.Boolean.annotate({
      description:
        "This is set to true when the transaction cannot be validated. This can happen when the taker has an insufficient balance of the `fromToken`. Note that this does not necessarily mean that the trade will revert.",
    }),
  }).annotate({
    description:
      "An object containing potential issues discovered during validation that could prevent the swap from being executed successfully.",
  }),
  liquidityAvailable: Schema.Literal(true).annotate({
    description:
      "Whether sufficient liquidity is available to settle the swap. All other fields in the response will be empty if this is false.",
  }),
  minToAmount: Schema.String.annotate({
    description:
      "The minimum amount of the `toToken` that must be received for the swap to succeed, in atomic units of the `toToken`.  For example, `1000000000000000000` when receiving ETH equates to 1 ETH, `1000000` when receiving USDC equates to 1 USDC, etc. This value is influenced by the `slippageBps` parameter.",
  }).check(Schema.isPattern(new RegExp("^(0|[1-9]\\d*)$"))),
  fromAmount: Schema.String.annotate({
    description:
      "The amount of the `fromToken` that will be sent in this swap, in atomic units of the `fromToken`. For example, `1000000000000000000` when sending ETH equates to 1 ETH, `1000000` when sending USDC equates to 1 USDC, etc.",
  }).check(Schema.isPattern(new RegExp("^(0|[1-9]\\d*)$"))),
  fromToken: Schema.String.annotate({
    description: "The 0x-prefixed contract address of the token that will be sent.",
  }).check(Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$"))),
  gas: Schema.String.annotate({
    description: "The estimated gas limit that should be used to send the transaction to guarantee settlement.",
  }).check(Schema.isPattern(new RegExp("^\\d+$"))),
  gasPrice: Schema.String.annotate({
    description:
      "The gas price, in Wei, that should be used to send the transaction. For EIP-1559 transactions, this value should be seen as the `maxFeePerGas` value. The transaction should be sent with this gas price to guarantee settlement.",
  }).check(Schema.isPattern(new RegExp("^\\d+$"))),
}).annotate({ title: "GetSwapPriceResponse" })
export type SwapUnavailableResponse = { readonly liquidityAvailable: false }
export const SwapUnavailableResponse = Schema.Struct({
  liquidityAvailable: Schema.Literal(false).annotate({
    description:
      "Whether sufficient liquidity is available to settle the swap. All other fields in the response will be empty if this is false.",
  }),
}).annotate({ title: "SwapUnavailableResponse" })
export type ListEvmTokenBalancesNetwork = "base" | "base-sepolia" | "ethereum"
export const ListEvmTokenBalancesNetwork = Schema.Literals(["base", "base-sepolia", "ethereum"]).annotate({
  description: "The name of the supported EVM networks in human-readable format.",
})
export type TokenAmount = { readonly amount: string; readonly decimals: number }
export const TokenAmount = Schema.Struct({
  amount: Schema.String.annotate({
    description:
      "The amount is denominated in the smallest indivisible unit of the token. For ETH, the smallest indivisible unit is Wei (10^-18 ETH). For ERC-20s, the smallest unit is the unit returned from `function totalSupply() public view returns (uint256)`.",
  }).check(Schema.isPattern(new RegExp("^[0-9]+$"))),
  decimals: Schema.Number.annotate({
    description:
      "'decimals' is the exponential value N that satisfies the equation `amount * 10^-N = standard_denomination`. The standard denomination is the most commonly used denomination for the token.\n- In the case of the native gas token, `decimals` is defined via convention. As an example, for ETH of Ethereum mainnet, the standard denomination is 10^-18 the smallest denomination (Wei). As such, for ETH on Ethereum mainnet, `decimals` is 18. - In the case of ERC-20 tokens, `decimals` is defined via configuration. `decimals` will be the number returned by `function decimals() public view returns (uint8)` on the underlying token contract.\nNot all tokens have a `decimals` field, as this function is [optional in the ERC-20 specification](https://eips.ethereum.org/EIPS/eip-20#decimals). This field will be left empty if the underlying token contract doesn't implement `decimals`.\nFurther, this endpoint will only populate this value for a small subset of whitelisted ERC-20 tokens at this time. We intend to improve coverage in the future.",
    format: "int64",
  }).check(Schema.isInt()),
}).annotate({ description: "Amount of a given token." })
export type EthValueCriterion = {
  readonly type: "ethValue"
  readonly ethValue: string
  readonly operator: ">" | ">=" | "<" | "<=" | "=="
}
export const EthValueCriterion = Schema.Struct({
  type: Schema.Literal("ethValue").annotate({
    description: "The type of criterion to use. This should be `ethValue`.",
  }),
  ethValue: Schema.String.annotate({
    description: "The amount of ETH, in wei, that the transaction's `value` field should be compared to.",
  })
    .check(Schema.isMaxLength(78))
    .check(Schema.isPattern(new RegExp("^[0-9]+$"))),
  operator: Schema.Literals([">", ">=", "<", "<=", "=="]).annotate({
    description:
      "The operator to use for the comparison. The transaction's `value` field will be on the left-hand side of the operator, and the `ethValue` field will be on the right-hand side.",
  }),
}).annotate({
  title: "EthValueCriterion",
  description: "A schema for specifying a criterion for the `value` field of an EVM transaction.",
})
export type EvmAddressCriterion = {
  readonly type: "evmAddress"
  readonly addresses: ReadonlyArray<string>
  readonly operator: "in" | "not in"
}
export const EvmAddressCriterion = Schema.Struct({
  type: Schema.Literal("evmAddress").annotate({
    description: "The type of criterion to use. This should be `evmAddress`.",
  }),
  addresses: Schema.Array(
    Schema.String.annotate({
      description: "The 0x-prefixed EVM address that the transaction's `to` field should be compared to.",
    }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
  ).annotate({
    description:
      "A list of 0x-prefixed EVM addresses that the transaction's `to` field should be compared to. There is a limit of 300 addresses per criterion.",
  }),
  operator: Schema.Literals(["in", "not in"]).annotate({
    description:
      "The operator to use for the comparison. The transaction's `to` field will be on the left-hand side of the operator, and the `addresses` field will be on the right-hand side.",
  }),
}).annotate({
  title: "EvmAddressCriterion",
  description: "A schema for specifying a criterion for the `to` field of an EVM transaction.",
})
export type KnownAbiType = "erc20" | "erc721" | "erc1155"
export const KnownAbiType = Schema.Literals(["erc20", "erc721", "erc1155"]).annotate({
  title: "KnownAbiType",
  description:
    "A reference to an established EIP standard. When referencing a `KnownAbiType` within a policy rule configuring an `EvmDataCriterion`, criteria will only decode function data officially documented in the standard. For more information on supported token standards, see the links below.\n  - [erc20 - Token Standard](https://eips.ethereum.org/EIPS/eip-20).\n  - [erc721 - Non-Fungible Token Standard](https://eips.ethereum.org/EIPS/eip-721).\n  - [erc1155 - Multi Token Standard](https://eips.ethereum.org/EIPS/eip-1155).",
})
export type AbiStateMutability = "pure" | "view" | "nonpayable" | "payable"
export const AbiStateMutability = Schema.Literals(["pure", "view", "nonpayable", "payable"]).annotate({
  description: "State mutability of a function in Solidity.",
})
export type AbiInput = {
  readonly type: "constructor" | "error" | "event" | "fallback" | "receive"
  readonly additionalProperties?: unknown
}
export const AbiInput = Schema.Struct({
  type: Schema.Literals(["constructor", "error", "event", "fallback", "receive"]).annotate({
    description: "The type of the ABI item.",
  }),
  additionalProperties: Schema.optionalKey(
    Schema.Unknown.annotate({
      description:
        "For additional information on the ABI JSON specification, see [the Solidity documentation](https://docs.soliditylang.org/en/latest/abi-spec.html#json).",
    }),
  ),
}).annotate({
  title: "AbiInput",
  description: "Generic ABI item type encapsulating all other types besides `function`.",
})
export type EvmDataParameterCondition = {
  readonly name: string
  readonly operator: ">" | ">=" | "<" | "<=" | "=="
  readonly value: string
}
export const EvmDataParameterCondition = Schema.Struct({
  name: Schema.String.annotate({
    description:
      "The name of the parameter to check against a transaction's calldata. If name is unknown, or is not named, you may supply an array index, e.g., `0` for first parameter.",
  }),
  operator: Schema.Literals([">", ">=", "<", "<=", "=="]).annotate({
    description:
      "The operator to use for the comparison. The value resolved at the `name` will be on the left-hand side of the operator, and the `value` field will be on the right-hand side.",
  }),
  value: Schema.String.annotate({
    description:
      "A single value to compare the value resolved at `name` to. All values are encoded as strings. Refer to the table in the documentation for how values should be encoded, and which operators are supported for each type.",
  }),
}).annotate({ title: "EvmDataParameterCondition" })
export type EvmDataParameterConditionList = {
  readonly name: string
  readonly operator: "in" | "not in"
  readonly values: ReadonlyArray<string>
}
export const EvmDataParameterConditionList = Schema.Struct({
  name: Schema.String.annotate({
    description:
      "The name of the parameter to check against a transaction's calldata. If name is unknown, or is not named, you may supply an array index, e.g., `0` for first parameter.",
  }),
  operator: Schema.Literals(["in", "not in"]).annotate({
    description:
      "The operator to use for the comparison. The value resolved at the `name` will be on the left-hand side of the operator, and the `values` field will be on the right-hand side.",
  }),
  values: Schema.Array(
    Schema.String.annotate({
      description:
        "A single potential value to compare against the resolved `name` value. All values are encoded as strings. Refer to the table in the documentation for how values should be encoded, and which operators are supported for each type.",
    }),
  ).annotate({
    description:
      "Values to compare against the resolved `name` value. All values are encoded as strings. Refer to the table in the documentation for how values should be encoded, and which operators are supported for each type.",
  }),
}).annotate({ title: "EvmDataParameterConditionList" })
export type NetUSDChangeCriterion = {
  readonly type: "netUSDChange"
  readonly changeCents: number
  readonly operator: ">" | ">=" | "<" | "<=" | "=="
}
export const NetUSDChangeCriterion = Schema.Struct({
  type: Schema.Literal("netUSDChange").annotate({
    description: "The type of criterion to use. This should be `netUSDChange`.",
  }),
  changeCents: Schema.Number.annotate({
    description:
      "The amount of USD, in cents, that the total value of a transaction's asset transfer should be compared to.",
  }).check(Schema.isInt()),
  operator: Schema.Literals([">", ">=", "<", "<=", "=="]).annotate({
    description:
      "The operator to use for the comparison. The total value of a transaction's asset transfer will be on the left-hand side of the operator, and the `changeCents` field will be on the right-hand side.",
  }),
}).annotate({
  title: "NetUSDChangeCriterion",
  description:
    "A schema for specifying a criterion for the USD denominated asset transfer or exposure for a transaction. This includes native transfers, as well as token transfers.",
})
export type EvmNetworkCriterion = {
  readonly type: "evmNetwork"
  readonly networks: ReadonlyArray<
    | "base-sepolia"
    | "base"
    | "ethereum"
    | "ethereum-sepolia"
    | "avalanche"
    | "polygon"
    | "optimism"
    | "arbitrum"
    | "arbitrum-sepolia"
    | "zora"
    | "bnb"
    | "world"
    | "world-sepolia"
  >
  readonly operator: "in" | "not in"
}
export const EvmNetworkCriterion = Schema.Struct({
  type: Schema.Literal("evmNetwork").annotate({
    description: "The type of criterion to use. This should be `evmNetwork`.",
  }),
  networks: Schema.Array(
    Schema.Literals([
      "base-sepolia",
      "base",
      "ethereum",
      "ethereum-sepolia",
      "avalanche",
      "polygon",
      "optimism",
      "arbitrum",
      "arbitrum-sepolia",
      "zora",
      "bnb",
      "world",
      "world-sepolia",
    ]).annotate({ description: "The network the transaction is for." }),
  ).annotate({
    description: "A list of EVM network identifiers that the transaction's intended `network` should be compared to.",
  }),
  operator: Schema.Literals(["in", "not in"]).annotate({
    description:
      "The operator to use for the comparison. The transaction's intended `network` will be on the left-hand side of the operator, and the `networks` field will be on the right-hand side.",
  }),
}).annotate({
  title: "EvmNetworkCriterion",
  description: "A schema for specifying a criterion for the intended `network` of an EVM transaction.",
})
export type EvmMessageCriterion = { readonly type: "evmMessage"; readonly match: string }
export const EvmMessageCriterion = Schema.Struct({
  type: Schema.Literal("evmMessage").annotate({
    description: "The type of criterion to use. This should be `evmMessage`.",
  }),
  match: Schema.String.annotate({
    description:
      "A regular expression the message is matched against. Accepts valid regular expression syntax described by [RE2](https://github.com/google/re2/wiki/Syntax).",
  }),
}).annotate({
  title: "EvmMessageCriterion",
  description: "A schema for specifying a criterion for the message being signed.",
})
export type EvmTypedAddressCondition = {
  readonly addresses: ReadonlyArray<string>
  readonly operator: "in" | "not in"
  readonly path: string
}
export const EvmTypedAddressCondition = Schema.Struct({
  addresses: Schema.Array(
    Schema.String.annotate({
      description: "The 0x-prefixed EVM address that the value located at the message's path should be compared to.",
    }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
  ).annotate({
    description:
      "A list of 0x-prefixed EVM addresses that the value located at the message's path should be compared to. There is a limit of 300 addresses per criterion.",
  }),
  operator: Schema.Literals(["in", "not in"]).annotate({
    description:
      "The operator to use for the comparison. The value located at the message's path will be on the left-hand side of the operator, and the `addresses` field will be on the right-hand side.",
  }),
  path: Schema.String.annotate({
    description:
      "The path to the field to compare against this criterion. To reference deeply nested fields within the message, separate object keys by `.`, and access array values using `[index]`. If the field does not exist or is not an address, the operation will be rejected.",
  }),
}).annotate({
  title: "EvmTypedAddressCondition",
  description:
    "A schema for specifying criterion for an address field of an EVM typed message. The address can be deeply nested within the typed data's message.",
})
export type EvmTypedNumericalCondition = {
  readonly value: string
  readonly operator: ">" | ">=" | "<" | "<=" | "=="
  readonly path: string
}
export const EvmTypedNumericalCondition = Schema.Struct({
  value: Schema.String.annotate({
    description: "The amount that the value located at the message's path should be compared to.",
  }).check(Schema.isPattern(new RegExp("^[0-9]+$"))),
  operator: Schema.Literals([">", ">=", "<", "<=", "=="]).annotate({
    description:
      "The operator to use for the comparison. The value located at the message's path will be on the left-hand side of the operator, and the `value` field will be on the right-hand side.",
  }),
  path: Schema.String.annotate({
    description:
      "The path to the field to compare against this criterion. To reference deeply nested fields within the message, separate object keys by `.`, and access array values using `[index]`. If the field does not exist or is not an address, the operation will be rejected.",
  }),
}).annotate({
  title: "EvmTypedNumericalCondition",
  description:
    "A schema for specifying criterion for a numerical field of an EVM typed message. The value can be deeply nested within the typed data's message.",
})
export type EvmTypedStringCondition = { readonly match: string; readonly path: string }
export const EvmTypedStringCondition = Schema.Struct({
  match: Schema.String.annotate({ description: "A regular expression the field is matched against." }),
  path: Schema.String.annotate({
    description:
      "The path to the field to compare against this criterion. To reference deeply nested fields within the message, separate object keys by `.`, and access array values using `[index]`. If the field does not exist or is not an address, the operation will be rejected.",
  }),
}).annotate({
  title: "EvmTypedStringCondition",
  description:
    "A schema for specifying criterion for a string field of an EVM typed message. The value can be deeply nested within the typed data's message.",
})
export type SignEvmTypedDataVerifyingContractCriterion = {
  readonly type: "evmTypedDataVerifyingContract"
  readonly addresses: ReadonlyArray<string>
  readonly operator: "in" | "not in"
}
export const SignEvmTypedDataVerifyingContractCriterion = Schema.Struct({
  type: Schema.Literal("evmTypedDataVerifyingContract").annotate({
    description: "The type of criterion to use. This should be `evmTypedDataVerifyingContract`.",
  }),
  addresses: Schema.Array(
    Schema.String.annotate({
      description: "The 0x-prefixed EVM address that the domain's verifying contract should be compared to.",
    }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
  ).annotate({
    description:
      "A list of 0x-prefixed EVM addresses that the domain's verifying contract should be compared to. There is a limit of 300 addresses per criterion.",
  }),
  operator: Schema.Literals(["in", "not in"]).annotate({
    description:
      "The operator to use for the comparison. The domain's verifying contract will be on the left-hand side of the operator, and the `addresses` field will be on the right-hand side.",
  }),
}).annotate({
  title: "SignEvmTypedDataVerifyingContractCriterion",
  description: "A schema for specifying criterion for a domain's verifying contract.",
})
export type SolAddressCriterion = {
  readonly type: "solAddress"
  readonly addresses: ReadonlyArray<string>
  readonly operator: "in" | "not in"
}
export const SolAddressCriterion = Schema.Struct({
  type: Schema.Literal("solAddress").annotate({
    description: "The type of criterion to use. This should be `solAddress`.",
  }),
  addresses: Schema.Array(
    Schema.String.annotate({
      description:
        "The Solana address that is compared to the list of native transfer recipient addresses in the transaction's `accountKeys` (for legacy transactions) or `staticAccountKeys` (for V0 transactions) array.",
    }).check(Schema.isPattern(new RegExp("^[1-9A-HJ-NP-Za-km-z]{32,44}$"))),
  ).annotate({
    description:
      "The Solana addresses that are compared to the list of native transfer recipient addresses in the transaction's `accountKeys` (for legacy transactions) or `staticAccountKeys` (for V0 transactions) array.",
  }),
  operator: Schema.Literals(["in", "not in"]).annotate({
    description:
      "The operator to use for the comparison. Each of the native transfer recipient addresses in the transaction's `accountKeys` (for legacy transactions) or `staticAccountKeys` (for V0 transactions) array will be on the left-hand side of the operator, and the `addresses` field will be on the right-hand side.",
  }),
}).annotate({
  title: "SolAddressCriterion",
  description: "The criterion for the recipient addresses of a Solana transaction's native transfer instruction.",
})
export type SolValueCriterion = {
  readonly type: "solValue"
  readonly solValue: string
  readonly operator: ">" | ">=" | "<" | "<=" | "=="
}
export const SolValueCriterion = Schema.Struct({
  type: Schema.Literal("solValue").annotate({
    description: "The type of criterion to use. This should be `solValue`.",
  }),
  solValue: Schema.String.annotate({
    description:
      "The amount of SOL in lamports that the transaction instruction's `value` field should be compared to.",
  }),
  operator: Schema.Literals([">", ">=", "<", "<=", "=="]).annotate({
    description:
      "The operator to use for the comparison. The transaction instruction's `value` field will be on the left-hand side of the operator, and the `solValue` field will be on the right-hand side.",
  }),
}).annotate({
  title: "SolValueCriterion",
  description: "The criterion for the SOL value in lamports of a native transfer instruction in a Solana transaction.",
})
export type SplAddressCriterion = {
  readonly type: "splAddress"
  readonly addresses: ReadonlyArray<string>
  readonly operator: "in" | "not in"
}
export const SplAddressCriterion = Schema.Struct({
  type: Schema.Literal("splAddress").annotate({
    description: "The type of criterion to use. This should be `splAddress`.",
  }),
  addresses: Schema.Array(
    Schema.String.annotate({
      description:
        "The Solana address that is compared to the list of SPL token transfer recipient addresses in the transaction's `accountKeys` (for legacy transactions) or `staticAccountKeys` (for V0 transactions) array.",
    }).check(Schema.isPattern(new RegExp("^[1-9A-HJ-NP-Za-km-z]{32,44}$"))),
  ).annotate({
    description:
      "The Solana addresses that are compared to the list of SPL token transfer recipient addresses in the transaction's `accountKeys` (for legacy transactions) or `staticAccountKeys` (for V0 transactions) array.",
  }),
  operator: Schema.Literals(["in", "not in"]).annotate({
    description:
      "The operator to use for the comparison. Each of the SPL token transfer recipient addresses in the transaction's `accountKeys` (for legacy transactions) or `staticAccountKeys` (for V0 transactions) array will be on the left-hand side of the operator, and the `addresses` field will be on the right-hand side.",
  }),
}).annotate({
  title: "SplAddressCriterion",
  description: "The criterion for the recipient addresses of a Solana transaction's SPL token transfer instructions.",
})
export type SplValueCriterion = {
  readonly type: "splValue"
  readonly splValue: string
  readonly operator: ">" | ">=" | "<" | "<=" | "=="
}
export const SplValueCriterion = Schema.Struct({
  type: Schema.Literal("splValue").annotate({
    description: "The type of criterion to use. This should be `splValue`.",
  }),
  splValue: Schema.String.annotate({
    description: "The amount of the SPL token that the transaction instruction's `value` field should be compared to.",
  }),
  operator: Schema.Literals([">", ">=", "<", "<=", "=="]).annotate({
    description:
      "The operator to use for the comparison. The transaction instruction's `value` field will be on the left-hand side of the operator, and the `splValue` field will be on the right-hand side.",
  }),
}).annotate({
  title: "SplValueCriterion",
  description: "The criterion for the SPL token value of a SPL token transfer instruction in a Solana transaction.",
})
export type MintAddressCriterion = {
  readonly type: "mintAddress"
  readonly addresses: ReadonlyArray<string>
  readonly operator: "in" | "not in"
}
export const MintAddressCriterion = Schema.Struct({
  type: Schema.Literal("mintAddress").annotate({
    description: "The type of criterion to use. This should be `mintAddress`.",
  }),
  addresses: Schema.Array(
    Schema.String.annotate({
      description:
        "The Solana address that is compared to the list of token mint addresses in the transaction's `accountKeys` (for legacy transactions) or `staticAccountKeys` (for V0 transactions) array.",
    }).check(Schema.isPattern(new RegExp("^[1-9A-HJ-NP-Za-km-z]{32,44}$"))),
  ).annotate({
    description:
      "The Solana addresses that are compared to the list of token mint addresses in the transaction's `accountKeys` (for legacy transactions) or `staticAccountKeys` (for V0 transactions) array.",
  }),
  operator: Schema.Literals(["in", "not in"]).annotate({
    description:
      "The operator to use for the comparison. Each of the token mint addresses in the transaction's `accountKeys` (for legacy transactions) or `staticAccountKeys` (for V0 transactions) array will be on the left-hand side of the operator, and the `addresses` field will be on the right-hand side.",
  }),
}).annotate({
  title: "MintAddressCriterion",
  description: "The criterion for the token mint addresses of a Solana transaction's SPL token transfer instructions.",
})
export type KnownIdlType = "SystemProgram" | "TokenProgram" | "AssociatedTokenProgram"
export const KnownIdlType = Schema.Literals(["SystemProgram", "TokenProgram", "AssociatedTokenProgram"]).annotate({
  title: "KnownIdlType",
  description:
    "A reference to an established Solana program. When referencing a `KnownIdlType` within a policy rule configuring an `SolDataCriterion`, criteria will decode instruction data as documented in the programs. For more information on supported programs, see the links below.\n  - [SystemProgram](https://docs.rs/solana-program/latest/solana_program/system_instruction/enum.SystemInstruction.html).\n  - [TokenProgram](https://docs.rs/spl-token/latest/spl_token/instruction/enum.TokenInstruction.html).\n  - [AssociatedTokenProgram](https://docs.rs/spl-associated-token-account/latest/spl_associated_token_account/instruction/index.html).",
})
export type Idl = {
  readonly address: string
  readonly instructions: ReadonlyArray<{
    readonly name: string
    readonly discriminator: ReadonlyArray<number>
    readonly args: ReadonlyArray<{ readonly name: string; readonly type: string }>
    readonly accounts?: ReadonlyArray<{ readonly name: string; readonly writable?: boolean; readonly signer?: boolean }>
  }>
  readonly metadata?: { readonly name?: string; readonly version?: string; readonly spec?: string }
  readonly types?: ReadonlyArray<{}>
}
export const Idl = Schema.Struct({
  address: Schema.String.annotate({ description: "The program address." }),
  instructions: Schema.Array(
    Schema.Struct({
      name: Schema.String.annotate({ description: "The instruction name." }),
      discriminator: Schema.Array(
        Schema.Number.check(Schema.isInt())
          .check(Schema.isGreaterThanOrEqualTo(0))
          .check(Schema.isLessThanOrEqualTo(255)),
      )
        .annotate({ description: "Array of 8 numbers representing the instruction discriminator." })
        .check(Schema.isMinLength(8))
        .check(Schema.isMaxLength(8)),
      args: Schema.Array(
        Schema.Struct({
          name: Schema.String.annotate({ description: "The argument name." }),
          type: Schema.String.annotate({ description: "The argument type." }),
        }),
      ).annotate({ description: "List of instruction arguments." }),
      accounts: Schema.optionalKey(
        Schema.Array(
          Schema.Struct({
            name: Schema.String.annotate({ description: "The account name." }),
            writable: Schema.optionalKey(Schema.Boolean.annotate({ description: "Whether the account is writable." })),
            signer: Schema.optionalKey(
              Schema.Boolean.annotate({ description: "Whether the account must be a signer." }),
            ),
          }),
        ).annotate({ description: "Optional list of accounts required by the instruction." }),
      ),
    }),
  ).annotate({ description: "List of program instructions." }),
  metadata: Schema.optionalKey(
    Schema.Struct({
      name: Schema.optionalKey(Schema.String.annotate({ description: "The program name." })),
      version: Schema.optionalKey(Schema.String.annotate({ description: "The program version." })),
      spec: Schema.optionalKey(Schema.String.annotate({ description: "The IDL specification version." })),
    }).annotate({ description: "Optional metadata about the IDL." }),
  ),
  types: Schema.optionalKey(
    Schema.Array(Schema.Struct({})).annotate({
      description: "Optional type definitions for custom data structures used in the program.",
    }),
  ),
}).annotate({ description: "IDL Specification following Anchor's IDL format v0.30+." })
export type SolDataParameterCondition = {
  readonly name: string
  readonly operator: ">" | ">=" | "<" | "<=" | "=="
  readonly value: string
}
export const SolDataParameterCondition = Schema.Struct({
  name: Schema.String.annotate({ description: "The parameter name." }),
  operator: Schema.Literals([">", ">=", "<", "<=", "=="]).annotate({
    description:
      "The operator to use for the comparison. The value resolved at the `name` will be on the left-hand side of the operator, and the `value` field will be on the right-hand side.",
  }),
  value: Schema.String.annotate({ description: "The value to compare against." }),
}).annotate({
  title: "SolDataParameterCondition",
  description: "A single parameter condition to apply against a specific instruction's parameters.",
})
export type SolDataParameterConditionList = {
  readonly name: string
  readonly operator: "in" | "not in"
  readonly values: ReadonlyArray<string>
}
export const SolDataParameterConditionList = Schema.Struct({
  name: Schema.String.annotate({ description: "The parameter name." }),
  operator: Schema.Literals(["in", "not in"]).annotate({
    description:
      "The operator to use for the comparison. The value resolved at the `name` will be on the left-hand side of the operator, and the `value` field will be on the right-hand side.",
  }),
  values: Schema.Array(
    Schema.String.annotate({ description: "A single potential value to compare against the resolved `name` value." }),
  ).annotate({ description: "The values to compare against." }),
}).annotate({
  title: "SolDataParameterConditionList",
  description: "A single parameter condition to apply against a specific instruction's parameters.",
})
export type ProgramIdCriterion = {
  readonly type: "programId"
  readonly programIds: ReadonlyArray<string>
  readonly operator: "in" | "not in"
}
export const ProgramIdCriterion = Schema.Struct({
  type: Schema.Literal("programId").annotate({
    description: "The type of criterion to use. This should be `programId`.",
  }),
  programIds: Schema.Array(
    Schema.String.annotate({
      description:
        "The Solana program ID that is compared to the list of program IDs in the transaction's instructions.",
    }).check(Schema.isPattern(new RegExp("^[1-9A-HJ-NP-Za-km-z]{32,44}$"))),
  ).annotate({
    description:
      "The Solana program IDs that are compared to the list of program IDs in the transaction's instructions.",
  }),
  operator: Schema.Literals(["in", "not in"]).annotate({
    description:
      "The operator to use for the comparison. Each of the program IDs in the transaction's instructions will be on the left-hand side of the operator, and the `programIds` field will be on the right-hand side.",
  }),
}).annotate({
  title: "ProgramIdCriterion",
  description: "The criterion for the program IDs of a Solana transaction's instructions.",
})
export type SolNetworkCriterion = {
  readonly type: "solNetwork"
  readonly networks: ReadonlyArray<"solana-devnet" | "solana">
  readonly operator: "in" | "not in"
}
export const SolNetworkCriterion = Schema.Struct({
  type: Schema.Literal("solNetwork").annotate({
    description: "The type of criterion to use. This should be `solNetwork`.",
  }),
  networks: Schema.Array(
    Schema.Literals(["solana-devnet", "solana"]).annotate({
      description: "The Solana network the transaction is for.",
    }),
  ).annotate({ description: "The Solana networks that the transaction's intended network should be compared to." }),
  operator: Schema.Literals(["in", "not in"]).annotate({
    description:
      "The operator to use for the comparison. The transaction's intended network will be on the left-hand side of the operator, and the `networks` field will be on the right-hand side.",
  }),
}).annotate({ title: "SolNetworkCriterion", description: "The criterion for the Solana network of a transaction." })
export type SolMessageCriterion = { readonly type: "solMessage"; readonly match: string }
export const SolMessageCriterion = Schema.Struct({
  type: Schema.Literal("solMessage").annotate({
    description: "The type of criterion to use. This should be `solMessage`.",
  }),
  match: Schema.String.annotate({ description: "A regular expression the field is matched against." }),
}).annotate({ title: "SolMessageCriterion", description: "The criterion for the message of a Solana transaction." })
export type SolanaAccount = {
  readonly address: string
  readonly name?: string
  readonly policies?: ReadonlyArray<string>
  readonly createdAt?: string
  readonly updatedAt?: string
}
export const SolanaAccount = Schema.Struct({
  address: Schema.String.annotate({ description: "The base58 encoded Solana address." }).check(
    Schema.isPattern(new RegExp("^[1-9A-HJ-NP-Za-km-z]{32,44}$")),
  ),
  name: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "An optional name for the account.\nAccount names can consist of alphanumeric characters and hyphens, and be between 2 and 36 characters long.\nAccount names are guaranteed to be unique across all Solana accounts in the developer's CDP Project.",
    }).check(Schema.isPattern(new RegExp("^[A-Za-z0-9][A-Za-z0-9-]{0,34}[A-Za-z0-9]$"))),
  ),
  policies: Schema.optionalKey(
    Schema.Array(
      Schema.String.check(
        Schema.isPattern(new RegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")),
      ),
    ).annotate({
      description:
        "The list of policy IDs that apply to the account. This will include both the project-level policy and the account-level policy, if one exists.",
    }),
  ),
  createdAt: Schema.optionalKey(
    Schema.String.annotate({
      description: "The ISO 8601 UTC timestamp at which the account was created.",
      format: "date-time",
    }),
  ),
  updatedAt: Schema.optionalKey(
    Schema.String.annotate({
      description: "The ISO 8601 UTC timestamp at which the account was last updated.",
      format: "date-time",
    }),
  ),
})
export type SolanaTokenAmount = { readonly amount: string; readonly decimals: number }
export const SolanaTokenAmount = Schema.Struct({
  amount: Schema.String.annotate({
    description:
      "The amount is denominated in the smallest indivisible unit of the token. For SOL, the smallest indivisible unit is lamports (10^-9 SOL). For SPL tokens, the smallest unit is defined by the token's decimals configuration.",
  }).check(Schema.isPattern(new RegExp("^[0-9]+$"))),
  decimals: Schema.Number.annotate({
    description:
      "'decimals' is the exponential value N that satisfies the equation `amount * 10^-N = standard_denomination`. The standard denomination is the most commonly used denomination for the token.\n- For native SOL, `decimals` is 9 (1 SOL = 10^9 lamports). - For SPL tokens, `decimals` is defined in the token's mint configuration.",
    format: "int64",
  }).check(Schema.isInt()),
}).annotate({ description: "Amount of a given Solana token." })
export type SolanaToken = { readonly symbol?: string; readonly name?: string; readonly mintAddress: string }
export const SolanaToken = Schema.Struct({
  symbol: Schema.optionalKey(
    Schema.String.annotate({
      description:
        'The symbol of this token (ex: SOL, USDC, RAY).\nThe token symbol is not unique. It is possible for two different tokens to have the same symbol.\nFor the native SOL token, this symbol is "SOL". For SPL tokens, this symbol is defined in the token\'s metadata.\nNot all tokens have a symbol. This field will only be populated when the token has metadata available.',
    }),
  ),
  name: Schema.optionalKey(
    Schema.String.annotate({
      description:
        'The name of this token (ex: "Solana", "USD Coin", "Raydium").\nThe token name is not unique. It is possible for two different tokens to have the same name.\nFor the native SOL token, this name is "Solana". For SPL tokens, this name is defined in the token\'s metadata.\nNot all tokens have a name. This field will only be populated when the token has metadata available.',
    }),
  ),
  mintAddress: Schema.String.annotate({
    description:
      "The mint address of the token.\nFor native SOL, the mint address is `So11111111111111111111111111111111111111111`. For SPL tokens, this is the mint address where the token is defined.",
  }).check(Schema.isPattern(new RegExp("^[1-9A-HJ-NP-Za-km-z]{32,44}$"))),
}).annotate({
  description:
    "General information about a Solana token. Includes the mint address, and other identifying information.",
})
export type OnchainDataQuery = { readonly sql: string; readonly cache?: { readonly maxAgeMs?: number } }
export const OnchainDataQuery = Schema.Struct({
  sql: Schema.String.annotate({ description: "SQL query to execute against the indexed blockchain data." })
    .check(Schema.isMinLength(1))
    .check(Schema.isMaxLength(100000)),
  cache: Schema.optionalKey(
    Schema.Struct({
      maxAgeMs: Schema.optionalKey(
        Schema.Number.annotate({
          description:
            "The maximum tolerable staleness of the query result cache in milliseconds. If a previous execution result of an identical query is older than this age, the query will be re-executed. If the data is less than this age, the result will be returned from cache.",
          default: 500,
        })
          .check(Schema.isInt())
          .check(Schema.isGreaterThanOrEqualTo(500))
          .check(Schema.isLessThanOrEqualTo(900000)),
      ),
    }).annotate({
      title: "Query result cache configuration",
      description:
        "Enables control over how often queries need to be fully re-executed on the backing store.\nThis can be useful in scenarios where API calls might be made frequently, API latency is critical, and some freshness lag (ex: 750ms, 2s, 5s) is tolerable.\nBy default, each query result is returned from cache so long as the result is from an identical query and less than 500ms old. This freshness tolerance can be modified upwards, to a maximum of 900000ms (i.e. 900s, 15m).\n",
    }),
  ),
}).annotate({ description: "Request to execute a SQL query against indexed blockchain data." })
export type OnchainDataResult = {
  readonly result?: ReadonlyArray<{ readonly [x: string]: unknown }>
  readonly schema?: {
    readonly columns?: ReadonlyArray<{
      readonly name?: string
      readonly type?:
        | "String"
        | "UInt8"
        | "UInt16"
        | "UInt32"
        | "UInt64"
        | "UInt128"
        | "UInt256"
        | "Int8"
        | "Int16"
        | "Int32"
        | "Int64"
        | "Int128"
        | "Int256"
        | "Float32"
        | "Float64"
        | "Bool"
        | "Date"
        | "DateTime"
        | "DateTime64"
        | "UUID"
    }>
  }
  readonly metadata?: {
    readonly cached?: boolean
    readonly executionTimestamp?: string
    readonly executionTimeMs?: number
    readonly rowCount?: number
  }
}
export const OnchainDataResult = Schema.Struct({
  result: Schema.optionalKey(
    Schema.Array(
      Schema.Record(Schema.String, Schema.Unknown).annotate({ description: "Row data with column names as keys." }),
    ).annotate({ description: "Query result as an array of objects representing rows." }),
  ),
  schema: Schema.optionalKey(
    Schema.Struct({
      columns: Schema.optionalKey(
        Schema.Array(
          Schema.Struct({
            name: Schema.optionalKey(Schema.String.annotate({ description: "Column name." })),
            type: Schema.optionalKey(
              Schema.Literals([
                "String",
                "UInt8",
                "UInt16",
                "UInt32",
                "UInt64",
                "UInt128",
                "UInt256",
                "Int8",
                "Int16",
                "Int32",
                "Int64",
                "Int128",
                "Int256",
                "Float32",
                "Float64",
                "Bool",
                "Date",
                "DateTime",
                "DateTime64",
                "UUID",
              ]).annotate({ description: "Column data type (ClickHouse types)." }),
            ),
          }),
        ).annotate({ description: "Column definitions." }),
      ),
    }).annotate({
      description:
        "Schema information for the query result. This is a derived schema from the query result, so types may not match the underlying table.\n",
    }),
  ),
  metadata: Schema.optionalKey(
    Schema.Struct({
      cached: Schema.optionalKey(
        Schema.Boolean.annotate({ description: "Whether the result was served from the query result cache." }),
      ),
      executionTimestamp: Schema.optionalKey(
        Schema.String.annotate({
          description: "When the query result was executed against the backing store in RFC 3339 format.",
          format: "date-time",
        }),
      ),
      executionTimeMs: Schema.optionalKey(
        Schema.Number.annotate({ description: "Query execution time in milliseconds." }).check(Schema.isInt()),
      ),
      rowCount: Schema.optionalKey(
        Schema.Number.annotate({ description: "Number of rows returned." }).check(Schema.isInt()),
      ),
    }).annotate({ description: "Metadata about query execution." }),
  ),
}).annotate({ description: "Result of executing a SQL query." })
export type OnchainDataColumnSchema = {
  readonly name?: string
  readonly type?: string
  readonly nullable?: boolean
  readonly description?: string
  readonly indexOrder?: number
}
export const OnchainDataColumnSchema = Schema.Struct({
  name: Schema.optionalKey(Schema.String.annotate({ description: "Column name." })),
  type: Schema.optionalKey(Schema.String.annotate({ description: "Column data type." })),
  nullable: Schema.optionalKey(
    Schema.Boolean.annotate({ description: "Whether this column can contain NULL values." }),
  ),
  description: Schema.optionalKey(
    Schema.String.annotate({ description: "A human-readable description." })
      .check(Schema.isMinLength(0))
      .check(Schema.isMaxLength(500)),
  ),
  indexOrder: Schema.optionalKey(
    Schema.Number.annotate({
      description:
        "The order of the column in the index. A lower number means the column is more important for the index and should be first in the query.",
    }).check(Schema.isInt()),
  ),
}).annotate({ description: "Schema definition for a table column." })
export type AccountTokenAddressesResponse = {
  readonly accountAddress?: string
  readonly tokenAddresses?: ReadonlyArray<string>
  readonly totalCount?: number
}
export const AccountTokenAddressesResponse = Schema.Struct({
  accountAddress: Schema.optionalKey(Schema.String.annotate({ description: "The account address that was queried." })),
  tokenAddresses: Schema.optionalKey(
    Schema.Array(
      Schema.String.annotate({ description: "Token contract address." }).check(
        Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$")),
      ),
    ).annotate({ description: "List of token contract addresses that the account has received." }),
  ),
  totalCount: Schema.optionalKey(
    Schema.Number.annotate({ description: "Total number of unique token addresses discovered." })
      .check(Schema.isInt())
      .check(Schema.isGreaterThanOrEqualTo(0)),
  ),
}).annotate({ description: "Response containing token addresses that an account has received." })
export type WebhookTarget = { readonly url: string; readonly headers?: { readonly [x: string]: string } }
export const WebhookTarget = Schema.Struct({
  url: Schema.String.annotate({ description: "A valid HTTP or HTTPS URL.", format: "uri" })
    .check(Schema.isMinLength(11))
    .check(Schema.isMaxLength(2048))
    .check(Schema.isPattern(new RegExp("^https?:\\/\\/.*$"))),
  headers: Schema.optionalKey(
    Schema.Record(Schema.String, Schema.String).annotate({
      description: "Additional headers to include in webhook requests.",
    }),
  ),
}).annotate({
  description:
    "Target configuration for webhook delivery.\nSpecifies the destination URL and any custom headers to include in webhook requests.\n",
})
export type WebhookEventResponseDetail = {
  readonly httpCode?: number
  readonly elapsedTimeMs?: number
  readonly body?: string
  readonly errorName?: string
}
export const WebhookEventResponseDetail = Schema.Struct({
  httpCode: Schema.optionalKey(
    Schema.Number.annotate({ description: "HTTP status code returned by the webhook target." }).check(Schema.isInt()),
  ),
  elapsedTimeMs: Schema.optionalKey(
    Schema.Number.annotate({ description: "Round-trip time of the webhook delivery in milliseconds." }).check(
      Schema.isInt(),
    ),
  ),
  body: Schema.optionalKey(Schema.String.annotate({ description: "Response body returned by the webhook target." })),
  errorName: Schema.optionalKey(
    Schema.String.annotate({ description: "Error name if the delivery failed (e.g., timeout, connection_refused)." }),
  ),
}).annotate({ description: "Details of the HTTP response received from the webhook target." })
export type X402Version = 1 | 2
export const X402Version = Schema.Literals([1, 2]).annotate({ description: "The version of the x402 protocol." })
export type X402BatchSettlementChannelConfig = {
  readonly payer: string
  readonly payerAuthorizer: string
  readonly receiver: string
  readonly receiverAuthorizer: string
  readonly token: string
  readonly withdrawDelay: number
  readonly salt: string
}
export const X402BatchSettlementChannelConfig = Schema.Struct({
  payer: Schema.String.annotate({
    description: "The 0x-prefixed, checksum EVM address of the payer (channel funder).",
  }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
  payerAuthorizer: Schema.String.annotate({
    description: "The 0x-prefixed, checksum EVM address authorized to sign vouchers on behalf of the payer.",
  }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
  receiver: Schema.String.annotate({
    description: "The 0x-prefixed, checksum EVM address of the receiver (resource server / merchant).",
  }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
  receiverAuthorizer: Schema.String.annotate({
    description:
      "The 0x-prefixed, checksum EVM address authorized to sign claim batches on behalf of the receiver (typically the facilitator).",
  }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
  token: Schema.String.annotate({
    description: "The 0x-prefixed, checksum EVM address of the ERC-20 payment token.",
  }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
  withdrawDelay: Schema.Number.annotate({
    description:
      "The non-cooperative withdraw delay in seconds. Must be between 900 (15 minutes) and 2,592,000 (30 days).",
  })
    .check(Schema.isInt())
    .check(Schema.isGreaterThanOrEqualTo(900))
    .check(Schema.isLessThanOrEqualTo(2592000)),
  salt: Schema.String.annotate({
    description: "A 32-byte salt used to differentiate channels between the same payer/receiver pair.",
  }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{64}$"))),
}).annotate({
  title: "x402BatchSettlementChannelConfig",
  description:
    "Immutable configuration for an x402 batch-settlement payment channel. The EIP-712 hash of this struct produces the `channelId` used by all batch-settlement payloads.",
})
export type X402BatchSettlementVoucher = {
  readonly channelId: string
  readonly maxClaimableAmount: string
  readonly signature: string
}
export const X402BatchSettlementVoucher = Schema.Struct({
  channelId: Schema.String.annotate({
    description: "The 32-byte EIP-712 hash of the `channelConfig` for this voucher's channel.",
  }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{64}$"))),
  maxClaimableAmount: Schema.String.annotate({
    description:
      "The cumulative maximum amount (uint128 as decimal string) the receiver is authorized to claim from this channel as of this voucher.",
  }).check(Schema.isPattern(new RegExp("^[0-9]+$"))),
  signature: Schema.String.annotate({
    description: "The EIP-712 hex-encoded signature of the voucher by `payerAuthorizer`.",
  }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]+$"))),
}).annotate({
  title: "x402BatchSettlementVoucher",
  description:
    "A signed cumulative-ceiling voucher for an x402 batch-settlement channel. `maxClaimableAmount` is monotonically increasing across requests in the same channel; the receiver may claim any amount up to this ceiling.",
})
export type X402V2PaymentRequirements = {
  readonly scheme: "exact" | "upto" | "batch-settlement"
  readonly network:
    | "eip155:8453"
    | "eip155:84532"
    | "eip155:137"
    | "eip155:42161"
    | "eip155:480"
    | "eip155:4801"
    | "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"
    | "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1"
  readonly asset: string
  readonly amount: string
  readonly payTo: string
  readonly maxTimeoutSeconds: number
  readonly extra?: { readonly [x: string]: unknown }
}
export const X402V2PaymentRequirements = Schema.Struct({
  scheme: Schema.Literals(["exact", "upto", "batch-settlement"]).annotate({
    description:
      "The scheme of the payment protocol to use. Supported schemes are `exact`, `upto`, and `batch-settlement`.",
  }),
  network: Schema.Literals([
    "eip155:8453",
    "eip155:84532",
    "eip155:137",
    "eip155:42161",
    "eip155:480",
    "eip155:4801",
    "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
    "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
  ]).annotate({
    description:
      "The x402 v2 network identifier in CAIP-2 format. x402 v2 identifies networks by their CAIP-2 chain ID (e.g. `eip155:<chainId>` for EVM networks, `solana:<genesisHash>` for Solana). Supported networks: Base, Polygon, Arbitrum One, World Chain (EVM), and Solana.",
  }),
  asset: Schema.String.annotate({
    description: "A blockchain address. Format varies by network (e.g., 0x-prefixed for EVM, base58 for Solana).",
  })
    .check(Schema.isMinLength(1))
    .check(Schema.isMaxLength(128)),
  amount: Schema.String.annotate({
    description: "The amount to pay for the resource in atomic units of the payment asset.",
  }),
  payTo: Schema.String.annotate({
    description: "A blockchain address. Format varies by network (e.g., 0x-prefixed for EVM, base58 for Solana).",
  })
    .check(Schema.isMinLength(1))
    .check(Schema.isMaxLength(128)),
  maxTimeoutSeconds: Schema.Number.annotate({
    description: "The maximum time in seconds for the resource server to respond.",
  }).check(Schema.isInt()),
  extra: Schema.optionalKey(
    Schema.Record(Schema.String, Schema.Unknown).annotate({
      description: "The optional additional scheme-specific payment info.",
    }),
  ),
}).annotate({
  title: "x402V2PaymentRequirements",
  description:
    "The x402 v2 payment requirements. Uses CAIP-2 network identifiers and supports `exact`, `upto`, and `batch-settlement` schemes. Carries only the payment fields (no resource metadata — that is in the enclosing `x402V2PaymentPayload.resource`).",
})
export type X402ResourceInfo = { readonly url?: string; readonly description?: string; readonly mimeType?: string }
export const X402ResourceInfo = Schema.Struct({
  url: Schema.optionalKey(Schema.String.annotate({ description: "The URL of the resource." })),
  description: Schema.optionalKey(
    Schema.String.annotate({ description: "A human-readable description." })
      .check(Schema.isMinLength(0))
      .check(Schema.isMaxLength(500)),
  ),
  mimeType: Schema.optionalKey(Schema.String.annotate({ description: "The MIME type of the resource response." })),
}).annotate({ description: "Describes the resource being accessed in x402 protocol." })
export type X402PaymentRequirements =
  | {
      readonly scheme: "exact" | "upto" | "batch-settlement"
      readonly network:
        | "eip155:8453"
        | "eip155:84532"
        | "eip155:137"
        | "eip155:42161"
        | "eip155:480"
        | "eip155:4801"
        | "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"
        | "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1"
      readonly asset: string
      readonly amount: string
      readonly payTo: string
      readonly maxTimeoutSeconds: number
      readonly extra?: { readonly [x: string]: unknown }
    }
  | {
      readonly scheme: "exact"
      readonly network: "base" | "base-sepolia" | "solana" | "solana-devnet"
      readonly maxAmountRequired: string
      readonly resource: string
      readonly description: string
      readonly mimeType: string
      readonly outputSchema?: { readonly [x: string]: unknown }
      readonly payTo: string
      readonly maxTimeoutSeconds: number
      readonly asset: string
      readonly extra?: { readonly [x: string]: unknown }
    }
export const X402PaymentRequirements = Schema.Union(
  [
    Schema.Struct({
      scheme: Schema.Literals(["exact", "upto", "batch-settlement"]).annotate({
        description:
          "The scheme of the payment protocol to use. Supported schemes are `exact`, `upto`, and `batch-settlement`.",
      }),
      network: Schema.Literals([
        "eip155:8453",
        "eip155:84532",
        "eip155:137",
        "eip155:42161",
        "eip155:480",
        "eip155:4801",
        "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
        "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
      ]).annotate({
        description:
          "The x402 v2 network identifier in CAIP-2 format. x402 v2 identifies networks by their CAIP-2 chain ID (e.g. `eip155:<chainId>` for EVM networks, `solana:<genesisHash>` for Solana). Supported networks: Base, Polygon, Arbitrum One, World Chain (EVM), and Solana.",
      }),
      asset: Schema.String.annotate({
        description: "A blockchain address. Format varies by network (e.g., 0x-prefixed for EVM, base58 for Solana).",
      })
        .check(Schema.isMinLength(1))
        .check(Schema.isMaxLength(128)),
      amount: Schema.String.annotate({
        description: "The amount to pay for the resource in atomic units of the payment asset.",
      }),
      payTo: Schema.String.annotate({
        description: "A blockchain address. Format varies by network (e.g., 0x-prefixed for EVM, base58 for Solana).",
      })
        .check(Schema.isMinLength(1))
        .check(Schema.isMaxLength(128)),
      maxTimeoutSeconds: Schema.Number.annotate({
        description: "The maximum time in seconds for the resource server to respond.",
      }).check(Schema.isInt()),
      extra: Schema.optionalKey(
        Schema.Record(Schema.String, Schema.Unknown).annotate({
          description: "The optional additional scheme-specific payment info.",
        }),
      ),
    }).annotate({
      title: "x402V2PaymentRequirements",
      description:
        "The x402 protocol payment requirements that the resource server expects the client's payment payload to meet.",
    }),
    Schema.Struct({
      scheme: Schema.Literal("exact").annotate({
        description: "The scheme of the payment protocol to use. Currently, the only supported scheme is `exact`.",
      }),
      network: Schema.Literals(["base", "base-sepolia", "solana", "solana-devnet"]).annotate({
        description:
          "The x402 v1 network identifier. x402 v1 uses human-readable network names. Supported networks: Base mainnet and testnet, Solana mainnet and devnet.",
      }),
      maxAmountRequired: Schema.String.annotate({
        description: "The maximum amount required to pay for the resource in atomic units of the payment asset.",
      }),
      resource: Schema.String.annotate({ description: "The URL of the resource to pay for." }),
      description: Schema.String.annotate({ description: "A human-readable description." })
        .check(Schema.isMinLength(0))
        .check(Schema.isMaxLength(500)),
      mimeType: Schema.String.annotate({ description: "The MIME type of the resource response." }),
      outputSchema: Schema.optionalKey(
        Schema.Record(Schema.String, Schema.Unknown).annotate({
          description: "The optional JSON schema describing the resource output.",
        }),
      ),
      payTo: Schema.String.annotate({
        description: "A blockchain address. Format varies by network (e.g., 0x-prefixed for EVM, base58 for Solana).",
      })
        .check(Schema.isMinLength(1))
        .check(Schema.isMaxLength(128)),
      maxTimeoutSeconds: Schema.Number.annotate({
        description: "The maximum time in seconds for the resource server to respond.",
      }).check(Schema.isInt()),
      asset: Schema.String.annotate({
        description: "A blockchain address. Format varies by network (e.g., 0x-prefixed for EVM, base58 for Solana).",
      })
        .check(Schema.isMinLength(1))
        .check(Schema.isMaxLength(128)),
      extra: Schema.optionalKey(
        Schema.Record(Schema.String, Schema.Unknown).annotate({
          description: "The optional additional scheme-specific payment info.",
        }),
      ),
    }).annotate({
      title: "x402V1PaymentRequirements",
      description:
        "The x402 protocol payment requirements that the resource server expects the client's payment payload to meet.",
    }),
  ],
  { mode: "oneOf" },
)
export type X402VerifyInvalidReason =
  | "insufficient_funds"
  | "invalid_scheme"
  | "invalid_network"
  | "invalid_x402_version"
  | "invalid_payment_requirements"
  | "invalid_payload"
  | "invalid_exact_evm_payload_authorization_value"
  | "invalid_exact_evm_payload_authorization_value_too_low"
  | "invalid_exact_evm_payload_authorization_valid_after"
  | "invalid_exact_evm_payload_authorization_valid_before"
  | "invalid_exact_evm_payload_authorization_typed_data_message"
  | "invalid_exact_evm_payload_authorization_from_address_kyt"
  | "invalid_exact_evm_payload_authorization_to_address_kyt"
  | "invalid_exact_evm_payload_signature"
  | "invalid_exact_evm_payload_signature_address"
  | "invalid_exact_evm_permit2_payload_allowance_required"
  | "invalid_exact_evm_permit2_payload_signature"
  | "invalid_exact_evm_permit2_payload_deadline"
  | "invalid_exact_evm_permit2_payload_valid_after"
  | "invalid_exact_evm_permit2_payload_spender"
  | "invalid_exact_evm_permit2_payload_recipient"
  | "invalid_exact_evm_permit2_payload_amount"
  | "invalid_exact_svm_payload_transaction"
  | "invalid_exact_svm_payload_transaction_amount_mismatch"
  | "invalid_exact_svm_payload_transaction_create_ata_instruction"
  | "invalid_exact_svm_payload_transaction_create_ata_instruction_incorrect_payee"
  | "invalid_exact_svm_payload_transaction_create_ata_instruction_incorrect_asset"
  | "invalid_exact_svm_payload_transaction_instructions"
  | "invalid_exact_svm_payload_transaction_instructions_length"
  | "invalid_exact_svm_payload_transaction_instructions_compute_limit_instruction"
  | "invalid_exact_svm_payload_transaction_instructions_compute_price_instruction"
  | "invalid_exact_svm_payload_transaction_instructions_compute_price_instruction_too_high"
  | "invalid_exact_svm_payload_transaction_instruction_not_spl_token_transfer_checked"
  | "invalid_exact_svm_payload_transaction_instruction_not_token_2022_transfer_checked"
  | "invalid_exact_svm_payload_transaction_not_a_transfer_instruction"
  | "invalid_exact_svm_payload_transaction_cannot_derive_receiver_ata"
  | "invalid_exact_svm_payload_transaction_receiver_ata_not_found"
  | "invalid_exact_svm_payload_transaction_sender_ata_not_found"
  | "invalid_exact_svm_payload_transaction_simulation_failed"
  | "invalid_exact_svm_payload_transaction_transfer_to_incorrect_ata"
  | "invalid_exact_svm_payload_transaction_fee_payer_included_in_instruction_accounts"
  | "invalid_exact_svm_payload_transaction_fee_payer_transferring_funds"
  | "invalid_batch_settlement_evm_scheme"
  | "invalid_batch_settlement_evm_network_mismatch"
  | "invalid_batch_settlement_evm_payload_type"
  | "invalid_batch_settlement_evm_channel_not_found"
  | "invalid_batch_settlement_evm_deposit_simulation_failed"
  | "invalid_batch_settlement_evm_channel_id_mismatch"
  | "invalid_batch_settlement_evm_channel_state_read_failed"
  | "invalid_batch_settlement_evm_cumulative_below_claimed"
  | "invalid_batch_settlement_evm_cumulative_exceeds_balance"
  | "invalid_batch_settlement_evm_eip2612_amount_mismatch"
  | "invalid_batch_settlement_evm_eip2612_asset_mismatch"
  | "invalid_batch_settlement_evm_eip2612_deadline_expired"
  | "invalid_batch_settlement_evm_eip2612_invalid_format"
  | "invalid_batch_settlement_evm_eip2612_invalid_signature"
  | "invalid_batch_settlement_evm_eip2612_owner_mismatch"
  | "invalid_batch_settlement_evm_eip2612_spender_mismatch"
  | "invalid_batch_settlement_evm_erc20_approval_asset_mismatch"
  | "invalid_batch_settlement_evm_erc20_approval_from_mismatch"
  | "invalid_batch_settlement_evm_erc20_approval_invalid_format"
  | "invalid_batch_settlement_evm_erc20_approval_unavailable"
  | "invalid_batch_settlement_evm_erc20_approval_wrong_spender"
  | "invalid_batch_settlement_evm_erc3009_authorization_required"
  | "invalid_batch_settlement_evm_insufficient_balance"
  | "invalid_batch_settlement_evm_deposit_payload"
  | "invalid_batch_settlement_evm_receive_authorization_signature"
  | "invalid_batch_settlement_evm_refund_payload"
  | "invalid_batch_settlement_evm_voucher_payload"
  | "invalid_batch_settlement_evm_voucher_signature"
  | "invalid_batch_settlement_evm_missing_eip712_domain"
  | "invalid_batch_settlement_evm_payload_authorization_valid_after"
  | "invalid_batch_settlement_evm_payload_authorization_valid_before"
  | "invalid_batch_settlement_evm_permit2_allowance_required"
  | "invalid_batch_settlement_evm_permit2_amount_mismatch"
  | "invalid_batch_settlement_evm_permit2_authorization_required"
  | "invalid_batch_settlement_evm_permit2_deadline_expired"
  | "invalid_batch_settlement_evm_permit2_invalid_signature"
  | "invalid_batch_settlement_evm_permit2_invalid_spender"
  | "invalid_batch_settlement_evm_receiver_authorizer_mismatch"
  | "invalid_batch_settlement_evm_receiver_mismatch"
  | "invalid_batch_settlement_evm_rpc_read_failed"
  | "invalid_batch_settlement_evm_token_mismatch"
  | "invalid_batch_settlement_evm_withdraw_delay_mismatch"
  | "invalid_batch_settlement_evm_withdraw_delay_out_of_range"
  | "invalid_exact_evm_scheme"
  | "invalid_exact_evm_network_mismatch"
  | "invalid_exact_evm_payload"
  | "invalid_exact_evm_payload_missing_signature"
  | "invalid_exact_evm_failed_to_get_network_config"
  | "invalid_exact_evm_missing_eip712_domain"
  | "invalid_exact_evm_recipient_mismatch"
  | "invalid_exact_evm_authorization_value"
  | "invalid_exact_evm_required_amount"
  | "invalid_exact_evm_payload_authorization_value_mismatch"
  | "invalid_exact_evm_failed_to_check_nonce"
  | "invalid_exact_evm_nonce_already_used"
  | "invalid_exact_evm_failed_to_get_balance"
  | "invalid_exact_evm_insufficient_balance"
  | "invalid_exact_evm_signature_format"
  | "invalid_exact_evm_failed_to_verify_signature"
  | "invalid_exact_evm_signature"
  | "invalid_exact_evm_token_name_mismatch"
  | "invalid_exact_evm_token_version_mismatch"
  | "invalid_exact_evm_eip3009_not_supported"
  | "invalid_exact_evm_transaction_simulation_failed"
  | "invalid_exact_evm_verification_failed"
  | "invalid_exact_evm_failed_to_parse_signature"
  | "invalid_exact_evm_failed_to_check_deployment"
  | "invalid_exact_evm_failed_to_execute_transfer"
  | "invalid_exact_evm_failed_to_get_receipt"
  | "invalid_exact_evm_transaction_failed"
  | "invalid_exact_evm_payload_undeployed_smart_wallet"
  | "smart_wallet_deployment_failed"
  | "unsupported_payload_type"
  | "invalid_erc20_approval_extension_format"
  | "erc20_approval_tx_failed"
  | "erc20_approval_from_mismatch"
  | "erc20_approval_asset_mismatch"
  | "erc20_approval_spender_not_permit2"
  | "erc20_approval_tx_parse_failed"
  | "erc20_approval_tx_wrong_target"
  | "erc20_approval_tx_wrong_selector"
  | "erc20_approval_tx_wrong_spender"
  | "erc20_approval_tx_signer_mismatch"
  | "erc20_approval_tx_invalid_signature"
  | "invalid_exact_evm_unsupported_scheme"
  | "invalid_exact_evm_extra_field"
  | "invalid_exact_evm_payload_recipient_mismatch"
  | "invalid_exact_evm_insufficient_funds"
  | "invalid_exact_evm_transaction_state"
  | "invalid_permit2_spender"
  | "invalid_permit2_recipient_mismatch"
  | "permit2_deadline_expired"
  | "permit2_not_yet_valid"
  | "permit2_amount_mismatch"
  | "permit2_token_mismatch"
  | "invalid_permit2_signature"
  | "permit2_allowance_required"
  | "permit2_invalid_amount"
  | "permit2_invalid_destination"
  | "permit2_invalid_owner"
  | "permit2_payment_too_early"
  | "permit2_invalid_nonce"
  | "permit2_2612_amount_mismatch"
  | "permit2_simulation_failed"
  | "permit2_insufficient_balance"
  | "permit2_proxy_not_deployed"
  | "erc20_approval_insufficient_eth_for_gas"
  | "erc20_approval_broadcast_failed"
  | "invalid_exact_solana_unsupported_scheme"
  | "invalid_exact_solana_network_mismatch"
  | "invalid_exact_solana_payload_missing_fee_payer"
  | "invalid_exact_solana_fee_payer_not_managed_by_facilitator"
  | "invalid_exact_solana_payload_transaction"
  | "invalid_exact_solana_payload_transaction_could_not_be_decoded"
  | "invalid_exact_solana_payload_transaction_instructions_length"
  | "invalid_exact_solana_payload_unknown_fourth_instruction"
  | "invalid_exact_solana_payload_unknown_fifth_instruction"
  | "invalid_exact_solana_payload_unknown_sixth_instruction"
  | "invalid_exact_solana_payload_transaction_instructions_compute_limit_instruction"
  | "invalid_exact_solana_payload_transaction_instructions_compute_price_instruction"
  | "invalid_exact_solana_payload_transaction_instructions_compute_price_instruction_too_high"
  | "invalid_exact_solana_payload_no_transfer_instruction"
  | "invalid_exact_solana_payload_transaction_fee_payer_transferring_funds"
  | "invalid_exact_solana_payload_mint_mismatch"
  | "invalid_exact_solana_payload_recipient_mismatch"
  | "invalid_exact_solana_payload_amount_insufficient"
  | "invalid_exact_solana_invalid_fee_payer"
  | "invalid_exact_solana_transaction_signing_failed"
  | "invalid_exact_solana_transaction_simulation_failed"
  | "invalid_exact_solana_payload_memo_mismatch"
  | "invalid_exact_solana_payload_memo_count"
  | "invalid_exact_solana_verification_failed"
  | "invalid_exact_solana_fee_payer_mismatch"
  | "invalid_exact_solana_transaction_failed"
  | "invalid_exact_solana_transaction_confirmation_failed"
  | "duplicate_settlement"
  | "invalid_exact_solana_extra_field"
  | "batch_settlement_cumulative_amount_mismatch"
  | "batch_settlement_channel_busy"
  | "missing_batch_settlement_channel"
  | "batch_settlement_charge_exceeds_signed_cumulative"
  | "batch_settlement_refund_no_balance"
  | "batch_settlement_refund_amount_invalid"
  | "batch_settlement_refund_amount_exceeds_balance"
  | "amount_too_low"
  | "invalid_amount"
  | "kyt_risk_detected"
  | "permit2_disabled"
  | "preflight_validation_failed"
  | "request_blocked_by_location"
  | "self_send_not_allowed"
  | "invalid_bazaar_extension"
  | "unknown_error"
export const X402VerifyInvalidReason = Schema.Literals([
  "insufficient_funds",
  "invalid_scheme",
  "invalid_network",
  "invalid_x402_version",
  "invalid_payment_requirements",
  "invalid_payload",
  "invalid_exact_evm_payload_authorization_value",
  "invalid_exact_evm_payload_authorization_value_too_low",
  "invalid_exact_evm_payload_authorization_valid_after",
  "invalid_exact_evm_payload_authorization_valid_before",
  "invalid_exact_evm_payload_authorization_typed_data_message",
  "invalid_exact_evm_payload_authorization_from_address_kyt",
  "invalid_exact_evm_payload_authorization_to_address_kyt",
  "invalid_exact_evm_payload_signature",
  "invalid_exact_evm_payload_signature_address",
  "invalid_exact_evm_permit2_payload_allowance_required",
  "invalid_exact_evm_permit2_payload_signature",
  "invalid_exact_evm_permit2_payload_deadline",
  "invalid_exact_evm_permit2_payload_valid_after",
  "invalid_exact_evm_permit2_payload_spender",
  "invalid_exact_evm_permit2_payload_recipient",
  "invalid_exact_evm_permit2_payload_amount",
  "invalid_exact_svm_payload_transaction",
  "invalid_exact_svm_payload_transaction_amount_mismatch",
  "invalid_exact_svm_payload_transaction_create_ata_instruction",
  "invalid_exact_svm_payload_transaction_create_ata_instruction_incorrect_payee",
  "invalid_exact_svm_payload_transaction_create_ata_instruction_incorrect_asset",
  "invalid_exact_svm_payload_transaction_instructions",
  "invalid_exact_svm_payload_transaction_instructions_length",
  "invalid_exact_svm_payload_transaction_instructions_compute_limit_instruction",
  "invalid_exact_svm_payload_transaction_instructions_compute_price_instruction",
  "invalid_exact_svm_payload_transaction_instructions_compute_price_instruction_too_high",
  "invalid_exact_svm_payload_transaction_instruction_not_spl_token_transfer_checked",
  "invalid_exact_svm_payload_transaction_instruction_not_token_2022_transfer_checked",
  "invalid_exact_svm_payload_transaction_not_a_transfer_instruction",
  "invalid_exact_svm_payload_transaction_cannot_derive_receiver_ata",
  "invalid_exact_svm_payload_transaction_receiver_ata_not_found",
  "invalid_exact_svm_payload_transaction_sender_ata_not_found",
  "invalid_exact_svm_payload_transaction_simulation_failed",
  "invalid_exact_svm_payload_transaction_transfer_to_incorrect_ata",
  "invalid_exact_svm_payload_transaction_fee_payer_included_in_instruction_accounts",
  "invalid_exact_svm_payload_transaction_fee_payer_transferring_funds",
  "invalid_batch_settlement_evm_scheme",
  "invalid_batch_settlement_evm_network_mismatch",
  "invalid_batch_settlement_evm_payload_type",
  "invalid_batch_settlement_evm_channel_not_found",
  "invalid_batch_settlement_evm_deposit_simulation_failed",
  "invalid_batch_settlement_evm_channel_id_mismatch",
  "invalid_batch_settlement_evm_channel_state_read_failed",
  "invalid_batch_settlement_evm_cumulative_below_claimed",
  "invalid_batch_settlement_evm_cumulative_exceeds_balance",
  "invalid_batch_settlement_evm_eip2612_amount_mismatch",
  "invalid_batch_settlement_evm_eip2612_asset_mismatch",
  "invalid_batch_settlement_evm_eip2612_deadline_expired",
  "invalid_batch_settlement_evm_eip2612_invalid_format",
  "invalid_batch_settlement_evm_eip2612_invalid_signature",
  "invalid_batch_settlement_evm_eip2612_owner_mismatch",
  "invalid_batch_settlement_evm_eip2612_spender_mismatch",
  "invalid_batch_settlement_evm_erc20_approval_asset_mismatch",
  "invalid_batch_settlement_evm_erc20_approval_from_mismatch",
  "invalid_batch_settlement_evm_erc20_approval_invalid_format",
  "invalid_batch_settlement_evm_erc20_approval_unavailable",
  "invalid_batch_settlement_evm_erc20_approval_wrong_spender",
  "invalid_batch_settlement_evm_erc3009_authorization_required",
  "invalid_batch_settlement_evm_insufficient_balance",
  "invalid_batch_settlement_evm_deposit_payload",
  "invalid_batch_settlement_evm_receive_authorization_signature",
  "invalid_batch_settlement_evm_refund_payload",
  "invalid_batch_settlement_evm_voucher_payload",
  "invalid_batch_settlement_evm_voucher_signature",
  "invalid_batch_settlement_evm_missing_eip712_domain",
  "invalid_batch_settlement_evm_payload_authorization_valid_after",
  "invalid_batch_settlement_evm_payload_authorization_valid_before",
  "invalid_batch_settlement_evm_permit2_allowance_required",
  "invalid_batch_settlement_evm_permit2_amount_mismatch",
  "invalid_batch_settlement_evm_permit2_authorization_required",
  "invalid_batch_settlement_evm_permit2_deadline_expired",
  "invalid_batch_settlement_evm_permit2_invalid_signature",
  "invalid_batch_settlement_evm_permit2_invalid_spender",
  "invalid_batch_settlement_evm_receiver_authorizer_mismatch",
  "invalid_batch_settlement_evm_receiver_mismatch",
  "invalid_batch_settlement_evm_rpc_read_failed",
  "invalid_batch_settlement_evm_token_mismatch",
  "invalid_batch_settlement_evm_withdraw_delay_mismatch",
  "invalid_batch_settlement_evm_withdraw_delay_out_of_range",
  "invalid_exact_evm_scheme",
  "invalid_exact_evm_network_mismatch",
  "invalid_exact_evm_payload",
  "invalid_exact_evm_payload_missing_signature",
  "invalid_exact_evm_failed_to_get_network_config",
  "invalid_exact_evm_missing_eip712_domain",
  "invalid_exact_evm_recipient_mismatch",
  "invalid_exact_evm_authorization_value",
  "invalid_exact_evm_required_amount",
  "invalid_exact_evm_payload_authorization_value_mismatch",
  "invalid_exact_evm_failed_to_check_nonce",
  "invalid_exact_evm_nonce_already_used",
  "invalid_exact_evm_failed_to_get_balance",
  "invalid_exact_evm_insufficient_balance",
  "invalid_exact_evm_signature_format",
  "invalid_exact_evm_failed_to_verify_signature",
  "invalid_exact_evm_signature",
  "invalid_exact_evm_token_name_mismatch",
  "invalid_exact_evm_token_version_mismatch",
  "invalid_exact_evm_eip3009_not_supported",
  "invalid_exact_evm_transaction_simulation_failed",
  "invalid_exact_evm_verification_failed",
  "invalid_exact_evm_failed_to_parse_signature",
  "invalid_exact_evm_failed_to_check_deployment",
  "invalid_exact_evm_failed_to_execute_transfer",
  "invalid_exact_evm_failed_to_get_receipt",
  "invalid_exact_evm_transaction_failed",
  "invalid_exact_evm_payload_undeployed_smart_wallet",
  "smart_wallet_deployment_failed",
  "unsupported_payload_type",
  "invalid_erc20_approval_extension_format",
  "erc20_approval_tx_failed",
  "erc20_approval_from_mismatch",
  "erc20_approval_asset_mismatch",
  "erc20_approval_spender_not_permit2",
  "erc20_approval_tx_parse_failed",
  "erc20_approval_tx_wrong_target",
  "erc20_approval_tx_wrong_selector",
  "erc20_approval_tx_wrong_spender",
  "erc20_approval_tx_signer_mismatch",
  "erc20_approval_tx_invalid_signature",
  "invalid_exact_evm_unsupported_scheme",
  "invalid_exact_evm_extra_field",
  "invalid_exact_evm_payload_recipient_mismatch",
  "invalid_exact_evm_insufficient_funds",
  "invalid_exact_evm_transaction_state",
  "invalid_permit2_spender",
  "invalid_permit2_recipient_mismatch",
  "permit2_deadline_expired",
  "permit2_not_yet_valid",
  "permit2_amount_mismatch",
  "permit2_token_mismatch",
  "invalid_permit2_signature",
  "permit2_allowance_required",
  "permit2_invalid_amount",
  "permit2_invalid_destination",
  "permit2_invalid_owner",
  "permit2_payment_too_early",
  "permit2_invalid_nonce",
  "permit2_2612_amount_mismatch",
  "permit2_simulation_failed",
  "permit2_insufficient_balance",
  "permit2_proxy_not_deployed",
  "erc20_approval_insufficient_eth_for_gas",
  "erc20_approval_broadcast_failed",
  "invalid_exact_solana_unsupported_scheme",
  "invalid_exact_solana_network_mismatch",
  "invalid_exact_solana_payload_missing_fee_payer",
  "invalid_exact_solana_fee_payer_not_managed_by_facilitator",
  "invalid_exact_solana_payload_transaction",
  "invalid_exact_solana_payload_transaction_could_not_be_decoded",
  "invalid_exact_solana_payload_transaction_instructions_length",
  "invalid_exact_solana_payload_unknown_fourth_instruction",
  "invalid_exact_solana_payload_unknown_fifth_instruction",
  "invalid_exact_solana_payload_unknown_sixth_instruction",
  "invalid_exact_solana_payload_transaction_instructions_compute_limit_instruction",
  "invalid_exact_solana_payload_transaction_instructions_compute_price_instruction",
  "invalid_exact_solana_payload_transaction_instructions_compute_price_instruction_too_high",
  "invalid_exact_solana_payload_no_transfer_instruction",
  "invalid_exact_solana_payload_transaction_fee_payer_transferring_funds",
  "invalid_exact_solana_payload_mint_mismatch",
  "invalid_exact_solana_payload_recipient_mismatch",
  "invalid_exact_solana_payload_amount_insufficient",
  "invalid_exact_solana_invalid_fee_payer",
  "invalid_exact_solana_transaction_signing_failed",
  "invalid_exact_solana_transaction_simulation_failed",
  "invalid_exact_solana_payload_memo_mismatch",
  "invalid_exact_solana_payload_memo_count",
  "invalid_exact_solana_verification_failed",
  "invalid_exact_solana_fee_payer_mismatch",
  "invalid_exact_solana_transaction_failed",
  "invalid_exact_solana_transaction_confirmation_failed",
  "duplicate_settlement",
  "invalid_exact_solana_extra_field",
  "batch_settlement_cumulative_amount_mismatch",
  "batch_settlement_channel_busy",
  "missing_batch_settlement_channel",
  "batch_settlement_charge_exceeds_signed_cumulative",
  "batch_settlement_refund_no_balance",
  "batch_settlement_refund_amount_invalid",
  "batch_settlement_refund_amount_exceeds_balance",
  "amount_too_low",
  "invalid_amount",
  "kyt_risk_detected",
  "permit2_disabled",
  "preflight_validation_failed",
  "request_blocked_by_location",
  "self_send_not_allowed",
  "invalid_bazaar_extension",
  "unknown_error",
]).annotate({ description: "The reason the payment is invalid on the x402 protocol." })
export type X402SettleErrorReason =
  | "insufficient_funds"
  | "invalid_scheme"
  | "invalid_network"
  | "invalid_x402_version"
  | "invalid_payment_requirements"
  | "invalid_payload"
  | "invalid_exact_evm_payload_authorization_value"
  | "invalid_exact_evm_payload_authorization_value_too_low"
  | "invalid_exact_evm_payload_authorization_valid_after"
  | "invalid_exact_evm_payload_authorization_valid_before"
  | "invalid_exact_evm_payload_authorization_typed_data_message"
  | "invalid_exact_evm_payload_authorization_from_address_kyt"
  | "invalid_exact_evm_payload_authorization_to_address_kyt"
  | "invalid_exact_evm_payload_signature"
  | "invalid_exact_evm_payload_signature_address"
  | "invalid_exact_evm_permit2_payload_allowance_required"
  | "invalid_exact_evm_permit2_payload_signature"
  | "invalid_exact_evm_permit2_payload_deadline"
  | "invalid_exact_evm_permit2_payload_valid_after"
  | "invalid_exact_evm_permit2_payload_spender"
  | "invalid_exact_evm_permit2_payload_recipient"
  | "invalid_exact_evm_permit2_payload_amount"
  | "invalid_exact_svm_payload_transaction"
  | "invalid_exact_svm_payload_transaction_amount_mismatch"
  | "invalid_exact_svm_payload_transaction_create_ata_instruction"
  | "invalid_exact_svm_payload_transaction_create_ata_instruction_incorrect_payee"
  | "invalid_exact_svm_payload_transaction_create_ata_instruction_incorrect_asset"
  | "invalid_exact_svm_payload_transaction_instructions"
  | "invalid_exact_svm_payload_transaction_instructions_length"
  | "invalid_exact_svm_payload_transaction_instructions_compute_limit_instruction"
  | "invalid_exact_svm_payload_transaction_instructions_compute_price_instruction"
  | "invalid_exact_svm_payload_transaction_instructions_compute_price_instruction_too_high"
  | "invalid_exact_svm_payload_transaction_instruction_not_spl_token_transfer_checked"
  | "invalid_exact_svm_payload_transaction_instruction_not_token_2022_transfer_checked"
  | "invalid_exact_svm_payload_transaction_not_a_transfer_instruction"
  | "invalid_exact_svm_payload_transaction_cannot_derive_receiver_ata"
  | "invalid_exact_svm_payload_transaction_receiver_ata_not_found"
  | "invalid_exact_svm_payload_transaction_sender_ata_not_found"
  | "invalid_exact_svm_payload_transaction_simulation_failed"
  | "invalid_exact_svm_payload_transaction_transfer_to_incorrect_ata"
  | "invalid_exact_svm_payload_transaction_fee_payer_included_in_instruction_accounts"
  | "invalid_exact_svm_payload_transaction_fee_payer_transferring_funds"
  | "settle_exact_evm_transaction_confirmation_timed_out"
  | "settle_exact_node_failure"
  | "settle_exact_failed_onchain"
  | "settle_exact_svm_block_height_exceeded"
  | "settle_exact_svm_transaction_confirmation_timed_out"
  | "invalid_batch_settlement_evm_unknown_settle_action"
  | "invalid_batch_settlement_evm_claim_payload"
  | "invalid_batch_settlement_evm_settle_payload"
  | "invalid_batch_settlement_evm_authorizer_address_mismatch"
  | "invalid_batch_settlement_evm_claim_simulation_failed"
  | "invalid_batch_settlement_evm_claim_transaction_failed"
  | "invalid_batch_settlement_evm_deposit_transaction_failed"
  | "invalid_batch_settlement_evm_refund_simulation_failed"
  | "invalid_batch_settlement_evm_refund_transaction_failed"
  | "invalid_batch_settlement_evm_settle_simulation_failed"
  | "invalid_batch_settlement_evm_settle_transaction_failed"
  | "invalid_batch_settlement_evm_transaction_reverted"
  | "invalid_batch_settlement_evm_wait_for_receipt_failed"
  | "invalid_batch_settlement_evm_erc20_approval_broadcast_failed"
  | "invalid_batch_settlement_evm_channel_id_mismatch"
  | "invalid_batch_settlement_evm_channel_state_read_failed"
  | "invalid_batch_settlement_evm_cumulative_below_claimed"
  | "invalid_batch_settlement_evm_cumulative_exceeds_balance"
  | "invalid_batch_settlement_evm_eip2612_amount_mismatch"
  | "invalid_batch_settlement_evm_eip2612_asset_mismatch"
  | "invalid_batch_settlement_evm_eip2612_deadline_expired"
  | "invalid_batch_settlement_evm_eip2612_invalid_format"
  | "invalid_batch_settlement_evm_eip2612_invalid_signature"
  | "invalid_batch_settlement_evm_eip2612_owner_mismatch"
  | "invalid_batch_settlement_evm_eip2612_spender_mismatch"
  | "invalid_batch_settlement_evm_erc20_approval_asset_mismatch"
  | "invalid_batch_settlement_evm_erc20_approval_from_mismatch"
  | "invalid_batch_settlement_evm_erc20_approval_invalid_format"
  | "invalid_batch_settlement_evm_erc20_approval_unavailable"
  | "invalid_batch_settlement_evm_erc20_approval_wrong_spender"
  | "invalid_batch_settlement_evm_erc3009_authorization_required"
  | "invalid_batch_settlement_evm_insufficient_balance"
  | "invalid_batch_settlement_evm_deposit_payload"
  | "invalid_batch_settlement_evm_receive_authorization_signature"
  | "invalid_batch_settlement_evm_refund_payload"
  | "invalid_batch_settlement_evm_voucher_payload"
  | "invalid_batch_settlement_evm_voucher_signature"
  | "invalid_batch_settlement_evm_missing_eip712_domain"
  | "invalid_batch_settlement_evm_payload_authorization_valid_after"
  | "invalid_batch_settlement_evm_payload_authorization_valid_before"
  | "invalid_batch_settlement_evm_permit2_allowance_required"
  | "invalid_batch_settlement_evm_permit2_amount_mismatch"
  | "invalid_batch_settlement_evm_permit2_authorization_required"
  | "invalid_batch_settlement_evm_permit2_deadline_expired"
  | "invalid_batch_settlement_evm_permit2_invalid_signature"
  | "invalid_batch_settlement_evm_permit2_invalid_spender"
  | "invalid_batch_settlement_evm_receiver_authorizer_mismatch"
  | "invalid_batch_settlement_evm_receiver_mismatch"
  | "invalid_batch_settlement_evm_rpc_read_failed"
  | "invalid_batch_settlement_evm_token_mismatch"
  | "invalid_batch_settlement_evm_withdraw_delay_mismatch"
  | "invalid_batch_settlement_evm_withdraw_delay_out_of_range"
  | "invalid_batch_settlement_evm_scheme"
  | "invalid_batch_settlement_evm_network_mismatch"
  | "invalid_batch_settlement_evm_payload_type"
  | "invalid_batch_settlement_evm_channel_not_found"
  | "invalid_batch_settlement_evm_deposit_simulation_failed"
  | "invalid_exact_evm_scheme"
  | "invalid_exact_evm_network_mismatch"
  | "invalid_exact_evm_payload"
  | "invalid_exact_evm_payload_missing_signature"
  | "invalid_exact_evm_failed_to_get_network_config"
  | "invalid_exact_evm_missing_eip712_domain"
  | "invalid_exact_evm_recipient_mismatch"
  | "invalid_exact_evm_authorization_value"
  | "invalid_exact_evm_required_amount"
  | "invalid_exact_evm_payload_authorization_value_mismatch"
  | "invalid_exact_evm_failed_to_check_nonce"
  | "invalid_exact_evm_nonce_already_used"
  | "invalid_exact_evm_failed_to_get_balance"
  | "invalid_exact_evm_insufficient_balance"
  | "invalid_exact_evm_signature_format"
  | "invalid_exact_evm_failed_to_verify_signature"
  | "invalid_exact_evm_signature"
  | "invalid_exact_evm_token_name_mismatch"
  | "invalid_exact_evm_token_version_mismatch"
  | "invalid_exact_evm_eip3009_not_supported"
  | "invalid_exact_evm_transaction_simulation_failed"
  | "invalid_exact_evm_verification_failed"
  | "invalid_exact_evm_failed_to_parse_signature"
  | "invalid_exact_evm_failed_to_check_deployment"
  | "invalid_exact_evm_failed_to_execute_transfer"
  | "invalid_exact_evm_failed_to_get_receipt"
  | "invalid_exact_evm_transaction_failed"
  | "invalid_exact_evm_payload_undeployed_smart_wallet"
  | "smart_wallet_deployment_failed"
  | "unsupported_payload_type"
  | "invalid_erc20_approval_extension_format"
  | "erc20_approval_tx_failed"
  | "erc20_approval_from_mismatch"
  | "erc20_approval_asset_mismatch"
  | "erc20_approval_spender_not_permit2"
  | "erc20_approval_tx_parse_failed"
  | "erc20_approval_tx_wrong_target"
  | "erc20_approval_tx_wrong_selector"
  | "erc20_approval_tx_wrong_spender"
  | "erc20_approval_tx_signer_mismatch"
  | "erc20_approval_tx_invalid_signature"
  | "invalid_exact_evm_unsupported_scheme"
  | "invalid_exact_evm_extra_field"
  | "invalid_exact_evm_payload_recipient_mismatch"
  | "invalid_exact_evm_insufficient_funds"
  | "invalid_exact_evm_transaction_state"
  | "invalid_permit2_spender"
  | "invalid_permit2_recipient_mismatch"
  | "permit2_deadline_expired"
  | "permit2_not_yet_valid"
  | "permit2_amount_mismatch"
  | "permit2_token_mismatch"
  | "invalid_permit2_signature"
  | "permit2_allowance_required"
  | "permit2_invalid_amount"
  | "permit2_invalid_destination"
  | "permit2_invalid_owner"
  | "permit2_payment_too_early"
  | "permit2_invalid_nonce"
  | "permit2_2612_amount_mismatch"
  | "permit2_simulation_failed"
  | "permit2_insufficient_balance"
  | "permit2_proxy_not_deployed"
  | "erc20_approval_insufficient_eth_for_gas"
  | "erc20_approval_broadcast_failed"
  | "invalid_exact_solana_unsupported_scheme"
  | "invalid_exact_solana_network_mismatch"
  | "invalid_exact_solana_payload_missing_fee_payer"
  | "invalid_exact_solana_fee_payer_not_managed_by_facilitator"
  | "invalid_exact_solana_payload_transaction"
  | "invalid_exact_solana_payload_transaction_could_not_be_decoded"
  | "invalid_exact_solana_payload_transaction_instructions_length"
  | "invalid_exact_solana_payload_unknown_fourth_instruction"
  | "invalid_exact_solana_payload_unknown_fifth_instruction"
  | "invalid_exact_solana_payload_unknown_sixth_instruction"
  | "invalid_exact_solana_payload_transaction_instructions_compute_limit_instruction"
  | "invalid_exact_solana_payload_transaction_instructions_compute_price_instruction"
  | "invalid_exact_solana_payload_transaction_instructions_compute_price_instruction_too_high"
  | "invalid_exact_solana_payload_no_transfer_instruction"
  | "invalid_exact_solana_payload_transaction_fee_payer_transferring_funds"
  | "invalid_exact_solana_payload_mint_mismatch"
  | "invalid_exact_solana_payload_recipient_mismatch"
  | "invalid_exact_solana_payload_amount_insufficient"
  | "invalid_exact_solana_invalid_fee_payer"
  | "invalid_exact_solana_transaction_signing_failed"
  | "invalid_exact_solana_transaction_simulation_failed"
  | "invalid_exact_solana_payload_memo_mismatch"
  | "invalid_exact_solana_payload_memo_count"
  | "invalid_exact_solana_verification_failed"
  | "invalid_exact_solana_fee_payer_mismatch"
  | "invalid_exact_solana_transaction_failed"
  | "invalid_exact_solana_transaction_confirmation_failed"
  | "duplicate_settlement"
  | "invalid_exact_solana_extra_field"
  | "batch_settlement_cumulative_amount_mismatch"
  | "batch_settlement_channel_busy"
  | "missing_batch_settlement_channel"
  | "batch_settlement_charge_exceeds_signed_cumulative"
  | "batch_settlement_refund_no_balance"
  | "batch_settlement_refund_amount_invalid"
  | "batch_settlement_refund_amount_exceeds_balance"
  | "amount_too_low"
  | "invalid_amount"
  | "kyt_risk_detected"
  | "permit2_disabled"
  | "preflight_validation_failed"
  | "request_blocked_by_location"
  | "self_send_not_allowed"
  | "invalid_bazaar_extension"
  | "unknown_error"
export const X402SettleErrorReason = Schema.Literals([
  "insufficient_funds",
  "invalid_scheme",
  "invalid_network",
  "invalid_x402_version",
  "invalid_payment_requirements",
  "invalid_payload",
  "invalid_exact_evm_payload_authorization_value",
  "invalid_exact_evm_payload_authorization_value_too_low",
  "invalid_exact_evm_payload_authorization_valid_after",
  "invalid_exact_evm_payload_authorization_valid_before",
  "invalid_exact_evm_payload_authorization_typed_data_message",
  "invalid_exact_evm_payload_authorization_from_address_kyt",
  "invalid_exact_evm_payload_authorization_to_address_kyt",
  "invalid_exact_evm_payload_signature",
  "invalid_exact_evm_payload_signature_address",
  "invalid_exact_evm_permit2_payload_allowance_required",
  "invalid_exact_evm_permit2_payload_signature",
  "invalid_exact_evm_permit2_payload_deadline",
  "invalid_exact_evm_permit2_payload_valid_after",
  "invalid_exact_evm_permit2_payload_spender",
  "invalid_exact_evm_permit2_payload_recipient",
  "invalid_exact_evm_permit2_payload_amount",
  "invalid_exact_svm_payload_transaction",
  "invalid_exact_svm_payload_transaction_amount_mismatch",
  "invalid_exact_svm_payload_transaction_create_ata_instruction",
  "invalid_exact_svm_payload_transaction_create_ata_instruction_incorrect_payee",
  "invalid_exact_svm_payload_transaction_create_ata_instruction_incorrect_asset",
  "invalid_exact_svm_payload_transaction_instructions",
  "invalid_exact_svm_payload_transaction_instructions_length",
  "invalid_exact_svm_payload_transaction_instructions_compute_limit_instruction",
  "invalid_exact_svm_payload_transaction_instructions_compute_price_instruction",
  "invalid_exact_svm_payload_transaction_instructions_compute_price_instruction_too_high",
  "invalid_exact_svm_payload_transaction_instruction_not_spl_token_transfer_checked",
  "invalid_exact_svm_payload_transaction_instruction_not_token_2022_transfer_checked",
  "invalid_exact_svm_payload_transaction_not_a_transfer_instruction",
  "invalid_exact_svm_payload_transaction_cannot_derive_receiver_ata",
  "invalid_exact_svm_payload_transaction_receiver_ata_not_found",
  "invalid_exact_svm_payload_transaction_sender_ata_not_found",
  "invalid_exact_svm_payload_transaction_simulation_failed",
  "invalid_exact_svm_payload_transaction_transfer_to_incorrect_ata",
  "invalid_exact_svm_payload_transaction_fee_payer_included_in_instruction_accounts",
  "invalid_exact_svm_payload_transaction_fee_payer_transferring_funds",
  "settle_exact_evm_transaction_confirmation_timed_out",
  "settle_exact_node_failure",
  "settle_exact_failed_onchain",
  "settle_exact_svm_block_height_exceeded",
  "settle_exact_svm_transaction_confirmation_timed_out",
  "invalid_batch_settlement_evm_unknown_settle_action",
  "invalid_batch_settlement_evm_claim_payload",
  "invalid_batch_settlement_evm_settle_payload",
  "invalid_batch_settlement_evm_authorizer_address_mismatch",
  "invalid_batch_settlement_evm_claim_simulation_failed",
  "invalid_batch_settlement_evm_claim_transaction_failed",
  "invalid_batch_settlement_evm_deposit_transaction_failed",
  "invalid_batch_settlement_evm_refund_simulation_failed",
  "invalid_batch_settlement_evm_refund_transaction_failed",
  "invalid_batch_settlement_evm_settle_simulation_failed",
  "invalid_batch_settlement_evm_settle_transaction_failed",
  "invalid_batch_settlement_evm_transaction_reverted",
  "invalid_batch_settlement_evm_wait_for_receipt_failed",
  "invalid_batch_settlement_evm_erc20_approval_broadcast_failed",
  "invalid_batch_settlement_evm_channel_id_mismatch",
  "invalid_batch_settlement_evm_channel_state_read_failed",
  "invalid_batch_settlement_evm_cumulative_below_claimed",
  "invalid_batch_settlement_evm_cumulative_exceeds_balance",
  "invalid_batch_settlement_evm_eip2612_amount_mismatch",
  "invalid_batch_settlement_evm_eip2612_asset_mismatch",
  "invalid_batch_settlement_evm_eip2612_deadline_expired",
  "invalid_batch_settlement_evm_eip2612_invalid_format",
  "invalid_batch_settlement_evm_eip2612_invalid_signature",
  "invalid_batch_settlement_evm_eip2612_owner_mismatch",
  "invalid_batch_settlement_evm_eip2612_spender_mismatch",
  "invalid_batch_settlement_evm_erc20_approval_asset_mismatch",
  "invalid_batch_settlement_evm_erc20_approval_from_mismatch",
  "invalid_batch_settlement_evm_erc20_approval_invalid_format",
  "invalid_batch_settlement_evm_erc20_approval_unavailable",
  "invalid_batch_settlement_evm_erc20_approval_wrong_spender",
  "invalid_batch_settlement_evm_erc3009_authorization_required",
  "invalid_batch_settlement_evm_insufficient_balance",
  "invalid_batch_settlement_evm_deposit_payload",
  "invalid_batch_settlement_evm_receive_authorization_signature",
  "invalid_batch_settlement_evm_refund_payload",
  "invalid_batch_settlement_evm_voucher_payload",
  "invalid_batch_settlement_evm_voucher_signature",
  "invalid_batch_settlement_evm_missing_eip712_domain",
  "invalid_batch_settlement_evm_payload_authorization_valid_after",
  "invalid_batch_settlement_evm_payload_authorization_valid_before",
  "invalid_batch_settlement_evm_permit2_allowance_required",
  "invalid_batch_settlement_evm_permit2_amount_mismatch",
  "invalid_batch_settlement_evm_permit2_authorization_required",
  "invalid_batch_settlement_evm_permit2_deadline_expired",
  "invalid_batch_settlement_evm_permit2_invalid_signature",
  "invalid_batch_settlement_evm_permit2_invalid_spender",
  "invalid_batch_settlement_evm_receiver_authorizer_mismatch",
  "invalid_batch_settlement_evm_receiver_mismatch",
  "invalid_batch_settlement_evm_rpc_read_failed",
  "invalid_batch_settlement_evm_token_mismatch",
  "invalid_batch_settlement_evm_withdraw_delay_mismatch",
  "invalid_batch_settlement_evm_withdraw_delay_out_of_range",
  "invalid_batch_settlement_evm_scheme",
  "invalid_batch_settlement_evm_network_mismatch",
  "invalid_batch_settlement_evm_payload_type",
  "invalid_batch_settlement_evm_channel_not_found",
  "invalid_batch_settlement_evm_deposit_simulation_failed",
  "invalid_exact_evm_scheme",
  "invalid_exact_evm_network_mismatch",
  "invalid_exact_evm_payload",
  "invalid_exact_evm_payload_missing_signature",
  "invalid_exact_evm_failed_to_get_network_config",
  "invalid_exact_evm_missing_eip712_domain",
  "invalid_exact_evm_recipient_mismatch",
  "invalid_exact_evm_authorization_value",
  "invalid_exact_evm_required_amount",
  "invalid_exact_evm_payload_authorization_value_mismatch",
  "invalid_exact_evm_failed_to_check_nonce",
  "invalid_exact_evm_nonce_already_used",
  "invalid_exact_evm_failed_to_get_balance",
  "invalid_exact_evm_insufficient_balance",
  "invalid_exact_evm_signature_format",
  "invalid_exact_evm_failed_to_verify_signature",
  "invalid_exact_evm_signature",
  "invalid_exact_evm_token_name_mismatch",
  "invalid_exact_evm_token_version_mismatch",
  "invalid_exact_evm_eip3009_not_supported",
  "invalid_exact_evm_transaction_simulation_failed",
  "invalid_exact_evm_verification_failed",
  "invalid_exact_evm_failed_to_parse_signature",
  "invalid_exact_evm_failed_to_check_deployment",
  "invalid_exact_evm_failed_to_execute_transfer",
  "invalid_exact_evm_failed_to_get_receipt",
  "invalid_exact_evm_transaction_failed",
  "invalid_exact_evm_payload_undeployed_smart_wallet",
  "smart_wallet_deployment_failed",
  "unsupported_payload_type",
  "invalid_erc20_approval_extension_format",
  "erc20_approval_tx_failed",
  "erc20_approval_from_mismatch",
  "erc20_approval_asset_mismatch",
  "erc20_approval_spender_not_permit2",
  "erc20_approval_tx_parse_failed",
  "erc20_approval_tx_wrong_target",
  "erc20_approval_tx_wrong_selector",
  "erc20_approval_tx_wrong_spender",
  "erc20_approval_tx_signer_mismatch",
  "erc20_approval_tx_invalid_signature",
  "invalid_exact_evm_unsupported_scheme",
  "invalid_exact_evm_extra_field",
  "invalid_exact_evm_payload_recipient_mismatch",
  "invalid_exact_evm_insufficient_funds",
  "invalid_exact_evm_transaction_state",
  "invalid_permit2_spender",
  "invalid_permit2_recipient_mismatch",
  "permit2_deadline_expired",
  "permit2_not_yet_valid",
  "permit2_amount_mismatch",
  "permit2_token_mismatch",
  "invalid_permit2_signature",
  "permit2_allowance_required",
  "permit2_invalid_amount",
  "permit2_invalid_destination",
  "permit2_invalid_owner",
  "permit2_payment_too_early",
  "permit2_invalid_nonce",
  "permit2_2612_amount_mismatch",
  "permit2_simulation_failed",
  "permit2_insufficient_balance",
  "permit2_proxy_not_deployed",
  "erc20_approval_insufficient_eth_for_gas",
  "erc20_approval_broadcast_failed",
  "invalid_exact_solana_unsupported_scheme",
  "invalid_exact_solana_network_mismatch",
  "invalid_exact_solana_payload_missing_fee_payer",
  "invalid_exact_solana_fee_payer_not_managed_by_facilitator",
  "invalid_exact_solana_payload_transaction",
  "invalid_exact_solana_payload_transaction_could_not_be_decoded",
  "invalid_exact_solana_payload_transaction_instructions_length",
  "invalid_exact_solana_payload_unknown_fourth_instruction",
  "invalid_exact_solana_payload_unknown_fifth_instruction",
  "invalid_exact_solana_payload_unknown_sixth_instruction",
  "invalid_exact_solana_payload_transaction_instructions_compute_limit_instruction",
  "invalid_exact_solana_payload_transaction_instructions_compute_price_instruction",
  "invalid_exact_solana_payload_transaction_instructions_compute_price_instruction_too_high",
  "invalid_exact_solana_payload_no_transfer_instruction",
  "invalid_exact_solana_payload_transaction_fee_payer_transferring_funds",
  "invalid_exact_solana_payload_mint_mismatch",
  "invalid_exact_solana_payload_recipient_mismatch",
  "invalid_exact_solana_payload_amount_insufficient",
  "invalid_exact_solana_invalid_fee_payer",
  "invalid_exact_solana_transaction_signing_failed",
  "invalid_exact_solana_transaction_simulation_failed",
  "invalid_exact_solana_payload_memo_mismatch",
  "invalid_exact_solana_payload_memo_count",
  "invalid_exact_solana_verification_failed",
  "invalid_exact_solana_fee_payer_mismatch",
  "invalid_exact_solana_transaction_failed",
  "invalid_exact_solana_transaction_confirmation_failed",
  "duplicate_settlement",
  "invalid_exact_solana_extra_field",
  "batch_settlement_cumulative_amount_mismatch",
  "batch_settlement_channel_busy",
  "missing_batch_settlement_channel",
  "batch_settlement_charge_exceeds_signed_cumulative",
  "batch_settlement_refund_no_balance",
  "batch_settlement_refund_amount_invalid",
  "batch_settlement_refund_amount_exceeds_balance",
  "amount_too_low",
  "invalid_amount",
  "kyt_risk_detected",
  "permit2_disabled",
  "preflight_validation_failed",
  "request_blocked_by_location",
  "self_send_not_allowed",
  "invalid_bazaar_extension",
  "unknown_error",
]).annotate({ description: "The reason the payment settlement errored on the x402 protocol." })
export type X402ResourceQuality = {
  readonly l30DaysTotalCalls?: number
  readonly l30DaysUniquePayers?: number
  readonly lastCalledAt?: string
}
export const X402ResourceQuality = Schema.Struct({
  l30DaysTotalCalls: Schema.optionalKey(
    Schema.Number.annotate({ description: "Total number of paid calls to a resource in the last 30 days." }).check(
      Schema.isInt(),
    ),
  ),
  l30DaysUniquePayers: Schema.optionalKey(
    Schema.Number.annotate({ description: "Number of unique payers to a resource in the last 30 days." }).check(
      Schema.isInt(),
    ),
  ),
  lastCalledAt: Schema.optionalKey(
    Schema.String.annotate({
      description: "Timestamp of the most recent paid call to a resource.",
      format: "date-time",
    }),
  ),
}).annotate({ description: "Quality metrics for a discovered x402 resource." })
export type X402McpRequest = {
  readonly jsonrpc: "2.0"
  readonly id?: string | number
  readonly method: string
  readonly params?: { readonly [x: string]: unknown }
}
export const X402McpRequest = Schema.Struct({
  jsonrpc: Schema.Literal("2.0").annotate({ description: 'JSON-RPC version, must be "2.0".' }),
  id: Schema.optionalKey(
    Schema.Union([Schema.String, Schema.Number.check(Schema.isInt())], { mode: "oneOf" }).annotate({
      description: "Request identifier.",
    }),
  ),
  method: Schema.String.annotate({ description: "The MCP method to invoke." }),
  params: Schema.optionalKey(
    Schema.Record(Schema.String, Schema.Unknown).annotate({ description: "Optional parameters for the method." }),
  ),
}).annotate({ description: "A JSON-RPC 2.0 request for the Model Context Protocol." })
export type X402McpError = {
  readonly code: number
  readonly message: string
  readonly data?: { readonly [x: string]: unknown }
}
export const X402McpError = Schema.Struct({
  code: Schema.Number.annotate({ description: "Error code." }).check(Schema.isInt()),
  message: Schema.String.annotate({ description: "Error message." }),
  data: Schema.optionalKey(
    Schema.Record(Schema.String, Schema.Unknown).annotate({ description: "Additional error data." }),
  ),
}).annotate({ description: "JSON-RPC 2.0 error object." })
export type OnrampOrderPaymentMethodTypeId = "GUEST_CHECKOUT_APPLE_PAY" | "GUEST_CHECKOUT_GOOGLE_PAY"
export const OnrampOrderPaymentMethodTypeId = Schema.Literals([
  "GUEST_CHECKOUT_APPLE_PAY",
  "GUEST_CHECKOUT_GOOGLE_PAY",
]).annotate({ description: "The type of payment method to be used to complete an onramp order." })
export type OnrampOrderFee = {
  readonly type: "FEE_TYPE_NETWORK" | "FEE_TYPE_EXCHANGE"
  readonly amount: string
  readonly currency: string
}
export const OnrampOrderFee = Schema.Struct({
  type: Schema.Literals(["FEE_TYPE_NETWORK", "FEE_TYPE_EXCHANGE"]).annotate({ description: "The type of fee." }),
  amount: Schema.String.annotate({ description: "The amount of the fee." }),
  currency: Schema.String.annotate({ description: "The currency of the fee." }),
}).annotate({ description: "A fee associated with an order." })
export type OnrampOrderStatus =
  | "ONRAMP_ORDER_STATUS_PENDING_AUTH"
  | "ONRAMP_ORDER_STATUS_PENDING_PAYMENT"
  | "ONRAMP_ORDER_STATUS_PROCESSING"
  | "ONRAMP_ORDER_STATUS_COMPLETED"
  | "ONRAMP_ORDER_STATUS_FAILED"
export const OnrampOrderStatus = Schema.Literals([
  "ONRAMP_ORDER_STATUS_PENDING_AUTH",
  "ONRAMP_ORDER_STATUS_PENDING_PAYMENT",
  "ONRAMP_ORDER_STATUS_PROCESSING",
  "ONRAMP_ORDER_STATUS_COMPLETED",
  "ONRAMP_ORDER_STATUS_FAILED",
]).annotate({ description: "The status of an onramp order." })
export type OnrampPaymentLinkType = "PAYMENT_LINK_TYPE_APPLE_PAY_BUTTON"
export const OnrampPaymentLinkType = Schema.Literal("PAYMENT_LINK_TYPE_APPLE_PAY_BUTTON").annotate({
  description: "The type of payment link.",
})
export type OnrampQuotePaymentMethodTypeId = "CARD" | "ACH" | "APPLE_PAY" | "PAYPAL" | "FIAT_WALLET" | "CRYPTO_WALLET"
export const OnrampQuotePaymentMethodTypeId = Schema.Literals([
  "CARD",
  "ACH",
  "APPLE_PAY",
  "PAYPAL",
  "FIAT_WALLET",
  "CRYPTO_WALLET",
]).annotate({ description: "The type of payment method used to generate the onramp quote." })
export type OnrampSession = { readonly onrampUrl: string }
export const OnrampSession = Schema.Struct({
  onrampUrl: Schema.String.annotate({ description: "A valid HTTP or HTTPS URL.", format: "uri" })
    .check(Schema.isMinLength(11))
    .check(Schema.isMaxLength(2048))
    .check(Schema.isPattern(new RegExp("^https?:\\/\\/.*$"))),
}).annotate({ description: "An onramp session containing a ready-to-use onramp URL." })
export type OnrampUserIdType = "phone_number"
export const OnrampUserIdType = Schema.Literal("phone_number").annotate({
  description:
    "The type of user identifier:\n- `phone_number`: A phone number in E.164 format associated with an onramp user.\n",
})
export type OnrampLimitType = "weekly_spending" | "lifetime_transactions"
export const OnrampLimitType = Schema.Literals(["weekly_spending", "lifetime_transactions"]).annotate({
  description:
    "The type of limit:\n- `weekly_spending`: Rolling 7-day spending limit. The limit applies to the sum of all completed transactions \n  within a sliding 168-hour (7-day) window. As time passes, older transactions naturally expire from the window. \n  $500 is the default limit.\n- `lifetime_transactions`: All-time transaction count limit. Tracks the total number of completed transactions \n  across the user's entire history with no time-based expiration. Once the limit is reached, no further \n  transactions are allowed. 15 is the default limit.\n",
})
export type PaymentMethodId = string
export const PaymentMethodId = Schema.String.annotate({
  description: "The ID of the Payment Method, which is a UUID prefixed by the string `paymentMethod_`.",
}).check(Schema.isPattern(new RegExp("^paymentMethod_[a-f0-9\\-]{36}$")))
export type Account = {
  readonly accountId: AccountId
  readonly type: AccountType
  readonly owner: Owner
  readonly name?: AccountName
  readonly createdAt: string
  readonly updatedAt: string
}
export const Account = Schema.Struct({
  accountId: AccountId,
  type: AccountType,
  owner: Owner,
  name: Schema.optionalKey(AccountName),
  createdAt: Schema.String.annotate({
    description: "The timestamp when the account was created.",
    format: "date-time",
  }),
  updatedAt: Schema.String.annotate({
    description: "The timestamp when the account was last updated.",
    format: "date-time",
  }),
})
export type CreateAccountRequest = { readonly name?: AccountName }
export const CreateAccountRequest = Schema.Struct({ name: Schema.optionalKey(AccountName) })
export type Error = {
  readonly errorType: ErrorType
  readonly errorMessage: string
  readonly correlationId?: string
  readonly errorLink?: string
  readonly unauthorizedCapabilities?: ReadonlyArray<CapabilityName>
}
export const Error = Schema.Struct({
  errorType: ErrorType,
  errorMessage: Schema.String.annotate({ description: "The error message." }),
  correlationId: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "A unique identifier for the request that generated the error. This can be used to help debug issues with the API.",
    }),
  ),
  errorLink: Schema.optionalKey(
    Schema.String.annotate({ description: "A valid HTTP or HTTPS URL.", format: "uri" })
      .check(Schema.isMinLength(11))
      .check(Schema.isMaxLength(2048))
      .check(Schema.isPattern(new RegExp("^https?:\\/\\/.*$"))),
  ),
  unauthorizedCapabilities: Schema.optionalKey(
    Schema.Array(CapabilityName).annotate({
      description:
        "The capability code(s) that were not authorized for the customer on\nthis request. Present only when `errorType` is\n`customer_not_authorized`; absent for every other error type.\n\nUse this list to render onboarding UX for the listed capabilities, or\nfetch `GET /v2/customers/{customerId}` and inspect each entry's\n`status` / `requirements` to discover what (if anything) can be\nsubmitted to resolve the block.\n",
    }),
  ),
}).annotate({
  description:
    "An error response including the code for the type of error and a human-readable message describing the error.",
})
export type Transfers_Account = { readonly accountId: string; readonly asset: Asset }
export const Transfers_Account = Schema.Struct({
  accountId: Schema.String.annotate({ description: "The ID of the Account." }),
  asset: Asset,
}).annotate({ title: "Account", description: "The Account specific details for the transfer." })
export type PaymentMethod = { readonly paymentMethodId: string; readonly asset: Asset }
export const PaymentMethod = Schema.Struct({
  paymentMethodId: Schema.String.annotate({ description: "The ID of the Payment Method." }),
  asset: Asset,
}).annotate({ title: "Payment Method", description: "The Payment Method specific details for the transfer." })
export type Balances_Asset = {
  readonly symbol: Asset
  readonly type: AssetType
  readonly name: string
  readonly decimals: number
}
export const Balances_Asset = Schema.Struct({
  symbol: Asset,
  type: AssetType,
  name: Schema.String.annotate({ description: "The name of the asset." }),
  decimals: Schema.Number.annotate({
    description:
      "The number of decimals (i.e. significant digits to the right of the decimal point) supported for the asset.",
  }).check(Schema.isInt()),
}).annotate({ description: "An asset, e.g. fiat or crypto." })
export type DepositDestinationReference = { readonly id: DepositDestinationId }
export const DepositDestinationReference = Schema.Struct({ id: DepositDestinationId }).annotate({
  description: "A reference to the deposit destination associated with the transfer.",
})
export type OnchainAddress = {
  readonly address: string
  readonly network: Network
  readonly destinationTag?: string
  readonly asset: string
}
export const OnchainAddress = Schema.Struct({
  address: Schema.String.annotate({
    description: "A blockchain address. Format varies by network (e.g., 0x-prefixed for EVM, base58 for Solana).",
  })
    .check(Schema.isMinLength(1))
    .check(Schema.isMaxLength(128)),
  network: Network,
  destinationTag: Schema.optionalKey(
    Schema.String.annotate({
      description:
        'The destination tag of the onchain address. Destination tags are used by certain networks\n(primarily XRP/Ripple) to identify specific recipients when multiple users share a single address.\nThe tag ensures funds are credited to the correct account within the shared address.\n\nExamples by network:\n- XRP/Ripple: Numeric values like "1234567890" or "123456"\n- Stellar (XLM): Memos which can be text, ID, or hash format\n\nNote: Most networks (Ethereum, Bitcoin, Solana) do not use destination tags.\n',
    }),
  ),
  asset: Schema.String.annotate({ description: "The symbol of the asset (e.g., eth, usd, usdc, usdt)." })
    .check(Schema.isMinLength(1))
    .check(Schema.isMaxLength(42)),
}).annotate({ title: "Onchain Address", description: "The target of the payment is an onchain address." })
export type DepositDestinationTarget = DepositDestinationTargetAccount
export const DepositDestinationTarget = Schema.Union([DepositDestinationTargetAccount], { mode: "oneOf" }).annotate({
  description: "The intended target for deposited funds.",
})
export type TransferFees = ReadonlyArray<TransferFee>
export const TransferFees = Schema.Array(TransferFee).annotate({
  description:
    "The fees associated with this transfer. Different transfer types have different fee structures.\n\n**NOTE:** These examples are not exhaustive.\n\nCommon examples:\n* **Crypto transfers**: Network fees (gas) paid in the native token\n* **Fiat conversions**: Processing fees + exchange fees in USD\n* **Wire transfers**: Wire fees ($15) + processing fees ($5) in USD\n* **Crypto conversions**: Spread fees paid in the source asset.",
})
export type DepositTravelRuleResponse = {
  readonly status: TravelRuleStatus
  readonly missingFields?: ReadonlyArray<string>
  readonly reason?: string
}
export const DepositTravelRuleResponse = Schema.Struct({
  status: TravelRuleStatus,
  missingFields: Schema.optionalKey(
    Schema.Array(Schema.String).annotate({
      description:
        'List of field paths that are still required to complete travel rule compliance. Each entry is a dot-separated path (e.g., "originator.name", "originator.address.countryCode"). Empty when status is "completed".',
    }),
  ),
  reason: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "Additional context about the current status. Present when status is `incomplete` to explain what needs to be fixed before the transfer can proceed.",
    }),
  ),
}).annotate({ description: "Response from submitting travel rule information for a deposit transfer." })
export type TravelRuleOriginator = {
  readonly financialInstitution?: string
  readonly name?: string
  readonly address?: PhysicalAddress
  readonly virtualAssetServiceProvider?: {
    readonly name?: string
    readonly address?: {
      readonly line1?: string
      readonly line2?: string
      readonly city?: string
      readonly state?: string
      readonly postCode?: string
      readonly countryCode?: string
    }
    readonly identifier?: string
  }
}
export const TravelRuleOriginator = Schema.Struct({
  financialInstitution: Schema.optionalKey(
    Schema.String.annotate({ description: "Name of the financial institution." }),
  ),
  name: Schema.optionalKey(Schema.String.annotate({ description: "Full name of the party." })),
  address: Schema.optionalKey(PhysicalAddress),
  virtualAssetServiceProvider: Schema.optionalKey(
    Schema.Struct({
      name: Schema.optionalKey(
        Schema.String.annotate({ description: "The name of the originating Virtual Asset Service Provider (VASP)." }),
      ),
      address: Schema.optionalKey(
        Schema.Struct({
          line1: Schema.optionalKey(Schema.String.annotate({ description: "Primary street address." })),
          line2: Schema.optionalKey(Schema.String.annotate({ description: "Secondary address information." })),
          city: Schema.optionalKey(Schema.String.annotate({ description: "City or locality." })),
          state: Schema.optionalKey(Schema.String.annotate({ description: "State, province, or region." })),
          postCode: Schema.optionalKey(Schema.String.annotate({ description: "Postal or ZIP code." })),
          countryCode: Schema.optionalKey(
            Schema.String.annotate({
              description:
                "ISO 3166-1 alpha-2 country code (2 characters). See https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes.",
            })
              .check(Schema.isMinLength(2))
              .check(Schema.isMaxLength(2)),
          ),
        }).annotate({ description: "The address of the originating Virtual Asset Service Provider (VASP)." }),
      ),
      identifier: Schema.optionalKey(
        Schema.String.annotate({
          description: "The Legal Entity Identifier of the originating Virtual Asset Service Provider (VASP).",
        }),
      ),
    }).annotate({
      description:
        "Information about the originating Virtual Asset Service Provider (VASP) that handles cryptocurrency or other virtual assets on behalf of customers.",
    }),
  ),
}).annotate({ description: "Information about a party (originator or beneficiary) for travel rule compliance." })
export type TravelRuleBeneficiary = {
  readonly financialInstitution?: string
  readonly name?: string
  readonly address?: PhysicalAddress
  readonly walletType?: "custodial" | "self_custody"
}
export const TravelRuleBeneficiary = Schema.Struct({
  financialInstitution: Schema.optionalKey(
    Schema.String.annotate({ description: "Name of the financial institution." }),
  ),
  name: Schema.optionalKey(Schema.String.annotate({ description: "Full name of the party." })),
  address: Schema.optionalKey(PhysicalAddress),
  walletType: Schema.optionalKey(
    Schema.Literals(["custodial", "self_custody"]).annotate({ description: "The type of the beneficiary's wallet." }),
  ),
}).annotate({ description: "Information about a party (originator or beneficiary) for travel rule compliance." })
export type DepositTravelRuleOriginator = {
  readonly name?: string
  readonly address?: PhysicalAddress
  readonly walletType?: "custodial" | "self_custody"
  readonly virtualAssetServiceProvider?: DepositTravelRuleVasp
  readonly personalId?: string
  readonly dateOfBirth?: DateOfBirth
}
export const DepositTravelRuleOriginator = Schema.Struct({
  name: Schema.optionalKey(Schema.String.annotate({ description: "Full name of the originator." })),
  address: Schema.optionalKey(PhysicalAddress),
  walletType: Schema.optionalKey(
    Schema.Literals(["custodial", "self_custody"]).annotate({ description: "The type of the originator's wallet." }),
  ),
  virtualAssetServiceProvider: Schema.optionalKey(DepositTravelRuleVasp),
  personalId: Schema.optionalKey(
    Schema.String.annotate({ description: "Government-issued personal identification number for the originator." }),
  ),
  dateOfBirth: Schema.optionalKey(DateOfBirth),
}).annotate({ description: "Originator information for a deposit travel rule submission." })
export type OAuth2Authentication = {
  readonly type: OAuth2ProviderType
  readonly sub: string
  readonly email?: string
  readonly name?: string
  readonly username?: string
}
export const OAuth2Authentication = Schema.Struct({
  type: OAuth2ProviderType,
  sub: Schema.String.annotate({
    description: "The unique identifier for the end user that is captured in the `sub` claim of the JWT.",
  }),
  email: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "The email address of the end user contained within the user's ID token, if available from third-party OAuth2 provider's token exchange.",
    }),
  ),
  name: Schema.optionalKey(
    Schema.String.annotate({
      description: "The full name of the end user if available from third-party OAuth2 provider's token exchange.",
    }),
  ),
  username: Schema.optionalKey(
    Schema.String.annotate({
      description: "The username of the end user if available from third-party OAuth2 provider's token exchange.",
    }),
  ),
}).annotate({
  title: "OAuth2Authentication",
  description: "Information about an end user who authenticates using a third-party provider.",
})
export type TelegramAuthentication = {
  readonly type: OAuth2ProviderType
  readonly id: number
  readonly firstName?: string
  readonly lastName?: string
  readonly photoUrl?: string
  readonly authDate: number
  readonly username?: string
}
export const TelegramAuthentication = Schema.Struct({
  type: OAuth2ProviderType,
  id: Schema.Number.annotate({ description: "The Telegram ID for the end user." }).check(Schema.isInt()),
  firstName: Schema.optionalKey(Schema.String.annotate({ description: "The Telegram user's first name." })),
  lastName: Schema.optionalKey(Schema.String.annotate({ description: "The Telegram user's last name." })),
  photoUrl: Schema.optionalKey(Schema.String.annotate({ description: "The Telegram user's profile picture." })),
  authDate: Schema.Number.annotate({ description: "The Telegram user's last login as a Unix timestamp." }).check(
    Schema.isInt(),
  ),
  username: Schema.optionalKey(Schema.String.annotate({ description: "The Telegram user's username." })),
}).annotate({ description: "Information about an end user who authenticates using Telegram." })
export type EIP712Message = {
  readonly domain: EIP712Domain
  readonly types: EIP712Types
  readonly primaryType: string
  readonly message: {}
}
export const EIP712Message = Schema.Struct({
  domain: EIP712Domain,
  types: EIP712Types,
  primaryType: Schema.String.annotate({
    description:
      "The primary type of the message. This is the name of the struct in the `types` object that is the root of the message.",
  }),
  message: Schema.Struct({}).annotate({
    description:
      "The message to sign. The structure of this message must match the `primaryType` struct in the `types` object.",
  }),
}).annotate({ description: "The message to sign using EIP-712." })
export type EvmEip7702DelegationOperation = {
  readonly delegationOperationId: string
  readonly status: "UNSPECIFIED" | "PENDING" | "SUBMITTED" | "COMPLETED" | "FAILED"
  readonly transactionHash?: string
  readonly network: EvmEip7702DelegationNetwork
  readonly delegateAddress?: string
}
export const EvmEip7702DelegationOperation = Schema.Struct({
  delegationOperationId: Schema.String.annotate({
    description: "The unique identifier for the delegation operation.",
    format: "uuid",
  }),
  status: Schema.Literals(["UNSPECIFIED", "PENDING", "SUBMITTED", "COMPLETED", "FAILED"]).annotate({
    description:
      "The current status of the delegation operation.\nUNSPECIFIED means the status has not been set. PENDING means the operation has been created but not yet submitted. SUBMITTED means the operation has been submitted to the network. COMPLETED means the operation has completed successfully. FAILED means the operation has failed.",
  }),
  transactionHash: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "The hash of the delegation transaction, if available. Present once the transaction has been submitted to the network.",
    }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{64}$"))),
  ),
  network: EvmEip7702DelegationNetwork,
  delegateAddress: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "The address the account has delegated to, if any. Only present when the account has an active delegation.",
    }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
  ),
}).annotate({ description: "The status of an EIP-7702 delegation operation." })
export type UserOperationReceipt = {
  readonly revert?: UserOperationReceiptRevert
  readonly transactionHash?: string
  readonly blockHash?: string
  readonly blockNumber?: number
  readonly gasUsed?: string
}
export const UserOperationReceipt = Schema.Struct({
  revert: Schema.optionalKey(UserOperationReceiptRevert),
  transactionHash: Schema.optionalKey(
    Schema.String.annotate({ description: "The hash of this transaction as 0x-prefixed string." }).check(
      Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{64}$")),
    ),
  ),
  blockHash: Schema.optionalKey(
    Schema.String.annotate({
      description: "The block hash of the block including the transaction as 0x-prefixed string.",
    }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{64}$|^$"))),
  ),
  blockNumber: Schema.optionalKey(
    Schema.Number.annotate({ description: "The block height (number) of the block including the transaction." }).check(
      Schema.isInt(),
    ),
  ),
  gasUsed: Schema.optionalKey(Schema.String.annotate({ description: "The gas used for landing this user operation." })),
}).annotate({ description: "The receipt that contains information about the execution of user operation." })
export type CreateSpendPermissionRequest = {
  readonly network: SpendPermissionNetwork
  readonly spender: string
  readonly token: string
  readonly allowance: string
  readonly period: string
  readonly start: string
  readonly end: string
  readonly salt?: string
  readonly extraData?: string
  readonly paymasterUrl?: string
}
export const CreateSpendPermissionRequest = Schema.Struct({
  network: SpendPermissionNetwork,
  spender: Schema.String.annotate({
    description: "Entity that can spend account's tokens. Can be either a Smart Account or an EOA.",
  }).check(Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$"))),
  token: Schema.String.annotate({
    description:
      'ERC-7528 native token address (e.g. "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" for native ETH), or an  ERC-20 contract address.',
  }).check(Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$"))),
  allowance: Schema.String.annotate({
    description: "Maximum allowed value to spend, in atomic units for the specified token, within each period.",
  }),
  period: Schema.String.annotate({
    description: "Time duration for resetting used allowance on a recurring basis (seconds).",
  }),
  start: Schema.String.annotate({ description: "The start time for this spend permission, in Unix seconds." }),
  end: Schema.String.annotate({ description: "The expiration time for this spend permission, in Unix seconds." }),
  salt: Schema.optionalKey(
    Schema.String.annotate({
      description: "An arbitrary salt to differentiate unique spend permissions with otherwise identical data.",
    }),
  ),
  extraData: Schema.optionalKey(
    Schema.String.annotate({ description: "Arbitrary data to include in the permission." }),
  ),
  paymasterUrl: Schema.optionalKey(
    Schema.String.annotate({ description: "A valid HTTP or HTTPS URL.", format: "uri" })
      .check(Schema.isMinLength(11))
      .check(Schema.isMaxLength(2048))
      .check(Schema.isPattern(new RegExp("^https?:\\/\\/.*$"))),
  ),
}).annotate({ description: "Request parameters for creating a Spend Permission." })
export type RevokeSpendPermissionRequest = {
  readonly network: SpendPermissionNetwork
  readonly permissionHash: string
  readonly paymasterUrl?: string
}
export const RevokeSpendPermissionRequest = Schema.Struct({
  network: SpendPermissionNetwork,
  permissionHash: Schema.String.annotate({ description: "The hash of the spend permission to revoke." }),
  paymasterUrl: Schema.optionalKey(
    Schema.String.annotate({ description: "A valid HTTP or HTTPS URL.", format: "uri" })
      .check(Schema.isMinLength(11))
      .check(Schema.isMaxLength(2048))
      .check(Schema.isPattern(new RegExp("^https?:\\/\\/.*$"))),
  ),
}).annotate({ description: "Request parameters for revoking a Spend Permission." })
export type SpendPermissionResponseObject = {
  readonly permission: SpendPermission
  readonly permissionHash: string
  readonly revoked: boolean
  readonly revokedAt?: string
  readonly createdAt: string
  readonly network: SpendPermissionNetwork
}
export const SpendPermissionResponseObject = Schema.Struct({
  permission: SpendPermission,
  permissionHash: Schema.String.annotate({ description: "Unique hash identifier for this permission." }),
  revoked: Schema.Boolean.annotate({ description: "Whether this permission has been revoked." }),
  revokedAt: Schema.optionalKey(
    Schema.String.annotate({
      description: "The UTC ISO 8601 timestamp when the permission was revoked (if applicable).",
      format: "date-time",
    }),
  ),
  createdAt: Schema.String.annotate({
    description: "The UTC ISO 8601 timestamp when the permission was created.",
    format: "date-time",
  }),
  network: SpendPermissionNetwork,
})
export type GetSwapPriceResponseWrapper = GetSwapPriceResponse | SwapUnavailableResponse
export const GetSwapPriceResponseWrapper = Schema.Union([GetSwapPriceResponse, SwapUnavailableResponse], {
  mode: "oneOf",
}).annotate({ description: "A wrapper for the response of a swap price operation." })
export type Token = {
  readonly network: ListEvmTokenBalancesNetwork
  readonly symbol?: string
  readonly name?: string
  readonly contractAddress: string
}
export const Token = Schema.Struct({
  network: ListEvmTokenBalancesNetwork,
  symbol: Schema.optionalKey(
    Schema.String.annotate({
      description:
        'The symbol of this token (ex: SOL, ETH, USDC).\nThe token symbol is not unique. It is possible for two different tokens to have the same symbol.\nFor native gas tokens, this symbol is defined via convention. As an example, for ETH on Ethereum mainnet, the symbol is "ETH". For ERC-20 tokens, this symbol is defined via configuration. `symbol` will be the string returned by `function symbol() public view returns (string)` on the underlying token contract.\nNot all tokens have a symbol, as this function is [optional in the ERC-20 specification](https://eips.ethereum.org/EIPS/eip-20#symbol). This field will only be populated when the token\'s underlying ERC-20 contract has a `symbol()` function.\nFurther, this endpoint will only populate this value for a small subset of whitelisted ERC-20 tokens at this time. We intend to improve coverage in the future.',
    }),
  ),
  name: Schema.optionalKey(
    Schema.String.annotate({
      description:
        'The name of this token (ex: "Solana", "Ether", "USD Coin").\nThe token name is not unique. It is possible for two different tokens to have the same name.\nFor native gas tokens, this name is defined via convention. As an example, for ETH on Ethereum mainnet, the name is "Ether". For ERC-20 tokens, this name is defined via configuration. `name` will be the string returned by `function name() public view returns (string)` on the underlying token contract.\nNot all tokens have a name, as this function is [optional in the ERC-20 specification](https://eips.ethereum.org/EIPS/eip-20#name). This field will only be populated when the token\'s underlying ERC-20 contract has a `name()` function.\nFurther, this endpoint will only populate this value for a small subset of whitelisted ERC-20 tokens at this time. We intend to improve coverage in the future.',
    }),
  ),
  contractAddress: Schema.String.annotate({
    description:
      "The contract address of the token.\nFor Ether, the contract address is `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE` per [EIP-7528](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-7528.md). For ERC-20 tokens, this is the contract address where the token is deployed.",
  }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
}).annotate({
  description: "General information about a token. Includes the type, the network, and other identifying information.",
})
export type AbiFunction = {
  readonly type: "function"
  readonly name: string
  readonly inputs: ReadonlyArray<AbiParameter>
  readonly outputs: ReadonlyArray<AbiParameter>
  readonly constant?: boolean
  readonly payable?: boolean
  readonly stateMutability: AbiStateMutability
  readonly gas?: number
}
export const AbiFunction = Schema.Struct({
  type: Schema.Literal("function").annotate({ description: "The type of the ABI item, must be `function`." }),
  name: Schema.String.annotate({ description: "The name of the ABI function." }),
  inputs: Schema.Array(AbiParameter).annotate({ description: "The list of ABI parameters used for this function." }),
  outputs: Schema.Array(AbiParameter).annotate({ description: "The values returned by this function." }),
  constant: Schema.optionalKey(
    Schema.Boolean.annotate({ description: "Deprecated. Use pure or view from stateMutability instead." }),
  ),
  payable: Schema.optionalKey(
    Schema.Boolean.annotate({ description: "Deprecated. Use payable or nonpayable from `stateMutability` instead." }),
  ),
  stateMutability: AbiStateMutability,
  gas: Schema.optionalKey(
    Schema.Number.annotate({ description: "Deprecated. Vyper used to provide gas estimates." }).check(Schema.isInt()),
  ),
}).annotate({ title: "AbiFunction", description: "ABI function type for contract functions." })
export type EvmDataCondition = {
  readonly function: string
  readonly params?: ReadonlyArray<EvmDataParameterCondition | EvmDataParameterConditionList>
}
export const EvmDataCondition = Schema.Struct({
  function: Schema.String.annotate({ description: "The name of a smart contract function being called." }),
  params: Schema.optionalKey(
    Schema.Array(
      Schema.Union([EvmDataParameterCondition, EvmDataParameterConditionList], { mode: "oneOf" }).annotate({
        description:
          "A list of parameter conditions to apply against encoded arguments in the transaction's `data` field.",
      }),
    ).annotate({
      description:
        "An optional list of parameter conditions to apply against encoded arguments in the transaction's `data` field.",
    }),
  ),
}).annotate({
  description:
    "A single condition to apply against the function and encoded arguments in the transaction's `data` field. Each `parameter` configuration must be successfully evaluated against the corresponding function argument in order for a policy to be accepted.",
})
export type SignEvmMessageCriteria = ReadonlyArray<EvmMessageCriterion>
export const SignEvmMessageCriteria = Schema.Array(Schema.Union([EvmMessageCriterion], { mode: "oneOf" })).annotate({
  description: "A schema for specifying the rejection criteria for the SignEvmMessage operation.",
})
export type SignEndUserEvmMessageCriteria = ReadonlyArray<EvmMessageCriterion>
export const SignEndUserEvmMessageCriteria = Schema.Array(
  Schema.Union([EvmMessageCriterion], { mode: "oneOf" }),
).annotate({ description: "A schema for specifying criteria for the signEndUserEvmMessage operation." })
export type SignEvmTypedDataFieldCriterion = {
  readonly type: "evmTypedDataField"
  readonly types: {
    readonly types: { readonly [x: string]: ReadonlyArray<{ readonly name?: string; readonly type?: string }> }
    readonly primaryType: string
  }
  readonly conditions: ReadonlyArray<EvmTypedAddressCondition | EvmTypedNumericalCondition | EvmTypedStringCondition>
}
export const SignEvmTypedDataFieldCriterion = Schema.Struct({
  type: Schema.Literal("evmTypedDataField").annotate({
    description: "The type of criterion to use. This should be `evmTypedDataField`.",
  }),
  types: Schema.Struct({
    types: Schema.Record(
      Schema.String,
      Schema.Array(
        Schema.Struct({
          name: Schema.optionalKey(
            Schema.String.annotate({ description: "The name of a key within an EIP-712 data structure." }),
          ),
          type: Schema.optionalKey(
            Schema.String.annotate({ description: "The Solidity type of a value within an EIP-712 data structure." }),
          ),
        }),
      ).annotate({ description: "Object containing names and types for fields within structured data." }),
    ).annotate({ description: "EIP-712 compliant map of model names to model definitions." }),
    primaryType: Schema.String.annotate({
      description: "The name of the root EIP-712 type. This value must be included in the `types` object.",
    }),
  }).annotate({
    description:
      "An object containing EIP-712 type definitions, as well as a primary type for the root message object.",
  }),
  conditions: Schema.Array(
    Schema.Union([EvmTypedAddressCondition, EvmTypedNumericalCondition, EvmTypedStringCondition], { mode: "oneOf" }),
  ).annotate({
    description:
      "A list of conditions to check against the data being signed. Each condition must be met for the rule to take effect.",
  }),
}).annotate({ title: "SignEvmTypedDataFieldCriterion" })
export type SolDataCondition = {
  readonly instruction: string
  readonly params?: ReadonlyArray<SolDataParameterCondition | SolDataParameterConditionList>
}
export const SolDataCondition = Schema.Struct({
  instruction: Schema.String.annotate({ description: "The instruction name." }),
  params: Schema.optionalKey(
    Schema.Array(
      Schema.Union([SolDataParameterCondition, SolDataParameterConditionList], { mode: "oneOf" }).annotate({
        description: "A list of parameter conditions to apply against a specific instruction's data.",
      }),
    ).annotate({ description: "Parameter conditions for the instruction." }),
  ),
}).annotate({ description: "A single condition to apply against a specific instruction type and its parameters." })
export type SignSolMessageCriteria = ReadonlyArray<SolMessageCriterion>
export const SignSolMessageCriteria = Schema.Array(Schema.Union([SolMessageCriterion], { mode: "oneOf" })).annotate({
  description: "A schema for specifying criteria for the SignSolMessage operation.",
})
export type SignEndUserSolMessageCriteria = ReadonlyArray<SolMessageCriterion>
export const SignEndUserSolMessageCriteria = Schema.Array(
  Schema.Union([SolMessageCriterion], { mode: "oneOf" }),
).annotate({ description: "A schema for specifying criteria for the signEndUserSolMessage operation." })
export type SolanaTokenBalance = { readonly amount: SolanaTokenAmount; readonly token: SolanaToken }
export const SolanaTokenBalance = Schema.Struct({ amount: SolanaTokenAmount, token: SolanaToken })
export type OnchainDataTableSchema = {
  readonly database?: string
  readonly table?: string
  readonly columns?: ReadonlyArray<OnchainDataColumnSchema>
}
export const OnchainDataTableSchema = Schema.Struct({
  database: Schema.optionalKey(
    Schema.String.annotate({ description: "The blockchain network database this table belongs to." }),
  ),
  table: Schema.optionalKey(Schema.String.annotate({ description: "Table name." })),
  columns: Schema.optionalKey(
    Schema.Array(OnchainDataColumnSchema).annotate({ description: "Column definitions for this table." }),
  ),
}).annotate({ description: "Schema definition for a data table." })
export type WebhookSubscriptionResponse = {
  readonly createdAt: string
  readonly updatedAt?: string
  readonly description?: string
  readonly eventTypes: ReadonlyArray<string>
  readonly isEnabled: boolean
  readonly metadata?: { readonly secret?: string }
  readonly secret: string
  readonly subscriptionId: string
  readonly target: WebhookTarget
  readonly labels?: { readonly [x: string]: string }
}
export const WebhookSubscriptionResponse = Schema.Struct({
  createdAt: Schema.String.annotate({ description: "When the subscription was created.", format: "date-time" }),
  updatedAt: Schema.optionalKey(
    Schema.String.annotate({ description: "When the subscription was last updated.", format: "date-time" }),
  ),
  description: Schema.optionalKey(
    Schema.String.annotate({ description: "A human-readable description." })
      .check(Schema.isMinLength(0))
      .check(Schema.isMaxLength(500)),
  ),
  eventTypes: Schema.Array(Schema.String).annotate({
    description:
      'Types of events to subscribe to. Event types follow a dot-separated format:\nservice.resource.verb (e.g., "onchain.activity.detected", "wallet.activity.detected", "onramp.transaction.created",\n"acceptance.payment_session.authorization_succeeded").\n',
  }),
  isEnabled: Schema.Boolean.annotate({ description: "Whether the subscription is enabled." }),
  metadata: Schema.optionalKey(
    Schema.Struct({
      secret: Schema.optionalKey(
        Schema.String.annotate({
          description: "Use the root-level `secret` field instead. Maintained for backward compatibility only.",
          format: "uuid",
        }),
      ),
    })
      .annotate({
        description:
          "Optional metadata as key-value pairs. Use this to store additional structured information on a resource, such as customer IDs, order references, or any application-specific data. Up to 10 key/value pairs may be provided. Keys and values are both strings. Keys must be ≤ 40 characters; values must be ≤ 500 characters.",
      })
      .check(Schema.isMaxProperties(10)),
  ),
  secret: Schema.String.annotate({ description: "Secret for webhook signature validation.", format: "uuid" }),
  subscriptionId: Schema.String.annotate({ description: "Unique identifier for the subscription.", format: "uuid" }),
  target: WebhookTarget,
  labels: Schema.optionalKey(
    Schema.Record(Schema.String, Schema.String).annotate({
      description:
        "Multi-label filters using total overlap logic. Total overlap means the subscription only triggers when events contain ALL these key-value pairs.\nPresent when subscription uses multi-label format.\n",
    }),
  ),
}).annotate({ description: "Response containing webhook subscription details." })
export type WebhookSubscriptionRequest = {
  readonly description?: string
  readonly eventTypes: ReadonlyArray<string>
  readonly isEnabled: boolean
  readonly target: WebhookTarget
  readonly metadata?: Metadata
  readonly labels?: { readonly [x: string]: string }
}
export const WebhookSubscriptionRequest = Schema.Struct({
  description: Schema.optionalKey(
    Schema.String.annotate({ description: "A human-readable description." })
      .check(Schema.isMinLength(0))
      .check(Schema.isMaxLength(500)),
  ),
  eventTypes: Schema.Array(Schema.String).annotate({
    description:
      'Types of events to subscribe to. Event types follow a dot-separated format:\nservice.resource.verb (e.g., "onchain.activity.detected", "wallet.activity.detected", "onramp.transaction.created",\n"acceptance.payment_session.authorization_succeeded").\nThe subscription will only receive events matching these types AND the label filter(s).\n',
  }),
  isEnabled: Schema.Boolean.annotate({ description: "Whether the subscription is enabled." }),
  target: WebhookTarget,
  metadata: Schema.optionalKey(Metadata),
  labels: Schema.optionalKey(
    Schema.Record(Schema.String, Schema.String).annotate({
      description:
        "Optional. Multi-label filters using total overlap logic. Total overlap means the subscription will only trigger when\nan event contains ALL the key-value pairs specified here. Additional labels on\nthe event are allowed and will not prevent matching. Omit to receive all events for the selected event types.\n\n**Note:** Currently, labels are supported for onchain webhooks only.\n\nSee [allowed labels for onchain webhooks](https://docs.cdp.coinbase.com/api-reference/v2/rest-api/webhooks/create-webhook-subscription#onchain-label-filtering).\n",
    }),
  ),
}).annotate({ description: "Request to create a new webhook subscription with support for multi-label filtering.\n" })
export type WebhookSubscriptionUpdateRequest = {
  readonly description?: string
  readonly eventTypes: ReadonlyArray<string>
  readonly isEnabled: boolean
  readonly target: WebhookTarget
  readonly metadata?: Metadata
  readonly labels?: { readonly [x: string]: string }
}
export const WebhookSubscriptionUpdateRequest = Schema.Struct({
  description: Schema.optionalKey(
    Schema.String.annotate({ description: "A human-readable description." })
      .check(Schema.isMinLength(0))
      .check(Schema.isMaxLength(500)),
  ),
  eventTypes: Schema.Array(Schema.String).annotate({
    description:
      'Types of events to subscribe to. Event types follow a three-part dot-separated format:\nservice.resource.verb (e.g., "onchain.activity.detected", "wallet.activity.detected", "onramp.transaction.created").\n',
  }),
  isEnabled: Schema.Boolean.annotate({ description: "Whether the subscription is enabled." }),
  target: WebhookTarget,
  metadata: Schema.optionalKey(Metadata),
  labels: Schema.optionalKey(
    Schema.Record(Schema.String, Schema.String).annotate({
      description:
        "Optional. Multi-label filters that trigger only when an event contains ALL of these key-value pairs.\n\n**Note:** Currently, labels are supported for onchain webhooks only.\n\nSee [allowed labels for onchain webhooks](https://docs.cdp.coinbase.com/api-reference/v2/rest-api/webhooks/create-webhook-subscription#onchain-label-filtering).\nOmit to receive all events for the selected event types.\n",
    }),
  ),
}).annotate({ description: "Request to update an existing webhook subscription.\n" })
export type WebhookEventResponse = {
  readonly eventId: string
  readonly eventTypeName: string
  readonly status: "pending" | "processing" | "succeeded" | "failed" | "retrying"
  readonly createdAt: string
  readonly succeededAt?: string
  readonly retryCount: number
  readonly response?: WebhookEventResponseDetail
}
export const WebhookEventResponse = Schema.Struct({
  eventId: Schema.String.annotate({ description: "Unique identifier for the webhook event." }),
  eventTypeName: Schema.String.annotate({
    description: 'The type of event that was delivered (e.g., "onchain.activity.detected").',
  }),
  status: Schema.Literals(["pending", "processing", "succeeded", "failed", "retrying"]).annotate({
    description: "Current delivery status of the event.",
  }),
  createdAt: Schema.String.annotate({
    description: "Timestamp when the event delivery attempt was created.",
    format: "date-time",
  }),
  succeededAt: Schema.optionalKey(
    Schema.String.annotate({
      description: 'Timestamp when the event was successfully delivered. Only present if status is "succeeded".',
      format: "date-time",
    }),
  ),
  retryCount: Schema.Number.annotate({ description: "Number of delivery retry attempts so far." }).check(
    Schema.isInt(),
  ),
  response: Schema.optionalKey(WebhookEventResponseDetail),
}).annotate({ description: "Details of a webhook event delivery attempt for a subscription." })
export type X402SupportedPaymentKind = {
  readonly x402Version: X402Version
  readonly scheme: "exact" | "upto" | "batch-settlement"
  readonly network:
    | "base-sepolia"
    | "base"
    | "solana-devnet"
    | "solana"
    | "eip155:8453"
    | "eip155:84532"
    | "eip155:137"
    | "eip155:42161"
    | "eip155:480"
    | "eip155:4801"
    | "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"
    | "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1"
  readonly extra?: { readonly [x: string]: unknown }
}
export const X402SupportedPaymentKind = Schema.Struct({
  x402Version: X402Version,
  scheme: Schema.Literals(["exact", "upto", "batch-settlement"]).annotate({
    description: "The scheme of the payment protocol.",
  }),
  network: Schema.Literals([
    "base-sepolia",
    "base",
    "solana-devnet",
    "solana",
    "eip155:8453",
    "eip155:84532",
    "eip155:137",
    "eip155:42161",
    "eip155:480",
    "eip155:4801",
    "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
    "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
  ]).annotate({
    description:
      "The network of the blockchain. The format corresponds to the `x402Version` of the enclosing `x402SupportedPaymentKind`: v1 uses human-readable names (see `X402V1Network`); v2 uses CAIP-2 chain IDs (see `X402V2Network`).",
  }),
  extra: Schema.optionalKey(
    Schema.Record(Schema.String, Schema.Unknown).annotate({
      description:
        'The optional additional scheme-specific payment info.\nCommon scheme-specific fields:\n  - `exact` on Solana: `feePayer` — the base58-encoded Solana address that pays transaction fees.\n  - `upto` on EVM: `name`, `version`, and `facilitatorAddress` — the EVM address of the facilitator that the client must bind into the Permit2 witness when constructing the payment payload.\n  - `batch-settlement` on EVM: `name`, `version`, `receiverAuthorizer` (the EVM address authorized to sign claim batches), `withdrawDelay` (channel non-cooperative withdraw delay in seconds, 900–2,592,000), and optionally `assetTransferMethod` (e.g., `"eip3009"`).',
    }),
  ),
}).annotate({
  description:
    "The supported payment kind for the x402 protocol. A kind is comprised of a scheme and a network, which together uniquely identify a way to move money on the x402 protocol. For more details, please see [x402 Schemes](https://github.com/coinbase/x402?tab=readme-ov-file#schemes).",
})
export type X402BatchSettlementClaim = {
  readonly voucher: { readonly channel: X402BatchSettlementChannelConfig; readonly maxClaimableAmount: string }
  readonly signature: string
  readonly totalClaimed: string
}
export const X402BatchSettlementClaim = Schema.Struct({
  voucher: Schema.Struct({
    channel: X402BatchSettlementChannelConfig,
    maxClaimableAmount: Schema.String.annotate({
      description:
        "The cumulative maximum claimable amount (uint128 as decimal string) signed by the payer authorizer.",
    }).check(Schema.isPattern(new RegExp("^[0-9]+$"))),
  }).annotate({
    description:
      "The voucher to claim, identified by the channel config it was signed against and its cumulative ceiling. Field shape mirrors the on-chain claim struct.",
  }),
  signature: Schema.String.annotate({ description: "The voucher signature from `payerAuthorizer`." }).check(
    Schema.isPattern(new RegExp("^0x[0-9a-fA-F]+$")),
  ),
  totalClaimed: Schema.String.annotate({
    description: "The cumulative amount already claimed from this channel as of this claim.",
  }).check(Schema.isPattern(new RegExp("^[0-9]+$"))),
}).annotate({
  title: "x402BatchSettlementClaim",
  description:
    "A single voucher claim within a batched on-chain claim transaction. Used by `x402BatchSettlementClaimPayload.claims` and by the server-enriched shape of `x402BatchSettlementRefundPayload.claims`.\nNOTE: the nested `voucher` here has a **different shape** from the top-level `x402BatchSettlementVoucher` schema. The top-level voucher is the signed cumulative-ceiling message sent by a client (`{channelId, maxClaimableAmount, signature}`). This nested `voucher` mirrors the on-chain claim struct (`{channel: ChannelConfig, maxClaimableAmount}`) that participates in the EIP-712 hash, with `signature` and `totalClaimed` as siblings rather than nested fields. The field names match the upstream x402 protocol and the on-chain Solidity struct; they cannot be renamed without breaking wire and EIP-712 compatibility.",
})
export type X402VerifyPaymentRejection = {
  readonly isValid: boolean
  readonly invalidReason: X402VerifyInvalidReason
  readonly invalidMessage?: string
  readonly payer?: string
}
export const X402VerifyPaymentRejection = Schema.Struct({
  isValid: Schema.Boolean.annotate({ description: "Indicates whether the payment is valid." }),
  invalidReason: X402VerifyInvalidReason,
  invalidMessage: Schema.optionalKey(
    Schema.String.annotate({ description: "The message describing the invalid reason." }),
  ),
  payer: Schema.optionalKey(
    Schema.String.annotate({
      description: "A blockchain address. Format varies by network (e.g., 0x-prefixed for EVM, base58 for Solana).",
    })
      .check(Schema.isMinLength(1))
      .check(Schema.isMaxLength(128)),
  ),
}).annotate({ description: "The result when x402 payment verification fails." })
export type X402SettlePaymentRejection = {
  readonly success: boolean
  readonly errorReason: X402SettleErrorReason
  readonly errorMessage?: string
  readonly payer?: string
  readonly transaction?: string
  readonly network?: string
}
export const X402SettlePaymentRejection = Schema.Struct({
  success: Schema.Boolean.annotate({ description: "Indicates whether the payment settlement is successful." }),
  errorReason: X402SettleErrorReason,
  errorMessage: Schema.optionalKey(Schema.String.annotate({ description: "The message describing the error reason." })),
  payer: Schema.optionalKey(
    Schema.String.annotate({
      description: "A blockchain address. Format varies by network (e.g., 0x-prefixed for EVM, base58 for Solana).",
    })
      .check(Schema.isMinLength(1))
      .check(Schema.isMaxLength(128)),
  ),
  transaction: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "The transaction of the settlement.\nFor EVM networks, the transaction will be a 0x-prefixed, EVM transaction hash.\nFor Solana-based networks, the transaction will be a base58-encoded Solana signature.",
    }).check(Schema.isPattern(new RegExp("^(0x[a-fA-F0-9]{64}|[1-9A-HJ-NP-Za-km-z]{87,88})$"))),
  ),
  network: Schema.optionalKey(Schema.String.annotate({ description: "The network where the settlement occurred." })),
}).annotate({ description: "The result when x402 payment settlement fails." })
export type X402DiscoveryResource = {
  readonly resource: string
  readonly description?: string
  readonly type: "http" | "mcp"
  readonly x402Version: X402Version
  readonly lastUpdated?: string
  readonly accepts?: ReadonlyArray<X402PaymentRequirements>
  readonly extensions?: { readonly [x: string]: unknown }
  readonly quality?: X402ResourceQuality
  readonly serviceName?: string
  readonly tags?: ReadonlyArray<string>
  readonly iconUrl?: string
}
export const X402DiscoveryResource = Schema.Struct({
  resource: Schema.String.annotate({ description: "The URL of the resource." }),
  description: Schema.optionalKey(
    Schema.String.annotate({ description: "A human-readable description of the resource." }),
  ),
  type: Schema.Literals(["http", "mcp"]).annotate({ description: 'Communication protocol (e.g., "http", "mcp").' }),
  x402Version: X402Version,
  lastUpdated: Schema.optionalKey(
    Schema.String.annotate({ description: "Timestamp of the last update.", format: "date-time" }),
  ),
  accepts: Schema.optionalKey(
    Schema.Array(X402PaymentRequirements).annotate({ description: "Payment requirements accepted by the resource." }),
  ),
  extensions: Schema.optionalKey(
    Schema.Record(Schema.String, Schema.Unknown).annotate({
      description: "Map of x402 protocol extensions supported by the resource, keyed by extension name.",
    }),
  ),
  quality: Schema.optionalKey(X402ResourceQuality),
  serviceName: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "Provider-supplied display name of the service this resource belongs to. This is a free-form\nlabel for grouping and presentation only — it is not a stable identifier, and two resources\nsharing the same `serviceName` are not guaranteed to belong to the same logical service.\n",
    }),
  ),
  tags: Schema.optionalKey(
    Schema.Array(Schema.String).annotate({
      description:
        "Provider-supplied, low-cardinality string labels associated with the resource for client-side\nfiltering and display. Values are free-form (no controlled vocabulary) and case-sensitive.\nOrder is not significant and duplicates are not expected.\n",
    }),
  ),
  iconUrl: Schema.optionalKey(
    Schema.String.annotate({ description: "A valid HTTP or HTTPS URL.", format: "uri" })
      .check(Schema.isMinLength(11))
      .check(Schema.isMaxLength(2048))
      .check(Schema.isPattern(new RegExp("^https?:\\/\\/.*$"))),
  ),
}).annotate({ description: "A single discovered x402 resource." })
export type X402McpResponse = {
  readonly jsonrpc: "2.0"
  readonly id?: string | number
  readonly result?: { readonly [x: string]: unknown }
  readonly error?: X402McpError
}
export const X402McpResponse = Schema.Struct({
  jsonrpc: Schema.Literal("2.0").annotate({ description: "JSON-RPC version." }),
  id: Schema.optionalKey(
    Schema.Union([Schema.String, Schema.Number.check(Schema.isInt())], { mode: "oneOf" }).annotate({
      description: "Request identifier (matches the request ID, null for notifications).",
    }),
  ),
  result: Schema.optionalKey(
    Schema.Record(Schema.String, Schema.Unknown).annotate({
      description: "The result of the method call (present on success).",
    }),
  ),
  error: Schema.optionalKey(X402McpError),
}).annotate({ description: "A JSON-RPC 2.0 response for the Model Context Protocol." })
export type OnrampQuote = {
  readonly paymentTotal: string
  readonly paymentSubtotal: string
  readonly paymentCurrency: string
  readonly purchaseAmount: string
  readonly purchaseCurrency: string
  readonly destinationNetwork: string
  readonly fees: ReadonlyArray<OnrampOrderFee>
  readonly exchangeRate: string
}
export const OnrampQuote = Schema.Struct({
  paymentTotal: Schema.String.annotate({ description: "The total amount of fiat to be paid, inclusive of any fees." }),
  paymentSubtotal: Schema.String.annotate({ description: "The amount of fiat to be converted to crypto." }),
  paymentCurrency: Schema.String.annotate({ description: "The fiat currency to be converted to crypto." }),
  purchaseAmount: Schema.String.annotate({ description: "The amount of crypto to be purchased." }),
  purchaseCurrency: Schema.String.annotate({ description: "The crypto currency to be purchased." }),
  destinationNetwork: Schema.String.annotate({ description: "The network to send the crypto on." }),
  fees: Schema.Array(OnrampOrderFee).annotate({ description: "The fees associated with the quote." }),
  exchangeRate: Schema.String.annotate({
    description: "The exchange rate used to convert fiat to crypto i.e. the crypto value of one fiat.",
  }),
}).annotate({ description: "Quote information with pricing details for the crypto purchase." })
export type OnrampOrder = {
  readonly orderId: string
  readonly paymentTotal: string
  readonly paymentSubtotal: string
  readonly paymentCurrency: string
  readonly paymentMethod: OnrampOrderPaymentMethodTypeId
  readonly purchaseAmount: string
  readonly purchaseCurrency: string
  readonly fees: ReadonlyArray<OnrampOrderFee>
  readonly exchangeRate: string
  readonly destinationAddress: string
  readonly destinationNetwork: string
  readonly status: OnrampOrderStatus
  readonly txHash?: string
  readonly createdAt: string
  readonly updatedAt: string
  readonly partnerUserRef?: string
}
export const OnrampOrder = Schema.Struct({
  orderId: Schema.String.annotate({ description: "The ID of the onramp order." }),
  paymentTotal: Schema.String.annotate({ description: "The total amount of fiat to be paid, inclusive of any fees." }),
  paymentSubtotal: Schema.String.annotate({ description: "The amount of fiat to be converted to crypto." }),
  paymentCurrency: Schema.String.annotate({ description: "The fiat currency to be converted to crypto." }),
  paymentMethod: OnrampOrderPaymentMethodTypeId,
  purchaseAmount: Schema.String.annotate({ description: "The amount of crypto to be purchased." }),
  purchaseCurrency: Schema.String.annotate({ description: "The crypto currency to be purchased." }),
  fees: Schema.Array(OnrampOrderFee).annotate({ description: "The fees associated with the order." }),
  exchangeRate: Schema.String.annotate({
    description: "The exchange rate used to convert fiat to crypto i.e. the crypto value of one fiat.",
  }),
  destinationAddress: Schema.String.annotate({
    description: "A blockchain address. Format varies by network (e.g., 0x-prefixed for EVM, base58 for Solana).",
  })
    .check(Schema.isMinLength(1))
    .check(Schema.isMaxLength(128)),
  destinationNetwork: Schema.String.annotate({ description: "The network to send the crypto on." }),
  status: OnrampOrderStatus,
  txHash: Schema.optionalKey(
    Schema.String.annotate({
      description: "The transaction hash of the order (only available once crypto has been sent).",
    }),
  ),
  createdAt: Schema.String.annotate({ description: "The date and time the order was created." }),
  updatedAt: Schema.String.annotate({ description: "The date and time the order was last updated." }),
  partnerUserRef: Schema.optionalKey(Schema.String.annotate({ description: "The partner user reference ID." })),
}).annotate({ description: "An Onramp order." })
export type OnrampPaymentLink = { readonly url: string; readonly paymentLinkType: OnrampPaymentLinkType }
export const OnrampPaymentLink = Schema.Struct({
  url: Schema.String.annotate({ description: "A valid HTTP or HTTPS URL.", format: "uri" })
    .check(Schema.isMinLength(11))
    .check(Schema.isMaxLength(2048))
    .check(Schema.isPattern(new RegExp("^https?:\\/\\/.*$"))),
  paymentLinkType: OnrampPaymentLinkType,
}).annotate({
  description:
    "A payment link to pay for an order.\n\nPlease refer to the [Onramp docs](https://docs.cdp.coinbase.com/onramp-&-offramp/onramp-apis/onramp-overview) for details on how to integrate with the different payment link types.",
})
export type OnrampLimitUpgradeRequest = {
  readonly userId: string
  readonly userIdType: OnrampUserIdType
  readonly fields: {
    readonly ssnLast4?: string
    readonly dateOfBirth?: { readonly day?: string; readonly month?: string; readonly year?: string }
  }
}
export const OnrampLimitUpgradeRequest = Schema.Struct({
  userId: Schema.String.annotate({
    description: "The user identifier value. For `phone_number` type, this must be in E.164 format.",
  }),
  userIdType: OnrampUserIdType,
  fields: Schema.Struct({
    ssnLast4: Schema.optionalKey(
      Schema.String.annotate({ description: "Last 4 digits of the Social Security Number (no dashes or spaces)." }),
    ),
    dateOfBirth: Schema.optionalKey(
      Schema.Struct({
        day: Schema.optionalKey(
          Schema.String.annotate({ description: "Day of birth (01-31)." })
            .check(Schema.isMinLength(2))
            .check(Schema.isMaxLength(2))
            .check(Schema.isPattern(new RegExp("^[0-9]{2}$"))),
        ),
        month: Schema.optionalKey(
          Schema.String.annotate({ description: "Month of birth (01-12)." })
            .check(Schema.isMinLength(2))
            .check(Schema.isMaxLength(2))
            .check(Schema.isPattern(new RegExp("^[0-9]{2}$"))),
        ),
        year: Schema.optionalKey(
          Schema.String.annotate({ description: "Year of birth (four digits)." })
            .check(Schema.isMinLength(4))
            .check(Schema.isMaxLength(4))
            .check(Schema.isPattern(new RegExp("^[0-9]{4}$"))),
        ),
      }).annotate({ description: "Date of birth." }),
    ),
  }).annotate({
    description:
      "Populate the properties that correspond to the `fields` array from the user's `OnrampLimitUpgradeOption`.",
  }),
}).annotate({ description: "Request to request a limits upgrade for a user." })
export type OnrampUserLimit = {
  readonly limitType: OnrampLimitType
  readonly currency?: string
  readonly limit: string
  readonly remaining: string
}
export const OnrampUserLimit = Schema.Struct({
  limitType: OnrampLimitType,
  currency: Schema.optionalKey(
    Schema.String.annotate({
      description: "The currency of the limit amounts. Only present for spending limits, not for count-based limits.",
    }),
  ),
  limit: Schema.String.annotate({ description: "The maximum limit value." }),
  remaining: Schema.String.annotate({ description: "The remaining amount or count available." }),
}).annotate({ description: "A single limit with remaining capacity." })
export type FedwirePaymentMethod = {
  readonly paymentMethodId: PaymentMethodId
  readonly active: boolean
  readonly createdAt: string
  readonly updatedAt: string
  readonly paymentRail: "fedwire"
  readonly fedwire: {
    readonly asset: string
    readonly bankName: string
    readonly accountLast4: string
    readonly routingNumber: string
  }
}
export const FedwirePaymentMethod = Schema.Struct({
  paymentMethodId: PaymentMethodId,
  active: Schema.Boolean.annotate({
    description:
      "Whether the payment method is active and can be used in transfers. A payment method may be inactive due to verification requirements or entity-level restrictions.",
  }),
  createdAt: Schema.String.annotate({
    description: "The timestamp when the payment method was created.",
    format: "date-time",
  }),
  updatedAt: Schema.String.annotate({
    description: "The timestamp when the payment method was last updated.",
    format: "date-time",
  }),
  paymentRail: Schema.Literal("fedwire").annotate({ description: "The payment rail for this payment method." }),
  fedwire: Schema.Struct({
    asset: Schema.String.annotate({ description: "The asset for this payment method. Always `usd` for Fedwire." }),
    bankName: Schema.String.annotate({ description: "The name of the bank." }),
    accountLast4: Schema.String.annotate({ description: "The last 4 digits of the bank account number." }).check(
      Schema.isPattern(new RegExp("^[0-9]{4}$")),
    ),
    routingNumber: Schema.String.annotate({ description: "The ABA routing number of the bank." }).check(
      Schema.isPattern(new RegExp("^[0-9]{9}$")),
    ),
  }).annotate({ description: "Details specific to Fedwire (domestic USD wire) payment methods." }),
}).annotate({ title: "FedwirePaymentMethod", description: "Common properties shared by all payment method types." })
export type SwiftPaymentMethod = {
  readonly paymentMethodId: PaymentMethodId
  readonly active: boolean
  readonly createdAt: string
  readonly updatedAt: string
  readonly paymentRail: "swift"
  readonly swift: {
    readonly asset: string
    readonly bankName: string
    readonly accountLast4: string
    readonly ibanLast4?: string
    readonly bic: string
  }
}
export const SwiftPaymentMethod = Schema.Struct({
  paymentMethodId: PaymentMethodId,
  active: Schema.Boolean.annotate({
    description:
      "Whether the payment method is active and can be used in transfers. A payment method may be inactive due to verification requirements or entity-level restrictions.",
  }),
  createdAt: Schema.String.annotate({
    description: "The timestamp when the payment method was created.",
    format: "date-time",
  }),
  updatedAt: Schema.String.annotate({
    description: "The timestamp when the payment method was last updated.",
    format: "date-time",
  }),
  paymentRail: Schema.Literal("swift").annotate({ description: "The payment rail for this payment method." }),
  swift: Schema.Struct({
    asset: Schema.String.annotate({ description: "The asset for this payment method (e.g., `eur`, `gbp`)." }),
    bankName: Schema.String.annotate({ description: "The name of the bank." }),
    accountLast4: Schema.String.annotate({
      description:
        "The last 4 characters of the account identifier. For IBAN-based accounts (e.g., EU), this is the last 4 characters of the IBAN. For account number-based accounts (e.g., US), this is the last 4 digits of the account number.",
    }).check(Schema.isPattern(new RegExp("^[A-Z0-9]{4}$"))),
    ibanLast4: Schema.optionalKey(
      Schema.String.annotate({
        description: "Deprecated: use `accountLast4` instead. The last 4 characters of the account identifier.",
      }).check(Schema.isPattern(new RegExp("^[A-Z0-9]{4}$"))),
    ),
    bic: Schema.String.annotate({ description: "The Bank Identifier Code (BIC) / SWIFT code." }).check(
      Schema.isPattern(new RegExp("^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$")),
    ),
  }).annotate({ description: "Details specific to SWIFT (international wire) payment methods." }),
}).annotate({ title: "SwiftPaymentMethod", description: "Common properties shared by all payment method types." })
export type SepaPaymentMethod = {
  readonly paymentMethodId: PaymentMethodId
  readonly active: boolean
  readonly createdAt: string
  readonly updatedAt: string
  readonly paymentRail: "sepa"
  readonly sepa: { readonly asset: string; readonly bankName: string; readonly ibanLast4: string; readonly bic: string }
}
export const SepaPaymentMethod = Schema.Struct({
  paymentMethodId: PaymentMethodId,
  active: Schema.Boolean.annotate({
    description:
      "Whether the payment method is active and can be used in transfers. A payment method may be inactive due to verification requirements or entity-level restrictions.",
  }),
  createdAt: Schema.String.annotate({
    description: "The timestamp when the payment method was created.",
    format: "date-time",
  }),
  updatedAt: Schema.String.annotate({
    description: "The timestamp when the payment method was last updated.",
    format: "date-time",
  }),
  paymentRail: Schema.Literal("sepa").annotate({ description: "The payment rail for this payment method." }),
  sepa: Schema.Struct({
    asset: Schema.String.annotate({ description: "The asset for this payment method. Always `eur` for SEPA." }),
    bankName: Schema.String.annotate({ description: "The name of the bank." }),
    ibanLast4: Schema.String.annotate({ description: "The last 4 characters of the IBAN." }).check(
      Schema.isPattern(new RegExp("^[A-Z0-9]{4}$")),
    ),
    bic: Schema.String.annotate({ description: "The Bank Identifier Code (BIC) / SWIFT code." }).check(
      Schema.isPattern(new RegExp("^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$")),
    ),
  }).annotate({ description: "Details specific to SEPA (Single Euro Payments Area) payment methods." }),
}).annotate({ title: "SepaPaymentMethod", description: "Common properties shared by all payment method types." })
export type CreateTransferSource = Transfers_Account | PaymentMethod
export const CreateTransferSource = Schema.Union([Transfers_Account, PaymentMethod], { mode: "oneOf" }).annotate({
  description: "The source of the transfer.",
})
export type Balance = { readonly asset: Balances_Asset; readonly amount: { readonly [x: string]: AmountDetail } }
export const Balance = Schema.Struct({
  asset: Balances_Asset,
  amount: Schema.Record(Schema.String, AmountDetail).annotate({
    description:
      'Amount details denominated in different assets. \n- The keys represent the asset symbols (e.g., "btc", "usd"), - Each value contains available and total amounts. - There will always be an entry for the asset specified in the `asset` field.',
  }),
}).annotate({ description: "A balance of an asset." })
export type TransferDetails = {
  readonly depositDestination?: DepositDestinationReference
  readonly onchainTransactions?: ReadonlyArray<{ readonly transactionHash: string; readonly network: Network }>
  readonly travelRule?: { readonly status?: TravelRuleStatus; readonly statusMessage?: string }
}
export const TransferDetails = Schema.Struct({
  depositDestination: Schema.optionalKey(DepositDestinationReference),
  onchainTransactions: Schema.optionalKey(
    Schema.Array(
      Schema.Struct({
        transactionHash: Schema.String.annotate({ description: "The transaction hash." }),
        network: Network,
      }).annotate({ description: "An onchain transaction associated with the transfer." }),
    ).annotate({ description: "The onchain transactions associated with the transfer." }),
  ),
  travelRule: Schema.optionalKey(
    Schema.Struct({
      status: Schema.optionalKey(TravelRuleStatus),
      statusMessage: Schema.optionalKey(
        Schema.String.annotate({
          description:
            "Additional details about the current travel rule status. For example, when status is `incomplete`, this may indicate the specific missing information required to proceed.",
        }),
      ),
    }).annotate({
      description:
        "Travel rule compliance status for deposit transfers. Present when the transfer requires travel rule information.",
    }),
  ),
}).annotate({
  description:
    "Additional details about the transfer. For example, if the transfer was sent to a deposit destination, the information about that destination will be included in this field.",
})
export type TransferSource = Transfers_Account | PaymentMethod | OnchainAddress | OriginatingBankAccountUS
export const TransferSource = Schema.Union(
  [Transfers_Account, PaymentMethod, OnchainAddress, OriginatingBankAccountUS],
  { mode: "oneOf" },
).annotate({ description: "The source of the transfer." })
export type TransferTarget = Transfers_Account | PaymentMethod | OnchainAddress | EmailInstrument
export const TransferTarget = Schema.Union([Transfers_Account, PaymentMethod, OnchainAddress, EmailInstrument], {
  mode: "oneOf",
}).annotate({ description: "The target of the transfer." })
export type CryptoDepositDestination = {
  readonly depositDestinationId: DepositDestinationId
  readonly accountId: AccountId
  readonly type: "crypto"
  readonly crypto: { readonly network: Network; readonly address: BlockchainAddress }
  readonly target?: DepositDestinationTarget
  readonly status: DepositDestinationStatus
  readonly metadata?: Metadata
  readonly createdAt: string
  readonly updatedAt: string
}
export const CryptoDepositDestination = Schema.Struct({
  depositDestinationId: DepositDestinationId,
  accountId: AccountId,
  type: Schema.Literal("crypto").annotate({ description: "The type of deposit destination." }),
  crypto: Schema.Struct({ network: Network, address: BlockchainAddress }).annotate({
    description:
      "Crypto-specific deposit destination details. In responses, this object is always present. Contains the network and address for the deposit destination.",
  }),
  target: Schema.optionalKey(DepositDestinationTarget),
  status: DepositDestinationStatus,
  metadata: Schema.optionalKey(Metadata),
  createdAt: Schema.String.annotate({
    description: "The timestamp when the deposit destination was created.",
    format: "date-time",
  }),
  updatedAt: Schema.String.annotate({
    description: "The timestamp when the deposit destination was last updated.",
    format: "date-time",
  }),
}).annotate({ description: "A cryptocurrency deposit destination." })
export type CreateCryptoDepositDestinationRequest = {
  readonly accountId: string
  readonly type: "crypto"
  readonly target?: DepositDestinationTarget
  readonly metadata?: Metadata
  readonly crypto: { readonly network: Network }
}
export const CreateCryptoDepositDestinationRequest = Schema.Struct({
  accountId: Schema.String.annotate({
    description:
      "The ID of the Account, which is a UUID prefixed by the string `account_`, that owns the deposit destination.",
  }).check(Schema.isPattern(new RegExp("^account_[a-f0-9\\-]{36}$"))),
  type: Schema.Literal("crypto"),
  target: Schema.optionalKey(DepositDestinationTarget),
  metadata: Schema.optionalKey(Metadata),
  crypto: Schema.Struct({ network: Network }).annotate({
    description: "Crypto-specific details for creating a deposit destination.",
  }),
}).annotate({ description: "Common fields for creating a deposit destination." })
export type TransferEstimate = {
  readonly exchangeRate?: TransferExchangeRate
  readonly targetAmount?: string
  readonly targetAsset?: string
  readonly fees?: TransferFees
  readonly estimatedAt: string
}
export const TransferEstimate = Schema.Struct({
  exchangeRate: Schema.optionalKey(TransferExchangeRate),
  targetAmount: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "Estimated amount of the target asset that will be received, as a decimal string in standard unit denomination.",
    }),
  ),
  targetAsset: Schema.optionalKey(
    Schema.String.annotate({ description: "The symbol of the asset (e.g., eth, usd, usdc, usdt)." })
      .check(Schema.isMinLength(1))
      .check(Schema.isMaxLength(42)),
  ),
  fees: Schema.optionalKey(TransferFees),
  estimatedAt: Schema.String.annotate({
    description: "The date and time when this estimate was captured.",
    format: "date-time",
  }),
}).annotate({
  description:
    "A point-in-time snapshot of estimated values for a transfer where exact amounts cannot be locked in at quote time (e.g., when the executed rate is determined at execution time and moves with the market).\n\nPresent in both pre-execution and post-execution states:\n* **Quoted state:** top-level fields whose values cannot be guaranteed are absent;\n  `estimate` holds their estimated values.\n\n* **Completed state:** top-level fields contain the actual executed values;\n  `estimate` is retained as an immutable audit snapshot of the pre-execution estimate.",
})
export type TravelRule = {
  readonly isSelf?: boolean
  readonly isIntermediary?: boolean
  readonly originator?: TravelRuleOriginator
  readonly beneficiary?: TravelRuleBeneficiary
}
export const TravelRule = Schema.Struct({
  isSelf: Schema.optionalKey(
    Schema.Boolean.annotate({
      description: "Indicates whether the user attests that the receiving wallet belongs to them.",
    }),
  ),
  isIntermediary: Schema.optionalKey(
    Schema.Boolean.annotate({
      description:
        "Indicates whether Coinbase is being used as an intermediary Virtual Asset Service Provider (VASP) to send crypto on behalf of your customer.\n\n**Background:**\n\nThe Travel Rule (FATF Recommendation 16) requires VASPs to share originator and beneficiary information for virtual asset transfers. When Coinbase acts as an intermediary, additional Travel Rule data must be provided to satisfy compliance requirements.\n\n**Set to `true` when:**\n\n- Your organization is a VASP using Coinbase to send crypto **on behalf of your end customer**\n- In this scenario, Coinbase acts as an intermediary in the transfer chain and handles Travel Rule data exchange with the beneficiary VASP\n\n**Set to `false` (or omit) when:**\n\n- You are transferring funds directly from your own Coinbase account, where **Coinbase is your primary VASP** rather than an intermediary for another institution\n\n**Impact on required fields:**\n\nWhen `isIntermediary` is `true`, you must provide the `originator` object with details about the original sender, including:\n- Originator name\n- Originator address\n- Your VASP information (`virtualAssetServiceProvider` object with `name`, `address`, and `identifier`)\n",
    }),
  ),
  originator: Schema.optionalKey(TravelRuleOriginator),
  beneficiary: Schema.optionalKey(TravelRuleBeneficiary),
}).annotate({
  description:
    "Required Travel Rule fields differ by region. These requirements are determined based on which Coinbase entity the customer has signed the service agreement for.",
})
export type DepositTravelRuleRequest = {
  readonly originator?: DepositTravelRuleOriginator
  readonly beneficiary?: DepositTravelRuleBeneficiary
  readonly isSelf?: boolean
}
export const DepositTravelRuleRequest = Schema.Struct({
  originator: Schema.optionalKey(DepositTravelRuleOriginator),
  beneficiary: Schema.optionalKey(DepositTravelRuleBeneficiary),
  isSelf: Schema.optionalKey(
    Schema.Boolean.annotate({
      description: "Indicates whether the user attests that the originating wallet belongs to them.",
    }),
  ),
}).annotate({
  description:
    "Request body for submitting travel rule information for a deposit transfer. Required fields vary by jurisdiction.",
})
export type AuthenticationMethod =
  | EmailAuthentication
  | SmsAuthentication
  | DeveloperJWTAuthentication
  | OAuth2Authentication
  | TelegramAuthentication
  | SiweAuthentication
export const AuthenticationMethod = Schema.Union(
  [
    EmailAuthentication,
    SmsAuthentication,
    DeveloperJWTAuthentication,
    OAuth2Authentication,
    TelegramAuthentication,
    SiweAuthentication,
  ],
  { mode: "oneOf" },
).annotate({ description: "Information about how the end user is authenticated." })
export type CreateSwapQuoteResponse = {
  readonly permit2: { readonly hash: string; readonly eip712: EIP712Message }
  readonly transaction: {
    readonly to: string
    readonly data: string
    readonly gas: string
    readonly gasPrice: string
    readonly value: string
  }
  readonly blockNumber: string
  readonly toAmount: string
  readonly toToken: string
  readonly fees: {
    readonly gasFee: { readonly amount: string; readonly token: string }
    readonly protocolFee: { readonly amount: string; readonly token: string }
  }
  readonly issues: {
    readonly allowance: { readonly currentAllowance: string; readonly spender: string }
    readonly balance: { readonly token: string; readonly currentBalance: string; readonly requiredBalance: string }
    readonly simulationIncomplete: boolean
  }
  readonly liquidityAvailable: true
  readonly minToAmount: string
  readonly fromAmount: string
  readonly fromToken: string
}
export const CreateSwapQuoteResponse = Schema.Struct({
  permit2: Schema.Struct({
    hash: Schema.String.annotate({
      description:
        "The hash for the approval according to [EIP-712](https://eips.ethereum.org/EIPS/eip-712). Computing the hash of the `eip712` field should match the value of this field.",
    }).check(Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{64}$"))),
    eip712: EIP712Message,
  }).annotate({
    description:
      "The approval object which contains the necessary fields to submit an approval for this transaction. Null if the `fromToken` is the native token or the transaction is a native token wrap / unwrap.",
  }),
  transaction: Schema.Struct({
    to: Schema.String.annotate({ description: "The 0x-prefixed address of the contract to call." }).check(
      Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$")),
    ),
    data: Schema.String.annotate({ description: "The hex-encoded call data to send to the contract." }),
    gas: Schema.String.annotate({
      description: "The estimated gas limit that should be used to send the transaction to guarantee settlement.",
    }).check(Schema.isPattern(new RegExp("^\\d+$"))),
    gasPrice: Schema.String.annotate({
      description:
        "The gas price, in Wei, that should be used to send the transaction. For EIP-1559 transactions, this value should be seen as the `maxFeePerGas` value. The transaction should be sent with this gas price to guarantee settlement.",
    }).check(Schema.isPattern(new RegExp("^\\d+$"))),
    value: Schema.String.annotate({ description: "The value of the transaction in Wei." }).check(
      Schema.isPattern(new RegExp("^\\d+$")),
    ),
  }).annotate({ description: "The details of the transaction to be signed and submitted to execute the swap." }),
  blockNumber: Schema.String.annotate({
    description: "The block number at which the liquidity conditions were examined.",
  }).check(Schema.isPattern(new RegExp("^[1-9]\\d*$"))),
  toAmount: Schema.String.annotate({
    description:
      "The amount of the `toToken` that will be received in atomic units of the `toToken`. For example, `1000000000000000000` when receiving ETH equates to 1 ETH, `1000000` when receiving USDC equates to 1 USDC, etc.",
  }).check(Schema.isPattern(new RegExp("^(0|[1-9]\\d*)$"))),
  toToken: Schema.String.annotate({
    description: "The 0x-prefixed contract address of the token that will be received.",
  }).check(Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$"))),
  fees: Schema.Struct({
    gasFee: Schema.Struct({
      amount: Schema.String.annotate({
        description:
          "The estimated amount of the fee in atomic units of the `token`. For example, `1000000000000000` if the fee is in ETH equates to 0.001 ETH, `10000` if the fee is in USDC equates to 0.01 USDC, etc.",
      }).check(Schema.isPattern(new RegExp("^\\d+$"))),
      token: Schema.String.annotate({
        description:
          "The contract address of the token that the fee is paid in. The address `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE` is used for the native token of the network (e.g. ETH).",
      }).check(Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$"))),
    }).annotate({ description: "The estimated gas fee for the swap." }),
    protocolFee: Schema.Struct({
      amount: Schema.String.annotate({
        description:
          "The estimated amount of the fee in atomic units of the `token`. For example, `1000000000000000` if the fee is in ETH equates to 0.001 ETH, `10000` if the fee is in USDC equates to 0.01 USDC, etc.",
      }).check(Schema.isPattern(new RegExp("^\\d+$"))),
      token: Schema.String.annotate({
        description:
          "The contract address of the token that the fee is paid in. The address `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE` is used for the native token of the network (e.g. ETH).",
      }).check(Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$"))),
    }).annotate({ description: "The estimated protocol fee for the swap." }),
  }).annotate({ description: "The estimated fees for the swap." }),
  issues: Schema.Struct({
    allowance: Schema.Struct({
      currentAllowance: Schema.String.annotate({
        description: "The current allowance of the `fromToken` by the `taker`.",
      }).check(Schema.isPattern(new RegExp("^\\d+$"))),
      spender: Schema.String.annotate({ description: "The 0x-prefixed address of to set the allowance on." }).check(
        Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$")),
      ),
    }).annotate({
      description:
        "Details of the allowances that the taker must set in order to execute the swap successfully. Null if no allowance is required.",
    }),
    balance: Schema.Struct({
      token: Schema.String.annotate({ description: "The 0x-prefixed contract address of the token." }).check(
        Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$")),
      ),
      currentBalance: Schema.String.annotate({
        description: "The current balance of the `fromToken` by the `taker`.",
      }).check(Schema.isPattern(new RegExp("^\\d+$"))),
      requiredBalance: Schema.String.annotate({
        description: "The amount of the token that the `taker` must hold.",
      }).check(Schema.isPattern(new RegExp("^\\d+$"))),
    }).annotate({
      description:
        "Details of the balance of the `fromToken` that the `taker` must hold. Null if the `taker` has a sufficient balance.",
    }),
    simulationIncomplete: Schema.Boolean.annotate({
      description:
        "This is set to true when the transaction cannot be validated. This can happen when the taker has an insufficient balance of the `fromToken`. Note that this does not necessarily mean that the trade will revert.",
    }),
  }).annotate({
    description:
      "An object containing potential issues discovered during validation that could prevent the swap from being executed successfully.",
  }),
  liquidityAvailable: Schema.Literal(true).annotate({
    description:
      "Whether sufficient liquidity is available to settle the swap. All other fields in the response will be empty if this is false.",
  }),
  minToAmount: Schema.String.annotate({
    description:
      "The minimum amount of the `toToken` that must be received for the swap to succeed, in atomic units of the `toToken`.  For example, `1000000000000000000` when receiving ETH equates to 1 ETH, `1000000` when receiving USDC equates to 1 USDC, etc. This value is influenced by the `slippageBps` parameter.",
  }).check(Schema.isPattern(new RegExp("^(0|[1-9]\\d*)$"))),
  fromAmount: Schema.String.annotate({
    description:
      "The amount of the `fromToken` that will be sent in this swap, in atomic units of the `fromToken`. For example, `1000000000000000000` when sending ETH equates to 1 ETH, `1000000` when sending USDC equates to 1 USDC, etc.",
  }).check(Schema.isPattern(new RegExp("^(0|[1-9]\\d*)$"))),
  fromToken: Schema.String.annotate({
    description: "The 0x-prefixed contract address of the token that will be sent.",
  }).check(Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$"))),
}).annotate({ title: "CreateSwapQuoteResponse" })
export type EvmUserOperation = {
  readonly network: EvmUserOperationNetwork
  readonly userOpHash: string
  readonly calls: ReadonlyArray<EvmCall>
  readonly status: "pending" | "signed" | "broadcast" | "complete" | "dropped" | "failed"
  readonly transactionHash?: string
  readonly receipts?: ReadonlyArray<UserOperationReceipt>
}
export const EvmUserOperation = Schema.Struct({
  network: EvmUserOperationNetwork,
  userOpHash: Schema.String.annotate({
    description:
      "The hash of the user operation. This is not the transaction hash, as a transaction consists of multiple user operations. The user operation hash is the hash of this particular user operation which gets signed by the owner of the Smart Account.",
  }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{64}$"))),
  calls: Schema.Array(EvmCall).annotate({ description: "The list of calls in the user operation." }),
  status: Schema.Literals(["pending", "signed", "broadcast", "complete", "dropped", "failed"]).annotate({
    description: "The status of the user operation.",
  }),
  transactionHash: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "The hash of the transaction that included this particular user operation. This gets set after the user operation is broadcasted and the transaction is included in a block.",
    }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{64}$|^$"))),
  ),
  receipts: Schema.optionalKey(
    Schema.Array(UserOperationReceipt).annotate({
      description: "The list of receipts associated with the user operation.",
    }),
  ),
})
export type TokenBalance = { readonly amount: TokenAmount; readonly token: Token }
export const TokenBalance = Schema.Struct({ amount: TokenAmount, token: Token })
export type Abi = ReadonlyArray<AbiFunction | AbiInput>
export const Abi = Schema.Array(Schema.Union([AbiFunction, AbiInput], { mode: "oneOf" })).annotate({
  description: "Contract ABI Specification following Solidity's external JSON interface format.",
})
export type SignEvmTypedDataCriteria = ReadonlyArray<
  SignEvmTypedDataFieldCriterion | SignEvmTypedDataVerifyingContractCriterion
>
export const SignEvmTypedDataCriteria = Schema.Array(
  Schema.Union([SignEvmTypedDataFieldCriterion, SignEvmTypedDataVerifyingContractCriterion], { mode: "oneOf" }),
).annotate({ description: "A schema for specifying criteria for the SignEvmTypedData operation." })
export type SignEndUserEvmTypedDataCriteria = ReadonlyArray<
  SignEvmTypedDataFieldCriterion | SignEvmTypedDataVerifyingContractCriterion
>
export const SignEndUserEvmTypedDataCriteria = Schema.Array(
  Schema.Union([SignEvmTypedDataFieldCriterion, SignEvmTypedDataVerifyingContractCriterion], { mode: "oneOf" }),
).annotate({ description: "A schema for specifying criteria for the signEndUserEvmTypedData operation." })
export type SolDataCriterion = {
  readonly type: "solData"
  readonly idls: ReadonlyArray<KnownIdlType | Idl>
  readonly conditions: ReadonlyArray<SolDataCondition>
}
export const SolDataCriterion = Schema.Struct({
  type: Schema.Literal("solData").annotate({ description: "The type of criterion to use. This should be `solData`." }),
  idls: Schema.Array(Schema.Union([KnownIdlType, Idl], { mode: "oneOf" })).annotate({
    description: "List of IDL specifications. Can contain known program names (strings) or custom IDL objects.",
  }),
  conditions: Schema.Array(SolDataCondition).annotate({
    description:
      "A list of conditions to apply against the transaction instruction. Only one condition must evaluate to true for this criterion to be met.",
  }),
}).annotate({ description: "A schema for specifying criterion for instruction data in a Solana transaction." })
export type OnchainDataSchemaResponse = { readonly tables?: ReadonlyArray<OnchainDataTableSchema> }
export const OnchainDataSchemaResponse = Schema.Struct({
  tables: Schema.optionalKey(
    Schema.Array(OnchainDataTableSchema).annotate({ description: "List of available tables." }),
  ),
}).annotate({ description: "Schema information for available blockchain data tables." })
export type WebhookSubscriptionListResponse = {
  readonly subscriptions: ReadonlyArray<WebhookSubscriptionResponse>
  readonly nextPageToken?: string
}
export const WebhookSubscriptionListResponse = Schema.Struct({
  subscriptions: Schema.Array(WebhookSubscriptionResponse).annotate({
    description: "The list of webhook subscriptions.",
  }),
  nextPageToken: Schema.optionalKey(
    Schema.String.annotate({ description: "The token for the next page of items, if any." }),
  ),
}).annotate({ description: "Response containing a list of webhook subscriptions." })
export type WebhookEventListResponse = { readonly events: ReadonlyArray<WebhookEventResponse> }
export const WebhookEventListResponse = Schema.Struct({
  events: Schema.Array(WebhookEventResponse).annotate({ description: "The list of webhook event delivery attempts." }),
}).annotate({ description: "Response containing a list of webhook event delivery attempts." })
export type X402PaymentPayload =
  | {
      readonly x402Version: 1 | 2
      readonly payload:
        | {
            readonly signature: string
            readonly authorization: {
              readonly from: string
              readonly to: string
              readonly value: string
              readonly validAfter: string
              readonly validBefore: string
              readonly nonce: string
            }
          }
        | {
            readonly signature: string
            readonly permit2Authorization: {
              readonly from: string
              readonly permitted: { readonly token: string; readonly amount: string }
              readonly spender: string
              readonly nonce: string
              readonly deadline: string
              readonly witness: { readonly to: string; readonly validAfter: string; readonly extra?: string }
            }
          }
        | { readonly transaction: string }
        | {
            readonly signature: string
            readonly permit2Authorization: {
              readonly from: string
              readonly permitted: { readonly token: string; readonly amount: string }
              readonly spender: string
              readonly nonce: string
              readonly deadline: string
              readonly witness: { readonly to: string; readonly facilitator: string; readonly validAfter: string }
            }
          }
        | {
            readonly type: "deposit"
            readonly channelConfig: X402BatchSettlementChannelConfig
            readonly voucher: X402BatchSettlementVoucher
            readonly deposit: {
              readonly amount: string
              readonly authorization: {
                readonly erc3009Authorization?: {
                  readonly validAfter: string
                  readonly validBefore: string
                  readonly salt: string
                  readonly signature: string
                }
              }
            }
          }
        | {
            readonly type: "voucher"
            readonly channelConfig: X402BatchSettlementChannelConfig
            readonly voucher: X402BatchSettlementVoucher
          }
        | {
            readonly type: "refund"
            readonly channelConfig: X402BatchSettlementChannelConfig
            readonly voucher: X402BatchSettlementVoucher
            readonly amount?: string
            readonly refundNonce?: string
            readonly claims?: ReadonlyArray<X402BatchSettlementClaim>
            readonly refundAuthorizerSignature?: string
            readonly claimAuthorizerSignature?: string
          }
        | {
            readonly type: "claim"
            readonly claims: ReadonlyArray<X402BatchSettlementClaim>
            readonly claimAuthorizerSignature?: string
          }
        | { readonly type: "settle"; readonly receiver: string; readonly token: string }
      readonly accepted: X402V2PaymentRequirements
      readonly resource?: X402ResourceInfo
      readonly extensions?: { readonly [x: string]: unknown }
    }
  | {
      readonly x402Version: 1 | 2
      readonly scheme: "exact"
      readonly network: "base" | "base-sepolia" | "solana" | "solana-devnet"
      readonly payload:
        | {
            readonly signature: string
            readonly authorization: {
              readonly from: string
              readonly to: string
              readonly value: string
              readonly validAfter: string
              readonly validBefore: string
              readonly nonce: string
            }
          }
        | {
            readonly signature: string
            readonly permit2Authorization: {
              readonly from: string
              readonly permitted: { readonly token: string; readonly amount: string }
              readonly spender: string
              readonly nonce: string
              readonly deadline: string
              readonly witness: { readonly to: string; readonly validAfter: string; readonly extra?: string }
            }
          }
        | { readonly transaction: string }
    }
export const X402PaymentPayload = Schema.Union(
  [
    Schema.Struct({
      x402Version: Schema.Literals([1, 2]).annotate({ description: "The version of the x402 protocol." }),
      payload: Schema.Union(
        [
          Schema.Struct({
            signature: Schema.String.annotate({
              description:
                "The EIP-712 hex-encoded signature of the ERC-3009 authorization message. Smart account signatures may be longer than 65 bytes.",
            }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{130,}$"))),
            authorization: Schema.Struct({
              from: Schema.String.annotate({
                description: "The 0x-prefixed, checksum EVM address of the sender of the payment.",
              }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
              to: Schema.String.annotate({
                description: "The 0x-prefixed, checksum EVM address of the recipient of the payment.",
              }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
              value: Schema.String.annotate({
                description: "The value of the payment, in atomic units of the payment asset.",
              }),
              validAfter: Schema.String.annotate({
                description: "The unix timestamp after which the payment is valid.",
              }),
              validBefore: Schema.String.annotate({
                description: "The unix timestamp before which the payment is valid.",
              }),
              nonce: Schema.String.annotate({ description: "The hex-encoded nonce of the payment (bytes32)." }).check(
                Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{64}$")),
              ),
            }).annotate({ description: "The authorization data for the ERC-3009 authorization message." }),
          }).annotate({
            title: "x402ExactEvmPayload",
            description:
              "The payload of the payment depending on the x402Version, scheme, and network. Discriminated by scheme-specific fields: exact-EVM/upto-EVM payloads carry a `signature`; exact-Solana carries a `transaction`; batch-settlement carries a `type` discriminator. See `x402BatchSettlementEvmPayload` for the documented batch-settlement variants.",
          }),
          Schema.Struct({
            signature: Schema.String.annotate({
              description:
                "The EIP-712 hex-encoded signature of the Permit2 PermitWitnessTransferFrom message. Smart account signatures may be longer than 65 bytes.",
            }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{130,}$"))),
            permit2Authorization: Schema.Struct({
              from: Schema.String.annotate({
                description: "The 0x-prefixed, checksum EVM address of the sender of the payment.",
              }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
              permitted: Schema.Struct({
                token: Schema.String.annotate({
                  description: "The 0x-prefixed, checksum EVM address of the token to transfer.",
                }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
                amount: Schema.String.annotate({ description: "The amount to transfer in atomic units." }),
              }).annotate({ description: "The token permissions for the transfer." }),
              spender: Schema.String.annotate({
                description: "The 0x-prefixed, checksum EVM address of the spender (x402 Permit2 proxy contract).",
              }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
              nonce: Schema.String.annotate({ description: "The Permit2 nonce as a decimal string (uint256)." }).check(
                Schema.isPattern(new RegExp("^[0-9]+$")),
              ),
              deadline: Schema.String.annotate({ description: "The unix timestamp before which the permit is valid." }),
              witness: Schema.Struct({
                to: Schema.String.annotate({
                  description: "The 0x-prefixed, checksum EVM address of the recipient.",
                }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
                validAfter: Schema.String.annotate({
                  description: "The unix timestamp after which the payment is valid.",
                }),
                extra: Schema.optionalKey(
                  Schema.String.annotate({ description: "Optional hex-encoded extra data." }).check(
                    Schema.isPattern(new RegExp("^0x[0-9a-fA-F]*$")),
                  ),
                ),
              }).annotate({ description: "The witness data containing payment details." }),
            }).annotate({ description: "The authorization data for the Permit2 PermitWitnessTransferFrom message." }),
          }).annotate({
            title: "x402ExactEvmPermit2Payload",
            description:
              "The payload of the payment depending on the x402Version, scheme, and network. Discriminated by scheme-specific fields: exact-EVM/upto-EVM payloads carry a `signature`; exact-Solana carries a `transaction`; batch-settlement carries a `type` discriminator. See `x402BatchSettlementEvmPayload` for the documented batch-settlement variants.",
          }),
          Schema.Struct({
            transaction: Schema.String.annotate({ description: "The base64-encoded Solana transaction." }),
          }).annotate({
            title: "x402ExactSolanaPayload",
            description:
              "The payload of the payment depending on the x402Version, scheme, and network. Discriminated by scheme-specific fields: exact-EVM/upto-EVM payloads carry a `signature`; exact-Solana carries a `transaction`; batch-settlement carries a `type` discriminator. See `x402BatchSettlementEvmPayload` for the documented batch-settlement variants.",
          }),
          Schema.Struct({
            signature: Schema.String.annotate({
              description:
                "The EIP-712 hex-encoded signature of the Permit2 PermitWitnessTransferFrom message. Smart account signatures may be longer than 65 bytes.",
            }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{130,}$"))),
            permit2Authorization: Schema.Struct({
              from: Schema.String.annotate({
                description: "The 0x-prefixed, checksum EVM address of the sender of the payment.",
              }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
              permitted: Schema.Struct({
                token: Schema.String.annotate({
                  description: "The 0x-prefixed, checksum EVM address of the token to transfer.",
                }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
                amount: Schema.String.annotate({
                  description: "The maximum amount the client authorizes to transfer in atomic units.",
                }),
              }).annotate({ description: "The token permissions for the transfer." }),
              spender: Schema.String.annotate({
                description:
                  "The 0x-prefixed, checksum EVM address of the spender (the x402 Upto Permit2 proxy contract).",
              }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
              nonce: Schema.String.annotate({ description: "The Permit2 nonce as a decimal string (uint256)." }).check(
                Schema.isPattern(new RegExp("^[0-9]+$")),
              ),
              deadline: Schema.String.annotate({ description: "The unix timestamp before which the permit is valid." }),
              witness: Schema.Struct({
                to: Schema.String.annotate({
                  description: "The 0x-prefixed, checksum EVM address of the recipient.",
                }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
                facilitator: Schema.String.annotate({
                  description:
                    "The 0x-prefixed, checksum EVM address of the facilitator authorized to settle this payment. MUST match the `facilitatorAddress` advertised in the payment requirements `extra` field.",
                }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
                validAfter: Schema.String.annotate({
                  description: "The unix timestamp after which the payment is valid.",
                }),
              }).annotate({
                description:
                  "The witness data containing payment details. Includes a `facilitator` field to bind the authorization to a specific facilitator address.",
              }),
            }).annotate({
              description:
                "The authorization data for the Permit2 PermitWitnessTransferFrom message. The `permitted.amount` is the maximum the client authorizes; the actual settled amount is decided by the resource server at settle time and MUST be less than or equal to it.",
            }),
          }).annotate({
            title: "x402UptoEvmPermit2Payload",
            description:
              "The payload of the payment depending on the x402Version, scheme, and network. Discriminated by scheme-specific fields: exact-EVM/upto-EVM payloads carry a `signature`; exact-Solana carries a `transaction`; batch-settlement carries a `type` discriminator. See `x402BatchSettlementEvmPayload` for the documented batch-settlement variants.",
          }),
          Schema.Union(
            [
              Schema.Struct({
                type: Schema.Literal("deposit").annotate({
                  description:
                    'The payload-type discriminator. Must be `"deposit"` for a channel-funding deposit payload.',
                }),
                channelConfig: X402BatchSettlementChannelConfig,
                voucher: X402BatchSettlementVoucher,
                deposit: Schema.Struct({
                  amount: Schema.String.annotate({
                    description: "The deposit amount in atomic units of `channelConfig.token`.",
                  }).check(Schema.isPattern(new RegExp("^[0-9]+$"))),
                  authorization: Schema.Struct({
                    erc3009Authorization: Schema.optionalKey(
                      Schema.Struct({
                        validAfter: Schema.String.annotate({
                          description: "The unix timestamp after which the authorization is valid.",
                        }),
                        validBefore: Schema.String.annotate({
                          description: "The unix timestamp before which the authorization is valid.",
                        }),
                        salt: Schema.String.annotate({
                          description: "The 32-byte ERC-3009 nonce/salt for replay protection.",
                        }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{64}$"))),
                        signature: Schema.String.annotate({
                          description: "The EIP-712 hex-encoded signature of the ERC-3009 authorization.",
                        }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]+$"))),
                      }).annotate({
                        description:
                          "An ERC-3009 receiveWithAuthorization message authorizing the channel-funding transfer.",
                      }),
                    ),
                  }).annotate({
                    description:
                      "The asset-transfer authorization for the deposit. Currently only ERC-3009 is supported.",
                  }),
                }).annotate({
                  description: "The deposit amount and asset-transfer authorization that funds the channel.",
                }),
              }).annotate({
                title: "x402BatchSettlementEvmPayload",
                description:
                  "The payload of the payment depending on the x402Version, scheme, and network. Discriminated by scheme-specific fields: exact-EVM/upto-EVM payloads carry a `signature`; exact-Solana carries a `transaction`; batch-settlement carries a `type` discriminator. See `x402BatchSettlementEvmPayload` for the documented batch-settlement variants.",
              }),
              Schema.Struct({
                type: Schema.Literal("voucher").annotate({
                  description:
                    'The payload-type discriminator. Must be `"voucher"` for a voucher-only payment against an already-funded channel.',
                }),
                channelConfig: X402BatchSettlementChannelConfig,
                voucher: X402BatchSettlementVoucher,
              }).annotate({
                title: "x402BatchSettlementEvmPayload",
                description:
                  "The payload of the payment depending on the x402Version, scheme, and network. Discriminated by scheme-specific fields: exact-EVM/upto-EVM payloads carry a `signature`; exact-Solana carries a `transaction`; batch-settlement carries a `type` discriminator. See `x402BatchSettlementEvmPayload` for the documented batch-settlement variants.",
              }),
              Schema.Struct({
                type: Schema.Literal("refund").annotate({
                  description:
                    'The payload-type discriminator. Must be `"refund"` for both the client-emitted and server-enriched shape.',
                }),
                channelConfig: X402BatchSettlementChannelConfig,
                voucher: X402BatchSettlementVoucher,
                amount: Schema.optionalKey(
                  Schema.String.annotate({
                    description:
                      "The refund amount in atomic units of `channelConfig.token`. Optional in the client-emitted shape (defaults to the full remaining channel balance). Required when the payload is enriched by a mediating server.",
                  }).check(Schema.isPattern(new RegExp("^[0-9]+$"))),
                ),
                refundNonce: Schema.optionalKey(
                  Schema.String.annotate({
                    description:
                      "The on-chain refund nonce for replay protection (uint256 as decimal string). Only present on the server-enriched shape.",
                  }).check(Schema.isPattern(new RegExp("^[0-9]+$"))),
                ),
                claims: Schema.optionalKey(
                  Schema.Array(X402BatchSettlementClaim).annotate({
                    description:
                      "Voucher claims to include atomically with the refund. Only present on the server-enriched shape.",
                  }),
                ),
                refundAuthorizerSignature: Schema.optionalKey(
                  Schema.String.annotate({
                    description:
                      "Optional EIP-712 signature from the receiver authorizer over the refund. When omitted, the facilitator auto-signs.",
                  }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]+$"))),
                ),
                claimAuthorizerSignature: Schema.optionalKey(
                  Schema.String.annotate({
                    description:
                      "Optional EIP-712 signature from the receiver authorizer over the included claims. When omitted, the facilitator auto-signs.",
                  }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]+$"))),
                ),
              }).annotate({
                title: "x402BatchSettlementEvmPayload",
                description:
                  "The payload of the payment depending on the x402Version, scheme, and network. Discriminated by scheme-specific fields: exact-EVM/upto-EVM payloads carry a `signature`; exact-Solana carries a `transaction`; batch-settlement carries a `type` discriminator. See `x402BatchSettlementEvmPayload` for the documented batch-settlement variants.",
              }),
              Schema.Struct({
                type: Schema.Literal("claim").annotate({
                  description:
                    'The payload-type discriminator. Must be `"claim"` for a server-to-facilitator on-chain claim batch request.',
                }),
                claims: Schema.Array(X402BatchSettlementClaim).annotate({
                  description: "The list of voucher claims to batch in a single on-chain `claim` call.",
                }),
                claimAuthorizerSignature: Schema.optionalKey(
                  Schema.String.annotate({
                    description:
                      "Optional EIP-712 signature from the receiver authorizer over the claim batch. When omitted, the facilitator auto-signs.",
                  }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]+$"))),
                ),
              }).annotate({
                title: "x402BatchSettlementEvmPayload",
                description:
                  "The payload of the payment depending on the x402Version, scheme, and network. Discriminated by scheme-specific fields: exact-EVM/upto-EVM payloads carry a `signature`; exact-Solana carries a `transaction`; batch-settlement carries a `type` discriminator. See `x402BatchSettlementEvmPayload` for the documented batch-settlement variants.",
              }),
              Schema.Struct({
                type: Schema.Literal("settle").annotate({
                  description:
                    'The payload-type discriminator. Must be `"settle"` for a server-to-facilitator request to move claimed funds to the receiver.',
                }),
                receiver: Schema.String.annotate({
                  description: "The 0x-prefixed, checksum EVM address of the receiver to settle to.",
                }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
                token: Schema.String.annotate({
                  description: "The 0x-prefixed, checksum EVM address of the token to settle.",
                }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
              }).annotate({
                title: "x402BatchSettlementEvmPayload",
                description:
                  "The payload of the payment depending on the x402Version, scheme, and network. Discriminated by scheme-specific fields: exact-EVM/upto-EVM payloads carry a `signature`; exact-Solana carries a `transaction`; batch-settlement carries a `type` discriminator. See `x402BatchSettlementEvmPayload` for the documented batch-settlement variants.",
              }),
            ],
            { mode: "oneOf" },
          ),
        ],
        { mode: "oneOf" },
      ),
      accepted: X402V2PaymentRequirements,
      resource: Schema.optionalKey(X402ResourceInfo),
      extensions: Schema.optionalKey(
        Schema.Record(Schema.String, Schema.Unknown).annotate({ description: "Optional protocol extensions." }),
      ),
    }).annotate({
      title: "x402V2PaymentPayload",
      description:
        "The x402 protocol payment payload that the client attaches to x402-paid API requests to the resource server in the X-PAYMENT header.\nFor EVM networks, smart account signatures can be longer than 65 bytes.",
    }),
    Schema.Struct({
      x402Version: Schema.Literals([1, 2]).annotate({ description: "The version of the x402 protocol." }),
      scheme: Schema.Literal("exact").annotate({
        description: "The scheme of the payment protocol to use. Currently, the only supported scheme is `exact`.",
      }),
      network: Schema.Literals(["base", "base-sepolia", "solana", "solana-devnet"]).annotate({
        description:
          "The x402 v1 network identifier. x402 v1 uses human-readable network names. Supported networks: Base mainnet and testnet, Solana mainnet and devnet.",
      }),
      payload: Schema.Union(
        [
          Schema.Struct({
            signature: Schema.String.annotate({
              description:
                "The EIP-712 hex-encoded signature of the ERC-3009 authorization message. Smart account signatures may be longer than 65 bytes.",
            }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{130,}$"))),
            authorization: Schema.Struct({
              from: Schema.String.annotate({
                description: "The 0x-prefixed, checksum EVM address of the sender of the payment.",
              }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
              to: Schema.String.annotate({
                description: "The 0x-prefixed, checksum EVM address of the recipient of the payment.",
              }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
              value: Schema.String.annotate({
                description: "The value of the payment, in atomic units of the payment asset.",
              }),
              validAfter: Schema.String.annotate({
                description: "The unix timestamp after which the payment is valid.",
              }),
              validBefore: Schema.String.annotate({
                description: "The unix timestamp before which the payment is valid.",
              }),
              nonce: Schema.String.annotate({ description: "The hex-encoded nonce of the payment (bytes32)." }).check(
                Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{64}$")),
              ),
            }).annotate({ description: "The authorization data for the ERC-3009 authorization message." }),
          }).annotate({
            title: "x402ExactEvmPayload",
            description: "The payload of the payment depending on the x402Version, scheme, and network.",
          }),
          Schema.Struct({
            signature: Schema.String.annotate({
              description:
                "The EIP-712 hex-encoded signature of the Permit2 PermitWitnessTransferFrom message. Smart account signatures may be longer than 65 bytes.",
            }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{130,}$"))),
            permit2Authorization: Schema.Struct({
              from: Schema.String.annotate({
                description: "The 0x-prefixed, checksum EVM address of the sender of the payment.",
              }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
              permitted: Schema.Struct({
                token: Schema.String.annotate({
                  description: "The 0x-prefixed, checksum EVM address of the token to transfer.",
                }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
                amount: Schema.String.annotate({ description: "The amount to transfer in atomic units." }),
              }).annotate({ description: "The token permissions for the transfer." }),
              spender: Schema.String.annotate({
                description: "The 0x-prefixed, checksum EVM address of the spender (x402 Permit2 proxy contract).",
              }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
              nonce: Schema.String.annotate({ description: "The Permit2 nonce as a decimal string (uint256)." }).check(
                Schema.isPattern(new RegExp("^[0-9]+$")),
              ),
              deadline: Schema.String.annotate({ description: "The unix timestamp before which the permit is valid." }),
              witness: Schema.Struct({
                to: Schema.String.annotate({
                  description: "The 0x-prefixed, checksum EVM address of the recipient.",
                }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
                validAfter: Schema.String.annotate({
                  description: "The unix timestamp after which the payment is valid.",
                }),
                extra: Schema.optionalKey(
                  Schema.String.annotate({ description: "Optional hex-encoded extra data." }).check(
                    Schema.isPattern(new RegExp("^0x[0-9a-fA-F]*$")),
                  ),
                ),
              }).annotate({ description: "The witness data containing payment details." }),
            }).annotate({ description: "The authorization data for the Permit2 PermitWitnessTransferFrom message." }),
          }).annotate({
            title: "x402ExactEvmPermit2Payload",
            description: "The payload of the payment depending on the x402Version, scheme, and network.",
          }),
          Schema.Struct({
            transaction: Schema.String.annotate({ description: "The base64-encoded Solana transaction." }),
          }).annotate({
            title: "x402ExactSolanaPayload",
            description: "The payload of the payment depending on the x402Version, scheme, and network.",
          }),
        ],
        { mode: "oneOf" },
      ),
    }).annotate({
      title: "x402V1PaymentPayload",
      description:
        "The x402 protocol payment payload that the client attaches to x402-paid API requests to the resource server in the X-PAYMENT header.\nFor EVM networks, smart account signatures can be longer than 65 bytes.",
    }),
  ],
  { mode: "oneOf" },
)
export type X402DiscoveryResourcesResponse = {
  readonly x402Version: X402Version
  readonly items: ReadonlyArray<X402DiscoveryResource>
  readonly pagination: { readonly limit?: number; readonly offset?: number; readonly total?: number }
}
export const X402DiscoveryResourcesResponse = Schema.Struct({
  x402Version: X402Version,
  items: Schema.Array(X402DiscoveryResource).annotate({ description: "List of discovered x402 resources." }),
  pagination: Schema.Struct({
    limit: Schema.optionalKey(
      Schema.Number.annotate({ description: "The number of discovered x402 resources to return per page." }).check(
        Schema.isInt(),
      ),
    ),
    offset: Schema.optionalKey(
      Schema.Number.annotate({ description: "The offset of the first discovered x402 resource to return." }).check(
        Schema.isInt(),
      ),
    ),
    total: Schema.optionalKey(
      Schema.Number.annotate({ description: "The total number of discovered x402 resources." }).check(Schema.isInt()),
    ),
  }).annotate({ description: "Pagination information for the response." }),
}).annotate({ description: "Response containing discovered x402 resources." })
export type X402DiscoveryMerchantResponse = {
  readonly x402Version: X402Version
  readonly payTo: BlockchainAddress
  readonly resources: ReadonlyArray<X402DiscoveryResource>
  readonly pagination: { readonly limit?: number; readonly offset?: number; readonly total?: number }
}
export const X402DiscoveryMerchantResponse = Schema.Struct({
  x402Version: X402Version,
  payTo: BlockchainAddress,
  resources: Schema.Array(X402DiscoveryResource).annotate({
    description: "List of discovered x402 resources associated with the merchant's payTo address.",
  }),
  pagination: Schema.Struct({
    limit: Schema.optionalKey(
      Schema.Number.annotate({ description: "The number of resources returned per page." }).check(Schema.isInt()),
    ),
    offset: Schema.optionalKey(
      Schema.Number.annotate({ description: "The offset of the first resource returned." }).check(Schema.isInt()),
    ),
    total: Schema.optionalKey(
      Schema.Number.annotate({
        description: "The total number of resources associated with the merchant's payTo address.",
      }).check(Schema.isInt()),
    ),
  }).annotate({ description: "Pagination information for the response." }),
}).annotate({ description: "Response containing x402 resources associated with a merchant payment address." })
export type X402SearchResourcesResponse = {
  readonly resources: ReadonlyArray<X402DiscoveryResource>
  readonly partialResults: boolean
  readonly searchMethod?: "text" | "vector" | "hybrid"
  readonly x402Version: X402Version
}
export const X402SearchResourcesResponse = Schema.Struct({
  resources: Schema.Array(X402DiscoveryResource).annotate({
    description: "List of x402 resources matching the search query and filters.",
  }),
  partialResults: Schema.Boolean.annotate({
    description:
      "Indicates whether the result set was truncated because there were more results than the requested limit.",
  }),
  searchMethod: Schema.optionalKey(
    Schema.Literals(["text", "vector", "hybrid"]).annotate({
      description: 'The search method used to retrieve the results (e.g., "text", "vector", "hybrid").',
    }),
  ),
  x402Version: X402Version,
}).annotate({ description: "Response from a search for x402 resources." })
export type Payment_methods_PaymentMethod = FedwirePaymentMethod | SwiftPaymentMethod | SepaPaymentMethod
export const Payment_methods_PaymentMethod = Schema.Union(
  [FedwirePaymentMethod, SwiftPaymentMethod, SepaPaymentMethod],
  { mode: "oneOf" },
).annotate({
  description:
    "A payment method linked to your entity. Payment methods represent external financial instruments that can be used as a target for transfers.\n\nThe `paymentRail` field indicates which type-specific details object is present. Type-specific fields are nested under a key matching the rail name (e.g., `fedwire`, `swift`).",
})
export type DepositDestination = CryptoDepositDestination
export const DepositDestination = Schema.Union([CryptoDepositDestination], { mode: "oneOf" }).annotate({
  description: "A deposit destination for receiving funds to an account.",
})
export type CreateDepositDestinationRequest = CreateCryptoDepositDestinationRequest
export const CreateDepositDestinationRequest = Schema.Union([CreateCryptoDepositDestinationRequest], {
  mode: "oneOf",
}).annotate({
  description:
    "Request to create a new deposit destination. Provide the type-specific details matching the chosen `type`.",
})
export type Transfer = {
  readonly transferId?: string
  readonly status?: TransferStatus
  readonly source: TransferSource
  readonly target: TransferTarget
  readonly sourceAmount?: string
  readonly sourceAsset?: string
  readonly targetAmount?: string
  readonly targetAsset?: string
  readonly exchangeRate?: TransferExchangeRate
  readonly fees?: TransferFees
  readonly estimate?: TransferEstimate
  readonly completedAt?: string
  readonly failureReason?: string
  readonly expiresAt?: string
  readonly executedAt?: string
  readonly createdAt?: string
  readonly updatedAt?: string
  readonly metadata?: Metadata
  readonly details?: TransferDetails
}
export const Transfer = Schema.Struct({
  transferId: Schema.optionalKey(
    Schema.String.annotate({ description: "The ID of the transfer. Required when validateOnly is false." }),
  ),
  status: Schema.optionalKey(TransferStatus),
  source: TransferSource,
  target: TransferTarget,
  sourceAmount: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "The amount of the source asset that will be transferred out, as a decimal string in standard unit denomination.",
    }),
  ),
  sourceAsset: Schema.optionalKey(
    Schema.String.annotate({ description: "The symbol of the asset (e.g., eth, usd, usdc, usdt)." })
      .check(Schema.isMinLength(1))
      .check(Schema.isMaxLength(42)),
  ),
  targetAmount: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "The amount of the target asset that will be received, as a decimal string in standard unit denomination.",
    }),
  ),
  targetAsset: Schema.optionalKey(
    Schema.String.annotate({ description: "The symbol of the asset (e.g., eth, usd, usdc, usdt)." })
      .check(Schema.isMinLength(1))
      .check(Schema.isMaxLength(42)),
  ),
  exchangeRate: Schema.optionalKey(TransferExchangeRate),
  fees: Schema.optionalKey(TransferFees),
  estimate: Schema.optionalKey(TransferEstimate),
  completedAt: Schema.optionalKey(
    Schema.String.annotate({ description: "The date and time the transfer was completed.", format: "date-time" }),
  ),
  failureReason: Schema.optionalKey(
    Schema.String.annotate({
      description: "The reason for failure, if the transfer failed. Only present when status is `failed`.",
    }),
  ),
  expiresAt: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "The date and time when this transfer will expire if not executed. Only present for `quoted` status. A new transfer must be created to obtain an updated quote after expiration. Required when validateOnly is false.",
      format: "date-time",
    }),
  ),
  executedAt: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "The date and time the transfer was executed and moved to processing. Only present when status has progressed beyond `quoted`.",
      format: "date-time",
    }),
  ),
  createdAt: Schema.optionalKey(
    Schema.String.annotate({
      description: "The date and time the transfer was created. Required when validateOnly is false.",
      format: "date-time",
    }),
  ),
  updatedAt: Schema.optionalKey(
    Schema.String.annotate({
      description: "The date and time the transfer was last updated. Required when validateOnly is false.",
      format: "date-time",
    }),
  ),
  metadata: Schema.optionalKey(Metadata),
  details: Schema.optionalKey(TransferDetails),
}).annotate({
  description:
    "A Transfer represents all the information needed to execute a transfer and tracks the lifecycle of a transfer from initiation through completion or failure.",
})
export type TransferRequest = {
  readonly source: CreateTransferSource
  readonly target: TransferTarget
  readonly amount: string
  readonly asset: string
  readonly amountType?: "target" | "source"
  readonly validateOnly?: boolean
  readonly execute: boolean
  readonly metadata?: Metadata
  readonly travelRule?: TravelRule
}
export const TransferRequest = Schema.Struct({
  source: CreateTransferSource,
  target: TransferTarget,
  amount: Schema.String.annotate({
    description:
      'The amount of the transfer, as a decimal string in standard unit denomination of the asset specified by `asset` (e.g., "100.00" for 100 USD, "0.05" for 0.05 ETH).',
  }),
  asset: Schema.String.annotate({ description: "The symbol of the asset (e.g., eth, usd, usdc, usdt)." })
    .check(Schema.isMinLength(1))
    .check(Schema.isMaxLength(42)),
  amountType: Schema.optionalKey(
    Schema.Literals(["target", "source"]).annotate({
      description:
        "Specifies whether the given amount is to be received by the target or taken from the source.\n\n- `target`: The transfer `target` receives the exact value specified in `amount`. Fees are added to the amount taken from the transfer `source`.\n- `source`: The transfer `target` receives the value specified in `amount`, minus any fees.\n",
      default: "source",
    }),
  ),
  validateOnly: Schema.optionalKey(
    Schema.Boolean.annotate({
      description:
        "If true, validates the transfer without initiating it.  If the request is valid, a 2xx will be returned. If the request is invalid, a 4xx error will be returned. The response will include an errorType, for e.g. invalid_target if the specified target cannot receive funds.",
      default: false,
    }),
  ),
  execute: Schema.Boolean.annotate({
    description:
      "Whether to immediately execute the transfer. If false, the transfer will be created in quoted status and must be executed manually via the /execute endpoint.",
  }),
  metadata: Schema.optionalKey(Metadata),
  travelRule: Schema.optionalKey(TravelRule),
}).annotate({ description: "A request to create a transfer." })
export type AuthenticationMethods = ReadonlyArray<AuthenticationMethod>
export const AuthenticationMethods = Schema.Array(AuthenticationMethod).annotate({
  description: "The list of valid authentication methods linked to the end user.",
})
export type CreateSwapQuoteResponseWrapper = CreateSwapQuoteResponse | SwapUnavailableResponse
export const CreateSwapQuoteResponseWrapper = Schema.Union([CreateSwapQuoteResponse, SwapUnavailableResponse], {
  mode: "oneOf",
}).annotate({ description: "A wrapper for the response of a swap quote operation." })
export type EvmDataCriterion = {
  readonly type: "evmData"
  readonly abi: KnownAbiType | Abi
  readonly conditions: ReadonlyArray<EvmDataCondition>
}
export const EvmDataCriterion = Schema.Struct({
  type: Schema.Literal("evmData").annotate({ description: "The type of criterion to use. This should be `evmData`." }),
  abi: Schema.Union([KnownAbiType, Abi], { mode: "oneOf" }).annotate({
    description:
      "The ABI of the smart contract being called. This can be a partial structure with only specific functions.",
  }),
  conditions: Schema.Array(EvmDataCondition).annotate({
    description:
      "A list of conditions to apply against the function and encoded arguments in the transaction's `data` field. Each condition must be met in order for this policy to be accepted or rejected.",
  }),
}).annotate({
  title: "EvmDataCriterion",
  description: "A schema for specifying a criterion for the `data` field of an EVM transaction.",
})
export type SignSolTransactionCriteria = ReadonlyArray<
  | SolAddressCriterion
  | SolValueCriterion
  | SplAddressCriterion
  | SplValueCriterion
  | MintAddressCriterion
  | SolDataCriterion
  | ProgramIdCriterion
>
export const SignSolTransactionCriteria = Schema.Array(
  Schema.Union(
    [
      SolAddressCriterion,
      SolValueCriterion,
      SplAddressCriterion,
      SplValueCriterion,
      MintAddressCriterion,
      SolDataCriterion,
      ProgramIdCriterion,
    ],
    { mode: "oneOf" },
  ),
).annotate({ description: "A schema for specifying criteria for the SignSolTransaction operation." })
export type SendSolTransactionCriteria = ReadonlyArray<
  | SolAddressCriterion
  | SolValueCriterion
  | SplAddressCriterion
  | SplValueCriterion
  | MintAddressCriterion
  | SolDataCriterion
  | ProgramIdCriterion
  | SolNetworkCriterion
>
export const SendSolTransactionCriteria = Schema.Array(
  Schema.Union(
    [
      SolAddressCriterion,
      SolValueCriterion,
      SplAddressCriterion,
      SplValueCriterion,
      MintAddressCriterion,
      SolDataCriterion,
      ProgramIdCriterion,
      SolNetworkCriterion,
    ],
    { mode: "oneOf" },
  ),
).annotate({ description: "A schema for specifying criteria for the SendSolTransaction operation." })
export type SignEndUserSolTransactionCriteria = ReadonlyArray<
  | SolAddressCriterion
  | SolValueCriterion
  | SplAddressCriterion
  | SplValueCriterion
  | MintAddressCriterion
  | SolDataCriterion
  | ProgramIdCriterion
>
export const SignEndUserSolTransactionCriteria = Schema.Array(
  Schema.Union(
    [
      SolAddressCriterion,
      SolValueCriterion,
      SplAddressCriterion,
      SplValueCriterion,
      MintAddressCriterion,
      SolDataCriterion,
      ProgramIdCriterion,
    ],
    { mode: "oneOf" },
  ),
).annotate({ description: "A schema for specifying criteria for the signEndUserSolTransaction operation." })
export type SendEndUserSolTransactionCriteria = ReadonlyArray<
  | SolAddressCriterion
  | SolValueCriterion
  | SplAddressCriterion
  | SplValueCriterion
  | MintAddressCriterion
  | SolDataCriterion
  | ProgramIdCriterion
  | SolNetworkCriterion
>
export const SendEndUserSolTransactionCriteria = Schema.Array(
  Schema.Union(
    [
      SolAddressCriterion,
      SolValueCriterion,
      SplAddressCriterion,
      SplValueCriterion,
      MintAddressCriterion,
      SolDataCriterion,
      ProgramIdCriterion,
      SolNetworkCriterion,
    ],
    { mode: "oneOf" },
  ),
).annotate({ description: "A schema for specifying criteria for the sendEndUserSolTransaction operation." })
export type SendEndUserSolAssetCriteria = ReadonlyArray<
  SplAddressCriterion | SplValueCriterion | SolDataCriterion | SolNetworkCriterion
>
export const SendEndUserSolAssetCriteria = Schema.Array(
  Schema.Union([SplAddressCriterion, SplValueCriterion, SolDataCriterion, SolNetworkCriterion], { mode: "oneOf" }),
).annotate({ description: "A schema for specifying criteria for the sendEndUserSolAsset operation." })
export type EndUser = {
  readonly userId: string
  readonly authenticationMethods: AuthenticationMethods
  readonly mfaMethods?: MFAMethods
  readonly evmAccounts: ReadonlyArray<string>
  readonly evmAccountObjects: ReadonlyArray<EndUserEvmAccount>
  readonly evmSmartAccounts: ReadonlyArray<string>
  readonly evmSmartAccountObjects: ReadonlyArray<EndUserEvmSmartAccount>
  readonly solanaAccounts: ReadonlyArray<string>
  readonly solanaAccountObjects: ReadonlyArray<EndUserSolanaAccount>
  readonly createdAt: string
}
export const EndUser = Schema.Struct({
  userId: Schema.String.annotate({
    description:
      "A stable, unique identifier for the end user. The `userId` must be unique across all end users in the developer's CDP Project. It must be between 1 and 100 characters long and can only contain alphanumeric characters and hyphens.",
  }).check(Schema.isPattern(new RegExp("^[a-zA-Z0-9-]{1,100}$"))),
  authenticationMethods: AuthenticationMethods,
  mfaMethods: Schema.optionalKey(MFAMethods),
  evmAccounts: Schema.Array(
    Schema.String.annotate({ description: "The address of the EVM account associated with the end user." }).check(
      Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$")),
    ),
  ).annotate({
    description:
      "**DEPRECATED**: Use `evmAccountObjects` instead for richer account information. The list of EVM account addresses associated with the end user. End users can have up to 10 EVM accounts.",
  }),
  evmAccountObjects: Schema.Array(EndUserEvmAccount).annotate({
    description: "The list of EVM accounts associated with the end user. End users can have up to 10 EVM accounts.",
  }),
  evmSmartAccounts: Schema.Array(
    Schema.String.annotate({ description: "The address of the EVM smart account associated with the end user." }).check(
      Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$")),
    ),
  ).annotate({
    description:
      "**DEPRECATED**: Use `evmSmartAccountObjects` instead for richer account information including owner relationships. The list of EVM smart account addresses associated with the end user. Each EVM EOA can own one smart account.",
  }),
  evmSmartAccountObjects: Schema.Array(EndUserEvmSmartAccount).annotate({
    description: "The list of EVM smart accounts associated with the end user. Each EVM EOA can own one smart account.",
  }),
  solanaAccounts: Schema.Array(
    Schema.String.annotate({
      description: "The base58 encoded address of the Solana account associated with the end user.",
    }).check(Schema.isPattern(new RegExp("^[1-9A-HJ-NP-Za-km-z]{32,44}$"))),
  ).annotate({
    description:
      "**DEPRECATED**: Use `solanaAccountObjects` instead for richer account information. The list of Solana account addresses associated with the end user. End users can have up to 10 Solana accounts.",
  }),
  solanaAccountObjects: Schema.Array(EndUserSolanaAccount).annotate({
    description:
      "The list of Solana accounts associated with the end user. End users can have up to 10 Solana accounts.",
  }),
  createdAt: Schema.String.annotate({
    description: "The date and time when the end user was created, in ISO 8601 format.",
    format: "date-time",
  }),
}).annotate({ description: "Information about the end user." })
export type SignEvmTransactionCriteria = ReadonlyArray<
  EthValueCriterion | EvmAddressCriterion | EvmDataCriterion | NetUSDChangeCriterion
>
export const SignEvmTransactionCriteria = Schema.Array(
  Schema.Union([EthValueCriterion, EvmAddressCriterion, EvmDataCriterion, NetUSDChangeCriterion], { mode: "oneOf" }),
).annotate({ description: "A schema for specifying criteria for the SignEvmTransaction operation." })
export type SendEvmTransactionCriteria = ReadonlyArray<
  EthValueCriterion | EvmAddressCriterion | EvmNetworkCriterion | EvmDataCriterion | NetUSDChangeCriterion
>
export const SendEvmTransactionCriteria = Schema.Array(
  Schema.Union([EthValueCriterion, EvmAddressCriterion, EvmNetworkCriterion, EvmDataCriterion, NetUSDChangeCriterion], {
    mode: "oneOf",
  }),
).annotate({ description: "A schema for specifying criteria for the SignEvmTransaction operation." })
export type PrepareUserOperationCriteria = ReadonlyArray<
  EthValueCriterion | EvmAddressCriterion | EvmNetworkCriterion | EvmDataCriterion | NetUSDChangeCriterion
>
export const PrepareUserOperationCriteria = Schema.Array(
  Schema.Union([EthValueCriterion, EvmAddressCriterion, EvmNetworkCriterion, EvmDataCriterion, NetUSDChangeCriterion], {
    mode: "oneOf",
  }),
).annotate({ description: "A schema for specifying criteria for the PrepareUserOperation operation." })
export type SendUserOperationCriteria = ReadonlyArray<
  EthValueCriterion | EvmAddressCriterion | EvmNetworkCriterion | EvmDataCriterion | NetUSDChangeCriterion
>
export const SendUserOperationCriteria = Schema.Array(
  Schema.Union([EthValueCriterion, EvmAddressCriterion, EvmNetworkCriterion, EvmDataCriterion, NetUSDChangeCriterion], {
    mode: "oneOf",
  }),
).annotate({ description: "A schema for specifying criteria for the SendUserOperation operation." })
export type SignEndUserEvmTransactionCriteria = ReadonlyArray<
  EthValueCriterion | EvmAddressCriterion | EvmDataCriterion | NetUSDChangeCriterion
>
export const SignEndUserEvmTransactionCriteria = Schema.Array(
  Schema.Union([EthValueCriterion, EvmAddressCriterion, EvmDataCriterion, NetUSDChangeCriterion], { mode: "oneOf" }),
).annotate({ description: "A schema for specifying criteria for the signEndUserEvmTransaction operation." })
export type SendEndUserEvmTransactionCriteria = ReadonlyArray<
  EthValueCriterion | EvmAddressCriterion | EvmNetworkCriterion | EvmDataCriterion | NetUSDChangeCriterion
>
export const SendEndUserEvmTransactionCriteria = Schema.Array(
  Schema.Union([EthValueCriterion, EvmAddressCriterion, EvmNetworkCriterion, EvmDataCriterion, NetUSDChangeCriterion], {
    mode: "oneOf",
  }),
).annotate({ description: "A schema for specifying criteria for the sendEndUserEvmTransaction operation." })
export type SendEndUserEvmAssetCriteria = ReadonlyArray<EvmNetworkCriterion | EvmDataCriterion | NetUSDChangeCriterion>
export const SendEndUserEvmAssetCriteria = Schema.Array(
  Schema.Union([EvmNetworkCriterion, EvmDataCriterion, NetUSDChangeCriterion], { mode: "oneOf" }),
).annotate({ description: "A schema for specifying criteria for the sendEndUserEvmAsset operation." })
export type SendEndUserOperationCriteria = ReadonlyArray<
  EthValueCriterion | EvmAddressCriterion | EvmNetworkCriterion | EvmDataCriterion | NetUSDChangeCriterion
>
export const SendEndUserOperationCriteria = Schema.Array(
  Schema.Union([EthValueCriterion, EvmAddressCriterion, EvmNetworkCriterion, EvmDataCriterion, NetUSDChangeCriterion], {
    mode: "oneOf",
  }),
).annotate({ description: "A schema for specifying criteria for the sendEndUserOperation operation." })
export type CreateEndUserEvmSwapCriteria = ReadonlyArray<EvmNetworkCriterion | EvmDataCriterion | NetUSDChangeCriterion>
export const CreateEndUserEvmSwapCriteria = Schema.Array(
  Schema.Union([EvmNetworkCriterion, EvmDataCriterion, NetUSDChangeCriterion], { mode: "oneOf" }),
).annotate({ description: "A schema for specifying criteria for the createEndUserEvmSwap operation." })
export type Rule =
  | {
      readonly action: "reject" | "accept"
      readonly operation: "signEvmTransaction"
      readonly criteria: SignEvmTransactionCriteria
    }
  | {
      readonly action: "reject" | "accept"
      readonly operation: "sendEvmTransaction"
      readonly criteria: SendEvmTransactionCriteria
    }
  | {
      readonly action: "reject" | "accept"
      readonly operation: "signEvmMessage"
      readonly criteria: SignEvmMessageCriteria
    }
  | {
      readonly action: "reject" | "accept"
      readonly operation: "signEvmTypedData"
      readonly criteria: SignEvmTypedDataCriteria
    }
  | {
      readonly action: "reject" | "accept"
      readonly operation: "signSolTransaction"
      readonly criteria: SignSolTransactionCriteria
    }
  | {
      readonly action: "reject" | "accept"
      readonly operation: "sendSolTransaction"
      readonly criteria: SendSolTransactionCriteria
    }
  | {
      readonly action: "reject" | "accept"
      readonly operation: "signSolMessage"
      readonly criteria: SignSolMessageCriteria
    }
  | { readonly action: "reject" | "accept"; readonly operation: "signEvmHash" }
  | {
      readonly action: "reject" | "accept"
      readonly operation: "prepareUserOperation"
      readonly criteria: PrepareUserOperationCriteria
    }
  | {
      readonly action: "reject" | "accept"
      readonly operation: "sendUserOperation"
      readonly criteria: SendUserOperationCriteria
    }
  | {
      readonly action: "reject" | "accept"
      readonly operation: "signEndUserEvmTransaction"
      readonly criteria: SignEndUserEvmTransactionCriteria
    }
  | {
      readonly action: "reject" | "accept"
      readonly operation: "sendEndUserEvmTransaction"
      readonly criteria: SendEndUserEvmTransactionCriteria
    }
  | {
      readonly action: "reject" | "accept"
      readonly operation: "signEndUserEvmMessage"
      readonly criteria: SignEndUserEvmMessageCriteria
    }
  | {
      readonly action: "reject" | "accept"
      readonly operation: "signEndUserEvmTypedData"
      readonly criteria: SignEndUserEvmTypedDataCriteria
    }
  | { readonly action: "reject" | "accept"; readonly operation: "signEndUserEvmHash" }
  | {
      readonly action: "reject" | "accept"
      readonly operation: "signEndUserSolTransaction"
      readonly criteria: SignEndUserSolTransactionCriteria
    }
  | {
      readonly action: "reject" | "accept"
      readonly operation: "sendEndUserSolTransaction"
      readonly criteria: SendEndUserSolTransactionCriteria
    }
  | {
      readonly action: "reject" | "accept"
      readonly operation: "signEndUserSolMessage"
      readonly criteria: SignEndUserSolMessageCriteria
    }
  | {
      readonly action: "reject" | "accept"
      readonly operation: "sendEndUserEvmAsset"
      readonly criteria: SendEndUserEvmAssetCriteria
    }
  | {
      readonly action: "reject" | "accept"
      readonly operation: "sendEndUserSolAsset"
      readonly criteria: SendEndUserSolAssetCriteria
    }
  | {
      readonly action: "reject" | "accept"
      readonly operation: "sendEndUserOperation"
      readonly criteria: SendEndUserOperationCriteria
    }
  | {
      readonly action: "reject" | "accept"
      readonly operation: "createEndUserEvmSwap"
      readonly criteria: CreateEndUserEvmSwapCriteria
    }
export const Rule = Schema.Union(
  [
    Schema.Struct({
      action: Schema.Literals(["reject", "accept"]).annotate({
        description: "Whether matching the rule will cause the request to be rejected or accepted.",
      }),
      operation: Schema.Literal("signEvmTransaction").annotate({
        description:
          "The operation to which the rule applies. Every element of the `criteria` array must match the specified operation.",
      }),
      criteria: SignEvmTransactionCriteria,
    }).annotate({ title: "SignEvmTransactionRule", description: "A rule that limits the behavior of an account." }),
    Schema.Struct({
      action: Schema.Literals(["reject", "accept"]).annotate({
        description: "Whether matching the rule will cause the request to be rejected or accepted.",
      }),
      operation: Schema.Literal("sendEvmTransaction").annotate({
        description:
          "The operation to which the rule applies. Every element of the `criteria` array must match the specified operation.",
      }),
      criteria: SendEvmTransactionCriteria,
    }).annotate({ title: "SendEvmTransactionRule", description: "A rule that limits the behavior of an account." }),
    Schema.Struct({
      action: Schema.Literals(["reject", "accept"]).annotate({
        description: "Whether matching the rule will cause the request to be rejected or accepted.",
      }),
      operation: Schema.Literal("signEvmMessage").annotate({
        description:
          "The operation to which the rule applies. Every element of the `criteria` array must match the specified operation.",
      }),
      criteria: SignEvmMessageCriteria,
    }).annotate({ title: "SignEvmMessageRule", description: "A rule that limits the behavior of an account." }),
    Schema.Struct({
      action: Schema.Literals(["reject", "accept"]).annotate({
        description: "Whether matching the rule will cause the request to be rejected or accepted.",
      }),
      operation: Schema.Literal("signEvmTypedData").annotate({
        description:
          "The operation to which the rule applies. Every element of the `criteria` array must match the specified operation.",
      }),
      criteria: SignEvmTypedDataCriteria,
    }).annotate({ title: "SignEvmTypedDataRule", description: "A rule that limits the behavior of an account." }),
    Schema.Struct({
      action: Schema.Literals(["reject", "accept"]).annotate({
        description: "Whether matching the rule will cause the request to be rejected or accepted.",
      }),
      operation: Schema.Literal("signSolTransaction").annotate({
        description:
          "The operation to which the rule applies. Every element of the `criteria` array must match the specified operation.",
      }),
      criteria: SignSolTransactionCriteria,
    }).annotate({ title: "SignSolTransactionRule", description: "A rule that limits the behavior of an account." }),
    Schema.Struct({
      action: Schema.Literals(["reject", "accept"]).annotate({
        description: "Whether matching the rule will cause the request to be rejected or accepted.",
      }),
      operation: Schema.Literal("sendSolTransaction").annotate({
        description:
          "The operation to which the rule applies. Every element of the `criteria` array must match the specified operation.",
      }),
      criteria: SendSolTransactionCriteria,
    }).annotate({ title: "SendSolTransactionRule", description: "A rule that limits the behavior of an account." }),
    Schema.Struct({
      action: Schema.Literals(["reject", "accept"]).annotate({
        description: "Whether matching the rule will cause the request to be rejected or accepted.",
      }),
      operation: Schema.Literal("signSolMessage").annotate({
        description:
          "The operation to which the rule applies. Every element of the `criteria` array must match the specified operation.",
      }),
      criteria: SignSolMessageCriteria,
    }).annotate({ title: "SignSolMessageRule", description: "A rule that limits the behavior of an account." }),
    Schema.Struct({
      action: Schema.Literals(["reject", "accept"]).annotate({
        description:
          "Whether any attempts to sign a hash will be accepted or rejected. This rule does not accept any criteria.",
      }),
      operation: Schema.Literal("signEvmHash").annotate({ description: "The operation to which the rule applies." }),
    }).annotate({ title: "SignEvmHashRule", description: "A rule that limits the behavior of an account." }),
    Schema.Struct({
      action: Schema.Literals(["reject", "accept"]).annotate({
        description: "Whether matching the rule will cause the request to be rejected or accepted.",
      }),
      operation: Schema.Literal("prepareUserOperation").annotate({
        description:
          "The operation to which the rule applies. Every element of the `criteria` array must match the specified operation.",
      }),
      criteria: PrepareUserOperationCriteria,
    }).annotate({ title: "PrepareUserOperationRule", description: "A rule that limits the behavior of an account." }),
    Schema.Struct({
      action: Schema.Literals(["reject", "accept"]).annotate({
        description: "Whether matching the rule will cause the request to be rejected or accepted.",
      }),
      operation: Schema.Literal("sendUserOperation").annotate({
        description:
          "The operation to which the rule applies. Every element of the `criteria` array must match the specified operation.",
      }),
      criteria: SendUserOperationCriteria,
    }).annotate({ title: "SendUserOperationRule", description: "A rule that limits the behavior of an account." }),
    Schema.Struct({
      action: Schema.Literals(["reject", "accept"]).annotate({
        description: "Whether matching the rule will cause the request to be rejected or accepted.",
      }),
      operation: Schema.Literal("signEndUserEvmTransaction").annotate({
        description:
          "The operation to which the rule applies. Every element of the `criteria` array must match the specified operation.",
      }),
      criteria: SignEndUserEvmTransactionCriteria,
    }).annotate({
      title: "SignEndUserEvmTransactionRule",
      description: "A rule that limits the behavior of an account.",
    }),
    Schema.Struct({
      action: Schema.Literals(["reject", "accept"]).annotate({
        description: "Whether matching the rule will cause the request to be rejected or accepted.",
      }),
      operation: Schema.Literal("sendEndUserEvmTransaction").annotate({
        description:
          "The operation to which the rule applies. Every element of the `criteria` array must match the specified operation.",
      }),
      criteria: SendEndUserEvmTransactionCriteria,
    }).annotate({
      title: "SendEndUserEvmTransactionRule",
      description: "A rule that limits the behavior of an account.",
    }),
    Schema.Struct({
      action: Schema.Literals(["reject", "accept"]).annotate({
        description: "Whether matching the rule will cause the request to be rejected or accepted.",
      }),
      operation: Schema.Literal("signEndUserEvmMessage").annotate({
        description:
          "The operation to which the rule applies. Every element of the `criteria` array must match the specified operation.",
      }),
      criteria: SignEndUserEvmMessageCriteria,
    }).annotate({ title: "SignEndUserEvmMessageRule", description: "A rule that limits the behavior of an account." }),
    Schema.Struct({
      action: Schema.Literals(["reject", "accept"]).annotate({
        description: "Whether matching the rule will cause the request to be rejected or accepted.",
      }),
      operation: Schema.Literal("signEndUserEvmTypedData").annotate({
        description:
          "The operation to which the rule applies. Every element of the `criteria` array must match the specified operation.",
      }),
      criteria: SignEndUserEvmTypedDataCriteria,
    }).annotate({
      title: "SignEndUserEvmTypedDataRule",
      description: "A rule that limits the behavior of an account.",
    }),
    Schema.Struct({
      action: Schema.Literals(["reject", "accept"]).annotate({
        description:
          "Whether any attempts to sign a hash will be accepted or rejected. This rule does not accept any criteria.",
      }),
      operation: Schema.Literal("signEndUserEvmHash").annotate({
        description: "The operation to which the rule applies.",
      }),
    }).annotate({ title: "SignEndUserEvmHashRule", description: "A rule that limits the behavior of an account." }),
    Schema.Struct({
      action: Schema.Literals(["reject", "accept"]).annotate({
        description: "Whether matching the rule will cause the request to be rejected or accepted.",
      }),
      operation: Schema.Literal("signEndUserSolTransaction").annotate({
        description:
          "The operation to which the rule applies. Every element of the `criteria` array must match the specified operation.",
      }),
      criteria: SignEndUserSolTransactionCriteria,
    }).annotate({
      title: "SignEndUserSolTransactionRule",
      description: "A rule that limits the behavior of an account.",
    }),
    Schema.Struct({
      action: Schema.Literals(["reject", "accept"]).annotate({
        description: "Whether matching the rule will cause the request to be rejected or accepted.",
      }),
      operation: Schema.Literal("sendEndUserSolTransaction").annotate({
        description:
          "The operation to which the rule applies. Every element of the `criteria` array must match the specified operation.",
      }),
      criteria: SendEndUserSolTransactionCriteria,
    }).annotate({
      title: "SendEndUserSolTransactionRule",
      description: "A rule that limits the behavior of an account.",
    }),
    Schema.Struct({
      action: Schema.Literals(["reject", "accept"]).annotate({
        description: "Whether matching the rule will cause the request to be rejected or accepted.",
      }),
      operation: Schema.Literal("signEndUserSolMessage").annotate({
        description:
          "The operation to which the rule applies. Every element of the `criteria` array must match the specified operation.",
      }),
      criteria: SignEndUserSolMessageCriteria,
    }).annotate({ title: "SignEndUserSolMessageRule", description: "A rule that limits the behavior of an account." }),
    Schema.Struct({
      action: Schema.Literals(["reject", "accept"]).annotate({
        description: "Whether matching the rule will cause the request to be rejected or accepted.",
      }),
      operation: Schema.Literal("sendEndUserEvmAsset").annotate({
        description:
          "The operation to which the rule applies. Every element of the `criteria` array must match the specified operation.",
      }),
      criteria: SendEndUserEvmAssetCriteria,
    }).annotate({ title: "SendEndUserEvmAssetRule", description: "A rule that limits the behavior of an account." }),
    Schema.Struct({
      action: Schema.Literals(["reject", "accept"]).annotate({
        description: "Whether matching the rule will cause the request to be rejected or accepted.",
      }),
      operation: Schema.Literal("sendEndUserSolAsset").annotate({
        description:
          "The operation to which the rule applies. Every element of the `criteria` array must match the specified operation.",
      }),
      criteria: SendEndUserSolAssetCriteria,
    }).annotate({ title: "SendEndUserSolAssetRule", description: "A rule that limits the behavior of an account." }),
    Schema.Struct({
      action: Schema.Literals(["reject", "accept"]).annotate({
        description: "Whether matching the rule will cause the request to be rejected or accepted.",
      }),
      operation: Schema.Literal("sendEndUserOperation").annotate({
        description:
          "The operation to which the rule applies. Every element of the `criteria` array must match the specified operation.",
      }),
      criteria: SendEndUserOperationCriteria,
    }).annotate({ title: "SendEndUserOperationRule", description: "A rule that limits the behavior of an account." }),
    Schema.Struct({
      action: Schema.Literals(["reject", "accept"]).annotate({
        description: "Whether matching the rule will cause the request to be rejected or accepted.",
      }),
      operation: Schema.Literal("createEndUserEvmSwap").annotate({
        description:
          "The operation to which the rule applies. Every element of the `criteria` array must match the specified operation.",
      }),
      criteria: CreateEndUserEvmSwapCriteria,
    }).annotate({ title: "CreateEndUserEvmSwapRule", description: "A rule that limits the behavior of an account." }),
  ],
  { mode: "oneOf" },
)
export type Policy = {
  readonly id: string
  readonly description?: string
  readonly scope: "project" | "account"
  readonly rules: ReadonlyArray<Rule>
  readonly createdAt: string
  readonly updatedAt: string
}
export const Policy = Schema.Struct({
  id: Schema.String.annotate({ description: "The unique identifier for the policy." }).check(
    Schema.isPattern(new RegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")),
  ),
  description: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "An optional human-readable description of the policy.\nPolicy descriptions can consist of alphanumeric characters, spaces, commas, and periods, and be 50 characters or less.",
    }).check(Schema.isPattern(new RegExp("^[A-Za-z0-9 ,.]{1,50}$"))),
  ),
  scope: Schema.Literals(["project", "account"]).annotate({
    description: "The scope of the policy. Only one project-level policy can exist at any time.",
  }),
  rules: Schema.Array(Rule).annotate({ description: "A list of rules that comprise the policy." }),
  createdAt: Schema.String.annotate({ description: "The ISO 8601 timestamp at which the Policy was created." }),
  updatedAt: Schema.String.annotate({ description: "The ISO 8601 timestamp at which the Policy was last updated." }),
})
// recursive definitions
const __recursive_AbiParameter = Schema.Struct({
  name: Schema.optionalKey(Schema.String.annotate({ description: "The name of the parameter." })),
  type: Schema.String.annotate({ description: "The canonical type of the parameter." }),
  internalType: Schema.optionalKey(
    Schema.String.annotate({ description: "The internal Solidity type used by the compiler." }),
  ),
  components: Schema.optionalKey(
    Schema.Array(Schema.suspend((): Schema.Codec<AbiParameter> => AbiParameter)).annotate({
      description: "Used for tuple types.",
    }),
  ),
}).annotate({ description: "Parameter definition for ABI functions, errors, and constructors." })
// schemas
export type ListFoundationAccountsParams = {
  readonly pageSize?: number
  readonly pageToken?: string
  readonly type?: AccountType
}
export const ListFoundationAccountsParams = Schema.Struct({
  pageSize: Schema.optionalKey(Schema.Number.annotate({ default: 20 }).check(Schema.isInt())),
  pageToken: Schema.optionalKey(Schema.String),
  type: Schema.optionalKey(AccountType),
})
export type ListFoundationAccounts200 = { readonly accounts: ReadonlyArray<Account>; readonly nextPageToken?: string }
export const ListFoundationAccounts200 = Schema.Struct({
  accounts: Schema.Array(Account).annotate({ description: "The list of accounts." }),
  nextPageToken: Schema.optionalKey(
    Schema.String.annotate({ description: "The token for the next page of items, if any." }),
  ),
})
export type ListFoundationAccounts400 = Error
export const ListFoundationAccounts400 = Error
export type CreateFoundationAccountParams = { readonly "X-Idempotency-Key"?: string }
export const CreateFoundationAccountParams = Schema.Struct({
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type CreateFoundationAccountRequestJson = CreateAccountRequest
export const CreateFoundationAccountRequestJson = CreateAccountRequest
export type CreateFoundationAccount200 = Account
export const CreateFoundationAccount200 = Account
export type CreateFoundationAccount400 = Error
export const CreateFoundationAccount400 = Error
export type CreateFoundationAccount403 = Error
export const CreateFoundationAccount403 = Error
export type CreateFoundationAccount422 = Error
export const CreateFoundationAccount422 = Error
export type CreateFoundationAccount503 = Error
export const CreateFoundationAccount503 = Error
export type GetFoundationAccountById200 = Account
export const GetFoundationAccountById200 = Account
export type GetFoundationAccountById400 = Error
export const GetFoundationAccountById400 = Error
export type GetFoundationAccountById404 = Error
export const GetFoundationAccountById404 = Error
export type ListBalancesParams = { readonly pageSize?: number; readonly pageToken?: string }
export const ListBalancesParams = Schema.Struct({
  pageSize: Schema.optionalKey(Schema.Number.annotate({ default: 20 }).check(Schema.isInt())),
  pageToken: Schema.optionalKey(Schema.String),
})
export type ListBalances200 = { readonly balances: ReadonlyArray<Balance>; readonly nextPageToken?: string }
export const ListBalances200 = Schema.Struct({
  balances: Schema.Array(Balance).annotate({ description: "The list of balances." }),
  nextPageToken: Schema.optionalKey(
    Schema.String.annotate({ description: "The token for the next page of items, if any." }),
  ),
}).annotate({ description: "A list of balances for an account." })
export type ListBalances400 = Error
export const ListBalances400 = Error
export type ListBalances401 = Error
export const ListBalances401 = Error
export type ListBalances404 = Error
export const ListBalances404 = Error
export type ListBalances500 = Error
export const ListBalances500 = Error
export type ListBalances503 = Error
export const ListBalances503 = Error
export type GetBalanceByAsset200 = Balance
export const GetBalanceByAsset200 = Balance
export type GetBalanceByAsset400 = Error
export const GetBalanceByAsset400 = Error
export type GetBalanceByAsset401 = Error
export const GetBalanceByAsset401 = Error
export type GetBalanceByAsset404 = Error
export const GetBalanceByAsset404 = Error
export type GetBalanceByAsset500 = Error
export const GetBalanceByAsset500 = Error
export type GetBalanceByAsset503 = Error
export const GetBalanceByAsset503 = Error
export type ListDepositDestinationsParams = {
  readonly accountId?: AccountId
  readonly address?: string
  readonly type?: DepositDestinationType
  readonly network?: string
  readonly pageSize?: number
  readonly pageToken?: string
}
export const ListDepositDestinationsParams = Schema.Struct({
  accountId: Schema.optionalKey(AccountId),
  address: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "The cryptocurrency address to filter by. Format depends on the network (e.g., 0x-prefixed for EVM networks, base58 for Solana).",
    }),
  ),
  type: Schema.optionalKey(DepositDestinationType),
  network: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "The blockchain network to filter by (e.g., base, ethereum). Only applies to crypto deposit destinations.",
    }),
  ),
  pageSize: Schema.optionalKey(Schema.Number.annotate({ default: 20 }).check(Schema.isInt())),
  pageToken: Schema.optionalKey(Schema.String),
})
export type ListDepositDestinations200 = {
  readonly depositDestinations: ReadonlyArray<DepositDestination>
  readonly nextPageToken?: string
}
export const ListDepositDestinations200 = Schema.Struct({
  depositDestinations: Schema.Array(DepositDestination).annotate({ description: "The list of deposit destinations." }),
  nextPageToken: Schema.optionalKey(
    Schema.String.annotate({ description: "The token for the next page of items, if any." }),
  ),
})
export type ListDepositDestinations400 = Error
export const ListDepositDestinations400 = Error
export type ListDepositDestinations401 = Error
export const ListDepositDestinations401 = Error
export type ListDepositDestinations500 = Error
export const ListDepositDestinations500 = Error
export type CreateDepositDestinationParams = { readonly "X-Idempotency-Key"?: string }
export const CreateDepositDestinationParams = Schema.Struct({
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type CreateDepositDestinationRequestJson = CreateDepositDestinationRequest
export const CreateDepositDestinationRequestJson = CreateDepositDestinationRequest
export type CreateDepositDestination201 = DepositDestination
export const CreateDepositDestination201 = DepositDestination
export type CreateDepositDestination400 = Error
export const CreateDepositDestination400 = Error
export type CreateDepositDestination401 = Error
export const CreateDepositDestination401 = Error
export type CreateDepositDestination403 = Error
export const CreateDepositDestination403 = Error
export type CreateDepositDestination404 = Error
export const CreateDepositDestination404 = Error
export type CreateDepositDestination422 = Error
export const CreateDepositDestination422 = Error
export type CreateDepositDestination500 = Error
export const CreateDepositDestination500 = Error
export type CreateDepositDestination503 = Error
export const CreateDepositDestination503 = Error
export type GetDepositDestinationById200 = DepositDestination
export const GetDepositDestinationById200 = DepositDestination
export type GetDepositDestinationById400 = Error
export const GetDepositDestinationById400 = Error
export type GetDepositDestinationById401 = Error
export const GetDepositDestinationById401 = Error
export type GetDepositDestinationById404 = Error
export const GetDepositDestinationById404 = Error
export type GetDepositDestinationById500 = Error
export const GetDepositDestinationById500 = Error
export type ListTransfersParams = {
  readonly status?: TransferStatus
  readonly accountId?: AccountId
  readonly sourceAccountId?: AccountId
  readonly targetAccountId?: AccountId
  readonly createdAfter?: string
  readonly createdBefore?: string
  readonly updatedAfter?: string
  readonly updatedBefore?: string
  readonly sourceAsset?: string
  readonly targetAsset?: string
  readonly sourceAddress?: BlockchainAddress
  readonly targetAddress?: BlockchainAddress
  readonly targetEmail?: Email
  readonly transferId?: string
  readonly pageSize?: number
  readonly pageToken?: string
}
export const ListTransfersParams = Schema.Struct({
  status: Schema.optionalKey(TransferStatus),
  accountId: Schema.optionalKey(AccountId),
  sourceAccountId: Schema.optionalKey(AccountId),
  targetAccountId: Schema.optionalKey(AccountId),
  createdAfter: Schema.optionalKey(Schema.String.annotate({ format: "date-time" })),
  createdBefore: Schema.optionalKey(Schema.String.annotate({ format: "date-time" })),
  updatedAfter: Schema.optionalKey(Schema.String.annotate({ format: "date-time" })),
  updatedBefore: Schema.optionalKey(Schema.String.annotate({ format: "date-time" })),
  sourceAsset: Schema.optionalKey(Schema.String),
  targetAsset: Schema.optionalKey(Schema.String),
  sourceAddress: Schema.optionalKey(BlockchainAddress),
  targetAddress: Schema.optionalKey(BlockchainAddress),
  targetEmail: Schema.optionalKey(Email),
  transferId: Schema.optionalKey(Schema.String.check(Schema.isPattern(new RegExp("^transfer_[a-f0-9\\-]{36}$")))),
  pageSize: Schema.optionalKey(Schema.Number.annotate({ default: 20 }).check(Schema.isInt())),
  pageToken: Schema.optionalKey(Schema.String),
})
export type ListTransfers200 = { readonly transfers: ReadonlyArray<Transfer>; readonly nextPageToken?: string }
export const ListTransfers200 = Schema.Struct({
  transfers: Schema.Array(Transfer).annotate({ description: "The list of transfers." }),
  nextPageToken: Schema.optionalKey(
    Schema.String.annotate({ description: "The token for the next page of items, if any." }),
  ),
})
export type ListTransfers400 = Error
export const ListTransfers400 = Error
export type CreateTransferParams = { readonly "X-Idempotency-Key"?: string }
export const CreateTransferParams = Schema.Struct({
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type CreateTransferRequestJson = TransferRequest
export const CreateTransferRequestJson = TransferRequest
export type CreateTransfer200 = Transfer
export const CreateTransfer200 = Transfer
export type CreateTransfer400 = Error
export const CreateTransfer400 = Error
export type CreateTransfer403 = Error
export const CreateTransfer403 = Error
export type CreateTransfer422 = Error
export const CreateTransfer422 = Error
export type GetTransferById200 = Transfer
export const GetTransferById200 = Transfer
export type GetTransferById404 = Error
export const GetTransferById404 = Error
export type ExecuteFundTransferParams = { readonly "X-Idempotency-Key"?: string }
export const ExecuteFundTransferParams = Schema.Struct({
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type ExecuteFundTransfer200 = Transfer
export const ExecuteFundTransfer200 = Transfer
export type ExecuteFundTransfer400 = Error
export const ExecuteFundTransfer400 = Error
export type ExecuteFundTransfer401 = Error
export const ExecuteFundTransfer401 = Error
export type ExecuteFundTransfer403 = Error
export const ExecuteFundTransfer403 = Error
export type ExecuteFundTransfer404 = Error
export const ExecuteFundTransfer404 = Error
export type ExecuteFundTransfer422 = Error
export const ExecuteFundTransfer422 = Error
export type ExecuteFundTransfer429 = Error
export const ExecuteFundTransfer429 = Error
export type ExecuteFundTransfer500 = Error
export const ExecuteFundTransfer500 = Error
export type ExecuteFundTransfer502 = Error
export const ExecuteFundTransfer502 = Error
export type ExecuteFundTransfer503 = Error
export const ExecuteFundTransfer503 = Error
export type SubmitDepositTravelRuleParams = { readonly "X-Idempotency-Key"?: string }
export const SubmitDepositTravelRuleParams = Schema.Struct({
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type SubmitDepositTravelRuleRequestJson = DepositTravelRuleRequest
export const SubmitDepositTravelRuleRequestJson = DepositTravelRuleRequest
export type SubmitDepositTravelRule200 = DepositTravelRuleResponse
export const SubmitDepositTravelRule200 = DepositTravelRuleResponse
export type SubmitDepositTravelRule400 = Error
export const SubmitDepositTravelRule400 = Error
export type SubmitDepositTravelRule404 = Error
export const SubmitDepositTravelRule404 = Error
export type SubmitDepositTravelRule422 = Error
export const SubmitDepositTravelRule422 = Error
export type ListEndUsersParams = {
  readonly pageSize?: number
  readonly pageToken?: string
  readonly sort?: ReadonlyArray<"createdAt=asc" | "createdAt=desc">
}
export const ListEndUsersParams = Schema.Struct({
  pageSize: Schema.optionalKey(
    Schema.Number.annotate({ default: 20 })
      .check(Schema.isInt())
      .check(Schema.isGreaterThanOrEqualTo(1))
      .check(Schema.isLessThanOrEqualTo(100)),
  ),
  pageToken: Schema.optionalKey(Schema.String),
  sort: Schema.optionalKey(Schema.Array(Schema.Literals(["createdAt=asc", "createdAt=desc"]))),
})
export type ListEndUsers200 = { readonly endUsers: ReadonlyArray<EndUser>; readonly nextPageToken?: string }
export const ListEndUsers200 = Schema.Struct({
  endUsers: Schema.Array(EndUser).annotate({ description: "The list of end users." }),
  nextPageToken: Schema.optionalKey(
    Schema.String.annotate({ description: "The token for the next page of items, if any." }),
  ),
})
export type ListEndUsers400 = Error
export const ListEndUsers400 = Error
export type ListEndUsers401 = Error
export const ListEndUsers401 = Error
export type ListEndUsers500 = Error
export const ListEndUsers500 = Error
export type ListEndUsers502 = Error
export const ListEndUsers502 = Error
export type ListEndUsers503 = Error
export const ListEndUsers503 = Error
export type CreateEndUserParams = { readonly "X-Wallet-Auth": string; readonly "X-Idempotency-Key"?: string }
export const CreateEndUserParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type CreateEndUserRequestJson = {
  readonly userId?: string
  readonly authenticationMethods: AuthenticationMethods
  readonly evmAccount?: { readonly createSmartAccount?: boolean; readonly enableSpendPermissions?: boolean }
  readonly solanaAccount?: { readonly createSmartAccount?: boolean }
}
export const CreateEndUserRequestJson = Schema.Struct({
  userId: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "A stable, unique identifier for the end user. The `userId` must be unique across all end users in the developer's CDP Project. It must be between 1 and 100 characters long and can only contain alphanumeric characters and hyphens.\n\nIf `userId` is not provided in the request, the server will generate a random UUID.",
    }).check(Schema.isPattern(new RegExp("^[a-zA-Z0-9-]{1,100}$"))),
  ),
  authenticationMethods: AuthenticationMethods,
  evmAccount: Schema.optionalKey(
    Schema.Struct({
      createSmartAccount: Schema.optionalKey(
        Schema.Boolean.annotate({
          description:
            "If true, creates an EVM smart account and a default EVM EOA account as the owner. If false, only a EVM EOA account is created.",
          default: false,
        }),
      ),
      enableSpendPermissions: Schema.optionalKey(
        Schema.Boolean.annotate({ description: "If true, enables spend permissions for the EVM smart account." }),
      ),
    }).annotate({ description: "Configuration for creating an EVM account for the end user." }),
  ),
  solanaAccount: Schema.optionalKey(
    Schema.Struct({
      createSmartAccount: Schema.optionalKey(
        Schema.Boolean.annotate({
          description: "Only false is a valid option since currently smart accounts on Solana are not supported.",
          default: false,
        }),
      ),
    }).annotate({ description: "Configuration for creating a Solana account for the end user." }),
  ),
})
export type CreateEndUser201 = EndUser
export const CreateEndUser201 = EndUser
export type CreateEndUser400 = Error
export const CreateEndUser400 = Error
export type CreateEndUser401 = Error
export const CreateEndUser401 = Error
export type CreateEndUser402 = Error
export const CreateEndUser402 = Error
export type CreateEndUser422 = Error
export const CreateEndUser422 = Error
export type CreateEndUser500 = Error
export const CreateEndUser500 = Error
export type ValidateEndUserAccessTokenRequestJson = { readonly accessToken: string }
export const ValidateEndUserAccessTokenRequestJson = Schema.Struct({
  accessToken: Schema.String.annotate({ description: "The access token in JWT format to verify." }),
}).annotate({ description: "The request body for a developer to verify an end user's access token." })
export type ValidateEndUserAccessToken200 = EndUser
export const ValidateEndUserAccessToken200 = EndUser
export type ValidateEndUserAccessToken400 = Error
export const ValidateEndUserAccessToken400 = Error
export type ValidateEndUserAccessToken401 = Error
export const ValidateEndUserAccessToken401 = Error
export type ValidateEndUserAccessToken404 = Error
export const ValidateEndUserAccessToken404 = Error
export type ValidateEndUserAccessToken500 = Error
export const ValidateEndUserAccessToken500 = Error
export type GetEndUser200 = EndUser
export const GetEndUser200 = EndUser
export type GetEndUser404 = Error
export const GetEndUser404 = Error
export type GetEndUser500 = Error
export const GetEndUser500 = Error
export type LookupEndUserParams = {
  readonly email?: Email
  readonly oauthProvider?: OAuth2ProviderType
  readonly oauthSubject?: string
  readonly phoneNumber?: PhoneNumber
}
export const LookupEndUserParams = Schema.Struct({
  email: Schema.optionalKey(Email),
  oauthProvider: Schema.optionalKey(OAuth2ProviderType),
  oauthSubject: Schema.optionalKey(Schema.String),
  phoneNumber: Schema.optionalKey(PhoneNumber),
})
export type LookupEndUser200 = { readonly endUsers: ReadonlyArray<EndUser> }
export const LookupEndUser200 = Schema.Struct({
  endUsers: Schema.Array(EndUser).annotate({ description: "The list of end users matching the lookup." }),
})
export type LookupEndUser400 = Error
export const LookupEndUser400 = Error
export type LookupEndUser401 = Error
export const LookupEndUser401 = Error
export type LookupEndUser500 = Error
export const LookupEndUser500 = Error
export type AddEndUserEvmAccountParams = { readonly "X-Wallet-Auth": string; readonly "X-Idempotency-Key"?: string }
export const AddEndUserEvmAccountParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type AddEndUserEvmAccountRequestJson = {}
export const AddEndUserEvmAccountRequestJson = Schema.Struct({})
export type AddEndUserEvmAccount201 = { readonly evmAccount: EndUserEvmAccount }
export const AddEndUserEvmAccount201 = Schema.Struct({ evmAccount: EndUserEvmAccount })
export type AddEndUserEvmAccount400 = Error
export const AddEndUserEvmAccount400 = Error
export type AddEndUserEvmAccount401 = Error
export const AddEndUserEvmAccount401 = Error
export type AddEndUserEvmAccount402 = Error
export const AddEndUserEvmAccount402 = Error
export type AddEndUserEvmAccount404 = Error
export const AddEndUserEvmAccount404 = Error
export type AddEndUserEvmAccount422 = Error
export const AddEndUserEvmAccount422 = Error
export type AddEndUserEvmAccount500 = Error
export const AddEndUserEvmAccount500 = Error
export type AddEndUserEvmAccount502 = Error
export const AddEndUserEvmAccount502 = Error
export type AddEndUserEvmAccount503 = Error
export const AddEndUserEvmAccount503 = Error
export type AddEndUserEvmSmartAccountParams = {
  readonly "X-Wallet-Auth": string
  readonly "X-Idempotency-Key"?: string
}
export const AddEndUserEvmSmartAccountParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type AddEndUserEvmSmartAccountRequestJson = { readonly enableSpendPermissions?: boolean }
export const AddEndUserEvmSmartAccountRequestJson = Schema.Struct({
  enableSpendPermissions: Schema.optionalKey(
    Schema.Boolean.annotate({
      description: "If true, enables spend permissions for the EVM smart account.",
      default: false,
    }),
  ),
})
export type AddEndUserEvmSmartAccount201 = { readonly evmSmartAccount: EndUserEvmSmartAccount }
export const AddEndUserEvmSmartAccount201 = Schema.Struct({ evmSmartAccount: EndUserEvmSmartAccount })
export type AddEndUserEvmSmartAccount400 = Error
export const AddEndUserEvmSmartAccount400 = Error
export type AddEndUserEvmSmartAccount401 = Error
export const AddEndUserEvmSmartAccount401 = Error
export type AddEndUserEvmSmartAccount402 = Error
export const AddEndUserEvmSmartAccount402 = Error
export type AddEndUserEvmSmartAccount404 = Error
export const AddEndUserEvmSmartAccount404 = Error
export type AddEndUserEvmSmartAccount422 = Error
export const AddEndUserEvmSmartAccount422 = Error
export type AddEndUserEvmSmartAccount500 = Error
export const AddEndUserEvmSmartAccount500 = Error
export type AddEndUserEvmSmartAccount502 = Error
export const AddEndUserEvmSmartAccount502 = Error
export type AddEndUserEvmSmartAccount503 = Error
export const AddEndUserEvmSmartAccount503 = Error
export type AddEndUserSolanaAccountParams = { readonly "X-Wallet-Auth": string; readonly "X-Idempotency-Key"?: string }
export const AddEndUserSolanaAccountParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type AddEndUserSolanaAccountRequestJson = {}
export const AddEndUserSolanaAccountRequestJson = Schema.Struct({})
export type AddEndUserSolanaAccount201 = { readonly solanaAccount: EndUserSolanaAccount }
export const AddEndUserSolanaAccount201 = Schema.Struct({ solanaAccount: EndUserSolanaAccount })
export type AddEndUserSolanaAccount400 = Error
export const AddEndUserSolanaAccount400 = Error
export type AddEndUserSolanaAccount401 = Error
export const AddEndUserSolanaAccount401 = Error
export type AddEndUserSolanaAccount402 = Error
export const AddEndUserSolanaAccount402 = Error
export type AddEndUserSolanaAccount404 = Error
export const AddEndUserSolanaAccount404 = Error
export type AddEndUserSolanaAccount422 = Error
export const AddEndUserSolanaAccount422 = Error
export type AddEndUserSolanaAccount500 = Error
export const AddEndUserSolanaAccount500 = Error
export type AddEndUserSolanaAccount502 = Error
export const AddEndUserSolanaAccount502 = Error
export type AddEndUserSolanaAccount503 = Error
export const AddEndUserSolanaAccount503 = Error
export type ImportEndUserParams = { readonly "X-Wallet-Auth": string; readonly "X-Idempotency-Key"?: string }
export const ImportEndUserParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type ImportEndUserRequestJson = {
  readonly userId: string
  readonly authenticationMethods: AuthenticationMethods
  readonly encryptedPrivateKey: string
  readonly keyType: "evm" | "solana"
}
export const ImportEndUserRequestJson = Schema.Struct({
  userId: Schema.String.annotate({
    description:
      "A stable, unique identifier for the end user. The `userId` must be unique across all end users in the developer's CDP Project. It must be between 1 and 100 characters long and can only contain alphanumeric characters and hyphens.",
  }).check(Schema.isPattern(new RegExp("^[a-zA-Z0-9-]{1,100}$"))),
  authenticationMethods: AuthenticationMethods,
  encryptedPrivateKey: Schema.String.annotate({
    description:
      "The base64-encoded, encrypted private key to import. The private key must be encrypted using the CDP SDK's encryption scheme. This is a 32-byte raw private key.",
  }),
  keyType: Schema.Literals(["evm", "solana"]).annotate({
    description: "The type of key being imported. Determines what type of account will be associated for the end user.",
  }),
})
export type ImportEndUser201 = EndUser
export const ImportEndUser201 = EndUser
export type ImportEndUser400 = Error
export const ImportEndUser400 = Error
export type ImportEndUser401 = Error
export const ImportEndUser401 = Error
export type ImportEndUser402 = Error
export const ImportEndUser402 = Error
export type ImportEndUser409 = Error
export const ImportEndUser409 = Error
export type ImportEndUser422 = Error
export const ImportEndUser422 = Error
export type ImportEndUser500 = Error
export const ImportEndUser500 = Error
export type ImportEndUser502 = Error
export const ImportEndUser502 = Error
export type ImportEndUser503 = Error
export const ImportEndUser503 = Error
export type SignEvmTransactionWithEndUserAccountParams = {
  readonly "X-Wallet-Auth"?: string
  readonly "X-Idempotency-Key"?: string
  readonly "X-Developer-Auth"?: string
  readonly projectID?: string
}
export const SignEvmTransactionWithEndUserAccountParams = Schema.Struct({
  "X-Wallet-Auth": Schema.optionalKey(Schema.String),
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
  "X-Developer-Auth": Schema.optionalKey(Schema.String),
  projectID: Schema.optionalKey(
    Schema.String.check(
      Schema.isPattern(new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")),
    ),
  ),
})
export type SignEvmTransactionWithEndUserAccountRequestJson = {
  readonly address: string
  readonly transaction: string
  readonly walletSecretId?: string
}
export const SignEvmTransactionWithEndUserAccountRequestJson = Schema.Struct({
  address: Schema.String.annotate({
    description: "The 0x-prefixed address of the EVM account belonging to the end user.",
  }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
  transaction: Schema.String.annotate({
    description: "The RLP-encoded transaction to sign, as a 0x-prefixed hex string.",
  }),
  walletSecretId: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "Required when not using delegated signing. The ID of the Temporary Wallet Secret that was used to sign the X-Wallet-Auth Header.",
    }).check(Schema.isPattern(new RegExp("^[a-zA-Z0-9-]{1,100}$"))),
  ),
})
export type SignEvmTransactionWithEndUserAccount200 = { readonly signedTransaction: string }
export const SignEvmTransactionWithEndUserAccount200 = Schema.Struct({
  signedTransaction: Schema.String.annotate({
    description: "The RLP-encoded signed transaction, as a 0x-prefixed hex string.",
  }),
})
export type SignEvmTransactionWithEndUserAccount400 = Error
export const SignEvmTransactionWithEndUserAccount400 = Error
export type SignEvmTransactionWithEndUserAccount401 = Error
export const SignEvmTransactionWithEndUserAccount401 = Error
export type SignEvmTransactionWithEndUserAccount402 = Error
export const SignEvmTransactionWithEndUserAccount402 = Error
export type SignEvmTransactionWithEndUserAccount403 = Error
export const SignEvmTransactionWithEndUserAccount403 = Error
export type SignEvmTransactionWithEndUserAccount404 = Error
export const SignEvmTransactionWithEndUserAccount404 = Error
export type SignEvmTransactionWithEndUserAccount409 = Error
export const SignEvmTransactionWithEndUserAccount409 = Error
export type SignEvmTransactionWithEndUserAccount422 = Error
export const SignEvmTransactionWithEndUserAccount422 = Error
export type SignEvmTransactionWithEndUserAccount500 = Error
export const SignEvmTransactionWithEndUserAccount500 = Error
export type SignEvmTransactionWithEndUserAccount502 = Error
export const SignEvmTransactionWithEndUserAccount502 = Error
export type SignEvmTransactionWithEndUserAccount503 = Error
export const SignEvmTransactionWithEndUserAccount503 = Error
export type SendEvmTransactionWithEndUserAccountParams = {
  readonly "X-Wallet-Auth"?: string
  readonly "X-Idempotency-Key"?: string
  readonly "X-Developer-Auth"?: string
  readonly projectID?: string
}
export const SendEvmTransactionWithEndUserAccountParams = Schema.Struct({
  "X-Wallet-Auth": Schema.optionalKey(Schema.String),
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
  "X-Developer-Auth": Schema.optionalKey(Schema.String),
  projectID: Schema.optionalKey(
    Schema.String.check(
      Schema.isPattern(new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")),
    ),
  ),
})
export type SendEvmTransactionWithEndUserAccountRequestJson = {
  readonly address: string
  readonly network:
    | "base"
    | "base-sepolia"
    | "ethereum"
    | "ethereum-sepolia"
    | "avalanche"
    | "polygon"
    | "optimism"
    | "arbitrum"
    | "arbitrum-sepolia"
    | "world"
    | "world-sepolia"
  readonly walletSecretId?: string
  readonly transaction: string
}
export const SendEvmTransactionWithEndUserAccountRequestJson = Schema.Struct({
  address: Schema.String.annotate({
    description: "The 0x-prefixed address of the EVM account belonging to the end user.",
  }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
  network: Schema.Literals([
    "base",
    "base-sepolia",
    "ethereum",
    "ethereum-sepolia",
    "avalanche",
    "polygon",
    "optimism",
    "arbitrum",
    "arbitrum-sepolia",
    "world",
    "world-sepolia",
  ]).annotate({ description: "The network to send the transaction to." }),
  walletSecretId: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "Required when not using delegated signing. The ID of the Temporary Wallet Secret that was used to sign the X-Wallet-Auth Header.",
    }).check(Schema.isPattern(new RegExp("^[a-zA-Z0-9-]{1,100}$"))),
  ),
  transaction: Schema.String.annotate({
    description: "The RLP-encoded transaction to sign and send, as a 0x-prefixed hex string.",
  }),
})
export type SendEvmTransactionWithEndUserAccount200 = { readonly transactionHash: string }
export const SendEvmTransactionWithEndUserAccount200 = Schema.Struct({
  transactionHash: Schema.String.annotate({ description: "The hash of the transaction, as a 0x-prefixed hex string." }),
})
export type SendEvmTransactionWithEndUserAccount400 = Error
export const SendEvmTransactionWithEndUserAccount400 = Error
export type SendEvmTransactionWithEndUserAccount401 = Error
export const SendEvmTransactionWithEndUserAccount401 = Error
export type SendEvmTransactionWithEndUserAccount402 = Error
export const SendEvmTransactionWithEndUserAccount402 = Error
export type SendEvmTransactionWithEndUserAccount403 = Error
export const SendEvmTransactionWithEndUserAccount403 = Error
export type SendEvmTransactionWithEndUserAccount404 = Error
export const SendEvmTransactionWithEndUserAccount404 = Error
export type SendEvmTransactionWithEndUserAccount409 = Error
export const SendEvmTransactionWithEndUserAccount409 = Error
export type SendEvmTransactionWithEndUserAccount422 = Error
export const SendEvmTransactionWithEndUserAccount422 = Error
export type SendEvmTransactionWithEndUserAccount500 = Error
export const SendEvmTransactionWithEndUserAccount500 = Error
export type SendEvmTransactionWithEndUserAccount502 = Error
export const SendEvmTransactionWithEndUserAccount502 = Error
export type SendEvmTransactionWithEndUserAccount503 = Error
export const SendEvmTransactionWithEndUserAccount503 = Error
export type SendEvmAssetWithEndUserAccountParams = {
  readonly "X-Wallet-Auth"?: string
  readonly "X-Idempotency-Key"?: string
  readonly "X-Developer-Auth"?: string
  readonly projectID?: string
}
export const SendEvmAssetWithEndUserAccountParams = Schema.Struct({
  "X-Wallet-Auth": Schema.optionalKey(Schema.String),
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
  "X-Developer-Auth": Schema.optionalKey(Schema.String),
  projectID: Schema.optionalKey(
    Schema.String.check(
      Schema.isPattern(new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")),
    ),
  ),
})
export type SendEvmAssetWithEndUserAccountRequestJson = {
  readonly to: string
  readonly amount: string
  readonly network:
    | "base"
    | "base-sepolia"
    | "ethereum"
    | "ethereum-sepolia"
    | "avalanche"
    | "polygon"
    | "optimism"
    | "arbitrum"
    | "arbitrum-sepolia"
    | "world"
    | "world-sepolia"
  readonly useCdpPaymaster?: boolean
  readonly paymasterUrl?: string
  readonly walletSecretId?: string
}
export const SendEvmAssetWithEndUserAccountRequestJson = Schema.Struct({
  to: Schema.String.annotate({ description: "The 0x-prefixed address of the recipient." })
    .check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$")))
    .check(
      Schema.makeFilterGroup([Schema.isMinLength(1), Schema.isMaxLength(128)], {
        description: "A blockchain address. Format varies by network (e.g., 0x-prefixed for EVM, base58 for Solana).",
      }),
    ),
  amount: Schema.String.annotate({
    description: 'The amount of USDC to send as a decimal string (e.g., "1.5" or "25.50").',
  })
    .check(Schema.isMinLength(1))
    .check(Schema.isMaxLength(32)),
  network: Schema.Literals([
    "base",
    "base-sepolia",
    "ethereum",
    "ethereum-sepolia",
    "avalanche",
    "polygon",
    "optimism",
    "arbitrum",
    "arbitrum-sepolia",
    "world",
    "world-sepolia",
  ]).annotate({ description: "The EVM network to send USDC on." }),
  useCdpPaymaster: Schema.optionalKey(
    Schema.Boolean.annotate({
      description:
        "Whether to use CDP Paymaster to sponsor gas fees. Only applicable for EVM Smart Accounts. When true, the transaction gas will be paid by the Paymaster, allowing users to send USDC without holding native gas tokens. Ignored for EOA accounts. Cannot be used together with `paymasterUrl`.",
    }),
  ),
  paymasterUrl: Schema.optionalKey(
    Schema.String.annotate({ description: "A valid HTTP or HTTPS URL.", format: "uri" })
      .check(Schema.isMinLength(11))
      .check(Schema.isMaxLength(2048))
      .check(Schema.isPattern(new RegExp("^https?:\\/\\/.*$"))),
  ),
  walletSecretId: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "Required when not using delegated signing. The ID of the Temporary Wallet Secret that was used to sign the X-Wallet-Auth Header.",
    }).check(Schema.isPattern(new RegExp("^[a-zA-Z0-9-]{1,100}$"))),
  ),
})
export type SendEvmAssetWithEndUserAccount200 = { readonly transactionHash?: string; readonly userOpHash?: string }
export const SendEvmAssetWithEndUserAccount200 = Schema.Struct({
  transactionHash: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "The hash of the transaction, as a 0x-prefixed hex string. Populated for EOA accounts. Null for Smart Accounts (use userOpHash instead).",
    }),
  ),
  userOpHash: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "The hash of the user operation, as a 0x-prefixed hex string. Populated for Smart Accounts. Null for EOA accounts (use transactionHash instead).",
    }),
  ),
})
export type SendEvmAssetWithEndUserAccount400 = Error
export const SendEvmAssetWithEndUserAccount400 = Error
export type SendEvmAssetWithEndUserAccount401 = Error
export const SendEvmAssetWithEndUserAccount401 = Error
export type SendEvmAssetWithEndUserAccount402 = Error
export const SendEvmAssetWithEndUserAccount402 = Error
export type SendEvmAssetWithEndUserAccount403 = Error
export const SendEvmAssetWithEndUserAccount403 = Error
export type SendEvmAssetWithEndUserAccount404 = Error
export const SendEvmAssetWithEndUserAccount404 = Error
export type SendEvmAssetWithEndUserAccount422 = Error
export const SendEvmAssetWithEndUserAccount422 = Error
export type SendEvmAssetWithEndUserAccount500 = Error
export const SendEvmAssetWithEndUserAccount500 = Error
export type SendEvmAssetWithEndUserAccount502 = Error
export const SendEvmAssetWithEndUserAccount502 = Error
export type SendEvmAssetWithEndUserAccount503 = Error
export const SendEvmAssetWithEndUserAccount503 = Error
export type SignEvmMessageWithEndUserAccountParams = {
  readonly "X-Wallet-Auth"?: string
  readonly "X-Idempotency-Key"?: string
  readonly "X-Developer-Auth"?: string
  readonly projectID?: string
}
export const SignEvmMessageWithEndUserAccountParams = Schema.Struct({
  "X-Wallet-Auth": Schema.optionalKey(Schema.String),
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
  "X-Developer-Auth": Schema.optionalKey(Schema.String),
  projectID: Schema.optionalKey(
    Schema.String.check(
      Schema.isPattern(new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")),
    ),
  ),
})
export type SignEvmMessageWithEndUserAccountRequestJson = {
  readonly address: string
  readonly message: string
  readonly walletSecretId?: string
}
export const SignEvmMessageWithEndUserAccountRequestJson = Schema.Struct({
  address: Schema.String.annotate({
    description: "The 0x-prefixed address of the EVM account belonging to the end user.",
  }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
  message: Schema.String.annotate({ description: "The message to sign." }),
  walletSecretId: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "Required when not using delegated signing. The ID of the Temporary Wallet Secret that was used to sign the X-Wallet-Auth Header.",
    }).check(Schema.isPattern(new RegExp("^[a-zA-Z0-9-]{1,100}$"))),
  ),
})
export type SignEvmMessageWithEndUserAccount200 = { readonly signature: string }
export const SignEvmMessageWithEndUserAccount200 = Schema.Struct({
  signature: Schema.String.annotate({ description: "The signature of the message, as a 0x-prefixed hex string." }),
})
export type SignEvmMessageWithEndUserAccount401 = Error
export const SignEvmMessageWithEndUserAccount401 = Error
export type SignEvmMessageWithEndUserAccount402 = Error
export const SignEvmMessageWithEndUserAccount402 = Error
export type SignEvmMessageWithEndUserAccount403 = Error
export const SignEvmMessageWithEndUserAccount403 = Error
export type SignEvmMessageWithEndUserAccount404 = Error
export const SignEvmMessageWithEndUserAccount404 = Error
export type SignEvmMessageWithEndUserAccount409 = Error
export const SignEvmMessageWithEndUserAccount409 = Error
export type SignEvmMessageWithEndUserAccount422 = Error
export const SignEvmMessageWithEndUserAccount422 = Error
export type SignEvmMessageWithEndUserAccount500 = Error
export const SignEvmMessageWithEndUserAccount500 = Error
export type SignEvmMessageWithEndUserAccount502 = Error
export const SignEvmMessageWithEndUserAccount502 = Error
export type SignEvmMessageWithEndUserAccount503 = Error
export const SignEvmMessageWithEndUserAccount503 = Error
export type SignEvmTypedDataWithEndUserAccountParams = {
  readonly "X-Wallet-Auth"?: string
  readonly "X-Idempotency-Key"?: string
  readonly "X-Developer-Auth"?: string
  readonly projectID?: string
}
export const SignEvmTypedDataWithEndUserAccountParams = Schema.Struct({
  "X-Wallet-Auth": Schema.optionalKey(Schema.String),
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
  "X-Developer-Auth": Schema.optionalKey(Schema.String),
  projectID: Schema.optionalKey(
    Schema.String.check(
      Schema.isPattern(new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")),
    ),
  ),
})
export type SignEvmTypedDataWithEndUserAccountRequestJson = {
  readonly address: string
  readonly typedData: EIP712Message
  readonly walletSecretId?: string
}
export const SignEvmTypedDataWithEndUserAccountRequestJson = Schema.Struct({
  address: Schema.String.annotate({
    description: "The 0x-prefixed address of the EVM account belonging to the end user.",
  }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
  typedData: EIP712Message,
  walletSecretId: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "Required when not using delegated signing. The ID of the Temporary Wallet Secret that was used to sign the X-Wallet-Auth Header.",
    }).check(Schema.isPattern(new RegExp("^[a-zA-Z0-9-]{1,100}$"))),
  ),
})
export type SignEvmTypedDataWithEndUserAccount200 = { readonly signature: string }
export const SignEvmTypedDataWithEndUserAccount200 = Schema.Struct({
  signature: Schema.String.annotate({ description: "The signature of the typed data, as a 0x-prefixed hex string." }),
})
export type SignEvmTypedDataWithEndUserAccount400 = Error
export const SignEvmTypedDataWithEndUserAccount400 = Error
export type SignEvmTypedDataWithEndUserAccount401 = Error
export const SignEvmTypedDataWithEndUserAccount401 = Error
export type SignEvmTypedDataWithEndUserAccount402 = Error
export const SignEvmTypedDataWithEndUserAccount402 = Error
export type SignEvmTypedDataWithEndUserAccount403 = Error
export const SignEvmTypedDataWithEndUserAccount403 = Error
export type SignEvmTypedDataWithEndUserAccount404 = Error
export const SignEvmTypedDataWithEndUserAccount404 = Error
export type SignEvmTypedDataWithEndUserAccount422 = Error
export const SignEvmTypedDataWithEndUserAccount422 = Error
export type SignEvmTypedDataWithEndUserAccount500 = Error
export const SignEvmTypedDataWithEndUserAccount500 = Error
export type SignEvmTypedDataWithEndUserAccount502 = Error
export const SignEvmTypedDataWithEndUserAccount502 = Error
export type SignEvmTypedDataWithEndUserAccount503 = Error
export const SignEvmTypedDataWithEndUserAccount503 = Error
export type GetDelegationForEndUserParams = { readonly projectID?: string }
export const GetDelegationForEndUserParams = Schema.Struct({
  projectID: Schema.optionalKey(
    Schema.String.check(
      Schema.isPattern(new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")),
    ),
  ),
})
export type GetDelegationForEndUser200 = { readonly expiresAt: string }
export const GetDelegationForEndUser200 = Schema.Struct({
  expiresAt: Schema.String.annotate({
    description: "The date until which the delegation is valid.",
    format: "date-time",
  }),
})
export type GetDelegationForEndUser401 = Error
export const GetDelegationForEndUser401 = Error
export type GetDelegationForEndUser404 = Error
export const GetDelegationForEndUser404 = Error
export type GetDelegationForEndUser500 = Error
export const GetDelegationForEndUser500 = Error
export type GetDelegationForEndUser502 = Error
export const GetDelegationForEndUser502 = Error
export type GetDelegationForEndUser503 = Error
export const GetDelegationForEndUser503 = Error
export type RevokeDelegationForEndUserParams = {
  readonly "X-Wallet-Auth"?: string
  readonly "X-Developer-Auth"?: string
  readonly "X-Idempotency-Key"?: string
  readonly projectID?: string
}
export const RevokeDelegationForEndUserParams = Schema.Struct({
  "X-Wallet-Auth": Schema.optionalKey(Schema.String),
  "X-Developer-Auth": Schema.optionalKey(Schema.String),
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
  projectID: Schema.optionalKey(
    Schema.String.check(
      Schema.isPattern(new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")),
    ),
  ),
})
export type RevokeDelegationForEndUserRequestJson = { readonly walletSecretId?: string }
export const RevokeDelegationForEndUserRequestJson = Schema.Struct({
  walletSecretId: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "When revoking with a wallet authentication scheme, the ID of the Temporary Wallet Secret that was used to sign the X-Wallet-Auth Header.",
    }).check(Schema.isPattern(new RegExp("^[a-zA-Z0-9-]{1,100}$"))),
  ),
})
export type RevokeDelegationForEndUser401 = Error
export const RevokeDelegationForEndUser401 = Error
export type RevokeDelegationForEndUser404 = Error
export const RevokeDelegationForEndUser404 = Error
export type RevokeDelegationForEndUser500 = Error
export const RevokeDelegationForEndUser500 = Error
export type RevokeDelegationForEndUser502 = Error
export const RevokeDelegationForEndUser502 = Error
export type RevokeDelegationForEndUser503 = Error
export const RevokeDelegationForEndUser503 = Error
export type GetDelegationForEndUserAccountParams = { readonly projectID?: string }
export const GetDelegationForEndUserAccountParams = Schema.Struct({
  projectID: Schema.optionalKey(
    Schema.String.check(
      Schema.isPattern(new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")),
    ),
  ),
})
export type GetDelegationForEndUserAccount200 = { readonly expiresAt: string }
export const GetDelegationForEndUserAccount200 = Schema.Struct({
  expiresAt: Schema.String.annotate({
    description: "The date until which the delegation is valid.",
    format: "date-time",
  }),
})
export type GetDelegationForEndUserAccount401 = Error
export const GetDelegationForEndUserAccount401 = Error
export type GetDelegationForEndUserAccount404 = Error
export const GetDelegationForEndUserAccount404 = Error
export type GetDelegationForEndUserAccount500 = Error
export const GetDelegationForEndUserAccount500 = Error
export type GetDelegationForEndUserAccount502 = Error
export const GetDelegationForEndUserAccount502 = Error
export type GetDelegationForEndUserAccount503 = Error
export const GetDelegationForEndUserAccount503 = Error
export type CreateDelegationForEndUserAccountParams = {
  readonly "X-Wallet-Auth": string
  readonly "X-Idempotency-Key"?: string
  readonly projectID?: string
}
export const CreateDelegationForEndUserAccountParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
  projectID: Schema.optionalKey(
    Schema.String.check(
      Schema.isPattern(new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")),
    ),
  ),
})
export type CreateDelegationForEndUserAccountRequestJson = {
  readonly expiresAt: string
  readonly walletSecretId: string
}
export const CreateDelegationForEndUserAccountRequestJson = Schema.Struct({
  expiresAt: Schema.String.annotate({
    description: "The date until which the delegation is valid.",
    format: "date-time",
  }),
  walletSecretId: Schema.String.annotate({
    description: "The ID of the Temporary Wallet Secret that was used to sign the X-Wallet-Auth Header.",
  }).check(Schema.isPattern(new RegExp("^[a-zA-Z0-9-]{1,100}$"))),
})
export type CreateDelegationForEndUserAccount201 = { readonly expiresAt: string }
export const CreateDelegationForEndUserAccount201 = Schema.Struct({
  expiresAt: Schema.String.annotate({
    description: "The date until which the delegation is valid.",
    format: "date-time",
  }),
})
export type CreateDelegationForEndUserAccount400 = Error
export const CreateDelegationForEndUserAccount400 = Error
export type CreateDelegationForEndUserAccount401 = Error
export const CreateDelegationForEndUserAccount401 = Error
export type CreateDelegationForEndUserAccount402 = Error
export const CreateDelegationForEndUserAccount402 = Error
export type CreateDelegationForEndUserAccount404 = Error
export const CreateDelegationForEndUserAccount404 = Error
export type CreateDelegationForEndUserAccount409 = Error
export const CreateDelegationForEndUserAccount409 = Error
export type CreateDelegationForEndUserAccount422 = Error
export const CreateDelegationForEndUserAccount422 = Error
export type CreateDelegationForEndUserAccount429 = Error
export const CreateDelegationForEndUserAccount429 = Error
export type CreateDelegationForEndUserAccount500 = Error
export const CreateDelegationForEndUserAccount500 = Error
export type CreateDelegationForEndUserAccount502 = Error
export const CreateDelegationForEndUserAccount502 = Error
export type CreateDelegationForEndUserAccount503 = Error
export const CreateDelegationForEndUserAccount503 = Error
export type RevokeDelegationForEndUserAccountParams = {
  readonly "X-Wallet-Auth"?: string
  readonly "X-Developer-Auth"?: string
  readonly "X-Idempotency-Key"?: string
  readonly projectID?: string
}
export const RevokeDelegationForEndUserAccountParams = Schema.Struct({
  "X-Wallet-Auth": Schema.optionalKey(Schema.String),
  "X-Developer-Auth": Schema.optionalKey(Schema.String),
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
  projectID: Schema.optionalKey(
    Schema.String.check(
      Schema.isPattern(new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")),
    ),
  ),
})
export type RevokeDelegationForEndUserAccountRequestJson = { readonly walletSecretId?: string }
export const RevokeDelegationForEndUserAccountRequestJson = Schema.Struct({
  walletSecretId: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "When revoking with a wallet authentication scheme, the ID of the Temporary Wallet Secret that was used to sign the X-Wallet-Auth Header.",
    }).check(Schema.isPattern(new RegExp("^[a-zA-Z0-9-]{1,100}$"))),
  ),
})
export type RevokeDelegationForEndUserAccount401 = Error
export const RevokeDelegationForEndUserAccount401 = Error
export type RevokeDelegationForEndUserAccount404 = Error
export const RevokeDelegationForEndUserAccount404 = Error
export type RevokeDelegationForEndUserAccount500 = Error
export const RevokeDelegationForEndUserAccount500 = Error
export type RevokeDelegationForEndUserAccount502 = Error
export const RevokeDelegationForEndUserAccount502 = Error
export type RevokeDelegationForEndUserAccount503 = Error
export const RevokeDelegationForEndUserAccount503 = Error
export type CreateEvmEip7702DelegationWithEndUserAccountParams = {
  readonly "X-Wallet-Auth"?: string
  readonly "X-Idempotency-Key"?: string
  readonly "X-Developer-Auth"?: string
  readonly projectID?: string
}
export const CreateEvmEip7702DelegationWithEndUserAccountParams = Schema.Struct({
  "X-Wallet-Auth": Schema.optionalKey(Schema.String),
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
  "X-Developer-Auth": Schema.optionalKey(Schema.String),
  projectID: Schema.optionalKey(
    Schema.String.check(
      Schema.isPattern(new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")),
    ),
  ),
})
export type CreateEvmEip7702DelegationWithEndUserAccountRequestJson = {
  readonly address: string
  readonly network: EvmEip7702DelegationNetwork
  readonly enableSpendPermissions?: boolean
  readonly walletSecretId?: string
}
export const CreateEvmEip7702DelegationWithEndUserAccountRequestJson = Schema.Struct({
  address: Schema.String.annotate({ description: "The 0x-prefixed address of the EVM account to delegate." }).check(
    Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$")),
  ),
  network: EvmEip7702DelegationNetwork,
  enableSpendPermissions: Schema.optionalKey(
    Schema.Boolean.annotate({
      description:
        "Whether to configure spend permissions for the upgraded, delegated account. When enabled, the account can grant permissions for third parties to spend on its behalf.",
      default: false,
    }),
  ),
  walletSecretId: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "Required when not using delegated signing. The ID of the Temporary Wallet Secret that was used to sign the X-Wallet-Auth Header.",
    }).check(Schema.isPattern(new RegExp("^[a-zA-Z0-9-]{1,100}$"))),
  ),
})
export type CreateEvmEip7702DelegationWithEndUserAccount201 = { readonly delegationOperationId: string }
export const CreateEvmEip7702DelegationWithEndUserAccount201 = Schema.Struct({
  delegationOperationId: Schema.String.annotate({
    description: "The unique identifier for the delegation operation. Use this to poll the operation status.",
    format: "uuid",
  }),
})
export type CreateEvmEip7702DelegationWithEndUserAccount400 = Error
export const CreateEvmEip7702DelegationWithEndUserAccount400 = Error
export type CreateEvmEip7702DelegationWithEndUserAccount401 = Error
export const CreateEvmEip7702DelegationWithEndUserAccount401 = Error
export type CreateEvmEip7702DelegationWithEndUserAccount402 = Error
export const CreateEvmEip7702DelegationWithEndUserAccount402 = Error
export type CreateEvmEip7702DelegationWithEndUserAccount403 = Error
export const CreateEvmEip7702DelegationWithEndUserAccount403 = Error
export type CreateEvmEip7702DelegationWithEndUserAccount404 = Error
export const CreateEvmEip7702DelegationWithEndUserAccount404 = Error
export type CreateEvmEip7702DelegationWithEndUserAccount409 = Error
export const CreateEvmEip7702DelegationWithEndUserAccount409 = Error
export type CreateEvmEip7702DelegationWithEndUserAccount422 = Error
export const CreateEvmEip7702DelegationWithEndUserAccount422 = Error
export type CreateEvmEip7702DelegationWithEndUserAccount429 = Error
export const CreateEvmEip7702DelegationWithEndUserAccount429 = Error
export type CreateEvmEip7702DelegationWithEndUserAccount500 = Error
export const CreateEvmEip7702DelegationWithEndUserAccount500 = Error
export type CreateEvmEip7702DelegationWithEndUserAccount502 = Error
export const CreateEvmEip7702DelegationWithEndUserAccount502 = Error
export type CreateEvmEip7702DelegationWithEndUserAccount503 = Error
export const CreateEvmEip7702DelegationWithEndUserAccount503 = Error
export type SendUserOperationWithEndUserAccountParams = {
  readonly "X-Idempotency-Key"?: string
  readonly "X-Wallet-Auth"?: string
  readonly "X-Developer-Auth"?: string
  readonly projectID?: string
}
export const SendUserOperationWithEndUserAccountParams = Schema.Struct({
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
  "X-Wallet-Auth": Schema.optionalKey(Schema.String),
  "X-Developer-Auth": Schema.optionalKey(Schema.String),
  projectID: Schema.optionalKey(
    Schema.String.check(
      Schema.isPattern(new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")),
    ),
  ),
})
export type SendUserOperationWithEndUserAccountRequestJson = {
  readonly network: EvmUserOperationNetwork
  readonly calls: ReadonlyArray<EvmCall>
  readonly useCdpPaymaster: boolean
  readonly paymasterUrl?: string
  readonly walletSecretId?: string
  readonly dataSuffix?: string
}
export const SendUserOperationWithEndUserAccountRequestJson = Schema.Struct({
  network: EvmUserOperationNetwork,
  calls: Schema.Array(EvmCall).annotate({ description: "The list of calls to make from the Smart Account." }),
  useCdpPaymaster: Schema.Boolean.annotate({ description: "Whether to use the CDP Paymaster for the user operation." }),
  paymasterUrl: Schema.optionalKey(
    Schema.String.annotate({ description: "A valid HTTP or HTTPS URL.", format: "uri" })
      .check(Schema.isMinLength(11))
      .check(Schema.isMaxLength(2048))
      .check(Schema.isPattern(new RegExp("^https?:\\/\\/.*$"))),
  ),
  walletSecretId: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "Required when not using delegated signing. The ID of the Temporary Wallet Secret that was used to sign the X-Wallet-Auth Header.",
    }).check(Schema.isPattern(new RegExp("^[a-zA-Z0-9-]{1,100}$"))),
  ),
  dataSuffix: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "The EIP-8021 data suffix (hex-encoded) that enables transaction attribution for the user operation.",
    }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]+$"))),
  ),
})
export type SendUserOperationWithEndUserAccount200 = EvmUserOperation
export const SendUserOperationWithEndUserAccount200 = EvmUserOperation
export type SendUserOperationWithEndUserAccount400 = Error
export const SendUserOperationWithEndUserAccount400 = Error
export type SendUserOperationWithEndUserAccount401 = Error
export const SendUserOperationWithEndUserAccount401 = Error
export type SendUserOperationWithEndUserAccount402 = Error
export const SendUserOperationWithEndUserAccount402 = Error
export type SendUserOperationWithEndUserAccount403 = Error
export const SendUserOperationWithEndUserAccount403 = Error
export type SendUserOperationWithEndUserAccount404 = Error
export const SendUserOperationWithEndUserAccount404 = Error
export type SendUserOperationWithEndUserAccount429 = Error
export const SendUserOperationWithEndUserAccount429 = Error
export type SendUserOperationWithEndUserAccount500 = Error
export const SendUserOperationWithEndUserAccount500 = Error
export type SendUserOperationWithEndUserAccount502 = Error
export const SendUserOperationWithEndUserAccount502 = Error
export type SendUserOperationWithEndUserAccount503 = Error
export const SendUserOperationWithEndUserAccount503 = Error
export type SignSolanaMessageWithEndUserAccountParams = {
  readonly "X-Wallet-Auth"?: string
  readonly "X-Idempotency-Key"?: string
  readonly "X-Developer-Auth"?: string
  readonly projectID?: string
}
export const SignSolanaMessageWithEndUserAccountParams = Schema.Struct({
  "X-Wallet-Auth": Schema.optionalKey(Schema.String),
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
  "X-Developer-Auth": Schema.optionalKey(Schema.String),
  projectID: Schema.optionalKey(
    Schema.String.check(
      Schema.isPattern(new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")),
    ),
  ),
})
export type SignSolanaMessageWithEndUserAccountRequestJson = {
  readonly address: string
  readonly message: string
  readonly walletSecretId?: string
}
export const SignSolanaMessageWithEndUserAccountRequestJson = Schema.Struct({
  address: Schema.String.annotate({
    description: "The base58 encoded address of the Solana account belonging to the end user.",
  }).check(Schema.isPattern(new RegExp("^[1-9A-HJ-NP-Za-km-z]{32,44}$"))),
  message: Schema.String.annotate({ description: "The base64 encoded arbitrary message to sign." }),
  walletSecretId: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "Required when not using delegated signing. The ID of the Temporary Wallet Secret that was used to sign the X-Wallet-Auth Header.",
    }).check(Schema.isPattern(new RegExp("^[a-zA-Z0-9-]{1,100}$"))),
  ),
})
export type SignSolanaMessageWithEndUserAccount200 = { readonly signature: string }
export const SignSolanaMessageWithEndUserAccount200 = Schema.Struct({
  signature: Schema.String.annotate({ description: "The signature of the message, as a base58 encoded string." }),
})
export type SignSolanaMessageWithEndUserAccount400 = Error
export const SignSolanaMessageWithEndUserAccount400 = Error
export type SignSolanaMessageWithEndUserAccount401 = Error
export const SignSolanaMessageWithEndUserAccount401 = Error
export type SignSolanaMessageWithEndUserAccount402 = Error
export const SignSolanaMessageWithEndUserAccount402 = Error
export type SignSolanaMessageWithEndUserAccount403 = Error
export const SignSolanaMessageWithEndUserAccount403 = Error
export type SignSolanaMessageWithEndUserAccount404 = Error
export const SignSolanaMessageWithEndUserAccount404 = Error
export type SignSolanaMessageWithEndUserAccount409 = Error
export const SignSolanaMessageWithEndUserAccount409 = Error
export type SignSolanaMessageWithEndUserAccount422 = Error
export const SignSolanaMessageWithEndUserAccount422 = Error
export type SignSolanaMessageWithEndUserAccount500 = Error
export const SignSolanaMessageWithEndUserAccount500 = Error
export type SignSolanaMessageWithEndUserAccount502 = Error
export const SignSolanaMessageWithEndUserAccount502 = Error
export type SignSolanaMessageWithEndUserAccount503 = Error
export const SignSolanaMessageWithEndUserAccount503 = Error
export type SignSolanaTransactionWithEndUserAccountParams = {
  readonly "X-Wallet-Auth"?: string
  readonly "X-Idempotency-Key"?: string
  readonly "X-Developer-Auth"?: string
  readonly projectID?: string
}
export const SignSolanaTransactionWithEndUserAccountParams = Schema.Struct({
  "X-Wallet-Auth": Schema.optionalKey(Schema.String),
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
  "X-Developer-Auth": Schema.optionalKey(Schema.String),
  projectID: Schema.optionalKey(
    Schema.String.check(
      Schema.isPattern(new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")),
    ),
  ),
})
export type SignSolanaTransactionWithEndUserAccountRequestJson = {
  readonly address: string
  readonly transaction: string
  readonly walletSecretId?: string
}
export const SignSolanaTransactionWithEndUserAccountRequestJson = Schema.Struct({
  address: Schema.String.annotate({
    description: "The base58 encoded address of the Solana account belonging to the end user.",
  }).check(Schema.isPattern(new RegExp("^[1-9A-HJ-NP-Za-km-z]{32,44}$"))),
  transaction: Schema.String.annotate({ description: "The base64 encoded transaction to sign." }),
  walletSecretId: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "Required when not using delegated signing. The ID of the Temporary Wallet Secret that was used to sign the X-Wallet-Auth Header.",
    }).check(Schema.isPattern(new RegExp("^[a-zA-Z0-9-]{1,100}$"))),
  ),
})
export type SignSolanaTransactionWithEndUserAccount200 = { readonly signedTransaction: string }
export const SignSolanaTransactionWithEndUserAccount200 = Schema.Struct({
  signedTransaction: Schema.String.annotate({ description: "The base64 encoded signed transaction." }),
})
export type SignSolanaTransactionWithEndUserAccount400 = Error
export const SignSolanaTransactionWithEndUserAccount400 = Error
export type SignSolanaTransactionWithEndUserAccount401 = Error
export const SignSolanaTransactionWithEndUserAccount401 = Error
export type SignSolanaTransactionWithEndUserAccount402 = Error
export const SignSolanaTransactionWithEndUserAccount402 = Error
export type SignSolanaTransactionWithEndUserAccount403 = Error
export const SignSolanaTransactionWithEndUserAccount403 = Error
export type SignSolanaTransactionWithEndUserAccount404 = Error
export const SignSolanaTransactionWithEndUserAccount404 = Error
export type SignSolanaTransactionWithEndUserAccount409 = Error
export const SignSolanaTransactionWithEndUserAccount409 = Error
export type SignSolanaTransactionWithEndUserAccount422 = Error
export const SignSolanaTransactionWithEndUserAccount422 = Error
export type SignSolanaTransactionWithEndUserAccount500 = Error
export const SignSolanaTransactionWithEndUserAccount500 = Error
export type SignSolanaTransactionWithEndUserAccount502 = Error
export const SignSolanaTransactionWithEndUserAccount502 = Error
export type SignSolanaTransactionWithEndUserAccount503 = Error
export const SignSolanaTransactionWithEndUserAccount503 = Error
export type SendSolanaTransactionWithEndUserAccountParams = {
  readonly "X-Wallet-Auth"?: string
  readonly "X-Idempotency-Key"?: string
  readonly "X-Developer-Auth"?: string
  readonly projectID?: string
}
export const SendSolanaTransactionWithEndUserAccountParams = Schema.Struct({
  "X-Wallet-Auth": Schema.optionalKey(Schema.String),
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
  "X-Developer-Auth": Schema.optionalKey(Schema.String),
  projectID: Schema.optionalKey(
    Schema.String.check(
      Schema.isPattern(new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")),
    ),
  ),
})
export type SendSolanaTransactionWithEndUserAccountRequestJson = {
  readonly address: string
  readonly network: "solana" | "solana-devnet"
  readonly walletSecretId?: string
  readonly transaction: string
  readonly useCdpSponsor?: boolean
}
export const SendSolanaTransactionWithEndUserAccountRequestJson = Schema.Struct({
  address: Schema.String.annotate({
    description: "The base58 encoded address of the Solana account belonging to the end user.",
  }).check(Schema.isPattern(new RegExp("^[1-9A-HJ-NP-Za-km-z]{32,44}$"))),
  network: Schema.Literals(["solana", "solana-devnet"]).annotate({
    description: "The Solana network to send the transaction to.",
  }),
  walletSecretId: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "Required when not using delegated signing. The ID of the Temporary Wallet Secret that was used to sign the X-Wallet-Auth Header.",
    }).check(Schema.isPattern(new RegExp("^[a-zA-Z0-9-]{1,100}$"))),
  ),
  transaction: Schema.String.annotate({
    description:
      "The base64 encoded transaction to sign and send. This transaction can contain multiple instructions for native Solana batching.",
  }),
  useCdpSponsor: Schema.optionalKey(
    Schema.Boolean.annotate({
      description:
        "Whether transaction fees should be sponsored by CDP. When true, CDP sponsors the transaction fees on behalf of the end user. When false, the end user is responsible for paying the transaction fees.",
    }),
  ),
})
export type SendSolanaTransactionWithEndUserAccount200 = { readonly transactionSignature: string }
export const SendSolanaTransactionWithEndUserAccount200 = Schema.Struct({
  transactionSignature: Schema.String.annotate({ description: "The base58 encoded transaction signature." }),
})
export type SendSolanaTransactionWithEndUserAccount400 = Error
export const SendSolanaTransactionWithEndUserAccount400 = Error
export type SendSolanaTransactionWithEndUserAccount401 = Error
export const SendSolanaTransactionWithEndUserAccount401 = Error
export type SendSolanaTransactionWithEndUserAccount402 = Error
export const SendSolanaTransactionWithEndUserAccount402 = Error
export type SendSolanaTransactionWithEndUserAccount403 = Error
export const SendSolanaTransactionWithEndUserAccount403 = Error
export type SendSolanaTransactionWithEndUserAccount404 = Error
export const SendSolanaTransactionWithEndUserAccount404 = Error
export type SendSolanaTransactionWithEndUserAccount422 = Error
export const SendSolanaTransactionWithEndUserAccount422 = Error
export type SendSolanaTransactionWithEndUserAccount500 = Error
export const SendSolanaTransactionWithEndUserAccount500 = Error
export type SendSolanaTransactionWithEndUserAccount502 = Error
export const SendSolanaTransactionWithEndUserAccount502 = Error
export type SendSolanaTransactionWithEndUserAccount503 = Error
export const SendSolanaTransactionWithEndUserAccount503 = Error
export type SendSolanaAssetWithEndUserAccountParams = {
  readonly "X-Wallet-Auth"?: string
  readonly "X-Idempotency-Key"?: string
  readonly "X-Developer-Auth"?: string
  readonly projectID?: string
}
export const SendSolanaAssetWithEndUserAccountParams = Schema.Struct({
  "X-Wallet-Auth": Schema.optionalKey(Schema.String),
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
  "X-Developer-Auth": Schema.optionalKey(Schema.String),
  projectID: Schema.optionalKey(
    Schema.String.check(
      Schema.isPattern(new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")),
    ),
  ),
})
export type SendSolanaAssetWithEndUserAccountRequestJson = {
  readonly to: string
  readonly amount: string
  readonly network: "solana" | "solana-devnet"
  readonly createRecipientAta?: boolean
  readonly walletSecretId?: string
  readonly useCdpSponsor?: boolean
}
export const SendSolanaAssetWithEndUserAccountRequestJson = Schema.Struct({
  to: Schema.String.annotate({ description: "The base58 encoded address of the recipient." })
    .check(Schema.isPattern(new RegExp("^[1-9A-HJ-NP-Za-km-z]{32,44}$")))
    .check(
      Schema.makeFilterGroup([Schema.isMinLength(1), Schema.isMaxLength(128)], {
        description: "A blockchain address. Format varies by network (e.g., 0x-prefixed for EVM, base58 for Solana).",
      }),
    ),
  amount: Schema.String.annotate({
    description: 'The amount of USDC to send as a decimal string (e.g., "1.5" or "25.50").',
  })
    .check(Schema.isMinLength(1))
    .check(Schema.isMaxLength(32)),
  network: Schema.Literals(["solana", "solana-devnet"]).annotate({
    description: "The Solana network to send USDC on.",
  }),
  createRecipientAta: Schema.optionalKey(
    Schema.Boolean.annotate({
      description:
        "Whether to automatically create an Associated Token Account (ATA) for the recipient if it doesn't exist. When true, the sender pays the rent-exempt minimum to create the recipient's USDC ATA. When false, the transaction will fail if the recipient doesn't have a USDC ATA.",
    }),
  ),
  walletSecretId: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "Required when not using delegated signing. The ID of the Temporary Wallet Secret that was used to sign the X-Wallet-Auth Header.",
    }).check(Schema.isPattern(new RegExp("^[a-zA-Z0-9-]{1,100}$"))),
  ),
  useCdpSponsor: Schema.optionalKey(
    Schema.Boolean.annotate({
      description:
        "Whether transaction fees should be sponsored by CDP. When true, CDP sponsors the transaction fees on behalf of the end user. When false, the end user is responsible for paying the transaction fees.",
    }),
  ),
})
export type SendSolanaAssetWithEndUserAccount200 = { readonly transactionSignature: string }
export const SendSolanaAssetWithEndUserAccount200 = Schema.Struct({
  transactionSignature: Schema.String.annotate({ description: "The base58 encoded transaction signature." }),
})
export type SendSolanaAssetWithEndUserAccount400 = Error
export const SendSolanaAssetWithEndUserAccount400 = Error
export type SendSolanaAssetWithEndUserAccount401 = Error
export const SendSolanaAssetWithEndUserAccount401 = Error
export type SendSolanaAssetWithEndUserAccount402 = Error
export const SendSolanaAssetWithEndUserAccount402 = Error
export type SendSolanaAssetWithEndUserAccount403 = Error
export const SendSolanaAssetWithEndUserAccount403 = Error
export type SendSolanaAssetWithEndUserAccount404 = Error
export const SendSolanaAssetWithEndUserAccount404 = Error
export type SendSolanaAssetWithEndUserAccount422 = Error
export const SendSolanaAssetWithEndUserAccount422 = Error
export type SendSolanaAssetWithEndUserAccount500 = Error
export const SendSolanaAssetWithEndUserAccount500 = Error
export type SendSolanaAssetWithEndUserAccount502 = Error
export const SendSolanaAssetWithEndUserAccount502 = Error
export type SendSolanaAssetWithEndUserAccount503 = Error
export const SendSolanaAssetWithEndUserAccount503 = Error
export type ListEvmAccountsParams = { readonly pageSize?: number; readonly pageToken?: string }
export const ListEvmAccountsParams = Schema.Struct({
  pageSize: Schema.optionalKey(Schema.Number.annotate({ default: 20 }).check(Schema.isInt())),
  pageToken: Schema.optionalKey(Schema.String),
})
export type ListEvmAccounts200 = { readonly accounts: ReadonlyArray<EvmAccount>; readonly nextPageToken?: string }
export const ListEvmAccounts200 = Schema.Struct({
  accounts: Schema.Array(EvmAccount).annotate({ description: "The list of EVM accounts." }),
  nextPageToken: Schema.optionalKey(
    Schema.String.annotate({ description: "The token for the next page of items, if any." }),
  ),
})
export type ListEvmAccounts500 = Error
export const ListEvmAccounts500 = Error
export type ListEvmAccounts502 = Error
export const ListEvmAccounts502 = Error
export type ListEvmAccounts503 = Error
export const ListEvmAccounts503 = Error
export type CreateEvmAccountParams = { readonly "X-Wallet-Auth": string; readonly "X-Idempotency-Key"?: string }
export const CreateEvmAccountParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type CreateEvmAccountRequestJson = { readonly name?: string; readonly accountPolicy?: string }
export const CreateEvmAccountRequestJson = Schema.Struct({
  name: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "An optional name for the account.\nAccount names can consist of alphanumeric characters and hyphens, and be between 2 and 36 characters long.\nAccount names must be unique across all EVM accounts in the developer's CDP Project.",
    }).check(Schema.isPattern(new RegExp("^[A-Za-z0-9][A-Za-z0-9-]{0,34}[A-Za-z0-9]$"))),
  ),
  accountPolicy: Schema.optionalKey(
    Schema.String.annotate({ description: "The ID of the account-level policy to apply to the account." }).check(
      Schema.isPattern(new RegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")),
    ),
  ),
})
export type CreateEvmAccount201 = EvmAccount
export const CreateEvmAccount201 = EvmAccount
export type CreateEvmAccount400 = Error
export const CreateEvmAccount400 = Error
export type CreateEvmAccount401 = Error
export const CreateEvmAccount401 = Error
export type CreateEvmAccount402 = Error
export const CreateEvmAccount402 = Error
export type CreateEvmAccount409 = Error
export const CreateEvmAccount409 = Error
export type CreateEvmAccount422 = Error
export const CreateEvmAccount422 = Error
export type CreateEvmAccount500 = Error
export const CreateEvmAccount500 = Error
export type CreateEvmAccount502 = Error
export const CreateEvmAccount502 = Error
export type CreateEvmAccount503 = Error
export const CreateEvmAccount503 = Error
export type GetEvmAccount200 = EvmAccount
export const GetEvmAccount200 = EvmAccount
export type GetEvmAccount400 = Error
export const GetEvmAccount400 = Error
export type GetEvmAccount404 = Error
export const GetEvmAccount404 = Error
export type GetEvmAccount500 = Error
export const GetEvmAccount500 = Error
export type GetEvmAccount502 = Error
export const GetEvmAccount502 = Error
export type GetEvmAccount503 = Error
export const GetEvmAccount503 = Error
export type UpdateEvmAccountParams = { readonly "X-Idempotency-Key"?: string }
export const UpdateEvmAccountParams = Schema.Struct({
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type UpdateEvmAccountRequestJson = { readonly name?: string; readonly accountPolicy?: string }
export const UpdateEvmAccountRequestJson = Schema.Struct({
  name: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "An optional name for the account.\nAccount names can consist of alphanumeric characters and hyphens, and be between 2 and 36 characters long.\nAccount names must be unique across all EVM accounts in the developer's CDP Project.",
    }).check(Schema.isPattern(new RegExp("^[A-Za-z0-9][A-Za-z0-9-]{0,34}[A-Za-z0-9]$"))),
  ),
  accountPolicy: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "The ID of the account-level policy to apply to the account, or an empty string to unset attached policy.",
    }).check(
      Schema.isPattern(
        new RegExp("(^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$)|(^$)"),
      ),
    ),
  ),
})
export type UpdateEvmAccount200 = EvmAccount
export const UpdateEvmAccount200 = EvmAccount
export type UpdateEvmAccount400 = Error
export const UpdateEvmAccount400 = Error
export type UpdateEvmAccount404 = Error
export const UpdateEvmAccount404 = Error
export type UpdateEvmAccount409 = Error
export const UpdateEvmAccount409 = Error
export type UpdateEvmAccount422 = Error
export const UpdateEvmAccount422 = Error
export type UpdateEvmAccount500 = Error
export const UpdateEvmAccount500 = Error
export type UpdateEvmAccount502 = Error
export const UpdateEvmAccount502 = Error
export type UpdateEvmAccount503 = Error
export const UpdateEvmAccount503 = Error
export type GetEvmAccountByName200 = EvmAccount
export const GetEvmAccountByName200 = EvmAccount
export type GetEvmAccountByName400 = Error
export const GetEvmAccountByName400 = Error
export type GetEvmAccountByName404 = Error
export const GetEvmAccountByName404 = Error
export type GetEvmAccountByName500 = Error
export const GetEvmAccountByName500 = Error
export type GetEvmAccountByName502 = Error
export const GetEvmAccountByName502 = Error
export type GetEvmAccountByName503 = Error
export const GetEvmAccountByName503 = Error
export type SendEvmTransactionParams = { readonly "X-Wallet-Auth": string; readonly "X-Idempotency-Key"?: string }
export const SendEvmTransactionParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type SendEvmTransactionRequestJson = {
  readonly network:
    | "base"
    | "base-sepolia"
    | "ethereum"
    | "ethereum-sepolia"
    | "avalanche"
    | "polygon"
    | "optimism"
    | "arbitrum"
    | "arbitrum-sepolia"
    | "world"
    | "world-sepolia"
  readonly transaction: string
}
export const SendEvmTransactionRequestJson = Schema.Struct({
  network: Schema.Literals([
    "base",
    "base-sepolia",
    "ethereum",
    "ethereum-sepolia",
    "avalanche",
    "polygon",
    "optimism",
    "arbitrum",
    "arbitrum-sepolia",
    "world",
    "world-sepolia",
  ]).annotate({ description: "The network to send the transaction to." }),
  transaction: Schema.String.annotate({
    description: "The RLP-encoded transaction to sign and send, as a 0x-prefixed hex string.",
  }),
})
export type SendEvmTransaction200 = { readonly transactionHash: string }
export const SendEvmTransaction200 = Schema.Struct({
  transactionHash: Schema.String.annotate({ description: "The hash of the transaction, as a 0x-prefixed hex string." }),
})
export type SendEvmTransaction400 = Error
export const SendEvmTransaction400 = Error
export type SendEvmTransaction401 = Error
export const SendEvmTransaction401 = Error
export type SendEvmTransaction402 = Error
export const SendEvmTransaction402 = Error
export type SendEvmTransaction403 = Error
export const SendEvmTransaction403 = Error
export type SendEvmTransaction404 = Error
export const SendEvmTransaction404 = Error
export type SendEvmTransaction409 = Error
export const SendEvmTransaction409 = Error
export type SendEvmTransaction422 = Error
export const SendEvmTransaction422 = Error
export type SendEvmTransaction500 = Error
export const SendEvmTransaction500 = Error
export type SendEvmTransaction502 = Error
export const SendEvmTransaction502 = Error
export type SendEvmTransaction503 = Error
export const SendEvmTransaction503 = Error
export type SignEvmTransactionParams = { readonly "X-Wallet-Auth": string; readonly "X-Idempotency-Key"?: string }
export const SignEvmTransactionParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type SignEvmTransactionRequestJson = { readonly transaction: string }
export const SignEvmTransactionRequestJson = Schema.Struct({
  transaction: Schema.String.annotate({
    description: "The RLP-encoded transaction to sign, as a 0x-prefixed hex string.",
  }),
})
export type SignEvmTransaction200 = { readonly signedTransaction: string }
export const SignEvmTransaction200 = Schema.Struct({
  signedTransaction: Schema.String.annotate({
    description: "The RLP-encoded signed transaction, as a 0x-prefixed hex string.",
  }),
})
export type SignEvmTransaction400 = Error
export const SignEvmTransaction400 = Error
export type SignEvmTransaction401 = Error
export const SignEvmTransaction401 = Error
export type SignEvmTransaction402 = Error
export const SignEvmTransaction402 = Error
export type SignEvmTransaction403 = Error
export const SignEvmTransaction403 = Error
export type SignEvmTransaction404 = Error
export const SignEvmTransaction404 = Error
export type SignEvmTransaction409 = Error
export const SignEvmTransaction409 = Error
export type SignEvmTransaction422 = Error
export const SignEvmTransaction422 = Error
export type SignEvmTransaction500 = Error
export const SignEvmTransaction500 = Error
export type SignEvmTransaction502 = Error
export const SignEvmTransaction502 = Error
export type SignEvmTransaction503 = Error
export const SignEvmTransaction503 = Error
export type SignEvmHashParams = { readonly "X-Wallet-Auth": string; readonly "X-Idempotency-Key"?: string }
export const SignEvmHashParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type SignEvmHashRequestJson = { readonly hash: string }
export const SignEvmHashRequestJson = Schema.Struct({
  hash: Schema.String.annotate({ description: "The arbitrary 32 byte hash to sign." }),
})
export type SignEvmHash200 = { readonly signature: string }
export const SignEvmHash200 = Schema.Struct({
  signature: Schema.String.annotate({ description: "The signature of the hash, as a 0x-prefixed hex string." }),
})
export type SignEvmHash400 = Error
export const SignEvmHash400 = Error
export type SignEvmHash402 = Error
export const SignEvmHash402 = Error
export type SignEvmHash404 = Error
export const SignEvmHash404 = Error
export type SignEvmHash409 = Error
export const SignEvmHash409 = Error
export type SignEvmHash422 = Error
export const SignEvmHash422 = Error
export type SignEvmHash500 = Error
export const SignEvmHash500 = Error
export type SignEvmHash502 = Error
export const SignEvmHash502 = Error
export type SignEvmHash503 = Error
export const SignEvmHash503 = Error
export type SignEvmMessageParams = { readonly "X-Wallet-Auth": string; readonly "X-Idempotency-Key"?: string }
export const SignEvmMessageParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type SignEvmMessageRequestJson = { readonly message: string }
export const SignEvmMessageRequestJson = Schema.Struct({
  message: Schema.String.annotate({ description: "The message to sign." }),
})
export type SignEvmMessage200 = { readonly signature: string }
export const SignEvmMessage200 = Schema.Struct({
  signature: Schema.String.annotate({ description: "The signature of the message, as a 0x-prefixed hex string." }),
})
export type SignEvmMessage401 = Error
export const SignEvmMessage401 = Error
export type SignEvmMessage402 = Error
export const SignEvmMessage402 = Error
export type SignEvmMessage404 = Error
export const SignEvmMessage404 = Error
export type SignEvmMessage409 = Error
export const SignEvmMessage409 = Error
export type SignEvmMessage422 = Error
export const SignEvmMessage422 = Error
export type SignEvmMessage500 = Error
export const SignEvmMessage500 = Error
export type SignEvmMessage502 = Error
export const SignEvmMessage502 = Error
export type SignEvmMessage503 = Error
export const SignEvmMessage503 = Error
export type SignEvmTypedDataParams = { readonly "X-Wallet-Auth": string; readonly "X-Idempotency-Key"?: string }
export const SignEvmTypedDataParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type SignEvmTypedDataRequestJson = EIP712Message
export const SignEvmTypedDataRequestJson = EIP712Message
export type SignEvmTypedData200 = { readonly signature: string }
export const SignEvmTypedData200 = Schema.Struct({
  signature: Schema.String.annotate({ description: "The signature of the typed data, as a 0x-prefixed hex string." }),
})
export type SignEvmTypedData400 = Error
export const SignEvmTypedData400 = Error
export type SignEvmTypedData401 = Error
export const SignEvmTypedData401 = Error
export type SignEvmTypedData402 = Error
export const SignEvmTypedData402 = Error
export type SignEvmTypedData404 = Error
export const SignEvmTypedData404 = Error
export type SignEvmTypedData422 = Error
export const SignEvmTypedData422 = Error
export type SignEvmTypedData500 = Error
export const SignEvmTypedData500 = Error
export type SignEvmTypedData502 = Error
export const SignEvmTypedData502 = Error
export type SignEvmTypedData503 = Error
export const SignEvmTypedData503 = Error
export type CreateEvmEip7702DelegationParams = {
  readonly "X-Wallet-Auth": string
  readonly "X-Idempotency-Key"?: string
}
export const CreateEvmEip7702DelegationParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type CreateEvmEip7702DelegationRequestJson = {
  readonly network: EvmEip7702DelegationNetwork
  readonly enableSpendPermissions?: boolean
}
export const CreateEvmEip7702DelegationRequestJson = Schema.Struct({
  network: EvmEip7702DelegationNetwork,
  enableSpendPermissions: Schema.optionalKey(
    Schema.Boolean.annotate({
      description:
        "Whether to configure spend permissions for the upgraded, delegated account. When enabled, the account can grant permissions for third parties to spend on its behalf.",
      default: false,
    }),
  ),
})
export type CreateEvmEip7702Delegation201 = { readonly delegationOperationId: string }
export const CreateEvmEip7702Delegation201 = Schema.Struct({
  delegationOperationId: Schema.String.annotate({
    description: "The unique identifier for the delegation operation. Use this to poll the operation status.",
    format: "uuid",
  }),
})
export type CreateEvmEip7702Delegation400 = Error
export const CreateEvmEip7702Delegation400 = Error
export type CreateEvmEip7702Delegation401 = Error
export const CreateEvmEip7702Delegation401 = Error
export type CreateEvmEip7702Delegation402 = Error
export const CreateEvmEip7702Delegation402 = Error
export type CreateEvmEip7702Delegation404 = Error
export const CreateEvmEip7702Delegation404 = Error
export type CreateEvmEip7702Delegation409 = Error
export const CreateEvmEip7702Delegation409 = Error
export type CreateEvmEip7702Delegation422 = Error
export const CreateEvmEip7702Delegation422 = Error
export type CreateEvmEip7702Delegation500 = Error
export const CreateEvmEip7702Delegation500 = Error
export type CreateEvmEip7702Delegation502 = Error
export const CreateEvmEip7702Delegation502 = Error
export type CreateEvmEip7702Delegation503 = Error
export const CreateEvmEip7702Delegation503 = Error
export type GetEvmEip7702DelegationOperationById200 = EvmEip7702DelegationOperation
export const GetEvmEip7702DelegationOperationById200 = EvmEip7702DelegationOperation
export type GetEvmEip7702DelegationOperationById400 = Error
export const GetEvmEip7702DelegationOperationById400 = Error
export type GetEvmEip7702DelegationOperationById404 = Error
export const GetEvmEip7702DelegationOperationById404 = Error
export type GetEvmEip7702DelegationOperationById500 = Error
export const GetEvmEip7702DelegationOperationById500 = Error
export type GetEvmEip7702DelegationOperationById502 = Error
export const GetEvmEip7702DelegationOperationById502 = Error
export type GetEvmEip7702DelegationOperationById503 = Error
export const GetEvmEip7702DelegationOperationById503 = Error
export type ListEvmSmartAccountsParams = { readonly pageSize?: number; readonly pageToken?: string }
export const ListEvmSmartAccountsParams = Schema.Struct({
  pageSize: Schema.optionalKey(Schema.Number.annotate({ default: 20 }).check(Schema.isInt())),
  pageToken: Schema.optionalKey(Schema.String),
})
export type ListEvmSmartAccounts200 = {
  readonly accounts: ReadonlyArray<EvmSmartAccount>
  readonly nextPageToken?: string
}
export const ListEvmSmartAccounts200 = Schema.Struct({
  accounts: Schema.Array(EvmSmartAccount).annotate({ description: "The list of Smart Accounts." }),
  nextPageToken: Schema.optionalKey(
    Schema.String.annotate({ description: "The token for the next page of items, if any." }),
  ),
})
export type ListEvmSmartAccounts400 = Error
export const ListEvmSmartAccounts400 = Error
export type ListEvmSmartAccounts500 = Error
export const ListEvmSmartAccounts500 = Error
export type ListEvmSmartAccounts502 = Error
export const ListEvmSmartAccounts502 = Error
export type ListEvmSmartAccounts503 = Error
export const ListEvmSmartAccounts503 = Error
export type CreateEvmSmartAccountParams = { readonly "X-Idempotency-Key"?: string }
export const CreateEvmSmartAccountParams = Schema.Struct({
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type CreateEvmSmartAccountRequestJson = { readonly owners: ReadonlyArray<string>; readonly name?: string }
export const CreateEvmSmartAccountRequestJson = Schema.Struct({
  owners: Schema.Array(Schema.String.check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$")))).annotate({
    description:
      "Today, only a single owner can be set for a Smart Account, but this is an array to allow setting multiple owners in the future.",
  }),
  name: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "An optional name for the account.\nAccount names can consist of alphanumeric characters and hyphens, and be between 2 and 36 characters long.\nAccount names must be unique across all EVM accounts in the developer's CDP Project.",
    }).check(Schema.isPattern(new RegExp("^[A-Za-z0-9][A-Za-z0-9-]{0,34}[A-Za-z0-9]$"))),
  ),
})
export type CreateEvmSmartAccount201 = EvmSmartAccount
export const CreateEvmSmartAccount201 = EvmSmartAccount
export type CreateEvmSmartAccount400 = Error
export const CreateEvmSmartAccount400 = Error
export type CreateEvmSmartAccount402 = Error
export const CreateEvmSmartAccount402 = Error
export type CreateEvmSmartAccount500 = Error
export const CreateEvmSmartAccount500 = Error
export type CreateEvmSmartAccount502 = Error
export const CreateEvmSmartAccount502 = Error
export type CreateEvmSmartAccount503 = Error
export const CreateEvmSmartAccount503 = Error
export type GetEvmSmartAccountByName200 = EvmSmartAccount
export const GetEvmSmartAccountByName200 = EvmSmartAccount
export type GetEvmSmartAccountByName400 = Error
export const GetEvmSmartAccountByName400 = Error
export type GetEvmSmartAccountByName404 = Error
export const GetEvmSmartAccountByName404 = Error
export type GetEvmSmartAccountByName500 = Error
export const GetEvmSmartAccountByName500 = Error
export type GetEvmSmartAccountByName502 = Error
export const GetEvmSmartAccountByName502 = Error
export type GetEvmSmartAccountByName503 = Error
export const GetEvmSmartAccountByName503 = Error
export type ImportEvmAccountParams = { readonly "X-Wallet-Auth": string; readonly "X-Idempotency-Key"?: string }
export const ImportEvmAccountParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type ImportEvmAccountRequestJson = {
  readonly encryptedPrivateKey: string
  readonly name?: string
  readonly accountPolicy?: string
}
export const ImportEvmAccountRequestJson = Schema.Struct({
  encryptedPrivateKey: Schema.String.annotate({
    description:
      "The base64-encoded, encrypted private key of the EVM account. The private key must be encrypted using the CDP SDK's encryption scheme.",
  }),
  name: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "An optional name for the account.\nAccount names can consist of alphanumeric characters and hyphens, and be between 2 and 36 characters long.\nAccount names must be unique across all EVM accounts in the developer's CDP Project.",
    }).check(Schema.isPattern(new RegExp("^[A-Za-z0-9][A-Za-z0-9-]{0,34}[A-Za-z0-9]$"))),
  ),
  accountPolicy: Schema.optionalKey(
    Schema.String.annotate({ description: "The ID of the account-level policy to apply to the account." }).check(
      Schema.isPattern(new RegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")),
    ),
  ),
})
export type ImportEvmAccount201 = EvmAccount
export const ImportEvmAccount201 = EvmAccount
export type ImportEvmAccount400 = Error
export const ImportEvmAccount400 = Error
export type ImportEvmAccount401 = Error
export const ImportEvmAccount401 = Error
export type ImportEvmAccount402 = Error
export const ImportEvmAccount402 = Error
export type ImportEvmAccount409 = Error
export const ImportEvmAccount409 = Error
export type ImportEvmAccount422 = Error
export const ImportEvmAccount422 = Error
export type ImportEvmAccount500 = Error
export const ImportEvmAccount500 = Error
export type ImportEvmAccount502 = Error
export const ImportEvmAccount502 = Error
export type ImportEvmAccount503 = Error
export const ImportEvmAccount503 = Error
export type ExportEvmAccountParams = { readonly "X-Wallet-Auth": string; readonly "X-Idempotency-Key"?: string }
export const ExportEvmAccountParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type ExportEvmAccountRequestJson = { readonly exportEncryptionKey: string }
export const ExportEvmAccountRequestJson = Schema.Struct({
  exportEncryptionKey: Schema.String.annotate({
    description:
      "The base64-encoded, public part of the RSA key in DER format used to encrypt the account private key.",
  }),
})
export type ExportEvmAccount200 = { readonly encryptedPrivateKey: string }
export const ExportEvmAccount200 = Schema.Struct({
  encryptedPrivateKey: Schema.String.annotate({
    description:
      "The base64-encoded, encrypted private key of the EVM account which is a 32 byte raw private key. The private key is encrypted in transport using the exportEncryptionKey in the request.",
  }),
})
export type ExportEvmAccount400 = Error
export const ExportEvmAccount400 = Error
export type ExportEvmAccount401 = Error
export const ExportEvmAccount401 = Error
export type ExportEvmAccount402 = Error
export const ExportEvmAccount402 = Error
export type ExportEvmAccount404 = Error
export const ExportEvmAccount404 = Error
export type ExportEvmAccount422 = Error
export const ExportEvmAccount422 = Error
export type ExportEvmAccount500 = Error
export const ExportEvmAccount500 = Error
export type ExportEvmAccount502 = Error
export const ExportEvmAccount502 = Error
export type ExportEvmAccount503 = Error
export const ExportEvmAccount503 = Error
export type ExportEvmAccountByNameParams = { readonly "X-Wallet-Auth": string; readonly "X-Idempotency-Key"?: string }
export const ExportEvmAccountByNameParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type ExportEvmAccountByNameRequestJson = { readonly exportEncryptionKey: string }
export const ExportEvmAccountByNameRequestJson = Schema.Struct({
  exportEncryptionKey: Schema.String.annotate({
    description:
      "The base64-encoded, public part of the RSA key in DER format used to encrypt the account private key.",
  }),
})
export type ExportEvmAccountByName200 = { readonly encryptedPrivateKey: string }
export const ExportEvmAccountByName200 = Schema.Struct({
  encryptedPrivateKey: Schema.String.annotate({
    description:
      "The base64-encoded, encrypted private key of the EVM account which is a 32 byte raw private key. The private key is encrypted in transport using the exportEncryptionKey in the request.",
  }),
})
export type ExportEvmAccountByName400 = Error
export const ExportEvmAccountByName400 = Error
export type ExportEvmAccountByName401 = Error
export const ExportEvmAccountByName401 = Error
export type ExportEvmAccountByName402 = Error
export const ExportEvmAccountByName402 = Error
export type ExportEvmAccountByName404 = Error
export const ExportEvmAccountByName404 = Error
export type ExportEvmAccountByName422 = Error
export const ExportEvmAccountByName422 = Error
export type ExportEvmAccountByName500 = Error
export const ExportEvmAccountByName500 = Error
export type ExportEvmAccountByName502 = Error
export const ExportEvmAccountByName502 = Error
export type ExportEvmAccountByName503 = Error
export const ExportEvmAccountByName503 = Error
export type GetEvmSmartAccount200 = EvmSmartAccount
export const GetEvmSmartAccount200 = EvmSmartAccount
export type GetEvmSmartAccount400 = Error
export const GetEvmSmartAccount400 = Error
export type GetEvmSmartAccount404 = Error
export const GetEvmSmartAccount404 = Error
export type GetEvmSmartAccount500 = Error
export const GetEvmSmartAccount500 = Error
export type GetEvmSmartAccount502 = Error
export const GetEvmSmartAccount502 = Error
export type GetEvmSmartAccount503 = Error
export const GetEvmSmartAccount503 = Error
export type UpdateEvmSmartAccountRequestJson = { readonly name?: string }
export const UpdateEvmSmartAccountRequestJson = Schema.Struct({
  name: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "An optional name for the smart account.\nAccount names can consist of alphanumeric characters and hyphens, and be between 2 and 36 characters long.\nAccount names must be unique across all EVM smart accounts in the developer's CDP Project.",
    }).check(Schema.isPattern(new RegExp("^[A-Za-z0-9][A-Za-z0-9-]{0,34}[A-Za-z0-9]$"))),
  ),
})
export type UpdateEvmSmartAccount200 = EvmSmartAccount
export const UpdateEvmSmartAccount200 = EvmSmartAccount
export type UpdateEvmSmartAccount400 = Error
export const UpdateEvmSmartAccount400 = Error
export type UpdateEvmSmartAccount404 = Error
export const UpdateEvmSmartAccount404 = Error
export type UpdateEvmSmartAccount409 = Error
export const UpdateEvmSmartAccount409 = Error
export type UpdateEvmSmartAccount422 = Error
export const UpdateEvmSmartAccount422 = Error
export type UpdateEvmSmartAccount500 = Error
export const UpdateEvmSmartAccount500 = Error
export type UpdateEvmSmartAccount502 = Error
export const UpdateEvmSmartAccount502 = Error
export type UpdateEvmSmartAccount503 = Error
export const UpdateEvmSmartAccount503 = Error
export type PrepareUserOperationRequestJson = {
  readonly network: EvmUserOperationNetwork
  readonly calls: ReadonlyArray<EvmCall>
  readonly paymasterUrl?: string
  readonly dataSuffix?: string
}
export const PrepareUserOperationRequestJson = Schema.Struct({
  network: EvmUserOperationNetwork,
  calls: Schema.Array(EvmCall).annotate({ description: "The list of calls to make from the Smart Account." }),
  paymasterUrl: Schema.optionalKey(
    Schema.String.annotate({ description: "A valid HTTP or HTTPS URL.", format: "uri" })
      .check(Schema.isMinLength(11))
      .check(Schema.isMaxLength(2048))
      .check(Schema.isPattern(new RegExp("^https?:\\/\\/.*$"))),
  ),
  dataSuffix: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "The EIP-8021 data suffix (hex-encoded) that enables transaction attribution for the user operation.",
    }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]+$"))),
  ),
})
export type PrepareUserOperation201 = EvmUserOperation
export const PrepareUserOperation201 = EvmUserOperation
export type PrepareUserOperation400 = Error
export const PrepareUserOperation400 = Error
export type PrepareUserOperation403 = Error
export const PrepareUserOperation403 = Error
export type PrepareUserOperation404 = Error
export const PrepareUserOperation404 = Error
export type PrepareUserOperation500 = Error
export const PrepareUserOperation500 = Error
export type PrepareUserOperation502 = Error
export const PrepareUserOperation502 = Error
export type PrepareUserOperation503 = Error
export const PrepareUserOperation503 = Error
export type PrepareAndSendUserOperationParams = {
  readonly "X-Idempotency-Key"?: string
  readonly "X-Wallet-Auth": string
}
export const PrepareAndSendUserOperationParams = Schema.Struct({
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
  "X-Wallet-Auth": Schema.String,
})
export type PrepareAndSendUserOperationRequestJson = {
  readonly network: EvmUserOperationNetwork
  readonly calls: ReadonlyArray<EvmCall>
  readonly paymasterUrl?: string
}
export const PrepareAndSendUserOperationRequestJson = Schema.Struct({
  network: EvmUserOperationNetwork,
  calls: Schema.Array(EvmCall).annotate({ description: "The list of calls to make from the Smart Account." }),
  paymasterUrl: Schema.optionalKey(
    Schema.String.annotate({ description: "A valid HTTP or HTTPS URL.", format: "uri" })
      .check(Schema.isMinLength(11))
      .check(Schema.isMaxLength(2048))
      .check(Schema.isPattern(new RegExp("^https?:\\/\\/.*$"))),
  ),
})
export type PrepareAndSendUserOperation200 = EvmUserOperation
export const PrepareAndSendUserOperation200 = EvmUserOperation
export type PrepareAndSendUserOperation400 = Error
export const PrepareAndSendUserOperation400 = Error
export type PrepareAndSendUserOperation401 = Error
export const PrepareAndSendUserOperation401 = Error
export type PrepareAndSendUserOperation402 = Error
export const PrepareAndSendUserOperation402 = Error
export type PrepareAndSendUserOperation403 = Error
export const PrepareAndSendUserOperation403 = Error
export type PrepareAndSendUserOperation404 = Error
export const PrepareAndSendUserOperation404 = Error
export type PrepareAndSendUserOperation429 = Error
export const PrepareAndSendUserOperation429 = Error
export type PrepareAndSendUserOperation500 = Error
export const PrepareAndSendUserOperation500 = Error
export type PrepareAndSendUserOperation502 = Error
export const PrepareAndSendUserOperation502 = Error
export type PrepareAndSendUserOperation503 = Error
export const PrepareAndSendUserOperation503 = Error
export type GetUserOperation200 = EvmUserOperation
export const GetUserOperation200 = EvmUserOperation
export type GetUserOperation400 = Error
export const GetUserOperation400 = Error
export type GetUserOperation404 = Error
export const GetUserOperation404 = Error
export type GetUserOperation500 = Error
export const GetUserOperation500 = Error
export type GetUserOperation502 = Error
export const GetUserOperation502 = Error
export type GetUserOperation503 = Error
export const GetUserOperation503 = Error
export type SendUserOperationRequestJson = { readonly signature: string }
export const SendUserOperationRequestJson = Schema.Struct({
  signature: Schema.String.annotate({
    description:
      "The hex-encoded signature of the user operation. This should be a 65-byte signature consisting of the `r`, `s`, and `v` values of the ECDSA signature. Note that the `v` value should conform to the `personal_sign` standard, which means it should be 27 or 28.",
  }),
})
export type SendUserOperation200 = EvmUserOperation
export const SendUserOperation200 = EvmUserOperation
export type SendUserOperation400 = Error
export const SendUserOperation400 = Error
export type SendUserOperation402 = Error
export const SendUserOperation402 = Error
export type SendUserOperation403 = Error
export const SendUserOperation403 = Error
export type SendUserOperation404 = Error
export const SendUserOperation404 = Error
export type SendUserOperation429 = Error
export const SendUserOperation429 = Error
export type SendUserOperation500 = Error
export const SendUserOperation500 = Error
export type SendUserOperation502 = Error
export const SendUserOperation502 = Error
export type SendUserOperation503 = Error
export const SendUserOperation503 = Error
export type CreateSpendPermissionParams = { readonly "X-Wallet-Auth": string; readonly "X-Idempotency-Key"?: string }
export const CreateSpendPermissionParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type CreateSpendPermissionRequestJson = CreateSpendPermissionRequest
export const CreateSpendPermissionRequestJson = CreateSpendPermissionRequest
export type CreateSpendPermission200 = EvmUserOperation
export const CreateSpendPermission200 = EvmUserOperation
export type CreateSpendPermission400 = Error
export const CreateSpendPermission400 = Error
export type CreateSpendPermission402 = Error
export const CreateSpendPermission402 = Error
export type CreateSpendPermission404 = Error
export const CreateSpendPermission404 = Error
export type CreateSpendPermission500 = Error
export const CreateSpendPermission500 = Error
export type CreateSpendPermission502 = Error
export const CreateSpendPermission502 = Error
export type CreateSpendPermission503 = Error
export const CreateSpendPermission503 = Error
export type ListSpendPermissionsParams = { readonly pageSize?: number; readonly pageToken?: string }
export const ListSpendPermissionsParams = Schema.Struct({
  pageSize: Schema.optionalKey(Schema.Number.annotate({ default: 20 }).check(Schema.isInt())),
  pageToken: Schema.optionalKey(Schema.String),
})
export type ListSpendPermissions200 = {
  readonly spendPermissions: ReadonlyArray<SpendPermissionResponseObject>
  readonly nextPageToken?: string
}
export const ListSpendPermissions200 = Schema.Struct({
  spendPermissions: Schema.Array(SpendPermissionResponseObject).annotate({
    description: "The spend permissions for the smart account.",
  }),
  nextPageToken: Schema.optionalKey(
    Schema.String.annotate({ description: "The token for the next page of items, if any." }),
  ),
})
export type ListSpendPermissions400 = Error
export const ListSpendPermissions400 = Error
export type ListSpendPermissions404 = Error
export const ListSpendPermissions404 = Error
export type ListSpendPermissions500 = Error
export const ListSpendPermissions500 = Error
export type ListSpendPermissions502 = Error
export const ListSpendPermissions502 = Error
export type ListSpendPermissions503 = Error
export const ListSpendPermissions503 = Error
export type RevokeSpendPermissionParams = { readonly "X-Wallet-Auth": string; readonly "X-Idempotency-Key"?: string }
export const RevokeSpendPermissionParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type RevokeSpendPermissionRequestJson = RevokeSpendPermissionRequest
export const RevokeSpendPermissionRequestJson = RevokeSpendPermissionRequest
export type RevokeSpendPermission200 = EvmUserOperation
export const RevokeSpendPermission200 = EvmUserOperation
export type RevokeSpendPermission400 = Error
export const RevokeSpendPermission400 = Error
export type RevokeSpendPermission402 = Error
export const RevokeSpendPermission402 = Error
export type RevokeSpendPermission404 = Error
export const RevokeSpendPermission404 = Error
export type RevokeSpendPermission500 = Error
export const RevokeSpendPermission500 = Error
export type RevokeSpendPermission502 = Error
export const RevokeSpendPermission502 = Error
export type RevokeSpendPermission503 = Error
export const RevokeSpendPermission503 = Error
export type GetEvmSwapPriceParams = {
  readonly network: EvmSwapsNetwork
  readonly toToken: ToToken
  readonly fromToken: FromToken
  readonly fromAmount: FromAmount
  readonly taker: Taker
  readonly signerAddress?: SignerAddress
  readonly gasPrice?: GasPrice
  readonly slippageBps?: SlippageBps
}
export const GetEvmSwapPriceParams = Schema.Struct({
  network: EvmSwapsNetwork,
  toToken: ToToken,
  fromToken: FromToken,
  fromAmount: FromAmount,
  taker: Taker,
  signerAddress: Schema.optionalKey(SignerAddress),
  gasPrice: Schema.optionalKey(GasPrice),
  slippageBps: Schema.optionalKey(SlippageBps),
})
export type GetEvmSwapPrice200 = GetSwapPriceResponseWrapper
export const GetEvmSwapPrice200 = GetSwapPriceResponseWrapper
export type GetEvmSwapPrice400 = Error
export const GetEvmSwapPrice400 = Error
export type GetEvmSwapPrice403 = Error
export const GetEvmSwapPrice403 = Error
export type GetEvmSwapPrice500 = Error
export const GetEvmSwapPrice500 = Error
export type GetEvmSwapPrice502 = Error
export const GetEvmSwapPrice502 = Error
export type GetEvmSwapPrice503 = Error
export const GetEvmSwapPrice503 = Error
export type CreateEvmSwapQuoteParams = { readonly "X-Idempotency-Key"?: string }
export const CreateEvmSwapQuoteParams = Schema.Struct({
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type CreateEvmSwapQuoteRequestJson = {
  readonly network: EvmSwapsNetwork
  readonly toToken: string
  readonly fromToken: string
  readonly fromAmount: string
  readonly taker: string
  readonly signerAddress?: string
  readonly gasPrice?: string
  readonly slippageBps?: number
}
export const CreateEvmSwapQuoteRequestJson = Schema.Struct({
  network: EvmSwapsNetwork,
  toToken: Schema.String.annotate({ description: "The 0x-prefixed contract address of the token to receive." }).check(
    Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$")),
  ),
  fromToken: Schema.String.annotate({ description: "The 0x-prefixed contract address of the token to send." }).check(
    Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$")),
  ),
  fromAmount: Schema.String.annotate({
    description:
      "The amount of the `fromToken` to send in atomic units of the token. For example, `1000000000000000000` when sending ETH equates to 1 ETH, `1000000` when sending USDC equates to 1 USDC, etc.",
  }).check(Schema.isPattern(new RegExp("^\\d+$"))),
  taker: Schema.String.annotate({
    description:
      "The 0x-prefixed address that holds the `fromToken` balance and has the `Permit2` allowance set for the swap.",
  }).check(Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$"))),
  signerAddress: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "The 0x-prefixed Externally Owned Account (EOA) address that will sign the `Permit2` EIP-712 permit message. This is only needed if `taker` is a smart contract.",
    }).check(Schema.isPattern(new RegExp("^0x[a-fA-F0-9]{40}$"))),
  ),
  gasPrice: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "The target gas price for the swap transaction, in Wei. For EIP-1559 transactions, this value should be seen as the `maxFeePerGas` value. If not provided, the API will use an estimate based on the current network conditions.",
    }).check(Schema.isPattern(new RegExp("^\\d+$"))),
  ),
  slippageBps: Schema.optionalKey(
    Schema.Number.annotate({
      description:
        "The maximum acceptable slippage of the `toToken` in basis points. If this parameter is set to 0, no slippage will be tolerated. If not provided, the default slippage tolerance is 100 bps (i.e., 1%).",
      default: 100,
    })
      .check(Schema.isInt())
      .check(Schema.isGreaterThanOrEqualTo(0))
      .check(Schema.isLessThanOrEqualTo(10000)),
  ),
})
export type CreateEvmSwapQuote201 = CreateSwapQuoteResponseWrapper
export const CreateEvmSwapQuote201 = CreateSwapQuoteResponseWrapper
export type CreateEvmSwapQuote400 = Error
export const CreateEvmSwapQuote400 = Error
export type CreateEvmSwapQuote403 = Error
export const CreateEvmSwapQuote403 = Error
export type CreateEvmSwapQuote500 = Error
export const CreateEvmSwapQuote500 = Error
export type CreateEvmSwapQuote502 = Error
export const CreateEvmSwapQuote502 = Error
export type CreateEvmSwapQuote503 = Error
export const CreateEvmSwapQuote503 = Error
export type ListEvmTokenBalancesParams = { readonly pageSize?: number; readonly pageToken?: string }
export const ListEvmTokenBalancesParams = Schema.Struct({
  pageSize: Schema.optionalKey(Schema.Number.annotate({ default: 20 }).check(Schema.isInt())),
  pageToken: Schema.optionalKey(Schema.String),
})
export type ListEvmTokenBalances200 = {
  readonly balances: ReadonlyArray<TokenBalance>
  readonly nextPageToken?: string
}
export const ListEvmTokenBalances200 = Schema.Struct({
  balances: Schema.Array(TokenBalance).annotate({ description: "The list of EVM token balances." }),
  nextPageToken: Schema.optionalKey(
    Schema.String.annotate({ description: "The token for the next page of items, if any." }),
  ),
})
export type ListEvmTokenBalances400 = Error
export const ListEvmTokenBalances400 = Error
export type ListEvmTokenBalances404 = Error
export const ListEvmTokenBalances404 = Error
export type ListEvmTokenBalances500 = Error
export const ListEvmTokenBalances500 = Error
export type ListEvmTokenBalances502 = Error
export const ListEvmTokenBalances502 = Error
export type ListEvmTokenBalances503 = Error
export const ListEvmTokenBalances503 = Error
export type RequestEvmFaucetRequestJson = {
  readonly network: "base-sepolia" | "ethereum-sepolia" | "ethereum-hoodi"
  readonly address: string
  readonly token: "eth" | "usdc" | "eurc" | "cbbtc"
}
export const RequestEvmFaucetRequestJson = Schema.Struct({
  network: Schema.Literals(["base-sepolia", "ethereum-sepolia", "ethereum-hoodi"]).annotate({
    description: "The network to request funds from.",
  }),
  address: Schema.String.annotate({
    description: "The address to request funds to, which is a 0x-prefixed hexadecimal string.",
  }).check(Schema.isPattern(new RegExp("^0x[0-9a-fA-F]{40}$"))),
  token: Schema.Literals(["eth", "usdc", "eurc", "cbbtc"]).annotate({ description: "The token to request funds for." }),
})
export type RequestEvmFaucet200 = { readonly transactionHash: string }
export const RequestEvmFaucet200 = Schema.Struct({
  transactionHash: Schema.String.annotate({
    description:
      "The hash of the transaction that requested the funds.\n**Note:** In rare cases, when gas conditions are unusually high, the transaction may not confirm, and the system may issue a replacement transaction to complete the faucet request. In these rare cases, the `transactionHash` will be out of sync with the actual faucet transaction that was confirmed onchain.",
  }),
})
export type RequestEvmFaucet400 = Error
export const RequestEvmFaucet400 = Error
export type RequestEvmFaucet403 = Error
export const RequestEvmFaucet403 = Error
export type RequestEvmFaucet429 = Error
export const RequestEvmFaucet429 = Error
export type RequestEvmFaucet500 = Error
export const RequestEvmFaucet500 = Error
export type RequestEvmFaucet502 = Error
export const RequestEvmFaucet502 = Error
export type RequestEvmFaucet503 = Error
export const RequestEvmFaucet503 = Error
export type ListPoliciesParams = {
  readonly pageSize?: number
  readonly pageToken?: string
  readonly scope?: "project" | "account"
}
export const ListPoliciesParams = Schema.Struct({
  pageSize: Schema.optionalKey(Schema.Number.annotate({ default: 20 }).check(Schema.isInt())),
  pageToken: Schema.optionalKey(Schema.String),
  scope: Schema.optionalKey(Schema.Literals(["project", "account"])),
})
export type ListPolicies200 = { readonly policies: ReadonlyArray<Policy>; readonly nextPageToken?: string }
export const ListPolicies200 = Schema.Struct({
  policies: Schema.Array(Policy).annotate({ description: "The list of policies." }),
  nextPageToken: Schema.optionalKey(
    Schema.String.annotate({ description: "The token for the next page of items, if any." }),
  ),
})
export type ListPolicies500 = Error
export const ListPolicies500 = Error
export type ListPolicies502 = Error
export const ListPolicies502 = Error
export type ListPolicies503 = Error
export const ListPolicies503 = Error
export type CreatePolicyParams = { readonly "X-Idempotency-Key"?: string }
export const CreatePolicyParams = Schema.Struct({
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type CreatePolicyRequestJson = {
  readonly scope: "project" | "account"
  readonly description?: string
  readonly rules: ReadonlyArray<Rule>
}
export const CreatePolicyRequestJson = Schema.Struct({
  scope: Schema.Literals(["project", "account"]).annotate({ description: "The scope of the policy." }),
  description: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "An optional human-readable description for the policy.\nPolicy descriptions can consist of alphanumeric characters, spaces, commas, and periods, and be 50 characters or less.",
    }).check(Schema.isPattern(new RegExp("^[A-Za-z0-9 ,.]{1,50}$"))),
  ),
  rules: Schema.Array(Rule).annotate({
    description: "A list of rules that comprise the policy. There is a limit of 10 rules per policy.",
  }),
})
export type CreatePolicy201 = Policy
export const CreatePolicy201 = Policy
export type CreatePolicy400 = Error
export const CreatePolicy400 = Error
export type CreatePolicy409 = Error
export const CreatePolicy409 = Error
export type CreatePolicy422 = Error
export const CreatePolicy422 = Error
export type CreatePolicy500 = Error
export const CreatePolicy500 = Error
export type CreatePolicy502 = Error
export const CreatePolicy502 = Error
export type CreatePolicy503 = Error
export const CreatePolicy503 = Error
export type GetPolicyById200 = Policy
export const GetPolicyById200 = Policy
export type GetPolicyById404 = Error
export const GetPolicyById404 = Error
export type GetPolicyById500 = Error
export const GetPolicyById500 = Error
export type GetPolicyById502 = Error
export const GetPolicyById502 = Error
export type GetPolicyById503 = Error
export const GetPolicyById503 = Error
export type UpdatePolicyParams = { readonly "X-Idempotency-Key"?: string }
export const UpdatePolicyParams = Schema.Struct({
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type UpdatePolicyRequestJson = { readonly description?: string; readonly rules: ReadonlyArray<Rule> }
export const UpdatePolicyRequestJson = Schema.Struct({
  description: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "An optional human-readable description for the policy.\nPolicy descriptions can consist of alphanumeric characters, spaces, commas, and periods, and be 50 characters or less.",
    }).check(Schema.isPattern(new RegExp("^[A-Za-z0-9 ,.]{1,50}$"))),
  ),
  rules: Schema.Array(Rule).annotate({
    description: "A list of rules that comprise the policy. There is a limit of 10 rules per policy.",
  }),
})
export type UpdatePolicy200 = Policy
export const UpdatePolicy200 = Policy
export type UpdatePolicy400 = Error
export const UpdatePolicy400 = Error
export type UpdatePolicy404 = Error
export const UpdatePolicy404 = Error
export type UpdatePolicy409 = Error
export const UpdatePolicy409 = Error
export type UpdatePolicy422 = Error
export const UpdatePolicy422 = Error
export type UpdatePolicy500 = Error
export const UpdatePolicy500 = Error
export type UpdatePolicy502 = Error
export const UpdatePolicy502 = Error
export type UpdatePolicy503 = Error
export const UpdatePolicy503 = Error
export type DeletePolicyParams = { readonly "X-Idempotency-Key"?: string }
export const DeletePolicyParams = Schema.Struct({
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type DeletePolicy400 = Error
export const DeletePolicy400 = Error
export type DeletePolicy404 = Error
export const DeletePolicy404 = Error
export type DeletePolicy409 = Error
export const DeletePolicy409 = Error
export type DeletePolicy422 = Error
export const DeletePolicy422 = Error
export type DeletePolicy500 = Error
export const DeletePolicy500 = Error
export type DeletePolicy502 = Error
export const DeletePolicy502 = Error
export type DeletePolicy503 = Error
export const DeletePolicy503 = Error
export type ListSolanaAccountsParams = { readonly pageSize?: number; readonly pageToken?: string }
export const ListSolanaAccountsParams = Schema.Struct({
  pageSize: Schema.optionalKey(Schema.Number.annotate({ default: 20 }).check(Schema.isInt())),
  pageToken: Schema.optionalKey(Schema.String),
})
export type ListSolanaAccounts200 = { readonly accounts: ReadonlyArray<SolanaAccount>; readonly nextPageToken?: string }
export const ListSolanaAccounts200 = Schema.Struct({
  accounts: Schema.Array(SolanaAccount).annotate({ description: "The list of Solana accounts." }),
  nextPageToken: Schema.optionalKey(
    Schema.String.annotate({ description: "The token for the next page of items, if any." }),
  ),
})
export type ListSolanaAccounts500 = Error
export const ListSolanaAccounts500 = Error
export type ListSolanaAccounts502 = Error
export const ListSolanaAccounts502 = Error
export type ListSolanaAccounts503 = Error
export const ListSolanaAccounts503 = Error
export type CreateSolanaAccountParams = { readonly "X-Wallet-Auth": string; readonly "X-Idempotency-Key"?: string }
export const CreateSolanaAccountParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type CreateSolanaAccountRequestJson = { readonly name?: string; readonly accountPolicy?: string }
export const CreateSolanaAccountRequestJson = Schema.Struct({
  name: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "An optional name for the account.\nAccount names can consist of alphanumeric characters and hyphens, and be between 2 and 36 characters long.\nAccount names must be unique across all Solana accounts in the developer's CDP Project.",
    }).check(Schema.isPattern(new RegExp("^[A-Za-z0-9][A-Za-z0-9-]{0,34}[A-Za-z0-9]$"))),
  ),
  accountPolicy: Schema.optionalKey(
    Schema.String.annotate({ description: "The ID of the account-level policy to apply to the account." }).check(
      Schema.isPattern(new RegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")),
    ),
  ),
})
export type CreateSolanaAccount201 = SolanaAccount
export const CreateSolanaAccount201 = SolanaAccount
export type CreateSolanaAccount400 = Error
export const CreateSolanaAccount400 = Error
export type CreateSolanaAccount401 = Error
export const CreateSolanaAccount401 = Error
export type CreateSolanaAccount402 = Error
export const CreateSolanaAccount402 = Error
export type CreateSolanaAccount409 = Error
export const CreateSolanaAccount409 = Error
export type CreateSolanaAccount422 = Error
export const CreateSolanaAccount422 = Error
export type CreateSolanaAccount500 = Error
export const CreateSolanaAccount500 = Error
export type CreateSolanaAccount502 = Error
export const CreateSolanaAccount502 = Error
export type CreateSolanaAccount503 = Error
export const CreateSolanaAccount503 = Error
export type GetSolanaAccount200 = SolanaAccount
export const GetSolanaAccount200 = SolanaAccount
export type GetSolanaAccount400 = Error
export const GetSolanaAccount400 = Error
export type GetSolanaAccount404 = Error
export const GetSolanaAccount404 = Error
export type GetSolanaAccount500 = Error
export const GetSolanaAccount500 = Error
export type GetSolanaAccount502 = Error
export const GetSolanaAccount502 = Error
export type GetSolanaAccount503 = Error
export const GetSolanaAccount503 = Error
export type UpdateSolanaAccountParams = { readonly "X-Idempotency-Key"?: string }
export const UpdateSolanaAccountParams = Schema.Struct({
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type UpdateSolanaAccountRequestJson = { readonly name?: string; readonly accountPolicy?: string }
export const UpdateSolanaAccountRequestJson = Schema.Struct({
  name: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "An optional name for the account. Account names can consist of alphanumeric characters and hyphens, and be between 2 and 36 characters long.\nAccount names must be unique across all Solana accounts in the developer's CDP Project.",
    }).check(Schema.isPattern(new RegExp("^[A-Za-z0-9][A-Za-z0-9-]{0,34}[A-Za-z0-9]$"))),
  ),
  accountPolicy: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "The ID of the account-level policy to apply to the account, or an empty string to unset attached policy.",
    }).check(
      Schema.isPattern(
        new RegExp("(^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$)|(^$)"),
      ),
    ),
  ),
})
export type UpdateSolanaAccount200 = SolanaAccount
export const UpdateSolanaAccount200 = SolanaAccount
export type UpdateSolanaAccount400 = Error
export const UpdateSolanaAccount400 = Error
export type UpdateSolanaAccount404 = Error
export const UpdateSolanaAccount404 = Error
export type UpdateSolanaAccount409 = Error
export const UpdateSolanaAccount409 = Error
export type UpdateSolanaAccount422 = Error
export const UpdateSolanaAccount422 = Error
export type UpdateSolanaAccount500 = Error
export const UpdateSolanaAccount500 = Error
export type UpdateSolanaAccount502 = Error
export const UpdateSolanaAccount502 = Error
export type UpdateSolanaAccount503 = Error
export const UpdateSolanaAccount503 = Error
export type GetSolanaAccountByName200 = SolanaAccount
export const GetSolanaAccountByName200 = SolanaAccount
export type GetSolanaAccountByName400 = Error
export const GetSolanaAccountByName400 = Error
export type GetSolanaAccountByName404 = Error
export const GetSolanaAccountByName404 = Error
export type GetSolanaAccountByName500 = Error
export const GetSolanaAccountByName500 = Error
export type GetSolanaAccountByName502 = Error
export const GetSolanaAccountByName502 = Error
export type GetSolanaAccountByName503 = Error
export const GetSolanaAccountByName503 = Error
export type ImportSolanaAccountParams = { readonly "X-Wallet-Auth": string; readonly "X-Idempotency-Key"?: string }
export const ImportSolanaAccountParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type ImportSolanaAccountRequestJson = { readonly encryptedPrivateKey: string; readonly name?: string }
export const ImportSolanaAccountRequestJson = Schema.Struct({
  encryptedPrivateKey: Schema.String.annotate({
    description:
      "The base64-encoded, encrypted 32-byte private key of the Solana account. The private key must be encrypted using the CDP SDK's encryption scheme.",
  }),
  name: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "An optional name for the account.\nAccount names can consist of alphanumeric characters and hyphens, and be between 2 and 36 characters long.\nAccount names must be unique across all EVM accounts in the developer's CDP Project.",
    }).check(Schema.isPattern(new RegExp("^[A-Za-z0-9][A-Za-z0-9-]{0,34}[A-Za-z0-9]$"))),
  ),
})
export type ImportSolanaAccount201 = SolanaAccount
export const ImportSolanaAccount201 = SolanaAccount
export type ImportSolanaAccount400 = Error
export const ImportSolanaAccount400 = Error
export type ImportSolanaAccount401 = Error
export const ImportSolanaAccount401 = Error
export type ImportSolanaAccount402 = Error
export const ImportSolanaAccount402 = Error
export type ImportSolanaAccount409 = Error
export const ImportSolanaAccount409 = Error
export type ImportSolanaAccount422 = Error
export const ImportSolanaAccount422 = Error
export type ImportSolanaAccount500 = Error
export const ImportSolanaAccount500 = Error
export type ImportSolanaAccount502 = Error
export const ImportSolanaAccount502 = Error
export type ImportSolanaAccount503 = Error
export const ImportSolanaAccount503 = Error
export type ExportSolanaAccountParams = { readonly "X-Wallet-Auth": string; readonly "X-Idempotency-Key"?: string }
export const ExportSolanaAccountParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type ExportSolanaAccountRequestJson = { readonly exportEncryptionKey: string }
export const ExportSolanaAccountRequestJson = Schema.Struct({
  exportEncryptionKey: Schema.String.annotate({
    description:
      "The base64-encoded, public part of the RSA key in DER format used to encrypt the account private key.",
  }),
})
export type ExportSolanaAccount200 = { readonly encryptedPrivateKey: string }
export const ExportSolanaAccount200 = Schema.Struct({
  encryptedPrivateKey: Schema.String.annotate({
    description:
      "The base64-encoded, encrypted private key of the Solana account which is a 32 byte raw private key. The private key is encrypted in transport using the exportEncryptionKey in the request.",
  }),
})
export type ExportSolanaAccount400 = Error
export const ExportSolanaAccount400 = Error
export type ExportSolanaAccount401 = Error
export const ExportSolanaAccount401 = Error
export type ExportSolanaAccount402 = Error
export const ExportSolanaAccount402 = Error
export type ExportSolanaAccount404 = Error
export const ExportSolanaAccount404 = Error
export type ExportSolanaAccount422 = Error
export const ExportSolanaAccount422 = Error
export type ExportSolanaAccount500 = Error
export const ExportSolanaAccount500 = Error
export type ExportSolanaAccount502 = Error
export const ExportSolanaAccount502 = Error
export type ExportSolanaAccount503 = Error
export const ExportSolanaAccount503 = Error
export type ExportSolanaAccountByNameParams = {
  readonly "X-Wallet-Auth": string
  readonly "X-Idempotency-Key"?: string
}
export const ExportSolanaAccountByNameParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type ExportSolanaAccountByNameRequestJson = { readonly exportEncryptionKey: string }
export const ExportSolanaAccountByNameRequestJson = Schema.Struct({
  exportEncryptionKey: Schema.String.annotate({
    description:
      "The base64-encoded, public part of the RSA key in DER format used to encrypt the account private key.",
  }),
})
export type ExportSolanaAccountByName200 = { readonly encryptedPrivateKey: string }
export const ExportSolanaAccountByName200 = Schema.Struct({
  encryptedPrivateKey: Schema.String.annotate({
    description:
      "The base64-encoded, encrypted private key of the Solana account which is a 32 byte raw private key. The private key is encrypted in transport using the exportEncryptionKey in the request.",
  }),
})
export type ExportSolanaAccountByName400 = Error
export const ExportSolanaAccountByName400 = Error
export type ExportSolanaAccountByName401 = Error
export const ExportSolanaAccountByName401 = Error
export type ExportSolanaAccountByName402 = Error
export const ExportSolanaAccountByName402 = Error
export type ExportSolanaAccountByName404 = Error
export const ExportSolanaAccountByName404 = Error
export type ExportSolanaAccountByName422 = Error
export const ExportSolanaAccountByName422 = Error
export type ExportSolanaAccountByName500 = Error
export const ExportSolanaAccountByName500 = Error
export type ExportSolanaAccountByName502 = Error
export const ExportSolanaAccountByName502 = Error
export type ExportSolanaAccountByName503 = Error
export const ExportSolanaAccountByName503 = Error
export type SignSolanaTransactionParams = { readonly "X-Wallet-Auth": string; readonly "X-Idempotency-Key"?: string }
export const SignSolanaTransactionParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type SignSolanaTransactionRequestJson = { readonly transaction: string }
export const SignSolanaTransactionRequestJson = Schema.Struct({
  transaction: Schema.String.annotate({ description: "The base64 encoded transaction to sign." }),
})
export type SignSolanaTransaction200 = { readonly signedTransaction: string }
export const SignSolanaTransaction200 = Schema.Struct({
  signedTransaction: Schema.String.annotate({ description: "The base64 encoded signed transaction." }),
})
export type SignSolanaTransaction400 = Error
export const SignSolanaTransaction400 = Error
export type SignSolanaTransaction401 = Error
export const SignSolanaTransaction401 = Error
export type SignSolanaTransaction402 = Error
export const SignSolanaTransaction402 = Error
export type SignSolanaTransaction403 = Error
export const SignSolanaTransaction403 = Error
export type SignSolanaTransaction404 = Error
export const SignSolanaTransaction404 = Error
export type SignSolanaTransaction409 = Error
export const SignSolanaTransaction409 = Error
export type SignSolanaTransaction422 = Error
export const SignSolanaTransaction422 = Error
export type SignSolanaTransaction500 = Error
export const SignSolanaTransaction500 = Error
export type SignSolanaTransaction502 = Error
export const SignSolanaTransaction502 = Error
export type SignSolanaTransaction503 = Error
export const SignSolanaTransaction503 = Error
export type SignSolanaMessageParams = { readonly "X-Wallet-Auth": string; readonly "X-Idempotency-Key"?: string }
export const SignSolanaMessageParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type SignSolanaMessageRequestJson = { readonly message: string }
export const SignSolanaMessageRequestJson = Schema.Struct({
  message: Schema.String.annotate({ description: "The arbitrary message to sign." }),
})
export type SignSolanaMessage200 = { readonly signature: string }
export const SignSolanaMessage200 = Schema.Struct({
  signature: Schema.String.annotate({ description: "The signature of the message, as a base58 encoded string." }),
})
export type SignSolanaMessage400 = Error
export const SignSolanaMessage400 = Error
export type SignSolanaMessage401 = Error
export const SignSolanaMessage401 = Error
export type SignSolanaMessage402 = Error
export const SignSolanaMessage402 = Error
export type SignSolanaMessage404 = Error
export const SignSolanaMessage404 = Error
export type SignSolanaMessage409 = Error
export const SignSolanaMessage409 = Error
export type SignSolanaMessage422 = Error
export const SignSolanaMessage422 = Error
export type SignSolanaMessage500 = Error
export const SignSolanaMessage500 = Error
export type SignSolanaMessage502 = Error
export const SignSolanaMessage502 = Error
export type SignSolanaMessage503 = Error
export const SignSolanaMessage503 = Error
export type SendSolanaTransactionParams = { readonly "X-Wallet-Auth": string; readonly "X-Idempotency-Key"?: string }
export const SendSolanaTransactionParams = Schema.Struct({
  "X-Wallet-Auth": Schema.String,
  "X-Idempotency-Key": Schema.optionalKey(Schema.String.check(Schema.isMinLength(1)).check(Schema.isMaxLength(128))),
})
export type SendSolanaTransactionRequestJson = {
  readonly network: "solana" | "solana-devnet"
  readonly transaction: string
  readonly useCdpSponsor?: boolean
}
export const SendSolanaTransactionRequestJson = Schema.Struct({
  network: Schema.Literals(["solana", "solana-devnet"]).annotate({
    description: "The Solana network to send the transaction to.",
  }),
  transaction: Schema.String.annotate({
    description:
      "The base64 encoded transaction to sign and send. This transaction can contain multiple instructions for native Solana batching.",
  }),
  useCdpSponsor: Schema.optionalKey(
    Schema.Boolean.annotate({
      description:
        "Whether transaction fees should be sponsored by CDP. When true, CDP sponsors the transaction fees on behalf of the server wallet. When false, the server wallet is responsible for paying the transaction fees.",
    }),
  ),
})
export type SendSolanaTransaction200 = { readonly transactionSignature: string }
export const SendSolanaTransaction200 = Schema.Struct({
  transactionSignature: Schema.String.annotate({ description: "The base58 encoded transaction signature." }),
})
export type SendSolanaTransaction400 = Error
export const SendSolanaTransaction400 = Error
export type SendSolanaTransaction401 = Error
export const SendSolanaTransaction401 = Error
export type SendSolanaTransaction402 = Error
export const SendSolanaTransaction402 = Error
export type SendSolanaTransaction403 = Error
export const SendSolanaTransaction403 = Error
export type SendSolanaTransaction404 = Error
export const SendSolanaTransaction404 = Error
export type SendSolanaTransaction422 = Error
export const SendSolanaTransaction422 = Error
export type SendSolanaTransaction500 = Error
export const SendSolanaTransaction500 = Error
export type SendSolanaTransaction502 = Error
export const SendSolanaTransaction502 = Error
export type SendSolanaTransaction503 = Error
export const SendSolanaTransaction503 = Error
export type RequestSolanaFaucetRequestJson = { readonly address: string; readonly token: "sol" | "usdc" | "cbtusd" }
export const RequestSolanaFaucetRequestJson = Schema.Struct({
  address: Schema.String.annotate({
    description: "The address to request funds to, which is a base58-encoded string.",
  }).check(Schema.isPattern(new RegExp("^[1-9A-HJ-NP-Za-km-z]{32,44}$"))),
  token: Schema.Literals(["sol", "usdc", "cbtusd"]).annotate({ description: "The token to request funds for." }),
})
export type RequestSolanaFaucet200 = { readonly transactionSignature: string }
export const RequestSolanaFaucet200 = Schema.Struct({
  transactionSignature: Schema.String.annotate({
    description: "The signature identifying the transaction that requested the funds.",
  }),
})
export type RequestSolanaFaucet400 = Error
export const RequestSolanaFaucet400 = Error
export type RequestSolanaFaucet403 = Error
export const RequestSolanaFaucet403 = Error
export type RequestSolanaFaucet429 = Error
export const RequestSolanaFaucet429 = Error
export type RequestSolanaFaucet500 = Error
export const RequestSolanaFaucet500 = Error
export type RequestSolanaFaucet502 = Error
export const RequestSolanaFaucet502 = Error
export type RequestSolanaFaucet503 = Error
export const RequestSolanaFaucet503 = Error
export type ListSolanaTokenBalancesParams = { readonly pageSize?: number; readonly pageToken?: string }
export const ListSolanaTokenBalancesParams = Schema.Struct({
  pageSize: Schema.optionalKey(Schema.Number.annotate({ default: 20 }).check(Schema.isInt())),
  pageToken: Schema.optionalKey(Schema.String),
})
export type ListSolanaTokenBalances200 = {
  readonly balances: ReadonlyArray<SolanaTokenBalance>
  readonly nextPageToken?: string
}
export const ListSolanaTokenBalances200 = Schema.Struct({
  balances: Schema.Array(SolanaTokenBalance).annotate({ description: "The list of Solana token balances." }),
  nextPageToken: Schema.optionalKey(
    Schema.String.annotate({ description: "The token for the next page of items, if any." }),
  ),
})
export type ListSolanaTokenBalances400 = Error
export const ListSolanaTokenBalances400 = Error
export type ListSolanaTokenBalances404 = Error
export const ListSolanaTokenBalances404 = Error
export type ListSolanaTokenBalances500 = Error
export const ListSolanaTokenBalances500 = Error
export type ListSolanaTokenBalances502 = Error
export const ListSolanaTokenBalances502 = Error
export type ListSolanaTokenBalances503 = Error
export const ListSolanaTokenBalances503 = Error
export type RunSQLQueryRequestJson = OnchainDataQuery
export const RunSQLQueryRequestJson = OnchainDataQuery
export type RunSQLQuery200 = OnchainDataResult
export const RunSQLQuery200 = OnchainDataResult
export type RunSQLQuery400 = Error
export const RunSQLQuery400 = Error
export type RunSQLQuery401 = Error
export const RunSQLQuery401 = Error
export type RunSQLQuery402 = Error
export const RunSQLQuery402 = Error
export type RunSQLQuery408 = Error
export const RunSQLQuery408 = Error
export type RunSQLQuery429 = Error
export const RunSQLQuery429 = Error
export type RunSQLQuery499 = Error
export const RunSQLQuery499 = Error
export type RunSQLQuery500 = Error
export const RunSQLQuery500 = Error
export type RunSQLQuery504 = Error
export const RunSQLQuery504 = Error
export type GetSQLGrammar200 = string
export const GetSQLGrammar200 = Schema.String.annotate({ description: "The ANTLR4 grammar for the SQL API." })
export type GetSQLGrammar401 = Error
export const GetSQLGrammar401 = Error
export type GetSQLGrammar429 = Error
export const GetSQLGrammar429 = Error
export type GetSQLGrammar500 = Error
export const GetSQLGrammar500 = Error
export type GetSQLGrammar504 = Error
export const GetSQLGrammar504 = Error
export type GetSQLSchemaParams = { readonly database?: "base" | "base_sepolia"; readonly table?: string }
export const GetSQLSchemaParams = Schema.Struct({
  database: Schema.optionalKey(Schema.Literals(["base", "base_sepolia"]).annotate({ default: "base" })),
  table: Schema.optionalKey(Schema.String),
})
export type GetSQLSchema200 = OnchainDataSchemaResponse
export const GetSQLSchema200 = OnchainDataSchemaResponse
export type GetSQLSchema401 = Error
export const GetSQLSchema401 = Error
export type GetSQLSchema500 = Error
export const GetSQLSchema500 = Error
export type ListTokensForAccount200 = AccountTokenAddressesResponse
export const ListTokensForAccount200 = AccountTokenAddressesResponse
export type ListTokensForAccount400 = Error
export const ListTokensForAccount400 = Error
export type ListTokensForAccount401 = Error
export const ListTokensForAccount401 = Error
export type ListTokensForAccount429 = Error
export const ListTokensForAccount429 = Error
export type ListTokensForAccount500 = Error
export const ListTokensForAccount500 = Error
export type ListDataTokenBalancesParams = { readonly pageSize?: number; readonly pageToken?: string }
export const ListDataTokenBalancesParams = Schema.Struct({
  pageSize: Schema.optionalKey(Schema.Number.annotate({ default: 20 }).check(Schema.isInt())),
  pageToken: Schema.optionalKey(Schema.String),
})
export type ListDataTokenBalances200 = {
  readonly balances: ReadonlyArray<TokenBalance>
  readonly nextPageToken?: string
}
export const ListDataTokenBalances200 = Schema.Struct({
  balances: Schema.Array(TokenBalance).annotate({ description: "The list of EVM token balances." }),
  nextPageToken: Schema.optionalKey(
    Schema.String.annotate({ description: "The token for the next page of items, if any." }),
  ),
})
export type ListDataTokenBalances400 = Error
export const ListDataTokenBalances400 = Error
export type ListDataTokenBalances404 = Error
export const ListDataTokenBalances404 = Error
export type ListDataTokenBalances500 = Error
export const ListDataTokenBalances500 = Error
export type ListDataTokenBalances502 = Error
export const ListDataTokenBalances502 = Error
export type ListDataTokenBalances503 = Error
export const ListDataTokenBalances503 = Error
export type ListWebhookSubscriptionsParams = { readonly pageSize?: number; readonly pageToken?: string }
export const ListWebhookSubscriptionsParams = Schema.Struct({
  pageSize: Schema.optionalKey(
    Schema.Number.annotate({ default: 20 })
      .check(Schema.isInt())
      .check(Schema.isGreaterThanOrEqualTo(1))
      .check(Schema.isLessThanOrEqualTo(100)),
  ),
  pageToken: Schema.optionalKey(Schema.String),
})
export type ListWebhookSubscriptions200 = WebhookSubscriptionListResponse
export const ListWebhookSubscriptions200 = WebhookSubscriptionListResponse
export type ListWebhookSubscriptions400 = Error
export const ListWebhookSubscriptions400 = Error
export type ListWebhookSubscriptions401 = Error
export const ListWebhookSubscriptions401 = Error
export type ListWebhookSubscriptions429 = Error
export const ListWebhookSubscriptions429 = Error
export type ListWebhookSubscriptions500 = Error
export const ListWebhookSubscriptions500 = Error
export type CreateWebhookSubscriptionRequestJson = WebhookSubscriptionRequest
export const CreateWebhookSubscriptionRequestJson = WebhookSubscriptionRequest
export type CreateWebhookSubscription201 = WebhookSubscriptionResponse
export const CreateWebhookSubscription201 = WebhookSubscriptionResponse
export type CreateWebhookSubscription400 = Error
export const CreateWebhookSubscription400 = Error
export type CreateWebhookSubscription401 = Error
export const CreateWebhookSubscription401 = Error
export type CreateWebhookSubscription429 = Error
export const CreateWebhookSubscription429 = Error
export type CreateWebhookSubscription500 = Error
export const CreateWebhookSubscription500 = Error
export type GetWebhookSubscription200 = WebhookSubscriptionResponse
export const GetWebhookSubscription200 = WebhookSubscriptionResponse
export type GetWebhookSubscription401 = Error
export const GetWebhookSubscription401 = Error
export type GetWebhookSubscription404 = Error
export const GetWebhookSubscription404 = Error
export type GetWebhookSubscription429 = Error
export const GetWebhookSubscription429 = Error
export type GetWebhookSubscription500 = Error
export const GetWebhookSubscription500 = Error
export type UpdateWebhookSubscriptionRequestJson = WebhookSubscriptionUpdateRequest
export const UpdateWebhookSubscriptionRequestJson = WebhookSubscriptionUpdateRequest
export type UpdateWebhookSubscription200 = WebhookSubscriptionResponse
export const UpdateWebhookSubscription200 = WebhookSubscriptionResponse
export type UpdateWebhookSubscription400 = Error
export const UpdateWebhookSubscription400 = Error
export type UpdateWebhookSubscription401 = Error
export const UpdateWebhookSubscription401 = Error
export type UpdateWebhookSubscription404 = Error
export const UpdateWebhookSubscription404 = Error
export type UpdateWebhookSubscription429 = Error
export const UpdateWebhookSubscription429 = Error
export type UpdateWebhookSubscription500 = Error
export const UpdateWebhookSubscription500 = Error
export type DeleteWebhookSubscription401 = Error
export const DeleteWebhookSubscription401 = Error
export type DeleteWebhookSubscription404 = Error
export const DeleteWebhookSubscription404 = Error
export type DeleteWebhookSubscription429 = Error
export const DeleteWebhookSubscription429 = Error
export type DeleteWebhookSubscription500 = Error
export const DeleteWebhookSubscription500 = Error
export type ListWebhookSubscriptionEventsParams = {
  readonly eventId?: string
  readonly minCreatedAt?: string
  readonly maxCreatedAt?: string
  readonly eventTypeNames?: string
}
export const ListWebhookSubscriptionEventsParams = Schema.Struct({
  eventId: Schema.optionalKey(Schema.String.annotate({ format: "uuid" })),
  minCreatedAt: Schema.optionalKey(Schema.String.annotate({ format: "date-time" })),
  maxCreatedAt: Schema.optionalKey(Schema.String.annotate({ format: "date-time" })),
  eventTypeNames: Schema.optionalKey(Schema.String),
})
export type ListWebhookSubscriptionEvents200 = WebhookEventListResponse
export const ListWebhookSubscriptionEvents200 = WebhookEventListResponse
export type ListWebhookSubscriptionEvents400 = Error
export const ListWebhookSubscriptionEvents400 = Error
export type ListWebhookSubscriptionEvents401 = Error
export const ListWebhookSubscriptionEvents401 = Error
export type ListWebhookSubscriptionEvents404 = Error
export const ListWebhookSubscriptionEvents404 = Error
export type ListWebhookSubscriptionEvents429 = Error
export const ListWebhookSubscriptionEvents429 = Error
export type ListWebhookSubscriptionEvents500 = Error
export const ListWebhookSubscriptionEvents500 = Error
export type VerifyX402PaymentRequestJson = {
  readonly x402Version: X402Version
  readonly paymentPayload: X402PaymentPayload
  readonly paymentRequirements: X402PaymentRequirements
}
export const VerifyX402PaymentRequestJson = Schema.Struct({
  x402Version: X402Version,
  paymentPayload: X402PaymentPayload,
  paymentRequirements: X402PaymentRequirements,
})
export type VerifyX402Payment200 = {
  readonly isValid: boolean
  readonly invalidReason?: X402VerifyInvalidReason
  readonly invalidMessage?: string
  readonly payer: string
  readonly extra?: { readonly [x: string]: unknown }
}
export const VerifyX402Payment200 = Schema.Struct({
  isValid: Schema.Boolean.annotate({ description: "Indicates whether the payment is valid." }),
  invalidReason: Schema.optionalKey(X402VerifyInvalidReason),
  invalidMessage: Schema.optionalKey(
    Schema.String.annotate({ description: "The message describing the invalid reason." }),
  ),
  payer: Schema.String.annotate({
    description: "A blockchain address. Format varies by network (e.g., 0x-prefixed for EVM, base58 for Solana).",
  })
    .check(Schema.isMinLength(1))
    .check(Schema.isMaxLength(128)),
  extra: Schema.optionalKey(
    Schema.Record(Schema.String, Schema.Unknown).annotate({
      description: "Optional scheme-specific verify metadata returned by the facilitator.",
    }),
  ),
})
export type VerifyX402Payment400 = X402VerifyPaymentRejection
export const VerifyX402Payment400 = X402VerifyPaymentRejection
export type VerifyX402Payment500 = Error
export const VerifyX402Payment500 = Error
export type VerifyX402Payment502 = Error
export const VerifyX402Payment502 = Error
export type VerifyX402Payment503 = Error
export const VerifyX402Payment503 = Error
export type SettleX402PaymentRequestJson = {
  readonly x402Version: X402Version
  readonly paymentPayload: X402PaymentPayload
  readonly paymentRequirements: X402PaymentRequirements
}
export const SettleX402PaymentRequestJson = Schema.Struct({
  x402Version: X402Version,
  paymentPayload: X402PaymentPayload,
  paymentRequirements: X402PaymentRequirements,
})
export type SettleX402Payment200 = {
  readonly success: boolean
  readonly errorReason?: X402SettleErrorReason
  readonly errorMessage?: string
  readonly payer: string
  readonly transaction: string
  readonly network: string
  readonly amount?: string
  readonly extra?: { readonly [x: string]: unknown }
}
export const SettleX402Payment200 = Schema.Struct({
  success: Schema.Boolean.annotate({ description: "Indicates whether the payment settlement is successful." }),
  errorReason: Schema.optionalKey(X402SettleErrorReason),
  errorMessage: Schema.optionalKey(Schema.String.annotate({ description: "The message describing the error reason." })),
  payer: Schema.String.annotate({
    description: "A blockchain address. Format varies by network (e.g., 0x-prefixed for EVM, base58 for Solana).",
  })
    .check(Schema.isMinLength(1))
    .check(Schema.isMaxLength(128)),
  transaction: Schema.String.annotate({
    description:
      "The transaction of the settlement.\nFor EVM networks, the transaction will be a 0x-prefixed, EVM transaction hash.\nFor Solana-based networks, the transaction will be a base58-encoded Solana signature.",
  }).check(Schema.isPattern(new RegExp("^(0x[a-fA-F0-9]{64}|[1-9A-HJ-NP-Za-km-z]{87,88})$"))),
  network: Schema.String.annotate({ description: "The network where the settlement occurred." }),
  amount: Schema.optionalKey(Schema.String.annotate({ description: "The amount that was settled, in atomic units." })),
  extra: Schema.optionalKey(
    Schema.Record(Schema.String, Schema.Unknown).annotate({
      description: "Optional scheme-specific success metadata returned by the facilitator.",
    }),
  ),
})
export type SettleX402Payment400 = X402SettlePaymentRejection
export const SettleX402Payment400 = X402SettlePaymentRejection
export type SettleX402Payment402 = Error
export const SettleX402Payment402 = Error
export type SettleX402Payment500 = Error
export const SettleX402Payment500 = Error
export type SettleX402Payment502 = Error
export const SettleX402Payment502 = Error
export type SettleX402Payment503 = Error
export const SettleX402Payment503 = Error
export type SupportedX402PaymentKinds200 = {
  readonly kinds: ReadonlyArray<X402SupportedPaymentKind>
  readonly extensions: ReadonlyArray<string>
  readonly signers: { readonly [x: string]: ReadonlyArray<string> }
}
export const SupportedX402PaymentKinds200 = Schema.Struct({
  kinds: Schema.Array(X402SupportedPaymentKind).annotate({ description: "The list of supported payment kinds." }),
  extensions: Schema.Array(Schema.String).annotate({ description: "The list of supported x402 extensions." }),
  signers: Schema.Record(Schema.String, Schema.Array(Schema.String)).annotate({
    description: "A map of CAIP-2 network or protocol family patterns to their supported signer addresses.",
  }),
})
export type SupportedX402PaymentKinds500 = Error
export const SupportedX402PaymentKinds500 = Error
export type SupportedX402PaymentKinds502 = Error
export const SupportedX402PaymentKinds502 = Error
export type SupportedX402PaymentKinds503 = Error
export const SupportedX402PaymentKinds503 = Error
export type ListX402DiscoveryResourcesParams = {
  readonly type?: string
  readonly limit?: number
  readonly offset?: number
}
export const ListX402DiscoveryResourcesParams = Schema.Struct({
  type: Schema.optionalKey(Schema.String),
  limit: Schema.optionalKey(Schema.Number.annotate({ default: 100 }).check(Schema.isInt())),
  offset: Schema.optionalKey(Schema.Number.annotate({ default: 0 }).check(Schema.isInt())),
})
export type ListX402DiscoveryResources200 = X402DiscoveryResourcesResponse
export const ListX402DiscoveryResources200 = X402DiscoveryResourcesResponse
export type ListX402DiscoveryResources400 = Error
export const ListX402DiscoveryResources400 = Error
export type ListX402DiscoveryResources500 = Error
export const ListX402DiscoveryResources500 = Error
export type ListX402DiscoveryResources502 = Error
export const ListX402DiscoveryResources502 = Error
export type ListX402DiscoveryResources503 = Error
export const ListX402DiscoveryResources503 = Error
export type ListX402DiscoveryMerchantParams = {
  readonly payTo: BlockchainAddress
  readonly limit?: number
  readonly offset?: number
}
export const ListX402DiscoveryMerchantParams = Schema.Struct({
  payTo: BlockchainAddress,
  limit: Schema.optionalKey(Schema.Number.annotate({ default: 20 }).check(Schema.isInt())),
  offset: Schema.optionalKey(Schema.Number.annotate({ default: 0 }).check(Schema.isInt())),
})
export type ListX402DiscoveryMerchant200 = X402DiscoveryMerchantResponse
export const ListX402DiscoveryMerchant200 = X402DiscoveryMerchantResponse
export type ListX402DiscoveryMerchant400 = Error
export const ListX402DiscoveryMerchant400 = Error
export type ListX402DiscoveryMerchant404 = Error
export const ListX402DiscoveryMerchant404 = Error
export type ListX402DiscoveryMerchant500 = Error
export const ListX402DiscoveryMerchant500 = Error
export type ListX402DiscoveryMerchant502 = Error
export const ListX402DiscoveryMerchant502 = Error
export type ListX402DiscoveryMerchant503 = Error
export const ListX402DiscoveryMerchant503 = Error
export type SearchX402ResourcesParams = {
  readonly query?: string
  readonly network?: string
  readonly asset?: string
  readonly scheme?: string
  readonly payTo?: BlockchainAddress
  readonly urlSubstring?: string
  readonly maxUsdPrice?: string
  readonly extensions?: ReadonlyArray<string>
  readonly limit?: number
}
export const SearchX402ResourcesParams = Schema.Struct({
  query: Schema.optionalKey(Schema.String.check(Schema.isMaxLength(400))),
  network: Schema.optionalKey(Schema.String),
  asset: Schema.optionalKey(Schema.String),
  scheme: Schema.optionalKey(Schema.String),
  payTo: Schema.optionalKey(BlockchainAddress),
  urlSubstring: Schema.optionalKey(Schema.String.check(Schema.isMinLength(3)).check(Schema.isMaxLength(2048))),
  maxUsdPrice: Schema.optionalKey(Schema.String),
  extensions: Schema.optionalKey(Schema.Array(Schema.String)),
  limit: Schema.optionalKey(
    Schema.Number.annotate({ default: 20 })
      .check(Schema.isInt())
      .check(Schema.isGreaterThanOrEqualTo(1))
      .check(Schema.isLessThanOrEqualTo(20)),
  ),
})
export type SearchX402Resources200 = X402SearchResourcesResponse
export const SearchX402Resources200 = X402SearchResourcesResponse
export type SearchX402Resources400 = Error
export const SearchX402Resources400 = Error
export type SearchX402Resources500 = Error
export const SearchX402Resources500 = Error
export type SearchX402Resources502 = Error
export const SearchX402Resources502 = Error
export type SearchX402Resources503 = Error
export const SearchX402Resources503 = Error
export type PostX402DiscoveryMcpRequestJson = X402McpRequest
export const PostX402DiscoveryMcpRequestJson = X402McpRequest
export type PostX402DiscoveryMcp200 = X402McpResponse
export const PostX402DiscoveryMcp200 = X402McpResponse
export type PostX402DiscoveryMcp400 = Error
export const PostX402DiscoveryMcp400 = Error
export type PostX402DiscoveryMcp500 = Error
export const PostX402DiscoveryMcp500 = Error
export type CreateOnrampOrderRequestJson = {
  readonly agreementAcceptedAt: string
  readonly destinationAddress: string
  readonly destinationNetwork: string
  readonly email: string
  readonly isQuote?: boolean
  readonly partnerOrderRef?: string
  readonly partnerUserRef: string
  readonly paymentAmount?: string
  readonly paymentCurrency: string
  readonly paymentMethod: OnrampOrderPaymentMethodTypeId
  readonly phoneNumber: string
  readonly phoneNumberVerifiedAt: string
  readonly purchaseAmount?: string
  readonly purchaseCurrency: string
  readonly clientIp?: string
  readonly domain?: string
}
export const CreateOnrampOrderRequestJson = Schema.Struct({
  agreementAcceptedAt: Schema.String.annotate({
    description:
      "The timestamp of when the user acknowledged that by using Coinbase Onramp they are accepting the Coinbase Terms  (https://www.coinbase.com/legal/guest-checkout/us), User Agreement (https://www.coinbase.com/legal/user_agreement),  and Privacy Policy (https://www.coinbase.com/legal/privacy).",
    format: "date-time",
  }),
  destinationAddress: Schema.String.annotate({
    description: "A blockchain address. Format varies by network (e.g., 0x-prefixed for EVM, base58 for Solana).",
  })
    .check(Schema.isMinLength(1))
    .check(Schema.isMaxLength(128)),
  destinationNetwork: Schema.String.annotate({
    description:
      "The name of the crypto network the purchased currency will be sent on.\n\nUse the [Onramp Buy Options API](https://docs.cdp.coinbase.com/api-reference/rest-api/onramp-offramp/get-buy-options) to discover the supported networks for your user's location.",
  }),
  email: Schema.String.annotate({
    description:
      "The verified email address of the user requesting the onramp transaction. This email must be verified by your app (via OTP) before being used with the Onramp API.",
  }),
  isQuote: Schema.optionalKey(
    Schema.Boolean.annotate({
      description: "If true, this API will return a quote without creating any transaction.",
      default: false,
    }),
  ),
  partnerOrderRef: Schema.optionalKey(Schema.String.annotate({ description: "Optional partner order reference ID." })),
  partnerUserRef: Schema.String.annotate({
    description:
      'A unique string that represents the user in your app. This can be used to link individual transactions  together so you can retrieve the transaction history for your users. Prefix this string with “sandbox-”  (e.g. "sandbox-user-1234") to perform a sandbox transaction which will allow you to test your integration  without any real transfer of funds.\n\nThis value can be used with with [Onramp User Transactions API](https://docs.cdp.coinbase.com/api-reference/rest-api/onramp-offramp/get-onramp-transactions-by-id) to retrieve all transactions created by the user.',
  }),
  paymentAmount: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "A string representing the amount of fiat the user wishes to pay in exchange for crypto. When using  this parameter, the returned quote will be inclusive of fees i.e. the user will pay this exact amount  of the payment currency.",
    }),
  ),
  paymentCurrency: Schema.String.annotate({ description: "The fiat currency to be converted to crypto." }),
  paymentMethod: OnrampOrderPaymentMethodTypeId,
  phoneNumber: Schema.String.annotate({
    description:
      "The phone number of the user requesting the onramp transaction in E.164 format. This phone number must  be verified by your app (via OTP) before being used with the Onramp API.\n\nPlease refer to the [Onramp docs](https://docs.cdp.coinbase.com/onramp-&-offramp/onramp-apis/apple-pay-onramp-api) for more details on phone number verification requirements and best practices.",
  }),
  phoneNumberVerifiedAt: Schema.String.annotate({
    description:
      "Timestamp of when the user's phone number was verified via OTP. User phone number must be verified  every 60 days. If this timestamp is older than 60 days, an error will be returned.",
    format: "date-time",
  }),
  purchaseAmount: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "A string representing the amount of crypto the user wishes to purchase. When using this parameter the  returned quote will be exclusive of fees i.e. the user will receive this exact amount of the purchase  currency.",
    }),
  ),
  purchaseCurrency: Schema.String.annotate({
    description:
      "The ticker (e.g. `BTC`, `USDC`, `SOL`) or the Coinbase UUID (e.g. `d85dce9b-5b73-5c3c-8978-522ce1d1c1b4`)  of the crypto asset to be purchased.\n\nUse the [Onramp Buy Options API](https://docs.cdp.coinbase.com/api-reference/rest-api/onramp-offramp/get-buy-options) to discover the supported purchase currencies for your user's location.",
  }),
  clientIp: Schema.optionalKey(
    Schema.String.annotate({ description: "The IP address of the end user requesting the onramp transaction." }),
  ),
  domain: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "The domain that the Apple Pay button will be rendered on. Required when using the `GUEST_CHECKOUT_APPLE_PAY`  payment method and embedding the payment link in an iframe.",
    }),
  ),
})
export type CreateOnrampOrder201 = { readonly order: OnrampOrder; readonly paymentLink?: OnrampPaymentLink }
export const CreateOnrampOrder201 = Schema.Struct({
  order: OnrampOrder,
  paymentLink: Schema.optionalKey(OnrampPaymentLink),
})
export type CreateOnrampOrder400 = Error
export const CreateOnrampOrder400 = Error
export type CreateOnrampOrder401 = Error
export const CreateOnrampOrder401 = Error
export type CreateOnrampOrder429 = Error
export const CreateOnrampOrder429 = Error
export type CreateOnrampOrder500 = Error
export const CreateOnrampOrder500 = Error
export type GetOnrampOrderById200 = { readonly order: OnrampOrder }
export const GetOnrampOrderById200 = Schema.Struct({ order: OnrampOrder })
export type GetOnrampOrderById401 = Error
export const GetOnrampOrderById401 = Error
export type GetOnrampOrderById404 = Error
export const GetOnrampOrderById404 = Error
export type GetOnrampOrderById429 = Error
export const GetOnrampOrderById429 = Error
export type CreateOnrampSessionRequestJson = {
  readonly purchaseCurrency: string
  readonly destinationNetwork: string
  readonly destinationAddress: string
  readonly paymentAmount?: string
  readonly purchaseAmount?: string
  readonly paymentCurrency?: string
  readonly paymentMethod?: OnrampQuotePaymentMethodTypeId
  readonly country?: string
  readonly subdivision?: string
  readonly redirectUrl?: string
  readonly clientIp?: string
  readonly partnerUserRef?: string
}
export const CreateOnrampSessionRequestJson = Schema.Struct({
  purchaseCurrency: Schema.String.annotate({
    description:
      "The ticker (e.g. `BTC`, `USDC`, `SOL`) or the Coinbase UUID (e.g. `d85dce9b-5b73-5c3c-8978-522ce1d1c1b4`)  of the crypto asset to be purchased.\n\nUse the [Onramp Buy Options API](https://docs.cdp.coinbase.com/api-reference/rest-api/onramp-offramp/get-buy-options) to discover the supported purchase currencies for your user's location.",
  }),
  destinationNetwork: Schema.String.annotate({
    description:
      "The name of the crypto network the purchased currency will be sent on.\n\nUse the [Onramp Buy Options API](https://docs.cdp.coinbase.com/api-reference/rest-api/onramp-offramp/get-buy-options) to discover the supported networks for your user's location.",
  }),
  destinationAddress: Schema.String.annotate({
    description: "A blockchain address. Format varies by network (e.g., 0x-prefixed for EVM, base58 for Solana).",
  })
    .check(Schema.isMinLength(1))
    .check(Schema.isMaxLength(128)),
  paymentAmount: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "A string representing the amount of fiat the user wishes to pay in exchange for crypto. When using this parameter, the returned quote will be inclusive of fees i.e. the user  will pay this exact amount of the payment currency.",
    }),
  ),
  purchaseAmount: Schema.optionalKey(
    Schema.String.annotate({
      description:
        "A string representing the amount of crypto the user wishes to purchase. When using  this parameter, the returned quote will be exclusive of fees i.e. the user will  receive this exact amount of the purchase currency.",
    }),
  ),
  paymentCurrency: Schema.optionalKey(
    Schema.String.annotate({ description: "The fiat currency to be converted to crypto." }),
  ),
  paymentMethod: Schema.optionalKey(OnrampQuotePaymentMethodTypeId),
  country: Schema.optionalKey(
    Schema.String.annotate({ description: "The ISO 3166-1 two letter country code (e.g. US)." }),
  ),
  subdivision: Schema.optionalKey(
    Schema.String.annotate({ description: "The ISO 3166-2 two letter state code (e.g. NY). Only required for US." }),
  ),
  redirectUrl: Schema.optionalKey(
    Schema.String.annotate({ description: "A valid URI.", format: "uri" })
      .check(Schema.isMinLength(5))
      .check(Schema.isMaxLength(2048))
      .check(Schema.isPattern(new RegExp("^.*:\\/\\/.*$"))),
  ),
  clientIp: Schema.optionalKey(
    Schema.String.annotate({ description: "The IP address of the end user requesting the onramp transaction." }),
  ),
  partnerUserRef: Schema.optionalKey(
    Schema.String.annotate({
      description:
        'A unique string that represents the user in your app. This can be used to link individual transactions together so you can retrieve the transaction history for your users. Prefix this string with “sandbox-”  (e.g. "sandbox-user-1234") to perform a sandbox transaction which will allow you to test your integration  without any real transfer of funds.\n\nThis value can be used with with [Onramp User Transactions API](https://docs.cdp.coinbase.com/api-reference/rest-api/onramp-offramp/get-onramp-transactions-by-id) to retrieve all transactions created by the user.',
    }),
  ),
})
export type CreateOnrampSession201 = { readonly session: OnrampSession; readonly quote?: OnrampQuote }
export const CreateOnrampSession201 = Schema.Struct({ session: OnrampSession, quote: Schema.optionalKey(OnrampQuote) })
export type CreateOnrampSession400 = Error
export const CreateOnrampSession400 = Error
export type CreateOnrampSession401 = Error
export const CreateOnrampSession401 = Error
export type CreateOnrampSession429 = Error
export const CreateOnrampSession429 = Error
export type CreateOnrampSession500 = Error
export const CreateOnrampSession500 = Error
export type GetOnrampUserLimitsRequestJson = {
  readonly paymentMethodType: OnrampOrderPaymentMethodTypeId
  readonly userId: string
  readonly userIdType: OnrampUserIdType
}
export const GetOnrampUserLimitsRequestJson = Schema.Struct({
  paymentMethodType: OnrampOrderPaymentMethodTypeId,
  userId: Schema.String.annotate({
    description: "The user identifier value. For `phone_number` type, this must be in E.164 format.",
  }),
  userIdType: OnrampUserIdType,
})
export type GetOnrampUserLimits200 = { readonly limits: ReadonlyArray<OnrampUserLimit> }
export const GetOnrampUserLimits200 = Schema.Struct({
  limits: Schema.Array(OnrampUserLimit).annotate({ description: "The list of limits applicable to the user." }),
})
export type GetOnrampUserLimits400 = Error
export const GetOnrampUserLimits400 = Error
export type GetOnrampUserLimits401 = Error
export const GetOnrampUserLimits401 = Error
export type GetOnrampUserLimits429 = Error
export const GetOnrampUserLimits429 = Error
export type GetOnrampUserLimits500 = Error
export const GetOnrampUserLimits500 = Error
export type RequestLimitsUpgradeRequestJson = OnrampLimitUpgradeRequest
export const RequestLimitsUpgradeRequestJson = OnrampLimitUpgradeRequest
export type RequestLimitsUpgrade400 = Error
export const RequestLimitsUpgrade400 = Error
export type RequestLimitsUpgrade401 = Error
export const RequestLimitsUpgrade401 = Error
export type RequestLimitsUpgrade429 = Error
export const RequestLimitsUpgrade429 = Error
export type RequestLimitsUpgrade500 = Error
export const RequestLimitsUpgrade500 = Error
export type ListPaymentMethodsParams = { readonly pageSize?: number; readonly pageToken?: string }
export const ListPaymentMethodsParams = Schema.Struct({
  pageSize: Schema.optionalKey(Schema.Number.annotate({ default: 20 }).check(Schema.isInt())),
  pageToken: Schema.optionalKey(Schema.String),
})
export type ListPaymentMethods200 = {
  readonly paymentMethods: ReadonlyArray<Payment_methods_PaymentMethod>
  readonly nextPageToken?: string
}
export const ListPaymentMethods200 = Schema.Struct({
  paymentMethods: Schema.Array(Payment_methods_PaymentMethod).annotate({ description: "The list of payment methods." }),
  nextPageToken: Schema.optionalKey(
    Schema.String.annotate({ description: "The token for the next page of items, if any." }),
  ),
})
export type ListPaymentMethods400 = Error
export const ListPaymentMethods400 = Error
export type ListPaymentMethods401 = Error
export const ListPaymentMethods401 = Error
export type ListPaymentMethods500 = Error
export const ListPaymentMethods500 = Error
export type GetPaymentMethod200 = Payment_methods_PaymentMethod
export const GetPaymentMethod200 = Payment_methods_PaymentMethod
export type GetPaymentMethod400 = Error
export const GetPaymentMethod400 = Error
export type GetPaymentMethod401 = Error
export const GetPaymentMethod401 = Error
export type GetPaymentMethod404 = Error
export const GetPaymentMethod404 = Error
export type GetPaymentMethod500 = Error
export const GetPaymentMethod500 = Error

export interface OperationConfig {
  /**
   * Whether or not the response should be included in the value returned from
   * an operation.
   *
   * If set to `true`, a tuple of `[A, HttpClientResponse]` will be returned,
   * where `A` is the success type of the operation.
   *
   * If set to `false`, only the success type of the operation will be returned.
   */
  readonly includeResponse?: boolean | undefined
}

/**
 * A utility type which optionally includes the response in the return result
 * of an operation based upon the value of the `includeResponse` configuration
 * option.
 */
export type WithOptionalResponse<A, Config extends OperationConfig> = Config extends {
  readonly includeResponse: true
}
  ? [A, HttpClientResponse.HttpClientResponse]
  : A

export const make = (
  httpClient: HttpClient.HttpClient,
  options: {
    readonly transformClient?: ((client: HttpClient.HttpClient) => Effect.Effect<HttpClient.HttpClient>) | undefined
  } = {},
): CdpClient => {
  const unexpectedStatus = (response: HttpClientResponse.HttpClientResponse) =>
    Effect.flatMap(
      Effect.orElseSucceed(response.json, () => "Unexpected status code"),
      (description) =>
        Effect.fail(
          new HttpClientError.HttpClientError({
            reason: new HttpClientError.StatusCodeError({
              request: response.request,
              response,
              description: typeof description === "string" ? description : JSON.stringify(description),
            }),
          }),
        ),
    )
  const withResponse =
    <Config extends OperationConfig>(config: Config | undefined) =>
    (
      f: (response: HttpClientResponse.HttpClientResponse) => Effect.Effect<any, any>,
    ): ((request: HttpClientRequest.HttpClientRequest) => Effect.Effect<any, any>) => {
      const withOptionalResponse = (
        config?.includeResponse
          ? (response: HttpClientResponse.HttpClientResponse) => Effect.map(f(response), (a) => [a, response])
          : (response: HttpClientResponse.HttpClientResponse) => f(response)
      ) as any
      return options?.transformClient
        ? (request) =>
            Effect.flatMap(
              Effect.flatMap(options.transformClient!(httpClient), (client) => client.execute(request)),
              withOptionalResponse,
            )
        : (request) => Effect.flatMap(httpClient.execute(request), withOptionalResponse)
    }
  const decodeSuccess =
    <Schema extends Schema.Top>(schema: Schema) =>
    (response: HttpClientResponse.HttpClientResponse) =>
      HttpClientResponse.schemaBodyJson(schema)(response)
  const decodeError =
    <const Tag extends string, Schema extends Schema.Top>(tag: Tag, schema: Schema) =>
    (response: HttpClientResponse.HttpClientResponse) =>
      Effect.flatMap(HttpClientResponse.schemaBodyJson(schema)(response), (cause) =>
        Effect.fail(CdpClientError(tag, cause, response)),
      )
  return {
    httpClient,
    listFoundationAccounts: (options) =>
      HttpClientRequest.get(`/v2/accounts`).pipe(
        HttpClientRequest.setUrlParams({
          pageSize: options?.params?.["pageSize"] as any,
          pageToken: options?.params?.["pageToken"] as any,
          type: options?.params?.["type"] as any,
        }),
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ListFoundationAccounts200),
            "400": decodeError("ListFoundationAccounts400", ListFoundationAccounts400),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    createFoundationAccount: (options) =>
      HttpClientRequest.post(`/v2/accounts`).pipe(
        HttpClientRequest.setHeaders({ "X-Idempotency-Key": options.params?.["X-Idempotency-Key"] ?? undefined }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(CreateFoundationAccount200),
            "400": decodeError("CreateFoundationAccount400", CreateFoundationAccount400),
            "403": decodeError("CreateFoundationAccount403", CreateFoundationAccount403),
            "422": decodeError("CreateFoundationAccount422", CreateFoundationAccount422),
            "503": decodeError("CreateFoundationAccount503", CreateFoundationAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    getFoundationAccountById: (accountId, options) =>
      HttpClientRequest.get(`/v2/accounts/${accountId}`).pipe(
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(GetFoundationAccountById200),
            "400": decodeError("GetFoundationAccountById400", GetFoundationAccountById400),
            "404": decodeError("GetFoundationAccountById404", GetFoundationAccountById404),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    listBalances: (accountId, options) =>
      HttpClientRequest.get(`/v2/accounts/${accountId}/balances`).pipe(
        HttpClientRequest.setUrlParams({
          pageSize: options?.params?.["pageSize"] as any,
          pageToken: options?.params?.["pageToken"] as any,
        }),
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ListBalances200),
            "400": decodeError("ListBalances400", ListBalances400),
            "401": decodeError("ListBalances401", ListBalances401),
            "404": decodeError("ListBalances404", ListBalances404),
            "500": decodeError("ListBalances500", ListBalances500),
            "503": decodeError("ListBalances503", ListBalances503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    getBalanceByAsset: (accountId, asset, options) =>
      HttpClientRequest.get(`/v2/accounts/${accountId}/balances/${asset}`).pipe(
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(GetBalanceByAsset200),
            "400": decodeError("GetBalanceByAsset400", GetBalanceByAsset400),
            "401": decodeError("GetBalanceByAsset401", GetBalanceByAsset401),
            "404": decodeError("GetBalanceByAsset404", GetBalanceByAsset404),
            "500": decodeError("GetBalanceByAsset500", GetBalanceByAsset500),
            "503": decodeError("GetBalanceByAsset503", GetBalanceByAsset503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    listDepositDestinations: (options) =>
      HttpClientRequest.get(`/v2/deposit-destinations`).pipe(
        HttpClientRequest.setUrlParams({
          accountId: options?.params?.["accountId"] as any,
          address: options?.params?.["address"] as any,
          type: options?.params?.["type"] as any,
          network: options?.params?.["network"] as any,
          pageSize: options?.params?.["pageSize"] as any,
          pageToken: options?.params?.["pageToken"] as any,
        }),
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ListDepositDestinations200),
            "400": decodeError("ListDepositDestinations400", ListDepositDestinations400),
            "401": decodeError("ListDepositDestinations401", ListDepositDestinations401),
            "500": decodeError("ListDepositDestinations500", ListDepositDestinations500),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    createDepositDestination: (options) =>
      HttpClientRequest.post(`/v2/deposit-destinations`).pipe(
        HttpClientRequest.setHeaders({ "X-Idempotency-Key": options.params?.["X-Idempotency-Key"] ?? undefined }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(CreateDepositDestination201),
            "400": decodeError("CreateDepositDestination400", CreateDepositDestination400),
            "401": decodeError("CreateDepositDestination401", CreateDepositDestination401),
            "403": decodeError("CreateDepositDestination403", CreateDepositDestination403),
            "404": decodeError("CreateDepositDestination404", CreateDepositDestination404),
            "422": decodeError("CreateDepositDestination422", CreateDepositDestination422),
            "500": decodeError("CreateDepositDestination500", CreateDepositDestination500),
            "503": decodeError("CreateDepositDestination503", CreateDepositDestination503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    getDepositDestinationById: (depositDestinationId, options) =>
      HttpClientRequest.get(`/v2/deposit-destinations/${depositDestinationId}`).pipe(
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(GetDepositDestinationById200),
            "400": decodeError("GetDepositDestinationById400", GetDepositDestinationById400),
            "401": decodeError("GetDepositDestinationById401", GetDepositDestinationById401),
            "404": decodeError("GetDepositDestinationById404", GetDepositDestinationById404),
            "500": decodeError("GetDepositDestinationById500", GetDepositDestinationById500),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    listTransfers: (options) =>
      HttpClientRequest.get(`/v2/transfers`).pipe(
        HttpClientRequest.setUrlParams({
          status: options?.params?.["status"] as any,
          accountId: options?.params?.["accountId"] as any,
          sourceAccountId: options?.params?.["sourceAccountId"] as any,
          targetAccountId: options?.params?.["targetAccountId"] as any,
          createdAfter: options?.params?.["createdAfter"] as any,
          createdBefore: options?.params?.["createdBefore"] as any,
          updatedAfter: options?.params?.["updatedAfter"] as any,
          updatedBefore: options?.params?.["updatedBefore"] as any,
          sourceAsset: options?.params?.["sourceAsset"] as any,
          targetAsset: options?.params?.["targetAsset"] as any,
          sourceAddress: options?.params?.["sourceAddress"] as any,
          targetAddress: options?.params?.["targetAddress"] as any,
          targetEmail: options?.params?.["targetEmail"] as any,
          transferId: options?.params?.["transferId"] as any,
          pageSize: options?.params?.["pageSize"] as any,
          pageToken: options?.params?.["pageToken"] as any,
        }),
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ListTransfers200),
            "400": decodeError("ListTransfers400", ListTransfers400),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    createTransfer: (options) =>
      HttpClientRequest.post(`/v2/transfers`).pipe(
        HttpClientRequest.setHeaders({ "X-Idempotency-Key": options.params?.["X-Idempotency-Key"] ?? undefined }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(CreateTransfer200),
            "400": decodeError("CreateTransfer400", CreateTransfer400),
            "403": decodeError("CreateTransfer403", CreateTransfer403),
            "422": decodeError("CreateTransfer422", CreateTransfer422),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    getTransferById: (transferId, options) =>
      HttpClientRequest.get(`/v2/transfers/${transferId}`).pipe(
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(GetTransferById200),
            "404": decodeError("GetTransferById404", GetTransferById404),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    executeFundTransfer: (transferId, options) =>
      HttpClientRequest.post(`/v2/transfers/${transferId}/execute`).pipe(
        HttpClientRequest.setHeaders({ "X-Idempotency-Key": options?.params?.["X-Idempotency-Key"] ?? undefined }),
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ExecuteFundTransfer200),
            "400": decodeError("ExecuteFundTransfer400", ExecuteFundTransfer400),
            "401": decodeError("ExecuteFundTransfer401", ExecuteFundTransfer401),
            "403": decodeError("ExecuteFundTransfer403", ExecuteFundTransfer403),
            "404": decodeError("ExecuteFundTransfer404", ExecuteFundTransfer404),
            "422": decodeError("ExecuteFundTransfer422", ExecuteFundTransfer422),
            "429": decodeError("ExecuteFundTransfer429", ExecuteFundTransfer429),
            "500": decodeError("ExecuteFundTransfer500", ExecuteFundTransfer500),
            "502": decodeError("ExecuteFundTransfer502", ExecuteFundTransfer502),
            "503": decodeError("ExecuteFundTransfer503", ExecuteFundTransfer503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    submitDepositTravelRule: (transferId, options) =>
      HttpClientRequest.post(`/v2/transfers/${transferId}/travel-rule`).pipe(
        HttpClientRequest.setHeaders({ "X-Idempotency-Key": options.params?.["X-Idempotency-Key"] ?? undefined }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SubmitDepositTravelRule200),
            "400": decodeError("SubmitDepositTravelRule400", SubmitDepositTravelRule400),
            "404": decodeError("SubmitDepositTravelRule404", SubmitDepositTravelRule404),
            "422": decodeError("SubmitDepositTravelRule422", SubmitDepositTravelRule422),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    listEndUsers: (options) =>
      HttpClientRequest.get(`/v2/end-users`).pipe(
        HttpClientRequest.setUrlParams({
          pageSize: options?.params?.["pageSize"] as any,
          pageToken: options?.params?.["pageToken"] as any,
          sort: options?.params?.["sort"] as any,
        }),
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ListEndUsers200),
            "400": decodeError("ListEndUsers400", ListEndUsers400),
            "401": decodeError("ListEndUsers401", ListEndUsers401),
            "500": decodeError("ListEndUsers500", ListEndUsers500),
            "502": decodeError("ListEndUsers502", ListEndUsers502),
            "503": decodeError("ListEndUsers503", ListEndUsers503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    createEndUser: (options) =>
      HttpClientRequest.post(`/v2/end-users`).pipe(
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(CreateEndUser201),
            "400": decodeError("CreateEndUser400", CreateEndUser400),
            "401": decodeError("CreateEndUser401", CreateEndUser401),
            "402": decodeError("CreateEndUser402", CreateEndUser402),
            "422": decodeError("CreateEndUser422", CreateEndUser422),
            "500": decodeError("CreateEndUser500", CreateEndUser500),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    validateEndUserAccessToken: (options) =>
      HttpClientRequest.post(`/v2/end-users/auth/validate-token`).pipe(
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ValidateEndUserAccessToken200),
            "400": decodeError("ValidateEndUserAccessToken400", ValidateEndUserAccessToken400),
            "401": decodeError("ValidateEndUserAccessToken401", ValidateEndUserAccessToken401),
            "404": decodeError("ValidateEndUserAccessToken404", ValidateEndUserAccessToken404),
            "500": decodeError("ValidateEndUserAccessToken500", ValidateEndUserAccessToken500),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    getEndUser: (userId, options) =>
      HttpClientRequest.get(`/v2/end-users/${userId}`).pipe(
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(GetEndUser200),
            "404": decodeError("GetEndUser404", GetEndUser404),
            "500": decodeError("GetEndUser500", GetEndUser500),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    lookupEndUser: (options) =>
      HttpClientRequest.get(`/v2/end-users/lookup`).pipe(
        HttpClientRequest.setUrlParams({
          email: options?.params?.["email"] as any,
          oauthProvider: options?.params?.["oauthProvider"] as any,
          oauthSubject: options?.params?.["oauthSubject"] as any,
          phoneNumber: options?.params?.["phoneNumber"] as any,
        }),
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(LookupEndUser200),
            "400": decodeError("LookupEndUser400", LookupEndUser400),
            "401": decodeError("LookupEndUser401", LookupEndUser401),
            "500": decodeError("LookupEndUser500", LookupEndUser500),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    addEndUserEvmAccount: (userId, options) =>
      HttpClientRequest.post(`/v2/end-users/${userId}/evm`).pipe(
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(AddEndUserEvmAccount201),
            "400": decodeError("AddEndUserEvmAccount400", AddEndUserEvmAccount400),
            "401": decodeError("AddEndUserEvmAccount401", AddEndUserEvmAccount401),
            "402": decodeError("AddEndUserEvmAccount402", AddEndUserEvmAccount402),
            "404": decodeError("AddEndUserEvmAccount404", AddEndUserEvmAccount404),
            "422": decodeError("AddEndUserEvmAccount422", AddEndUserEvmAccount422),
            "500": decodeError("AddEndUserEvmAccount500", AddEndUserEvmAccount500),
            "502": decodeError("AddEndUserEvmAccount502", AddEndUserEvmAccount502),
            "503": decodeError("AddEndUserEvmAccount503", AddEndUserEvmAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    addEndUserEvmSmartAccount: (userId, options) =>
      HttpClientRequest.post(`/v2/end-users/${userId}/evm-smart-account`).pipe(
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(AddEndUserEvmSmartAccount201),
            "400": decodeError("AddEndUserEvmSmartAccount400", AddEndUserEvmSmartAccount400),
            "401": decodeError("AddEndUserEvmSmartAccount401", AddEndUserEvmSmartAccount401),
            "402": decodeError("AddEndUserEvmSmartAccount402", AddEndUserEvmSmartAccount402),
            "404": decodeError("AddEndUserEvmSmartAccount404", AddEndUserEvmSmartAccount404),
            "422": decodeError("AddEndUserEvmSmartAccount422", AddEndUserEvmSmartAccount422),
            "500": decodeError("AddEndUserEvmSmartAccount500", AddEndUserEvmSmartAccount500),
            "502": decodeError("AddEndUserEvmSmartAccount502", AddEndUserEvmSmartAccount502),
            "503": decodeError("AddEndUserEvmSmartAccount503", AddEndUserEvmSmartAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    addEndUserSolanaAccount: (userId, options) =>
      HttpClientRequest.post(`/v2/end-users/${userId}/solana`).pipe(
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(AddEndUserSolanaAccount201),
            "400": decodeError("AddEndUserSolanaAccount400", AddEndUserSolanaAccount400),
            "401": decodeError("AddEndUserSolanaAccount401", AddEndUserSolanaAccount401),
            "402": decodeError("AddEndUserSolanaAccount402", AddEndUserSolanaAccount402),
            "404": decodeError("AddEndUserSolanaAccount404", AddEndUserSolanaAccount404),
            "422": decodeError("AddEndUserSolanaAccount422", AddEndUserSolanaAccount422),
            "500": decodeError("AddEndUserSolanaAccount500", AddEndUserSolanaAccount500),
            "502": decodeError("AddEndUserSolanaAccount502", AddEndUserSolanaAccount502),
            "503": decodeError("AddEndUserSolanaAccount503", AddEndUserSolanaAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    importEndUser: (options) =>
      HttpClientRequest.post(`/v2/end-users/import`).pipe(
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ImportEndUser201),
            "400": decodeError("ImportEndUser400", ImportEndUser400),
            "401": decodeError("ImportEndUser401", ImportEndUser401),
            "402": decodeError("ImportEndUser402", ImportEndUser402),
            "409": decodeError("ImportEndUser409", ImportEndUser409),
            "422": decodeError("ImportEndUser422", ImportEndUser422),
            "500": decodeError("ImportEndUser500", ImportEndUser500),
            "502": decodeError("ImportEndUser502", ImportEndUser502),
            "503": decodeError("ImportEndUser503", ImportEndUser503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    signEvmTransactionWithEndUserAccount: (userId, options) =>
      HttpClientRequest.post(`/v2/embedded-wallet-api/end-users/${userId}/evm/sign/transaction`).pipe(
        HttpClientRequest.setUrlParams({ projectID: options.params?.["projectID"] as any }),
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params?.["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params?.["X-Idempotency-Key"] ?? undefined,
          "X-Developer-Auth": options.params?.["X-Developer-Auth"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SignEvmTransactionWithEndUserAccount200),
            "400": decodeError("SignEvmTransactionWithEndUserAccount400", SignEvmTransactionWithEndUserAccount400),
            "401": decodeError("SignEvmTransactionWithEndUserAccount401", SignEvmTransactionWithEndUserAccount401),
            "402": decodeError("SignEvmTransactionWithEndUserAccount402", SignEvmTransactionWithEndUserAccount402),
            "403": decodeError("SignEvmTransactionWithEndUserAccount403", SignEvmTransactionWithEndUserAccount403),
            "404": decodeError("SignEvmTransactionWithEndUserAccount404", SignEvmTransactionWithEndUserAccount404),
            "409": decodeError("SignEvmTransactionWithEndUserAccount409", SignEvmTransactionWithEndUserAccount409),
            "422": decodeError("SignEvmTransactionWithEndUserAccount422", SignEvmTransactionWithEndUserAccount422),
            "500": decodeError("SignEvmTransactionWithEndUserAccount500", SignEvmTransactionWithEndUserAccount500),
            "502": decodeError("SignEvmTransactionWithEndUserAccount502", SignEvmTransactionWithEndUserAccount502),
            "503": decodeError("SignEvmTransactionWithEndUserAccount503", SignEvmTransactionWithEndUserAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    sendEvmTransactionWithEndUserAccount: (userId, options) =>
      HttpClientRequest.post(`/v2/embedded-wallet-api/end-users/${userId}/evm/send/transaction`).pipe(
        HttpClientRequest.setUrlParams({ projectID: options.params?.["projectID"] as any }),
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params?.["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params?.["X-Idempotency-Key"] ?? undefined,
          "X-Developer-Auth": options.params?.["X-Developer-Auth"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SendEvmTransactionWithEndUserAccount200),
            "400": decodeError("SendEvmTransactionWithEndUserAccount400", SendEvmTransactionWithEndUserAccount400),
            "401": decodeError("SendEvmTransactionWithEndUserAccount401", SendEvmTransactionWithEndUserAccount401),
            "402": decodeError("SendEvmTransactionWithEndUserAccount402", SendEvmTransactionWithEndUserAccount402),
            "403": decodeError("SendEvmTransactionWithEndUserAccount403", SendEvmTransactionWithEndUserAccount403),
            "404": decodeError("SendEvmTransactionWithEndUserAccount404", SendEvmTransactionWithEndUserAccount404),
            "409": decodeError("SendEvmTransactionWithEndUserAccount409", SendEvmTransactionWithEndUserAccount409),
            "422": decodeError("SendEvmTransactionWithEndUserAccount422", SendEvmTransactionWithEndUserAccount422),
            "500": decodeError("SendEvmTransactionWithEndUserAccount500", SendEvmTransactionWithEndUserAccount500),
            "502": decodeError("SendEvmTransactionWithEndUserAccount502", SendEvmTransactionWithEndUserAccount502),
            "503": decodeError("SendEvmTransactionWithEndUserAccount503", SendEvmTransactionWithEndUserAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    sendEvmAssetWithEndUserAccount: (userId, address, asset, options) =>
      HttpClientRequest.post(`/v2/embedded-wallet-api/end-users/${userId}/evm/${address}/send/${asset}`).pipe(
        HttpClientRequest.setUrlParams({ projectID: options.params?.["projectID"] as any }),
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params?.["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params?.["X-Idempotency-Key"] ?? undefined,
          "X-Developer-Auth": options.params?.["X-Developer-Auth"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SendEvmAssetWithEndUserAccount200),
            "400": decodeError("SendEvmAssetWithEndUserAccount400", SendEvmAssetWithEndUserAccount400),
            "401": decodeError("SendEvmAssetWithEndUserAccount401", SendEvmAssetWithEndUserAccount401),
            "402": decodeError("SendEvmAssetWithEndUserAccount402", SendEvmAssetWithEndUserAccount402),
            "403": decodeError("SendEvmAssetWithEndUserAccount403", SendEvmAssetWithEndUserAccount403),
            "404": decodeError("SendEvmAssetWithEndUserAccount404", SendEvmAssetWithEndUserAccount404),
            "422": decodeError("SendEvmAssetWithEndUserAccount422", SendEvmAssetWithEndUserAccount422),
            "500": decodeError("SendEvmAssetWithEndUserAccount500", SendEvmAssetWithEndUserAccount500),
            "502": decodeError("SendEvmAssetWithEndUserAccount502", SendEvmAssetWithEndUserAccount502),
            "503": decodeError("SendEvmAssetWithEndUserAccount503", SendEvmAssetWithEndUserAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    signEvmMessageWithEndUserAccount: (userId, options) =>
      HttpClientRequest.post(`/v2/embedded-wallet-api/end-users/${userId}/evm/sign/message`).pipe(
        HttpClientRequest.setUrlParams({ projectID: options.params?.["projectID"] as any }),
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params?.["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params?.["X-Idempotency-Key"] ?? undefined,
          "X-Developer-Auth": options.params?.["X-Developer-Auth"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SignEvmMessageWithEndUserAccount200),
            "401": decodeError("SignEvmMessageWithEndUserAccount401", SignEvmMessageWithEndUserAccount401),
            "402": decodeError("SignEvmMessageWithEndUserAccount402", SignEvmMessageWithEndUserAccount402),
            "403": decodeError("SignEvmMessageWithEndUserAccount403", SignEvmMessageWithEndUserAccount403),
            "404": decodeError("SignEvmMessageWithEndUserAccount404", SignEvmMessageWithEndUserAccount404),
            "409": decodeError("SignEvmMessageWithEndUserAccount409", SignEvmMessageWithEndUserAccount409),
            "422": decodeError("SignEvmMessageWithEndUserAccount422", SignEvmMessageWithEndUserAccount422),
            "500": decodeError("SignEvmMessageWithEndUserAccount500", SignEvmMessageWithEndUserAccount500),
            "502": decodeError("SignEvmMessageWithEndUserAccount502", SignEvmMessageWithEndUserAccount502),
            "503": decodeError("SignEvmMessageWithEndUserAccount503", SignEvmMessageWithEndUserAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    signEvmTypedDataWithEndUserAccount: (userId, options) =>
      HttpClientRequest.post(`/v2/embedded-wallet-api/end-users/${userId}/evm/sign/typed-data`).pipe(
        HttpClientRequest.setUrlParams({ projectID: options.params?.["projectID"] as any }),
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params?.["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params?.["X-Idempotency-Key"] ?? undefined,
          "X-Developer-Auth": options.params?.["X-Developer-Auth"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SignEvmTypedDataWithEndUserAccount200),
            "400": decodeError("SignEvmTypedDataWithEndUserAccount400", SignEvmTypedDataWithEndUserAccount400),
            "401": decodeError("SignEvmTypedDataWithEndUserAccount401", SignEvmTypedDataWithEndUserAccount401),
            "402": decodeError("SignEvmTypedDataWithEndUserAccount402", SignEvmTypedDataWithEndUserAccount402),
            "403": decodeError("SignEvmTypedDataWithEndUserAccount403", SignEvmTypedDataWithEndUserAccount403),
            "404": decodeError("SignEvmTypedDataWithEndUserAccount404", SignEvmTypedDataWithEndUserAccount404),
            "422": decodeError("SignEvmTypedDataWithEndUserAccount422", SignEvmTypedDataWithEndUserAccount422),
            "500": decodeError("SignEvmTypedDataWithEndUserAccount500", SignEvmTypedDataWithEndUserAccount500),
            "502": decodeError("SignEvmTypedDataWithEndUserAccount502", SignEvmTypedDataWithEndUserAccount502),
            "503": decodeError("SignEvmTypedDataWithEndUserAccount503", SignEvmTypedDataWithEndUserAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    getDelegationForEndUser: (userId, options) =>
      HttpClientRequest.get(`/v2/embedded-wallet-api/end-users/${userId}/delegation`).pipe(
        HttpClientRequest.setUrlParams({ projectID: options?.params?.["projectID"] as any }),
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(GetDelegationForEndUser200),
            "401": decodeError("GetDelegationForEndUser401", GetDelegationForEndUser401),
            "404": decodeError("GetDelegationForEndUser404", GetDelegationForEndUser404),
            "500": decodeError("GetDelegationForEndUser500", GetDelegationForEndUser500),
            "502": decodeError("GetDelegationForEndUser502", GetDelegationForEndUser502),
            "503": decodeError("GetDelegationForEndUser503", GetDelegationForEndUser503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    revokeDelegationForEndUser: (userId, options) =>
      HttpClientRequest.delete(`/v2/embedded-wallet-api/end-users/${userId}/delegation`).pipe(
        HttpClientRequest.setUrlParams({ projectID: options.params?.["projectID"] as any }),
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params?.["X-Wallet-Auth"] ?? undefined,
          "X-Developer-Auth": options.params?.["X-Developer-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params?.["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "401": decodeError("RevokeDelegationForEndUser401", RevokeDelegationForEndUser401),
            "404": decodeError("RevokeDelegationForEndUser404", RevokeDelegationForEndUser404),
            "500": decodeError("RevokeDelegationForEndUser500", RevokeDelegationForEndUser500),
            "502": decodeError("RevokeDelegationForEndUser502", RevokeDelegationForEndUser502),
            "503": decodeError("RevokeDelegationForEndUser503", RevokeDelegationForEndUser503),
            "204": () => Effect.void,
            orElse: unexpectedStatus,
          }),
        ),
      ),
    getDelegationForEndUserAccount: (userId, address, options) =>
      HttpClientRequest.get(`/v2/embedded-wallet-api/end-users/${userId}/address/${address}/delegation`).pipe(
        HttpClientRequest.setUrlParams({ projectID: options?.params?.["projectID"] as any }),
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(GetDelegationForEndUserAccount200),
            "401": decodeError("GetDelegationForEndUserAccount401", GetDelegationForEndUserAccount401),
            "404": decodeError("GetDelegationForEndUserAccount404", GetDelegationForEndUserAccount404),
            "500": decodeError("GetDelegationForEndUserAccount500", GetDelegationForEndUserAccount500),
            "502": decodeError("GetDelegationForEndUserAccount502", GetDelegationForEndUserAccount502),
            "503": decodeError("GetDelegationForEndUserAccount503", GetDelegationForEndUserAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    createDelegationForEndUserAccount: (userId, address, options) =>
      HttpClientRequest.post(`/v2/embedded-wallet-api/end-users/${userId}/address/${address}/delegation`).pipe(
        HttpClientRequest.setUrlParams({ projectID: options.params["projectID"] as any }),
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(CreateDelegationForEndUserAccount201),
            "400": decodeError("CreateDelegationForEndUserAccount400", CreateDelegationForEndUserAccount400),
            "401": decodeError("CreateDelegationForEndUserAccount401", CreateDelegationForEndUserAccount401),
            "402": decodeError("CreateDelegationForEndUserAccount402", CreateDelegationForEndUserAccount402),
            "404": decodeError("CreateDelegationForEndUserAccount404", CreateDelegationForEndUserAccount404),
            "409": decodeError("CreateDelegationForEndUserAccount409", CreateDelegationForEndUserAccount409),
            "422": decodeError("CreateDelegationForEndUserAccount422", CreateDelegationForEndUserAccount422),
            "429": decodeError("CreateDelegationForEndUserAccount429", CreateDelegationForEndUserAccount429),
            "500": decodeError("CreateDelegationForEndUserAccount500", CreateDelegationForEndUserAccount500),
            "502": decodeError("CreateDelegationForEndUserAccount502", CreateDelegationForEndUserAccount502),
            "503": decodeError("CreateDelegationForEndUserAccount503", CreateDelegationForEndUserAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    revokeDelegationForEndUserAccount: (userId, address, options) =>
      HttpClientRequest.delete(`/v2/embedded-wallet-api/end-users/${userId}/address/${address}/delegation`).pipe(
        HttpClientRequest.setUrlParams({ projectID: options.params?.["projectID"] as any }),
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params?.["X-Wallet-Auth"] ?? undefined,
          "X-Developer-Auth": options.params?.["X-Developer-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params?.["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "401": decodeError("RevokeDelegationForEndUserAccount401", RevokeDelegationForEndUserAccount401),
            "404": decodeError("RevokeDelegationForEndUserAccount404", RevokeDelegationForEndUserAccount404),
            "500": decodeError("RevokeDelegationForEndUserAccount500", RevokeDelegationForEndUserAccount500),
            "502": decodeError("RevokeDelegationForEndUserAccount502", RevokeDelegationForEndUserAccount502),
            "503": decodeError("RevokeDelegationForEndUserAccount503", RevokeDelegationForEndUserAccount503),
            "204": () => Effect.void,
            orElse: unexpectedStatus,
          }),
        ),
      ),
    createEvmEip7702DelegationWithEndUserAccount: (userId, options) =>
      HttpClientRequest.post(`/v2/embedded-wallet-api/end-users/${userId}/evm/eip7702/delegation`).pipe(
        HttpClientRequest.setUrlParams({ projectID: options.params?.["projectID"] as any }),
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params?.["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params?.["X-Idempotency-Key"] ?? undefined,
          "X-Developer-Auth": options.params?.["X-Developer-Auth"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(CreateEvmEip7702DelegationWithEndUserAccount201),
            "400": decodeError(
              "CreateEvmEip7702DelegationWithEndUserAccount400",
              CreateEvmEip7702DelegationWithEndUserAccount400,
            ),
            "401": decodeError(
              "CreateEvmEip7702DelegationWithEndUserAccount401",
              CreateEvmEip7702DelegationWithEndUserAccount401,
            ),
            "402": decodeError(
              "CreateEvmEip7702DelegationWithEndUserAccount402",
              CreateEvmEip7702DelegationWithEndUserAccount402,
            ),
            "403": decodeError(
              "CreateEvmEip7702DelegationWithEndUserAccount403",
              CreateEvmEip7702DelegationWithEndUserAccount403,
            ),
            "404": decodeError(
              "CreateEvmEip7702DelegationWithEndUserAccount404",
              CreateEvmEip7702DelegationWithEndUserAccount404,
            ),
            "409": decodeError(
              "CreateEvmEip7702DelegationWithEndUserAccount409",
              CreateEvmEip7702DelegationWithEndUserAccount409,
            ),
            "422": decodeError(
              "CreateEvmEip7702DelegationWithEndUserAccount422",
              CreateEvmEip7702DelegationWithEndUserAccount422,
            ),
            "429": decodeError(
              "CreateEvmEip7702DelegationWithEndUserAccount429",
              CreateEvmEip7702DelegationWithEndUserAccount429,
            ),
            "500": decodeError(
              "CreateEvmEip7702DelegationWithEndUserAccount500",
              CreateEvmEip7702DelegationWithEndUserAccount500,
            ),
            "502": decodeError(
              "CreateEvmEip7702DelegationWithEndUserAccount502",
              CreateEvmEip7702DelegationWithEndUserAccount502,
            ),
            "503": decodeError(
              "CreateEvmEip7702DelegationWithEndUserAccount503",
              CreateEvmEip7702DelegationWithEndUserAccount503,
            ),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    sendUserOperationWithEndUserAccount: (userId, address, options) =>
      HttpClientRequest.post(`/v2/embedded-wallet-api/end-users/${userId}/evm/smart-accounts/${address}/send`).pipe(
        HttpClientRequest.setUrlParams({ projectID: options.params?.["projectID"] as any }),
        HttpClientRequest.setHeaders({
          "X-Idempotency-Key": options.params?.["X-Idempotency-Key"] ?? undefined,
          "X-Wallet-Auth": options.params?.["X-Wallet-Auth"] ?? undefined,
          "X-Developer-Auth": options.params?.["X-Developer-Auth"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SendUserOperationWithEndUserAccount200),
            "400": decodeError("SendUserOperationWithEndUserAccount400", SendUserOperationWithEndUserAccount400),
            "401": decodeError("SendUserOperationWithEndUserAccount401", SendUserOperationWithEndUserAccount401),
            "402": decodeError("SendUserOperationWithEndUserAccount402", SendUserOperationWithEndUserAccount402),
            "403": decodeError("SendUserOperationWithEndUserAccount403", SendUserOperationWithEndUserAccount403),
            "404": decodeError("SendUserOperationWithEndUserAccount404", SendUserOperationWithEndUserAccount404),
            "429": decodeError("SendUserOperationWithEndUserAccount429", SendUserOperationWithEndUserAccount429),
            "500": decodeError("SendUserOperationWithEndUserAccount500", SendUserOperationWithEndUserAccount500),
            "502": decodeError("SendUserOperationWithEndUserAccount502", SendUserOperationWithEndUserAccount502),
            "503": decodeError("SendUserOperationWithEndUserAccount503", SendUserOperationWithEndUserAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    signSolanaMessageWithEndUserAccount: (userId, options) =>
      HttpClientRequest.post(`/v2/embedded-wallet-api/end-users/${userId}/solana/sign/message`).pipe(
        HttpClientRequest.setUrlParams({ projectID: options.params?.["projectID"] as any }),
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params?.["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params?.["X-Idempotency-Key"] ?? undefined,
          "X-Developer-Auth": options.params?.["X-Developer-Auth"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SignSolanaMessageWithEndUserAccount200),
            "400": decodeError("SignSolanaMessageWithEndUserAccount400", SignSolanaMessageWithEndUserAccount400),
            "401": decodeError("SignSolanaMessageWithEndUserAccount401", SignSolanaMessageWithEndUserAccount401),
            "402": decodeError("SignSolanaMessageWithEndUserAccount402", SignSolanaMessageWithEndUserAccount402),
            "403": decodeError("SignSolanaMessageWithEndUserAccount403", SignSolanaMessageWithEndUserAccount403),
            "404": decodeError("SignSolanaMessageWithEndUserAccount404", SignSolanaMessageWithEndUserAccount404),
            "409": decodeError("SignSolanaMessageWithEndUserAccount409", SignSolanaMessageWithEndUserAccount409),
            "422": decodeError("SignSolanaMessageWithEndUserAccount422", SignSolanaMessageWithEndUserAccount422),
            "500": decodeError("SignSolanaMessageWithEndUserAccount500", SignSolanaMessageWithEndUserAccount500),
            "502": decodeError("SignSolanaMessageWithEndUserAccount502", SignSolanaMessageWithEndUserAccount502),
            "503": decodeError("SignSolanaMessageWithEndUserAccount503", SignSolanaMessageWithEndUserAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    signSolanaTransactionWithEndUserAccount: (userId, options) =>
      HttpClientRequest.post(`/v2/embedded-wallet-api/end-users/${userId}/solana/sign/transaction`).pipe(
        HttpClientRequest.setUrlParams({ projectID: options.params?.["projectID"] as any }),
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params?.["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params?.["X-Idempotency-Key"] ?? undefined,
          "X-Developer-Auth": options.params?.["X-Developer-Auth"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SignSolanaTransactionWithEndUserAccount200),
            "400": decodeError(
              "SignSolanaTransactionWithEndUserAccount400",
              SignSolanaTransactionWithEndUserAccount400,
            ),
            "401": decodeError(
              "SignSolanaTransactionWithEndUserAccount401",
              SignSolanaTransactionWithEndUserAccount401,
            ),
            "402": decodeError(
              "SignSolanaTransactionWithEndUserAccount402",
              SignSolanaTransactionWithEndUserAccount402,
            ),
            "403": decodeError(
              "SignSolanaTransactionWithEndUserAccount403",
              SignSolanaTransactionWithEndUserAccount403,
            ),
            "404": decodeError(
              "SignSolanaTransactionWithEndUserAccount404",
              SignSolanaTransactionWithEndUserAccount404,
            ),
            "409": decodeError(
              "SignSolanaTransactionWithEndUserAccount409",
              SignSolanaTransactionWithEndUserAccount409,
            ),
            "422": decodeError(
              "SignSolanaTransactionWithEndUserAccount422",
              SignSolanaTransactionWithEndUserAccount422,
            ),
            "500": decodeError(
              "SignSolanaTransactionWithEndUserAccount500",
              SignSolanaTransactionWithEndUserAccount500,
            ),
            "502": decodeError(
              "SignSolanaTransactionWithEndUserAccount502",
              SignSolanaTransactionWithEndUserAccount502,
            ),
            "503": decodeError(
              "SignSolanaTransactionWithEndUserAccount503",
              SignSolanaTransactionWithEndUserAccount503,
            ),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    sendSolanaTransactionWithEndUserAccount: (userId, options) =>
      HttpClientRequest.post(`/v2/embedded-wallet-api/end-users/${userId}/solana/send/transaction`).pipe(
        HttpClientRequest.setUrlParams({ projectID: options.params?.["projectID"] as any }),
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params?.["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params?.["X-Idempotency-Key"] ?? undefined,
          "X-Developer-Auth": options.params?.["X-Developer-Auth"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SendSolanaTransactionWithEndUserAccount200),
            "400": decodeError(
              "SendSolanaTransactionWithEndUserAccount400",
              SendSolanaTransactionWithEndUserAccount400,
            ),
            "401": decodeError(
              "SendSolanaTransactionWithEndUserAccount401",
              SendSolanaTransactionWithEndUserAccount401,
            ),
            "402": decodeError(
              "SendSolanaTransactionWithEndUserAccount402",
              SendSolanaTransactionWithEndUserAccount402,
            ),
            "403": decodeError(
              "SendSolanaTransactionWithEndUserAccount403",
              SendSolanaTransactionWithEndUserAccount403,
            ),
            "404": decodeError(
              "SendSolanaTransactionWithEndUserAccount404",
              SendSolanaTransactionWithEndUserAccount404,
            ),
            "422": decodeError(
              "SendSolanaTransactionWithEndUserAccount422",
              SendSolanaTransactionWithEndUserAccount422,
            ),
            "500": decodeError(
              "SendSolanaTransactionWithEndUserAccount500",
              SendSolanaTransactionWithEndUserAccount500,
            ),
            "502": decodeError(
              "SendSolanaTransactionWithEndUserAccount502",
              SendSolanaTransactionWithEndUserAccount502,
            ),
            "503": decodeError(
              "SendSolanaTransactionWithEndUserAccount503",
              SendSolanaTransactionWithEndUserAccount503,
            ),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    sendSolanaAssetWithEndUserAccount: (userId, address, asset, options) =>
      HttpClientRequest.post(`/v2/embedded-wallet-api/end-users/${userId}/solana/${address}/send/${asset}`).pipe(
        HttpClientRequest.setUrlParams({ projectID: options.params?.["projectID"] as any }),
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params?.["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params?.["X-Idempotency-Key"] ?? undefined,
          "X-Developer-Auth": options.params?.["X-Developer-Auth"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SendSolanaAssetWithEndUserAccount200),
            "400": decodeError("SendSolanaAssetWithEndUserAccount400", SendSolanaAssetWithEndUserAccount400),
            "401": decodeError("SendSolanaAssetWithEndUserAccount401", SendSolanaAssetWithEndUserAccount401),
            "402": decodeError("SendSolanaAssetWithEndUserAccount402", SendSolanaAssetWithEndUserAccount402),
            "403": decodeError("SendSolanaAssetWithEndUserAccount403", SendSolanaAssetWithEndUserAccount403),
            "404": decodeError("SendSolanaAssetWithEndUserAccount404", SendSolanaAssetWithEndUserAccount404),
            "422": decodeError("SendSolanaAssetWithEndUserAccount422", SendSolanaAssetWithEndUserAccount422),
            "500": decodeError("SendSolanaAssetWithEndUserAccount500", SendSolanaAssetWithEndUserAccount500),
            "502": decodeError("SendSolanaAssetWithEndUserAccount502", SendSolanaAssetWithEndUserAccount502),
            "503": decodeError("SendSolanaAssetWithEndUserAccount503", SendSolanaAssetWithEndUserAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    listEvmAccounts: (options) =>
      HttpClientRequest.get(`/v2/evm/accounts`).pipe(
        HttpClientRequest.setUrlParams({
          pageSize: options?.params?.["pageSize"] as any,
          pageToken: options?.params?.["pageToken"] as any,
        }),
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ListEvmAccounts200),
            "500": decodeError("ListEvmAccounts500", ListEvmAccounts500),
            "502": decodeError("ListEvmAccounts502", ListEvmAccounts502),
            "503": decodeError("ListEvmAccounts503", ListEvmAccounts503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    createEvmAccount: (options) =>
      HttpClientRequest.post(`/v2/evm/accounts`).pipe(
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(CreateEvmAccount201),
            "400": decodeError("CreateEvmAccount400", CreateEvmAccount400),
            "401": decodeError("CreateEvmAccount401", CreateEvmAccount401),
            "402": decodeError("CreateEvmAccount402", CreateEvmAccount402),
            "409": decodeError("CreateEvmAccount409", CreateEvmAccount409),
            "422": decodeError("CreateEvmAccount422", CreateEvmAccount422),
            "500": decodeError("CreateEvmAccount500", CreateEvmAccount500),
            "502": decodeError("CreateEvmAccount502", CreateEvmAccount502),
            "503": decodeError("CreateEvmAccount503", CreateEvmAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    getEvmAccount: (address, options) =>
      HttpClientRequest.get(`/v2/evm/accounts/${address}`).pipe(
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(GetEvmAccount200),
            "400": decodeError("GetEvmAccount400", GetEvmAccount400),
            "404": decodeError("GetEvmAccount404", GetEvmAccount404),
            "500": decodeError("GetEvmAccount500", GetEvmAccount500),
            "502": decodeError("GetEvmAccount502", GetEvmAccount502),
            "503": decodeError("GetEvmAccount503", GetEvmAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    updateEvmAccount: (address, options) =>
      HttpClientRequest.put(`/v2/evm/accounts/${address}`).pipe(
        HttpClientRequest.setHeaders({ "X-Idempotency-Key": options.params?.["X-Idempotency-Key"] ?? undefined }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(UpdateEvmAccount200),
            "400": decodeError("UpdateEvmAccount400", UpdateEvmAccount400),
            "404": decodeError("UpdateEvmAccount404", UpdateEvmAccount404),
            "409": decodeError("UpdateEvmAccount409", UpdateEvmAccount409),
            "422": decodeError("UpdateEvmAccount422", UpdateEvmAccount422),
            "500": decodeError("UpdateEvmAccount500", UpdateEvmAccount500),
            "502": decodeError("UpdateEvmAccount502", UpdateEvmAccount502),
            "503": decodeError("UpdateEvmAccount503", UpdateEvmAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    getEvmAccountByName: (name, options) =>
      HttpClientRequest.get(`/v2/evm/accounts/by-name/${name}`).pipe(
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(GetEvmAccountByName200),
            "400": decodeError("GetEvmAccountByName400", GetEvmAccountByName400),
            "404": decodeError("GetEvmAccountByName404", GetEvmAccountByName404),
            "500": decodeError("GetEvmAccountByName500", GetEvmAccountByName500),
            "502": decodeError("GetEvmAccountByName502", GetEvmAccountByName502),
            "503": decodeError("GetEvmAccountByName503", GetEvmAccountByName503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    sendEvmTransaction: (address, options) =>
      HttpClientRequest.post(`/v2/evm/accounts/${address}/send/transaction`).pipe(
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SendEvmTransaction200),
            "400": decodeError("SendEvmTransaction400", SendEvmTransaction400),
            "401": decodeError("SendEvmTransaction401", SendEvmTransaction401),
            "402": decodeError("SendEvmTransaction402", SendEvmTransaction402),
            "403": decodeError("SendEvmTransaction403", SendEvmTransaction403),
            "404": decodeError("SendEvmTransaction404", SendEvmTransaction404),
            "409": decodeError("SendEvmTransaction409", SendEvmTransaction409),
            "422": decodeError("SendEvmTransaction422", SendEvmTransaction422),
            "500": decodeError("SendEvmTransaction500", SendEvmTransaction500),
            "502": decodeError("SendEvmTransaction502", SendEvmTransaction502),
            "503": decodeError("SendEvmTransaction503", SendEvmTransaction503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    signEvmTransaction: (address, options) =>
      HttpClientRequest.post(`/v2/evm/accounts/${address}/sign/transaction`).pipe(
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SignEvmTransaction200),
            "400": decodeError("SignEvmTransaction400", SignEvmTransaction400),
            "401": decodeError("SignEvmTransaction401", SignEvmTransaction401),
            "402": decodeError("SignEvmTransaction402", SignEvmTransaction402),
            "403": decodeError("SignEvmTransaction403", SignEvmTransaction403),
            "404": decodeError("SignEvmTransaction404", SignEvmTransaction404),
            "409": decodeError("SignEvmTransaction409", SignEvmTransaction409),
            "422": decodeError("SignEvmTransaction422", SignEvmTransaction422),
            "500": decodeError("SignEvmTransaction500", SignEvmTransaction500),
            "502": decodeError("SignEvmTransaction502", SignEvmTransaction502),
            "503": decodeError("SignEvmTransaction503", SignEvmTransaction503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    signEvmHash: (address, options) =>
      HttpClientRequest.post(`/v2/evm/accounts/${address}/sign`).pipe(
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SignEvmHash200),
            "400": decodeError("SignEvmHash400", SignEvmHash400),
            "402": decodeError("SignEvmHash402", SignEvmHash402),
            "404": decodeError("SignEvmHash404", SignEvmHash404),
            "409": decodeError("SignEvmHash409", SignEvmHash409),
            "422": decodeError("SignEvmHash422", SignEvmHash422),
            "500": decodeError("SignEvmHash500", SignEvmHash500),
            "502": decodeError("SignEvmHash502", SignEvmHash502),
            "503": decodeError("SignEvmHash503", SignEvmHash503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    signEvmMessage: (address, options) =>
      HttpClientRequest.post(`/v2/evm/accounts/${address}/sign/message`).pipe(
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SignEvmMessage200),
            "401": decodeError("SignEvmMessage401", SignEvmMessage401),
            "402": decodeError("SignEvmMessage402", SignEvmMessage402),
            "404": decodeError("SignEvmMessage404", SignEvmMessage404),
            "409": decodeError("SignEvmMessage409", SignEvmMessage409),
            "422": decodeError("SignEvmMessage422", SignEvmMessage422),
            "500": decodeError("SignEvmMessage500", SignEvmMessage500),
            "502": decodeError("SignEvmMessage502", SignEvmMessage502),
            "503": decodeError("SignEvmMessage503", SignEvmMessage503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    signEvmTypedData: (address, options) =>
      HttpClientRequest.post(`/v2/evm/accounts/${address}/sign/typed-data`).pipe(
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SignEvmTypedData200),
            "400": decodeError("SignEvmTypedData400", SignEvmTypedData400),
            "401": decodeError("SignEvmTypedData401", SignEvmTypedData401),
            "402": decodeError("SignEvmTypedData402", SignEvmTypedData402),
            "404": decodeError("SignEvmTypedData404", SignEvmTypedData404),
            "422": decodeError("SignEvmTypedData422", SignEvmTypedData422),
            "500": decodeError("SignEvmTypedData500", SignEvmTypedData500),
            "502": decodeError("SignEvmTypedData502", SignEvmTypedData502),
            "503": decodeError("SignEvmTypedData503", SignEvmTypedData503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    createEvmEip7702Delegation: (address, options) =>
      HttpClientRequest.post(`/v2/evm/accounts/${address}/eip7702/delegation`).pipe(
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(CreateEvmEip7702Delegation201),
            "400": decodeError("CreateEvmEip7702Delegation400", CreateEvmEip7702Delegation400),
            "401": decodeError("CreateEvmEip7702Delegation401", CreateEvmEip7702Delegation401),
            "402": decodeError("CreateEvmEip7702Delegation402", CreateEvmEip7702Delegation402),
            "404": decodeError("CreateEvmEip7702Delegation404", CreateEvmEip7702Delegation404),
            "409": decodeError("CreateEvmEip7702Delegation409", CreateEvmEip7702Delegation409),
            "422": decodeError("CreateEvmEip7702Delegation422", CreateEvmEip7702Delegation422),
            "500": decodeError("CreateEvmEip7702Delegation500", CreateEvmEip7702Delegation500),
            "502": decodeError("CreateEvmEip7702Delegation502", CreateEvmEip7702Delegation502),
            "503": decodeError("CreateEvmEip7702Delegation503", CreateEvmEip7702Delegation503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    getEvmEip7702DelegationOperationById: (delegationOperationId, options) =>
      HttpClientRequest.get(`/v2/evm/eip7702/delegation-operations/${delegationOperationId}`).pipe(
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(GetEvmEip7702DelegationOperationById200),
            "400": decodeError("GetEvmEip7702DelegationOperationById400", GetEvmEip7702DelegationOperationById400),
            "404": decodeError("GetEvmEip7702DelegationOperationById404", GetEvmEip7702DelegationOperationById404),
            "500": decodeError("GetEvmEip7702DelegationOperationById500", GetEvmEip7702DelegationOperationById500),
            "502": decodeError("GetEvmEip7702DelegationOperationById502", GetEvmEip7702DelegationOperationById502),
            "503": decodeError("GetEvmEip7702DelegationOperationById503", GetEvmEip7702DelegationOperationById503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    listEvmSmartAccounts: (options) =>
      HttpClientRequest.get(`/v2/evm/smart-accounts`).pipe(
        HttpClientRequest.setUrlParams({
          pageSize: options?.params?.["pageSize"] as any,
          pageToken: options?.params?.["pageToken"] as any,
        }),
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ListEvmSmartAccounts200),
            "400": decodeError("ListEvmSmartAccounts400", ListEvmSmartAccounts400),
            "500": decodeError("ListEvmSmartAccounts500", ListEvmSmartAccounts500),
            "502": decodeError("ListEvmSmartAccounts502", ListEvmSmartAccounts502),
            "503": decodeError("ListEvmSmartAccounts503", ListEvmSmartAccounts503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    createEvmSmartAccount: (options) =>
      HttpClientRequest.post(`/v2/evm/smart-accounts`).pipe(
        HttpClientRequest.setHeaders({ "X-Idempotency-Key": options.params?.["X-Idempotency-Key"] ?? undefined }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(CreateEvmSmartAccount201),
            "400": decodeError("CreateEvmSmartAccount400", CreateEvmSmartAccount400),
            "402": decodeError("CreateEvmSmartAccount402", CreateEvmSmartAccount402),
            "500": decodeError("CreateEvmSmartAccount500", CreateEvmSmartAccount500),
            "502": decodeError("CreateEvmSmartAccount502", CreateEvmSmartAccount502),
            "503": decodeError("CreateEvmSmartAccount503", CreateEvmSmartAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    getEvmSmartAccountByName: (name, options) =>
      HttpClientRequest.get(`/v2/evm/smart-accounts/by-name/${name}`).pipe(
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(GetEvmSmartAccountByName200),
            "400": decodeError("GetEvmSmartAccountByName400", GetEvmSmartAccountByName400),
            "404": decodeError("GetEvmSmartAccountByName404", GetEvmSmartAccountByName404),
            "500": decodeError("GetEvmSmartAccountByName500", GetEvmSmartAccountByName500),
            "502": decodeError("GetEvmSmartAccountByName502", GetEvmSmartAccountByName502),
            "503": decodeError("GetEvmSmartAccountByName503", GetEvmSmartAccountByName503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    importEvmAccount: (options) =>
      HttpClientRequest.post(`/v2/evm/accounts/import`).pipe(
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ImportEvmAccount201),
            "400": decodeError("ImportEvmAccount400", ImportEvmAccount400),
            "401": decodeError("ImportEvmAccount401", ImportEvmAccount401),
            "402": decodeError("ImportEvmAccount402", ImportEvmAccount402),
            "409": decodeError("ImportEvmAccount409", ImportEvmAccount409),
            "422": decodeError("ImportEvmAccount422", ImportEvmAccount422),
            "500": decodeError("ImportEvmAccount500", ImportEvmAccount500),
            "502": decodeError("ImportEvmAccount502", ImportEvmAccount502),
            "503": decodeError("ImportEvmAccount503", ImportEvmAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    exportEvmAccount: (address, options) =>
      HttpClientRequest.post(`/v2/evm/accounts/${address}/export`).pipe(
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ExportEvmAccount200),
            "400": decodeError("ExportEvmAccount400", ExportEvmAccount400),
            "401": decodeError("ExportEvmAccount401", ExportEvmAccount401),
            "402": decodeError("ExportEvmAccount402", ExportEvmAccount402),
            "404": decodeError("ExportEvmAccount404", ExportEvmAccount404),
            "422": decodeError("ExportEvmAccount422", ExportEvmAccount422),
            "500": decodeError("ExportEvmAccount500", ExportEvmAccount500),
            "502": decodeError("ExportEvmAccount502", ExportEvmAccount502),
            "503": decodeError("ExportEvmAccount503", ExportEvmAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    exportEvmAccountByName: (name, options) =>
      HttpClientRequest.post(`/v2/evm/accounts/export/by-name/${name}`).pipe(
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ExportEvmAccountByName200),
            "400": decodeError("ExportEvmAccountByName400", ExportEvmAccountByName400),
            "401": decodeError("ExportEvmAccountByName401", ExportEvmAccountByName401),
            "402": decodeError("ExportEvmAccountByName402", ExportEvmAccountByName402),
            "404": decodeError("ExportEvmAccountByName404", ExportEvmAccountByName404),
            "422": decodeError("ExportEvmAccountByName422", ExportEvmAccountByName422),
            "500": decodeError("ExportEvmAccountByName500", ExportEvmAccountByName500),
            "502": decodeError("ExportEvmAccountByName502", ExportEvmAccountByName502),
            "503": decodeError("ExportEvmAccountByName503", ExportEvmAccountByName503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    getEvmSmartAccount: (address, options) =>
      HttpClientRequest.get(`/v2/evm/smart-accounts/${address}`).pipe(
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(GetEvmSmartAccount200),
            "400": decodeError("GetEvmSmartAccount400", GetEvmSmartAccount400),
            "404": decodeError("GetEvmSmartAccount404", GetEvmSmartAccount404),
            "500": decodeError("GetEvmSmartAccount500", GetEvmSmartAccount500),
            "502": decodeError("GetEvmSmartAccount502", GetEvmSmartAccount502),
            "503": decodeError("GetEvmSmartAccount503", GetEvmSmartAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    updateEvmSmartAccount: (address, options) =>
      HttpClientRequest.put(`/v2/evm/smart-accounts/${address}`).pipe(
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(UpdateEvmSmartAccount200),
            "400": decodeError("UpdateEvmSmartAccount400", UpdateEvmSmartAccount400),
            "404": decodeError("UpdateEvmSmartAccount404", UpdateEvmSmartAccount404),
            "409": decodeError("UpdateEvmSmartAccount409", UpdateEvmSmartAccount409),
            "422": decodeError("UpdateEvmSmartAccount422", UpdateEvmSmartAccount422),
            "500": decodeError("UpdateEvmSmartAccount500", UpdateEvmSmartAccount500),
            "502": decodeError("UpdateEvmSmartAccount502", UpdateEvmSmartAccount502),
            "503": decodeError("UpdateEvmSmartAccount503", UpdateEvmSmartAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    prepareUserOperation: (address, options) =>
      HttpClientRequest.post(`/v2/evm/smart-accounts/${address}/user-operations`).pipe(
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(PrepareUserOperation201),
            "400": decodeError("PrepareUserOperation400", PrepareUserOperation400),
            "403": decodeError("PrepareUserOperation403", PrepareUserOperation403),
            "404": decodeError("PrepareUserOperation404", PrepareUserOperation404),
            "500": decodeError("PrepareUserOperation500", PrepareUserOperation500),
            "502": decodeError("PrepareUserOperation502", PrepareUserOperation502),
            "503": decodeError("PrepareUserOperation503", PrepareUserOperation503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    prepareAndSendUserOperation: (address, options) =>
      HttpClientRequest.post(`/v2/evm/smart-accounts/${address}/user-operations/prepare-and-send`).pipe(
        HttpClientRequest.setHeaders({
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(PrepareAndSendUserOperation200),
            "400": decodeError("PrepareAndSendUserOperation400", PrepareAndSendUserOperation400),
            "401": decodeError("PrepareAndSendUserOperation401", PrepareAndSendUserOperation401),
            "402": decodeError("PrepareAndSendUserOperation402", PrepareAndSendUserOperation402),
            "403": decodeError("PrepareAndSendUserOperation403", PrepareAndSendUserOperation403),
            "404": decodeError("PrepareAndSendUserOperation404", PrepareAndSendUserOperation404),
            "429": decodeError("PrepareAndSendUserOperation429", PrepareAndSendUserOperation429),
            "500": decodeError("PrepareAndSendUserOperation500", PrepareAndSendUserOperation500),
            "502": decodeError("PrepareAndSendUserOperation502", PrepareAndSendUserOperation502),
            "503": decodeError("PrepareAndSendUserOperation503", PrepareAndSendUserOperation503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    getUserOperation: (address, userOpHash, options) =>
      HttpClientRequest.get(`/v2/evm/smart-accounts/${address}/user-operations/${userOpHash}`).pipe(
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(GetUserOperation200),
            "400": decodeError("GetUserOperation400", GetUserOperation400),
            "404": decodeError("GetUserOperation404", GetUserOperation404),
            "500": decodeError("GetUserOperation500", GetUserOperation500),
            "502": decodeError("GetUserOperation502", GetUserOperation502),
            "503": decodeError("GetUserOperation503", GetUserOperation503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    sendUserOperation: (address, userOpHash, options) =>
      HttpClientRequest.post(`/v2/evm/smart-accounts/${address}/user-operations/${userOpHash}/send`).pipe(
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SendUserOperation200),
            "400": decodeError("SendUserOperation400", SendUserOperation400),
            "402": decodeError("SendUserOperation402", SendUserOperation402),
            "403": decodeError("SendUserOperation403", SendUserOperation403),
            "404": decodeError("SendUserOperation404", SendUserOperation404),
            "429": decodeError("SendUserOperation429", SendUserOperation429),
            "500": decodeError("SendUserOperation500", SendUserOperation500),
            "502": decodeError("SendUserOperation502", SendUserOperation502),
            "503": decodeError("SendUserOperation503", SendUserOperation503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    createSpendPermission: (address, options) =>
      HttpClientRequest.post(`/v2/evm/smart-accounts/${address}/spend-permissions`).pipe(
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(CreateSpendPermission200),
            "400": decodeError("CreateSpendPermission400", CreateSpendPermission400),
            "402": decodeError("CreateSpendPermission402", CreateSpendPermission402),
            "404": decodeError("CreateSpendPermission404", CreateSpendPermission404),
            "500": decodeError("CreateSpendPermission500", CreateSpendPermission500),
            "502": decodeError("CreateSpendPermission502", CreateSpendPermission502),
            "503": decodeError("CreateSpendPermission503", CreateSpendPermission503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    listSpendPermissions: (address, options) =>
      HttpClientRequest.get(`/v2/evm/smart-accounts/${address}/spend-permissions/list`).pipe(
        HttpClientRequest.setUrlParams({
          pageSize: options?.params?.["pageSize"] as any,
          pageToken: options?.params?.["pageToken"] as any,
        }),
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ListSpendPermissions200),
            "400": decodeError("ListSpendPermissions400", ListSpendPermissions400),
            "404": decodeError("ListSpendPermissions404", ListSpendPermissions404),
            "500": decodeError("ListSpendPermissions500", ListSpendPermissions500),
            "502": decodeError("ListSpendPermissions502", ListSpendPermissions502),
            "503": decodeError("ListSpendPermissions503", ListSpendPermissions503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    revokeSpendPermission: (address, options) =>
      HttpClientRequest.post(`/v2/evm/smart-accounts/${address}/spend-permissions/revoke`).pipe(
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(RevokeSpendPermission200),
            "400": decodeError("RevokeSpendPermission400", RevokeSpendPermission400),
            "402": decodeError("RevokeSpendPermission402", RevokeSpendPermission402),
            "404": decodeError("RevokeSpendPermission404", RevokeSpendPermission404),
            "500": decodeError("RevokeSpendPermission500", RevokeSpendPermission500),
            "502": decodeError("RevokeSpendPermission502", RevokeSpendPermission502),
            "503": decodeError("RevokeSpendPermission503", RevokeSpendPermission503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    getEvmSwapPrice: (options) =>
      HttpClientRequest.get(`/v2/evm/swaps/quote`).pipe(
        HttpClientRequest.setUrlParams({
          network: options.params["network"] as any,
          toToken: options.params["toToken"] as any,
          fromToken: options.params["fromToken"] as any,
          fromAmount: options.params["fromAmount"] as any,
          taker: options.params["taker"] as any,
          signerAddress: options.params["signerAddress"] as any,
          gasPrice: options.params["gasPrice"] as any,
          slippageBps: options.params["slippageBps"] as any,
        }),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(GetEvmSwapPrice200),
            "400": decodeError("GetEvmSwapPrice400", GetEvmSwapPrice400),
            "403": decodeError("GetEvmSwapPrice403", GetEvmSwapPrice403),
            "500": decodeError("GetEvmSwapPrice500", GetEvmSwapPrice500),
            "502": decodeError("GetEvmSwapPrice502", GetEvmSwapPrice502),
            "503": decodeError("GetEvmSwapPrice503", GetEvmSwapPrice503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    createEvmSwapQuote: (options) =>
      HttpClientRequest.post(`/v2/evm/swaps`).pipe(
        HttpClientRequest.setHeaders({ "X-Idempotency-Key": options.params?.["X-Idempotency-Key"] ?? undefined }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(CreateEvmSwapQuote201),
            "400": decodeError("CreateEvmSwapQuote400", CreateEvmSwapQuote400),
            "403": decodeError("CreateEvmSwapQuote403", CreateEvmSwapQuote403),
            "500": decodeError("CreateEvmSwapQuote500", CreateEvmSwapQuote500),
            "502": decodeError("CreateEvmSwapQuote502", CreateEvmSwapQuote502),
            "503": decodeError("CreateEvmSwapQuote503", CreateEvmSwapQuote503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    listEvmTokenBalances: (network, address, options) =>
      HttpClientRequest.get(`/v2/evm/token-balances/${network}/${address}`).pipe(
        HttpClientRequest.setUrlParams({
          pageSize: options?.params?.["pageSize"] as any,
          pageToken: options?.params?.["pageToken"] as any,
        }),
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ListEvmTokenBalances200),
            "400": decodeError("ListEvmTokenBalances400", ListEvmTokenBalances400),
            "404": decodeError("ListEvmTokenBalances404", ListEvmTokenBalances404),
            "500": decodeError("ListEvmTokenBalances500", ListEvmTokenBalances500),
            "502": decodeError("ListEvmTokenBalances502", ListEvmTokenBalances502),
            "503": decodeError("ListEvmTokenBalances503", ListEvmTokenBalances503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    requestEvmFaucet: (options) =>
      HttpClientRequest.post(`/v2/evm/faucet`).pipe(
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(RequestEvmFaucet200),
            "400": decodeError("RequestEvmFaucet400", RequestEvmFaucet400),
            "403": decodeError("RequestEvmFaucet403", RequestEvmFaucet403),
            "429": decodeError("RequestEvmFaucet429", RequestEvmFaucet429),
            "500": decodeError("RequestEvmFaucet500", RequestEvmFaucet500),
            "502": decodeError("RequestEvmFaucet502", RequestEvmFaucet502),
            "503": decodeError("RequestEvmFaucet503", RequestEvmFaucet503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    listPolicies: (options) =>
      HttpClientRequest.get(`/v2/policy-engine/policies`).pipe(
        HttpClientRequest.setUrlParams({
          pageSize: options?.params?.["pageSize"] as any,
          pageToken: options?.params?.["pageToken"] as any,
          scope: options?.params?.["scope"] as any,
        }),
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ListPolicies200),
            "500": decodeError("ListPolicies500", ListPolicies500),
            "502": decodeError("ListPolicies502", ListPolicies502),
            "503": decodeError("ListPolicies503", ListPolicies503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    createPolicy: (options) =>
      HttpClientRequest.post(`/v2/policy-engine/policies`).pipe(
        HttpClientRequest.setHeaders({ "X-Idempotency-Key": options.params?.["X-Idempotency-Key"] ?? undefined }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(CreatePolicy201),
            "400": decodeError("CreatePolicy400", CreatePolicy400),
            "409": decodeError("CreatePolicy409", CreatePolicy409),
            "422": decodeError("CreatePolicy422", CreatePolicy422),
            "500": decodeError("CreatePolicy500", CreatePolicy500),
            "502": decodeError("CreatePolicy502", CreatePolicy502),
            "503": decodeError("CreatePolicy503", CreatePolicy503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    getPolicyById: (policyId, options) =>
      HttpClientRequest.get(`/v2/policy-engine/policies/${policyId}`).pipe(
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(GetPolicyById200),
            "404": decodeError("GetPolicyById404", GetPolicyById404),
            "500": decodeError("GetPolicyById500", GetPolicyById500),
            "502": decodeError("GetPolicyById502", GetPolicyById502),
            "503": decodeError("GetPolicyById503", GetPolicyById503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    updatePolicy: (policyId, options) =>
      HttpClientRequest.put(`/v2/policy-engine/policies/${policyId}`).pipe(
        HttpClientRequest.setHeaders({ "X-Idempotency-Key": options.params?.["X-Idempotency-Key"] ?? undefined }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(UpdatePolicy200),
            "400": decodeError("UpdatePolicy400", UpdatePolicy400),
            "404": decodeError("UpdatePolicy404", UpdatePolicy404),
            "409": decodeError("UpdatePolicy409", UpdatePolicy409),
            "422": decodeError("UpdatePolicy422", UpdatePolicy422),
            "500": decodeError("UpdatePolicy500", UpdatePolicy500),
            "502": decodeError("UpdatePolicy502", UpdatePolicy502),
            "503": decodeError("UpdatePolicy503", UpdatePolicy503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    deletePolicy: (policyId, options) =>
      HttpClientRequest.delete(`/v2/policy-engine/policies/${policyId}`).pipe(
        HttpClientRequest.setHeaders({ "X-Idempotency-Key": options?.params?.["X-Idempotency-Key"] ?? undefined }),
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "400": decodeError("DeletePolicy400", DeletePolicy400),
            "404": decodeError("DeletePolicy404", DeletePolicy404),
            "409": decodeError("DeletePolicy409", DeletePolicy409),
            "422": decodeError("DeletePolicy422", DeletePolicy422),
            "500": decodeError("DeletePolicy500", DeletePolicy500),
            "502": decodeError("DeletePolicy502", DeletePolicy502),
            "503": decodeError("DeletePolicy503", DeletePolicy503),
            "204": () => Effect.void,
            orElse: unexpectedStatus,
          }),
        ),
      ),
    listSolanaAccounts: (options) =>
      HttpClientRequest.get(`/v2/solana/accounts`).pipe(
        HttpClientRequest.setUrlParams({
          pageSize: options?.params?.["pageSize"] as any,
          pageToken: options?.params?.["pageToken"] as any,
        }),
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ListSolanaAccounts200),
            "500": decodeError("ListSolanaAccounts500", ListSolanaAccounts500),
            "502": decodeError("ListSolanaAccounts502", ListSolanaAccounts502),
            "503": decodeError("ListSolanaAccounts503", ListSolanaAccounts503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    createSolanaAccount: (options) =>
      HttpClientRequest.post(`/v2/solana/accounts`).pipe(
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(CreateSolanaAccount201),
            "400": decodeError("CreateSolanaAccount400", CreateSolanaAccount400),
            "401": decodeError("CreateSolanaAccount401", CreateSolanaAccount401),
            "402": decodeError("CreateSolanaAccount402", CreateSolanaAccount402),
            "409": decodeError("CreateSolanaAccount409", CreateSolanaAccount409),
            "422": decodeError("CreateSolanaAccount422", CreateSolanaAccount422),
            "500": decodeError("CreateSolanaAccount500", CreateSolanaAccount500),
            "502": decodeError("CreateSolanaAccount502", CreateSolanaAccount502),
            "503": decodeError("CreateSolanaAccount503", CreateSolanaAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    getSolanaAccount: (address, options) =>
      HttpClientRequest.get(`/v2/solana/accounts/${address}`).pipe(
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(GetSolanaAccount200),
            "400": decodeError("GetSolanaAccount400", GetSolanaAccount400),
            "404": decodeError("GetSolanaAccount404", GetSolanaAccount404),
            "500": decodeError("GetSolanaAccount500", GetSolanaAccount500),
            "502": decodeError("GetSolanaAccount502", GetSolanaAccount502),
            "503": decodeError("GetSolanaAccount503", GetSolanaAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    updateSolanaAccount: (address, options) =>
      HttpClientRequest.put(`/v2/solana/accounts/${address}`).pipe(
        HttpClientRequest.setHeaders({ "X-Idempotency-Key": options.params?.["X-Idempotency-Key"] ?? undefined }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(UpdateSolanaAccount200),
            "400": decodeError("UpdateSolanaAccount400", UpdateSolanaAccount400),
            "404": decodeError("UpdateSolanaAccount404", UpdateSolanaAccount404),
            "409": decodeError("UpdateSolanaAccount409", UpdateSolanaAccount409),
            "422": decodeError("UpdateSolanaAccount422", UpdateSolanaAccount422),
            "500": decodeError("UpdateSolanaAccount500", UpdateSolanaAccount500),
            "502": decodeError("UpdateSolanaAccount502", UpdateSolanaAccount502),
            "503": decodeError("UpdateSolanaAccount503", UpdateSolanaAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    getSolanaAccountByName: (name, options) =>
      HttpClientRequest.get(`/v2/solana/accounts/by-name/${name}`).pipe(
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(GetSolanaAccountByName200),
            "400": decodeError("GetSolanaAccountByName400", GetSolanaAccountByName400),
            "404": decodeError("GetSolanaAccountByName404", GetSolanaAccountByName404),
            "500": decodeError("GetSolanaAccountByName500", GetSolanaAccountByName500),
            "502": decodeError("GetSolanaAccountByName502", GetSolanaAccountByName502),
            "503": decodeError("GetSolanaAccountByName503", GetSolanaAccountByName503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    importSolanaAccount: (options) =>
      HttpClientRequest.post(`/v2/solana/accounts/import`).pipe(
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ImportSolanaAccount201),
            "400": decodeError("ImportSolanaAccount400", ImportSolanaAccount400),
            "401": decodeError("ImportSolanaAccount401", ImportSolanaAccount401),
            "402": decodeError("ImportSolanaAccount402", ImportSolanaAccount402),
            "409": decodeError("ImportSolanaAccount409", ImportSolanaAccount409),
            "422": decodeError("ImportSolanaAccount422", ImportSolanaAccount422),
            "500": decodeError("ImportSolanaAccount500", ImportSolanaAccount500),
            "502": decodeError("ImportSolanaAccount502", ImportSolanaAccount502),
            "503": decodeError("ImportSolanaAccount503", ImportSolanaAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    exportSolanaAccount: (address, options) =>
      HttpClientRequest.post(`/v2/solana/accounts/${address}/export`).pipe(
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ExportSolanaAccount200),
            "400": decodeError("ExportSolanaAccount400", ExportSolanaAccount400),
            "401": decodeError("ExportSolanaAccount401", ExportSolanaAccount401),
            "402": decodeError("ExportSolanaAccount402", ExportSolanaAccount402),
            "404": decodeError("ExportSolanaAccount404", ExportSolanaAccount404),
            "422": decodeError("ExportSolanaAccount422", ExportSolanaAccount422),
            "500": decodeError("ExportSolanaAccount500", ExportSolanaAccount500),
            "502": decodeError("ExportSolanaAccount502", ExportSolanaAccount502),
            "503": decodeError("ExportSolanaAccount503", ExportSolanaAccount503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    exportSolanaAccountByName: (name, options) =>
      HttpClientRequest.post(`/v2/solana/accounts/export/by-name/${name}`).pipe(
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ExportSolanaAccountByName200),
            "400": decodeError("ExportSolanaAccountByName400", ExportSolanaAccountByName400),
            "401": decodeError("ExportSolanaAccountByName401", ExportSolanaAccountByName401),
            "402": decodeError("ExportSolanaAccountByName402", ExportSolanaAccountByName402),
            "404": decodeError("ExportSolanaAccountByName404", ExportSolanaAccountByName404),
            "422": decodeError("ExportSolanaAccountByName422", ExportSolanaAccountByName422),
            "500": decodeError("ExportSolanaAccountByName500", ExportSolanaAccountByName500),
            "502": decodeError("ExportSolanaAccountByName502", ExportSolanaAccountByName502),
            "503": decodeError("ExportSolanaAccountByName503", ExportSolanaAccountByName503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    signSolanaTransaction: (address, options) =>
      HttpClientRequest.post(`/v2/solana/accounts/${address}/sign/transaction`).pipe(
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SignSolanaTransaction200),
            "400": decodeError("SignSolanaTransaction400", SignSolanaTransaction400),
            "401": decodeError("SignSolanaTransaction401", SignSolanaTransaction401),
            "402": decodeError("SignSolanaTransaction402", SignSolanaTransaction402),
            "403": decodeError("SignSolanaTransaction403", SignSolanaTransaction403),
            "404": decodeError("SignSolanaTransaction404", SignSolanaTransaction404),
            "409": decodeError("SignSolanaTransaction409", SignSolanaTransaction409),
            "422": decodeError("SignSolanaTransaction422", SignSolanaTransaction422),
            "500": decodeError("SignSolanaTransaction500", SignSolanaTransaction500),
            "502": decodeError("SignSolanaTransaction502", SignSolanaTransaction502),
            "503": decodeError("SignSolanaTransaction503", SignSolanaTransaction503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    signSolanaMessage: (address, options) =>
      HttpClientRequest.post(`/v2/solana/accounts/${address}/sign/message`).pipe(
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SignSolanaMessage200),
            "400": decodeError("SignSolanaMessage400", SignSolanaMessage400),
            "401": decodeError("SignSolanaMessage401", SignSolanaMessage401),
            "402": decodeError("SignSolanaMessage402", SignSolanaMessage402),
            "404": decodeError("SignSolanaMessage404", SignSolanaMessage404),
            "409": decodeError("SignSolanaMessage409", SignSolanaMessage409),
            "422": decodeError("SignSolanaMessage422", SignSolanaMessage422),
            "500": decodeError("SignSolanaMessage500", SignSolanaMessage500),
            "502": decodeError("SignSolanaMessage502", SignSolanaMessage502),
            "503": decodeError("SignSolanaMessage503", SignSolanaMessage503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    sendSolanaTransaction: (options) =>
      HttpClientRequest.post(`/v2/solana/accounts/send/transaction`).pipe(
        HttpClientRequest.setHeaders({
          "X-Wallet-Auth": options.params["X-Wallet-Auth"] ?? undefined,
          "X-Idempotency-Key": options.params["X-Idempotency-Key"] ?? undefined,
        }),
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SendSolanaTransaction200),
            "400": decodeError("SendSolanaTransaction400", SendSolanaTransaction400),
            "401": decodeError("SendSolanaTransaction401", SendSolanaTransaction401),
            "402": decodeError("SendSolanaTransaction402", SendSolanaTransaction402),
            "403": decodeError("SendSolanaTransaction403", SendSolanaTransaction403),
            "404": decodeError("SendSolanaTransaction404", SendSolanaTransaction404),
            "422": decodeError("SendSolanaTransaction422", SendSolanaTransaction422),
            "500": decodeError("SendSolanaTransaction500", SendSolanaTransaction500),
            "502": decodeError("SendSolanaTransaction502", SendSolanaTransaction502),
            "503": decodeError("SendSolanaTransaction503", SendSolanaTransaction503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    requestSolanaFaucet: (options) =>
      HttpClientRequest.post(`/v2/solana/faucet`).pipe(
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(RequestSolanaFaucet200),
            "400": decodeError("RequestSolanaFaucet400", RequestSolanaFaucet400),
            "403": decodeError("RequestSolanaFaucet403", RequestSolanaFaucet403),
            "429": decodeError("RequestSolanaFaucet429", RequestSolanaFaucet429),
            "500": decodeError("RequestSolanaFaucet500", RequestSolanaFaucet500),
            "502": decodeError("RequestSolanaFaucet502", RequestSolanaFaucet502),
            "503": decodeError("RequestSolanaFaucet503", RequestSolanaFaucet503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    listSolanaTokenBalances: (network, address, options) =>
      HttpClientRequest.get(`/v2/solana/token-balances/${network}/${address}`).pipe(
        HttpClientRequest.setUrlParams({
          pageSize: options?.params?.["pageSize"] as any,
          pageToken: options?.params?.["pageToken"] as any,
        }),
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ListSolanaTokenBalances200),
            "400": decodeError("ListSolanaTokenBalances400", ListSolanaTokenBalances400),
            "404": decodeError("ListSolanaTokenBalances404", ListSolanaTokenBalances404),
            "500": decodeError("ListSolanaTokenBalances500", ListSolanaTokenBalances500),
            "502": decodeError("ListSolanaTokenBalances502", ListSolanaTokenBalances502),
            "503": decodeError("ListSolanaTokenBalances503", ListSolanaTokenBalances503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    runSQLQuery: (options) =>
      HttpClientRequest.post(`/v2/data/query/run`).pipe(
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(RunSQLQuery200),
            "400": decodeError("RunSQLQuery400", RunSQLQuery400),
            "401": decodeError("RunSQLQuery401", RunSQLQuery401),
            "402": decodeError("RunSQLQuery402", RunSQLQuery402),
            "408": decodeError("RunSQLQuery408", RunSQLQuery408),
            "429": decodeError("RunSQLQuery429", RunSQLQuery429),
            "499": decodeError("RunSQLQuery499", RunSQLQuery499),
            "500": decodeError("RunSQLQuery500", RunSQLQuery500),
            "504": decodeError("RunSQLQuery504", RunSQLQuery504),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    getSQLGrammar: (options) =>
      HttpClientRequest.get(`/v2/data/query/grammar`).pipe(
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(GetSQLGrammar200),
            "401": decodeError("GetSQLGrammar401", GetSQLGrammar401),
            "429": decodeError("GetSQLGrammar429", GetSQLGrammar429),
            "500": decodeError("GetSQLGrammar500", GetSQLGrammar500),
            "504": decodeError("GetSQLGrammar504", GetSQLGrammar504),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    getSQLSchema: (options) =>
      HttpClientRequest.get(`/v2/data/query/schema`).pipe(
        HttpClientRequest.setUrlParams({
          database: options?.params?.["database"] as any,
          table: options?.params?.["table"] as any,
        }),
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(GetSQLSchema200),
            "401": decodeError("GetSQLSchema401", GetSQLSchema401),
            "500": decodeError("GetSQLSchema500", GetSQLSchema500),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    listTokensForAccount: (network, address, options) =>
      HttpClientRequest.get(`/v2/data/evm/token-ownership/${network}/${address}`).pipe(
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ListTokensForAccount200),
            "400": decodeError("ListTokensForAccount400", ListTokensForAccount400),
            "401": decodeError("ListTokensForAccount401", ListTokensForAccount401),
            "429": decodeError("ListTokensForAccount429", ListTokensForAccount429),
            "500": decodeError("ListTokensForAccount500", ListTokensForAccount500),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    listDataTokenBalances: (network, address, options) =>
      HttpClientRequest.get(`/v2/data/evm/token-balances/${network}/${address}`).pipe(
        HttpClientRequest.setUrlParams({
          pageSize: options?.params?.["pageSize"] as any,
          pageToken: options?.params?.["pageToken"] as any,
        }),
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ListDataTokenBalances200),
            "400": decodeError("ListDataTokenBalances400", ListDataTokenBalances400),
            "404": decodeError("ListDataTokenBalances404", ListDataTokenBalances404),
            "500": decodeError("ListDataTokenBalances500", ListDataTokenBalances500),
            "502": decodeError("ListDataTokenBalances502", ListDataTokenBalances502),
            "503": decodeError("ListDataTokenBalances503", ListDataTokenBalances503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    listWebhookSubscriptions: (options) =>
      HttpClientRequest.get(`/v2/data/webhooks/subscriptions`).pipe(
        HttpClientRequest.setUrlParams({
          pageSize: options?.params?.["pageSize"] as any,
          pageToken: options?.params?.["pageToken"] as any,
        }),
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ListWebhookSubscriptions200),
            "400": decodeError("ListWebhookSubscriptions400", ListWebhookSubscriptions400),
            "401": decodeError("ListWebhookSubscriptions401", ListWebhookSubscriptions401),
            "429": decodeError("ListWebhookSubscriptions429", ListWebhookSubscriptions429),
            "500": decodeError("ListWebhookSubscriptions500", ListWebhookSubscriptions500),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    createWebhookSubscription: (options) =>
      HttpClientRequest.post(`/v2/data/webhooks/subscriptions`).pipe(
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(CreateWebhookSubscription201),
            "400": decodeError("CreateWebhookSubscription400", CreateWebhookSubscription400),
            "401": decodeError("CreateWebhookSubscription401", CreateWebhookSubscription401),
            "429": decodeError("CreateWebhookSubscription429", CreateWebhookSubscription429),
            "500": decodeError("CreateWebhookSubscription500", CreateWebhookSubscription500),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    getWebhookSubscription: (subscriptionId, options) =>
      HttpClientRequest.get(`/v2/data/webhooks/subscriptions/${subscriptionId}`).pipe(
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(GetWebhookSubscription200),
            "401": decodeError("GetWebhookSubscription401", GetWebhookSubscription401),
            "404": decodeError("GetWebhookSubscription404", GetWebhookSubscription404),
            "429": decodeError("GetWebhookSubscription429", GetWebhookSubscription429),
            "500": decodeError("GetWebhookSubscription500", GetWebhookSubscription500),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    updateWebhookSubscription: (subscriptionId, options) =>
      HttpClientRequest.put(`/v2/data/webhooks/subscriptions/${subscriptionId}`).pipe(
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(UpdateWebhookSubscription200),
            "400": decodeError("UpdateWebhookSubscription400", UpdateWebhookSubscription400),
            "401": decodeError("UpdateWebhookSubscription401", UpdateWebhookSubscription401),
            "404": decodeError("UpdateWebhookSubscription404", UpdateWebhookSubscription404),
            "429": decodeError("UpdateWebhookSubscription429", UpdateWebhookSubscription429),
            "500": decodeError("UpdateWebhookSubscription500", UpdateWebhookSubscription500),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    deleteWebhookSubscription: (subscriptionId, options) =>
      HttpClientRequest.delete(`/v2/data/webhooks/subscriptions/${subscriptionId}`).pipe(
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "401": decodeError("DeleteWebhookSubscription401", DeleteWebhookSubscription401),
            "404": decodeError("DeleteWebhookSubscription404", DeleteWebhookSubscription404),
            "429": decodeError("DeleteWebhookSubscription429", DeleteWebhookSubscription429),
            "500": decodeError("DeleteWebhookSubscription500", DeleteWebhookSubscription500),
            "204": () => Effect.void,
            orElse: unexpectedStatus,
          }),
        ),
      ),
    listWebhookSubscriptionEvents: (subscriptionId, options) =>
      HttpClientRequest.get(`/v2/data/webhooks/subscriptions/${subscriptionId}/events`).pipe(
        HttpClientRequest.setUrlParams({
          eventId: options?.params?.["eventId"] as any,
          minCreatedAt: options?.params?.["minCreatedAt"] as any,
          maxCreatedAt: options?.params?.["maxCreatedAt"] as any,
          eventTypeNames: options?.params?.["eventTypeNames"] as any,
        }),
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ListWebhookSubscriptionEvents200),
            "400": decodeError("ListWebhookSubscriptionEvents400", ListWebhookSubscriptionEvents400),
            "401": decodeError("ListWebhookSubscriptionEvents401", ListWebhookSubscriptionEvents401),
            "404": decodeError("ListWebhookSubscriptionEvents404", ListWebhookSubscriptionEvents404),
            "429": decodeError("ListWebhookSubscriptionEvents429", ListWebhookSubscriptionEvents429),
            "500": decodeError("ListWebhookSubscriptionEvents500", ListWebhookSubscriptionEvents500),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    verifyX402Payment: (options) =>
      HttpClientRequest.post(`/v2/x402/verify`).pipe(
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(VerifyX402Payment200),
            "400": decodeError("VerifyX402Payment400", VerifyX402Payment400),
            "500": decodeError("VerifyX402Payment500", VerifyX402Payment500),
            "502": decodeError("VerifyX402Payment502", VerifyX402Payment502),
            "503": decodeError("VerifyX402Payment503", VerifyX402Payment503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    settleX402Payment: (options) =>
      HttpClientRequest.post(`/v2/x402/settle`).pipe(
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SettleX402Payment200),
            "400": decodeError("SettleX402Payment400", SettleX402Payment400),
            "402": decodeError("SettleX402Payment402", SettleX402Payment402),
            "500": decodeError("SettleX402Payment500", SettleX402Payment500),
            "502": decodeError("SettleX402Payment502", SettleX402Payment502),
            "503": decodeError("SettleX402Payment503", SettleX402Payment503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    supportedX402PaymentKinds: (options) =>
      HttpClientRequest.get(`/v2/x402/supported`).pipe(
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SupportedX402PaymentKinds200),
            "500": decodeError("SupportedX402PaymentKinds500", SupportedX402PaymentKinds500),
            "502": decodeError("SupportedX402PaymentKinds502", SupportedX402PaymentKinds502),
            "503": decodeError("SupportedX402PaymentKinds503", SupportedX402PaymentKinds503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    listX402DiscoveryResources: (options) =>
      HttpClientRequest.get(`/v2/x402/discovery/resources`).pipe(
        HttpClientRequest.setUrlParams({
          type: options?.params?.["type"] as any,
          limit: options?.params?.["limit"] as any,
          offset: options?.params?.["offset"] as any,
        }),
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ListX402DiscoveryResources200),
            "400": decodeError("ListX402DiscoveryResources400", ListX402DiscoveryResources400),
            "500": decodeError("ListX402DiscoveryResources500", ListX402DiscoveryResources500),
            "502": decodeError("ListX402DiscoveryResources502", ListX402DiscoveryResources502),
            "503": decodeError("ListX402DiscoveryResources503", ListX402DiscoveryResources503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    listX402DiscoveryMerchant: (options) =>
      HttpClientRequest.get(`/v2/x402/discovery/merchant`).pipe(
        HttpClientRequest.setUrlParams({
          payTo: options.params["payTo"] as any,
          limit: options.params["limit"] as any,
          offset: options.params["offset"] as any,
        }),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ListX402DiscoveryMerchant200),
            "400": decodeError("ListX402DiscoveryMerchant400", ListX402DiscoveryMerchant400),
            "404": decodeError("ListX402DiscoveryMerchant404", ListX402DiscoveryMerchant404),
            "500": decodeError("ListX402DiscoveryMerchant500", ListX402DiscoveryMerchant500),
            "502": decodeError("ListX402DiscoveryMerchant502", ListX402DiscoveryMerchant502),
            "503": decodeError("ListX402DiscoveryMerchant503", ListX402DiscoveryMerchant503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    searchX402Resources: (options) =>
      HttpClientRequest.get(`/v2/x402/discovery/search`).pipe(
        HttpClientRequest.setUrlParams({
          query: options?.params?.["query"] as any,
          network: options?.params?.["network"] as any,
          asset: options?.params?.["asset"] as any,
          scheme: options?.params?.["scheme"] as any,
          payTo: options?.params?.["payTo"] as any,
          urlSubstring: options?.params?.["urlSubstring"] as any,
          maxUsdPrice: options?.params?.["maxUsdPrice"] as any,
          extensions: options?.params?.["extensions"] as any,
          limit: options?.params?.["limit"] as any,
        }),
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(SearchX402Resources200),
            "400": decodeError("SearchX402Resources400", SearchX402Resources400),
            "500": decodeError("SearchX402Resources500", SearchX402Resources500),
            "502": decodeError("SearchX402Resources502", SearchX402Resources502),
            "503": decodeError("SearchX402Resources503", SearchX402Resources503),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    postX402DiscoveryMcp: (options) =>
      HttpClientRequest.post(`/v2/x402/discovery/mcp`).pipe(
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(PostX402DiscoveryMcp200),
            "400": decodeError("PostX402DiscoveryMcp400", PostX402DiscoveryMcp400),
            "500": decodeError("PostX402DiscoveryMcp500", PostX402DiscoveryMcp500),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    createOnrampOrder: (options) =>
      HttpClientRequest.post(`/v2/onramp/orders`).pipe(
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(CreateOnrampOrder201),
            "400": decodeError("CreateOnrampOrder400", CreateOnrampOrder400),
            "401": decodeError("CreateOnrampOrder401", CreateOnrampOrder401),
            "429": decodeError("CreateOnrampOrder429", CreateOnrampOrder429),
            "500": decodeError("CreateOnrampOrder500", CreateOnrampOrder500),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    getOnrampOrderById: (orderId, options) =>
      HttpClientRequest.get(`/v2/onramp/orders/${orderId}`).pipe(
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(GetOnrampOrderById200),
            "401": decodeError("GetOnrampOrderById401", GetOnrampOrderById401),
            "404": decodeError("GetOnrampOrderById404", GetOnrampOrderById404),
            "429": decodeError("GetOnrampOrderById429", GetOnrampOrderById429),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    createOnrampSession: (options) =>
      HttpClientRequest.post(`/v2/onramp/sessions`).pipe(
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(CreateOnrampSession201),
            "400": decodeError("CreateOnrampSession400", CreateOnrampSession400),
            "401": decodeError("CreateOnrampSession401", CreateOnrampSession401),
            "429": decodeError("CreateOnrampSession429", CreateOnrampSession429),
            "500": decodeError("CreateOnrampSession500", CreateOnrampSession500),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    getOnrampUserLimits: (options) =>
      HttpClientRequest.post(`/v2/onramp/limits`).pipe(
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(GetOnrampUserLimits200),
            "400": decodeError("GetOnrampUserLimits400", GetOnrampUserLimits400),
            "401": decodeError("GetOnrampUserLimits401", GetOnrampUserLimits401),
            "429": decodeError("GetOnrampUserLimits429", GetOnrampUserLimits429),
            "500": decodeError("GetOnrampUserLimits500", GetOnrampUserLimits500),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    requestLimitsUpgrade: (options) =>
      HttpClientRequest.post(`/v2/onramp/limits/upgrade`).pipe(
        HttpClientRequest.bodyJsonUnsafe(options.payload),
        withResponse(options.config)(
          HttpClientResponse.matchStatus({
            "400": decodeError("RequestLimitsUpgrade400", RequestLimitsUpgrade400),
            "401": decodeError("RequestLimitsUpgrade401", RequestLimitsUpgrade401),
            "429": decodeError("RequestLimitsUpgrade429", RequestLimitsUpgrade429),
            "500": decodeError("RequestLimitsUpgrade500", RequestLimitsUpgrade500),
            "202": () => Effect.void,
            orElse: unexpectedStatus,
          }),
        ),
      ),
    listPaymentMethods: (options) =>
      HttpClientRequest.get(`/v2/payment-methods`).pipe(
        HttpClientRequest.setUrlParams({
          pageSize: options?.params?.["pageSize"] as any,
          pageToken: options?.params?.["pageToken"] as any,
        }),
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(ListPaymentMethods200),
            "400": decodeError("ListPaymentMethods400", ListPaymentMethods400),
            "401": decodeError("ListPaymentMethods401", ListPaymentMethods401),
            "500": decodeError("ListPaymentMethods500", ListPaymentMethods500),
            orElse: unexpectedStatus,
          }),
        ),
      ),
    getPaymentMethod: (paymentMethodId, options) =>
      HttpClientRequest.get(`/v2/payment-methods/${paymentMethodId}`).pipe(
        withResponse(options?.config)(
          HttpClientResponse.matchStatus({
            "2xx": decodeSuccess(GetPaymentMethod200),
            "400": decodeError("GetPaymentMethod400", GetPaymentMethod400),
            "401": decodeError("GetPaymentMethod401", GetPaymentMethod401),
            "404": decodeError("GetPaymentMethod404", GetPaymentMethod404),
            "500": decodeError("GetPaymentMethod500", GetPaymentMethod500),
            orElse: unexpectedStatus,
          }),
        ),
      ),
  }
}

export interface CdpClient {
  readonly httpClient: HttpClient.HttpClient
  /**
   * List all accounts. The API will return all accounts that the API Key has Permissions to access. You can filter the results by using query parameters, which will be treated as a single conjunction (i.e. AND). Results are sorted by creation date in descending order (newest first).
   */
  readonly listFoundationAccounts: <Config extends OperationConfig>(
    options:
      | {
          readonly params?: typeof ListFoundationAccountsParams.Encoded | undefined
          readonly config?: Config | undefined
        }
      | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof ListFoundationAccounts200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ListFoundationAccounts400", typeof ListFoundationAccounts400.Type>
  >
  /**
   * Create an account for your Entity. Support for creating Customer-owned accounts is in development.
   */
  readonly createFoundationAccount: <Config extends OperationConfig>(options: {
    readonly params?: typeof CreateFoundationAccountParams.Encoded | undefined
    readonly payload: typeof CreateFoundationAccountRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof CreateFoundationAccount200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"CreateFoundationAccount400", typeof CreateFoundationAccount400.Type>
    | CdpClientError<"CreateFoundationAccount403", typeof CreateFoundationAccount403.Type>
    | CdpClientError<"CreateFoundationAccount422", typeof CreateFoundationAccount422.Type>
    | CdpClientError<"CreateFoundationAccount503", typeof CreateFoundationAccount503.Type>
  >
  /**
   * Get an account by its ID.
   */
  readonly getFoundationAccountById: <Config extends OperationConfig>(
    accountId: string,
    options: { readonly config?: Config | undefined } | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof GetFoundationAccountById200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"GetFoundationAccountById400", typeof GetFoundationAccountById400.Type>
    | CdpClientError<"GetFoundationAccountById404", typeof GetFoundationAccountById404.Type>
  >
  /**
   * List the balances for an account. Results are sorted by native-fiat equivalent balance in descending order.
   */
  readonly listBalances: <Config extends OperationConfig>(
    accountId: string,
    options:
      | { readonly params?: typeof ListBalancesParams.Encoded | undefined; readonly config?: Config | undefined }
      | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof ListBalances200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ListBalances400", typeof ListBalances400.Type>
    | CdpClientError<"ListBalances401", typeof ListBalances401.Type>
    | CdpClientError<"ListBalances404", typeof ListBalances404.Type>
    | CdpClientError<"ListBalances500", typeof ListBalances500.Type>
    | CdpClientError<"ListBalances503", typeof ListBalances503.Type>
  >
  /**
   * Get the balance for an account by asset.
   */
  readonly getBalanceByAsset: <Config extends OperationConfig>(
    accountId: string,
    asset: string,
    options: { readonly config?: Config | undefined } | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof GetBalanceByAsset200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"GetBalanceByAsset400", typeof GetBalanceByAsset400.Type>
    | CdpClientError<"GetBalanceByAsset401", typeof GetBalanceByAsset401.Type>
    | CdpClientError<"GetBalanceByAsset404", typeof GetBalanceByAsset404.Type>
    | CdpClientError<"GetBalanceByAsset500", typeof GetBalanceByAsset500.Type>
    | CdpClientError<"GetBalanceByAsset503", typeof GetBalanceByAsset503.Type>
  >
  /**
   * List deposit destinations. You can optionally filter the results by type, account ID, network, or cryptocurrency address. Results are sorted by creation date in descending order (newest first).
   */
  readonly listDepositDestinations: <Config extends OperationConfig>(
    options:
      | {
          readonly params?: typeof ListDepositDestinationsParams.Encoded | undefined
          readonly config?: Config | undefined
        }
      | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof ListDepositDestinations200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ListDepositDestinations400", typeof ListDepositDestinations400.Type>
    | CdpClientError<"ListDepositDestinations401", typeof ListDepositDestinations401.Type>
    | CdpClientError<"ListDepositDestinations500", typeof ListDepositDestinations500.Type>
  >
  /**
   * Create a new deposit destination for an account. A deposit destination is a cryptocurrency address that can be used to receive funds. The address will be generated for the specified network.
   */
  readonly createDepositDestination: <Config extends OperationConfig>(options: {
    readonly params?: typeof CreateDepositDestinationParams.Encoded | undefined
    readonly payload: typeof CreateDepositDestinationRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof CreateDepositDestination201.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"CreateDepositDestination400", typeof CreateDepositDestination400.Type>
    | CdpClientError<"CreateDepositDestination401", typeof CreateDepositDestination401.Type>
    | CdpClientError<"CreateDepositDestination403", typeof CreateDepositDestination403.Type>
    | CdpClientError<"CreateDepositDestination404", typeof CreateDepositDestination404.Type>
    | CdpClientError<"CreateDepositDestination422", typeof CreateDepositDestination422.Type>
    | CdpClientError<"CreateDepositDestination500", typeof CreateDepositDestination500.Type>
    | CdpClientError<"CreateDepositDestination503", typeof CreateDepositDestination503.Type>
  >
  /**
   * Get a specific deposit destination by its ID.
   */
  readonly getDepositDestinationById: <Config extends OperationConfig>(
    depositDestinationId: string,
    options: { readonly config?: Config | undefined } | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof GetDepositDestinationById200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"GetDepositDestinationById400", typeof GetDepositDestinationById400.Type>
    | CdpClientError<"GetDepositDestinationById401", typeof GetDepositDestinationById401.Type>
    | CdpClientError<"GetDepositDestinationById404", typeof GetDepositDestinationById404.Type>
    | CdpClientError<"GetDepositDestinationById500", typeof GetDepositDestinationById500.Type>
  >
  /**
   * List transfers for your organization. Use this to view and monitor your transfer activity.
   *
   * **Status Filtering**: Filter by specific status to efficiently manage transfers:
   * * `?status=processing` - Monitor active transfers.
   * * `?status=quoted` - Find transfers awaiting execution.
   * * `?status=failed` - Review failed transfers for troubleshooting.
   * * `?status=completed` - Find completed transfers.
   *
   * **Account Filtering**: Filter by account ID to find transfers involving a specific account:
   * * `?accountId=<ID>` - All transfers where the account is either source or target (OR semantics).
   * * `?sourceAccountId=<ID>` - Only transfers where the account is the source (outbound).
   * * `?targetAccountId=<ID>` - Only transfers where the account is the target (inbound).
   * Providing `accountId` together with `sourceAccountId` or `targetAccountId` is a validation error and returns HTTP 400.
   *
   * **Date Range Filtering**: Filter by creation or last-updated time for reconciliation:
   * * `?createdAfter=2026-01-01T00:00:00Z&createdBefore=2026-01-31T23:59:59Z` - Transfers created within a date range.
   * * `?updatedAfter=2026-01-01T00:00:00Z` - Transfers updated since a given time. Useful for incremental sync.
   *
   * **Asset Filtering**: Filter by source or target asset symbol:
   * * `?sourceAsset=usd` - Transfers funded from a USD account.
   * * `?targetAsset=usdc` - Transfers delivering USDC to the target.
   *
   * **Other Filters**:
   * * `?sourceAddress=0x...` - Transfers from a specific on-chain source address.
   * * `?targetAddress=0x...` - Transfers to a specific on-chain destination address.
   * * `?targetEmail=user@example.com` - Transfers to a specific email recipient.
   * * `?transferId=transfer_...` - Look up a single transfer by ID; bypasses pagination.
   */
  readonly listTransfers: <Config extends OperationConfig>(
    options:
      | { readonly params?: typeof ListTransfersParams.Encoded | undefined; readonly config?: Config | undefined }
      | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof ListTransfers200.Type, Config>,
    HttpClientError.HttpClientError | SchemaError | CdpClientError<"ListTransfers400", typeof ListTransfers400.Type>
  >
  /**
   * Create a new transfer to move funds from a source to a target.
   * All transfers first transition to `quoted`. If `execute: false`, the transfer stays quoted until you call `/v2/transfers/{transferId}/execute`.
   * If `execute: true`, quoted status emits momentarily before the transfer moves to `processing`, where execution proceeds. Subscribe to the transfers webhook to  follow progress in real time instead of polling.
   */
  readonly createTransfer: <Config extends OperationConfig>(options: {
    readonly params?: typeof CreateTransferParams.Encoded | undefined
    readonly payload: typeof CreateTransferRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof CreateTransfer200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"CreateTransfer400", typeof CreateTransfer400.Type>
    | CdpClientError<"CreateTransfer403", typeof CreateTransfer403.Type>
    | CdpClientError<"CreateTransfer422", typeof CreateTransfer422.Type>
  >
  /**
   * Get a transfer by its ID.
   */
  readonly getTransferById: <Config extends OperationConfig>(
    transferId: string,
    options: { readonly config?: Config | undefined } | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof GetTransferById200.Type, Config>,
    HttpClientError.HttpClientError | SchemaError | CdpClientError<"GetTransferById404", typeof GetTransferById404.Type>
  >
  /**
   * Executes a transfer which was created using the Create a transfer endpoint.
   */
  readonly executeFundTransfer: <Config extends OperationConfig>(
    transferId: string,
    options:
      | { readonly params?: typeof ExecuteFundTransferParams.Encoded | undefined; readonly config?: Config | undefined }
      | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof ExecuteFundTransfer200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ExecuteFundTransfer400", typeof ExecuteFundTransfer400.Type>
    | CdpClientError<"ExecuteFundTransfer401", typeof ExecuteFundTransfer401.Type>
    | CdpClientError<"ExecuteFundTransfer403", typeof ExecuteFundTransfer403.Type>
    | CdpClientError<"ExecuteFundTransfer404", typeof ExecuteFundTransfer404.Type>
    | CdpClientError<"ExecuteFundTransfer422", typeof ExecuteFundTransfer422.Type>
    | CdpClientError<"ExecuteFundTransfer429", typeof ExecuteFundTransfer429.Type>
    | CdpClientError<"ExecuteFundTransfer500", typeof ExecuteFundTransfer500.Type>
    | CdpClientError<"ExecuteFundTransfer502", typeof ExecuteFundTransfer502.Type>
    | CdpClientError<"ExecuteFundTransfer503", typeof ExecuteFundTransfer503.Type>
  >
  /**
   * Submit travel rule information for a deposit transfer held pending compliance review.
   *
   * Required fields vary by jurisdiction and may include originator name, address, date of birth, personal ID, and VASP information.
   *
   * If the submitted information satisfies all jurisdictional requirements, `status` will be `completed` and the transfer will proceed. Otherwise, `status` will be `incomplete` and `missingFields` will indicate which fields still need to be provided.
   */
  readonly submitDepositTravelRule: <Config extends OperationConfig>(
    transferId: string,
    options: {
      readonly params?: typeof SubmitDepositTravelRuleParams.Encoded | undefined
      readonly payload: typeof SubmitDepositTravelRuleRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof SubmitDepositTravelRule200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"SubmitDepositTravelRule400", typeof SubmitDepositTravelRule400.Type>
    | CdpClientError<"SubmitDepositTravelRule404", typeof SubmitDepositTravelRule404.Type>
    | CdpClientError<"SubmitDepositTravelRule422", typeof SubmitDepositTravelRule422.Type>
  >
  /**
   * Lists the end users belonging to the developer's CDP Project.
   * By default, the response is sorted by creation date in ascending order and paginated to 20 users per page.
   */
  readonly listEndUsers: <Config extends OperationConfig>(
    options:
      | { readonly params?: typeof ListEndUsersParams.Encoded | undefined; readonly config?: Config | undefined }
      | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof ListEndUsers200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ListEndUsers400", typeof ListEndUsers400.Type>
    | CdpClientError<"ListEndUsers401", typeof ListEndUsers401.Type>
    | CdpClientError<"ListEndUsers500", typeof ListEndUsers500.Type>
    | CdpClientError<"ListEndUsers502", typeof ListEndUsers502.Type>
    | CdpClientError<"ListEndUsers503", typeof ListEndUsers503.Type>
  >
  /**
   * Creates an end user. An end user is an entity that can own CDP EVM accounts, EVM smart accounts, and/or Solana accounts. 1 or more authentication methods must be associated with an end user. By default, no accounts are created unless the optional `evmAccount` and/or `solanaAccount` fields are provided.
   * This API is intended to be used by the developer's own backend, and is authenticated using the developer's CDP API key.
   */
  readonly createEndUser: <Config extends OperationConfig>(options: {
    readonly params: typeof CreateEndUserParams.Encoded
    readonly payload: typeof CreateEndUserRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof CreateEndUser201.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"CreateEndUser400", typeof CreateEndUser400.Type>
    | CdpClientError<"CreateEndUser401", typeof CreateEndUser401.Type>
    | CdpClientError<"CreateEndUser402", typeof CreateEndUser402.Type>
    | CdpClientError<"CreateEndUser422", typeof CreateEndUser422.Type>
    | CdpClientError<"CreateEndUser500", typeof CreateEndUser500.Type>
  >
  /**
   * Validates the end user's access token and returns the end user's information. Returns an error if the access token is invalid or expired.
   *
   * This API is intended to be used by the developer's own backend, and is authenticated using the developer's CDP API key.
   */
  readonly validateEndUserAccessToken: <Config extends OperationConfig>(options: {
    readonly payload: typeof ValidateEndUserAccessTokenRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof ValidateEndUserAccessToken200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ValidateEndUserAccessToken400", typeof ValidateEndUserAccessToken400.Type>
    | CdpClientError<"ValidateEndUserAccessToken401", typeof ValidateEndUserAccessToken401.Type>
    | CdpClientError<"ValidateEndUserAccessToken404", typeof ValidateEndUserAccessToken404.Type>
    | CdpClientError<"ValidateEndUserAccessToken500", typeof ValidateEndUserAccessToken500.Type>
  >
  /**
   * Gets an end user by ID.
   *
   * This API is intended to be used by the developer's own backend, and is authenticated using the developer's CDP API key.
   */
  readonly getEndUser: <Config extends OperationConfig>(
    userId: string,
    options: { readonly config?: Config | undefined } | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof GetEndUser200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"GetEndUser404", typeof GetEndUser404.Type>
    | CdpClientError<"GetEndUser500", typeof GetEndUser500.Type>
  >
  /**
   * Looks up end users. Exactly one lookup type must be provided per request:
   *
   * - **email**: searches across all email-based authentication methods
   *   (email, Google, Apple, GitHub). May return multiple end users if the
   *   same email address appears across different auth methods.
   *
   * - **oauthProvider + oauthSubject**: looks up a user by their OAuth
   *   provider and subject (the `sub` claim from the provider's ID token).
   *   Both params must be provided together.
   *
   * - **phoneNumber**: looks up a user by their SMS-verified phone number.
   *
   * Returns all matching end users. If no end users match, an empty array is returned.
   *
   * This API is intended to be used by the developer's own backend, and is authenticated using the developer's CDP API key.
   */
  readonly lookupEndUser: <Config extends OperationConfig>(
    options:
      | { readonly params?: typeof LookupEndUserParams.Encoded | undefined; readonly config?: Config | undefined }
      | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof LookupEndUser200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"LookupEndUser400", typeof LookupEndUser400.Type>
    | CdpClientError<"LookupEndUser401", typeof LookupEndUser401.Type>
    | CdpClientError<"LookupEndUser500", typeof LookupEndUser500.Type>
  >
  /**
   * Adds a new EVM EOA account to an existing end user. End users can have up to 10 EVM accounts.
   * This API is intended to be used by the developer's own backend, and is authenticated using the developer's CDP API key.
   */
  readonly addEndUserEvmAccount: <Config extends OperationConfig>(
    userId: string,
    options: {
      readonly params: typeof AddEndUserEvmAccountParams.Encoded
      readonly payload: typeof AddEndUserEvmAccountRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof AddEndUserEvmAccount201.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"AddEndUserEvmAccount400", typeof AddEndUserEvmAccount400.Type>
    | CdpClientError<"AddEndUserEvmAccount401", typeof AddEndUserEvmAccount401.Type>
    | CdpClientError<"AddEndUserEvmAccount402", typeof AddEndUserEvmAccount402.Type>
    | CdpClientError<"AddEndUserEvmAccount404", typeof AddEndUserEvmAccount404.Type>
    | CdpClientError<"AddEndUserEvmAccount422", typeof AddEndUserEvmAccount422.Type>
    | CdpClientError<"AddEndUserEvmAccount500", typeof AddEndUserEvmAccount500.Type>
    | CdpClientError<"AddEndUserEvmAccount502", typeof AddEndUserEvmAccount502.Type>
    | CdpClientError<"AddEndUserEvmAccount503", typeof AddEndUserEvmAccount503.Type>
  >
  /**
   * Creates an EVM smart account for an existing end user. The backend will create a new EVM EOA account to serve as the owner of the smart account.
   * This API is intended to be used by the developer's own backend, and is authenticated using the developer's CDP API key.
   */
  readonly addEndUserEvmSmartAccount: <Config extends OperationConfig>(
    userId: string,
    options: {
      readonly params: typeof AddEndUserEvmSmartAccountParams.Encoded
      readonly payload: typeof AddEndUserEvmSmartAccountRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof AddEndUserEvmSmartAccount201.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"AddEndUserEvmSmartAccount400", typeof AddEndUserEvmSmartAccount400.Type>
    | CdpClientError<"AddEndUserEvmSmartAccount401", typeof AddEndUserEvmSmartAccount401.Type>
    | CdpClientError<"AddEndUserEvmSmartAccount402", typeof AddEndUserEvmSmartAccount402.Type>
    | CdpClientError<"AddEndUserEvmSmartAccount404", typeof AddEndUserEvmSmartAccount404.Type>
    | CdpClientError<"AddEndUserEvmSmartAccount422", typeof AddEndUserEvmSmartAccount422.Type>
    | CdpClientError<"AddEndUserEvmSmartAccount500", typeof AddEndUserEvmSmartAccount500.Type>
    | CdpClientError<"AddEndUserEvmSmartAccount502", typeof AddEndUserEvmSmartAccount502.Type>
    | CdpClientError<"AddEndUserEvmSmartAccount503", typeof AddEndUserEvmSmartAccount503.Type>
  >
  /**
   * Adds a new Solana account to an existing end user. End users can have up to 10 Solana accounts.
   * This API is intended to be used by the developer's own backend, and is authenticated using the developer's CDP API key.
   */
  readonly addEndUserSolanaAccount: <Config extends OperationConfig>(
    userId: string,
    options: {
      readonly params: typeof AddEndUserSolanaAccountParams.Encoded
      readonly payload: typeof AddEndUserSolanaAccountRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof AddEndUserSolanaAccount201.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"AddEndUserSolanaAccount400", typeof AddEndUserSolanaAccount400.Type>
    | CdpClientError<"AddEndUserSolanaAccount401", typeof AddEndUserSolanaAccount401.Type>
    | CdpClientError<"AddEndUserSolanaAccount402", typeof AddEndUserSolanaAccount402.Type>
    | CdpClientError<"AddEndUserSolanaAccount404", typeof AddEndUserSolanaAccount404.Type>
    | CdpClientError<"AddEndUserSolanaAccount422", typeof AddEndUserSolanaAccount422.Type>
    | CdpClientError<"AddEndUserSolanaAccount500", typeof AddEndUserSolanaAccount500.Type>
    | CdpClientError<"AddEndUserSolanaAccount502", typeof AddEndUserSolanaAccount502.Type>
    | CdpClientError<"AddEndUserSolanaAccount503", typeof AddEndUserSolanaAccount503.Type>
  >
  /**
   * Imports an existing private key for an end user into the developer's CDP Project. The private key must be encrypted using the CDP SDK's encryption scheme before being sent to this endpoint. This API should be called from the [CDP SDK](https://github.com/coinbase/cdp-sdk) to ensure that the associated private key is properly encrypted.
   *
   * This endpoint allows developers to import existing keys for their end users, supporting both EVM and Solana key types. The end user must have at least one authentication method configured.
   */
  readonly importEndUser: <Config extends OperationConfig>(options: {
    readonly params: typeof ImportEndUserParams.Encoded
    readonly payload: typeof ImportEndUserRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof ImportEndUser201.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ImportEndUser400", typeof ImportEndUser400.Type>
    | CdpClientError<"ImportEndUser401", typeof ImportEndUser401.Type>
    | CdpClientError<"ImportEndUser402", typeof ImportEndUser402.Type>
    | CdpClientError<"ImportEndUser409", typeof ImportEndUser409.Type>
    | CdpClientError<"ImportEndUser422", typeof ImportEndUser422.Type>
    | CdpClientError<"ImportEndUser500", typeof ImportEndUser500.Type>
    | CdpClientError<"ImportEndUser502", typeof ImportEndUser502.Type>
    | CdpClientError<"ImportEndUser503", typeof ImportEndUser503.Type>
  >
  /**
   * Signs a transaction with the given end user EVM account.
   * The transaction should be serialized as a hex string using [RLP](https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/).
   *
   * The transaction must be an [EIP-1559 dynamic fee transaction](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md). The developer is responsible for ensuring that the unsigned transaction is valid, as the API will not validate the transaction.
   */
  readonly signEvmTransactionWithEndUserAccount: <Config extends OperationConfig>(
    userId: string,
    options: {
      readonly params?: typeof SignEvmTransactionWithEndUserAccountParams.Encoded | undefined
      readonly payload: typeof SignEvmTransactionWithEndUserAccountRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof SignEvmTransactionWithEndUserAccount200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"SignEvmTransactionWithEndUserAccount400", typeof SignEvmTransactionWithEndUserAccount400.Type>
    | CdpClientError<"SignEvmTransactionWithEndUserAccount401", typeof SignEvmTransactionWithEndUserAccount401.Type>
    | CdpClientError<"SignEvmTransactionWithEndUserAccount402", typeof SignEvmTransactionWithEndUserAccount402.Type>
    | CdpClientError<"SignEvmTransactionWithEndUserAccount403", typeof SignEvmTransactionWithEndUserAccount403.Type>
    | CdpClientError<"SignEvmTransactionWithEndUserAccount404", typeof SignEvmTransactionWithEndUserAccount404.Type>
    | CdpClientError<"SignEvmTransactionWithEndUserAccount409", typeof SignEvmTransactionWithEndUserAccount409.Type>
    | CdpClientError<"SignEvmTransactionWithEndUserAccount422", typeof SignEvmTransactionWithEndUserAccount422.Type>
    | CdpClientError<"SignEvmTransactionWithEndUserAccount500", typeof SignEvmTransactionWithEndUserAccount500.Type>
    | CdpClientError<"SignEvmTransactionWithEndUserAccount502", typeof SignEvmTransactionWithEndUserAccount502.Type>
    | CdpClientError<"SignEvmTransactionWithEndUserAccount503", typeof SignEvmTransactionWithEndUserAccount503.Type>
  >
  /**
   * Signs a transaction with the given end user EVM account and sends it to the indicated supported network. This API handles nonce management and gas estimation, leaving the developer to provide only the minimal set of fields necessary to send the transaction. The transaction should be serialized as a hex string using [RLP](https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/).
   *
   * The transaction must be an [EIP-1559 dynamic fee transaction](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md).
   *
   *
   * **Transaction fields and API behavior**
   *
   * - `to` *(Required)*: The address of the contract or account to send the transaction to.
   * - `chainId` *(Ignored)*: The value of the `chainId` field in the transaction is ignored.
   *   The transaction will be sent to the network indicated by the `network` field in the request body.
   *
   * - `nonce` *(Optional)*: The nonce to use for the transaction. If not provided, the API will assign
   *    a nonce to the transaction based on the current state of the account.
   *
   * - `maxPriorityFeePerGas` *(Optional)*: The maximum priority fee per gas to use for the transaction.
   *    If not provided, the API will estimate a value based on current network conditions.
   *
   * - `maxFeePerGas` *(Optional)*: The maximum fee per gas to use for the transaction.
   *    If not provided, the API will estimate a value based on current network conditions.
   *
   * - `gasLimit` *(Optional)*: The gas limit to use for the transaction. If not provided, the API will estimate a value
   *   based on the `to` and `data` fields of the transaction.
   *
   * - `value` *(Optional)*: The amount of ETH, in wei, to send with the transaction.
   * - `data` *(Optional)*: The data to send with the transaction; only used for contract calls.
   * - `accessList` *(Optional)*: The access list to use for the transaction.
   */
  readonly sendEvmTransactionWithEndUserAccount: <Config extends OperationConfig>(
    userId: string,
    options: {
      readonly params?: typeof SendEvmTransactionWithEndUserAccountParams.Encoded | undefined
      readonly payload: typeof SendEvmTransactionWithEndUserAccountRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof SendEvmTransactionWithEndUserAccount200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"SendEvmTransactionWithEndUserAccount400", typeof SendEvmTransactionWithEndUserAccount400.Type>
    | CdpClientError<"SendEvmTransactionWithEndUserAccount401", typeof SendEvmTransactionWithEndUserAccount401.Type>
    | CdpClientError<"SendEvmTransactionWithEndUserAccount402", typeof SendEvmTransactionWithEndUserAccount402.Type>
    | CdpClientError<"SendEvmTransactionWithEndUserAccount403", typeof SendEvmTransactionWithEndUserAccount403.Type>
    | CdpClientError<"SendEvmTransactionWithEndUserAccount404", typeof SendEvmTransactionWithEndUserAccount404.Type>
    | CdpClientError<"SendEvmTransactionWithEndUserAccount409", typeof SendEvmTransactionWithEndUserAccount409.Type>
    | CdpClientError<"SendEvmTransactionWithEndUserAccount422", typeof SendEvmTransactionWithEndUserAccount422.Type>
    | CdpClientError<"SendEvmTransactionWithEndUserAccount500", typeof SendEvmTransactionWithEndUserAccount500.Type>
    | CdpClientError<"SendEvmTransactionWithEndUserAccount502", typeof SendEvmTransactionWithEndUserAccount502.Type>
    | CdpClientError<"SendEvmTransactionWithEndUserAccount503", typeof SendEvmTransactionWithEndUserAccount503.Type>
  >
  /**
   * Sends USDC from an end user's EVM account (EOA or Smart Account) to a recipient address on a supported EVM network. This endpoint simplifies USDC transfers by automatically handling contract resolution, decimal conversion, gas estimation, and transaction encoding.
   * The `amount` field accepts human-readable amounts as decimal strings (e.g., "1.5", "25.50").
   */
  readonly sendEvmAssetWithEndUserAccount: <Config extends OperationConfig>(
    userId: string,
    address: string,
    asset: string,
    options: {
      readonly params?: typeof SendEvmAssetWithEndUserAccountParams.Encoded | undefined
      readonly payload: typeof SendEvmAssetWithEndUserAccountRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof SendEvmAssetWithEndUserAccount200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"SendEvmAssetWithEndUserAccount400", typeof SendEvmAssetWithEndUserAccount400.Type>
    | CdpClientError<"SendEvmAssetWithEndUserAccount401", typeof SendEvmAssetWithEndUserAccount401.Type>
    | CdpClientError<"SendEvmAssetWithEndUserAccount402", typeof SendEvmAssetWithEndUserAccount402.Type>
    | CdpClientError<"SendEvmAssetWithEndUserAccount403", typeof SendEvmAssetWithEndUserAccount403.Type>
    | CdpClientError<"SendEvmAssetWithEndUserAccount404", typeof SendEvmAssetWithEndUserAccount404.Type>
    | CdpClientError<"SendEvmAssetWithEndUserAccount422", typeof SendEvmAssetWithEndUserAccount422.Type>
    | CdpClientError<"SendEvmAssetWithEndUserAccount500", typeof SendEvmAssetWithEndUserAccount500.Type>
    | CdpClientError<"SendEvmAssetWithEndUserAccount502", typeof SendEvmAssetWithEndUserAccount502.Type>
    | CdpClientError<"SendEvmAssetWithEndUserAccount503", typeof SendEvmAssetWithEndUserAccount503.Type>
  >
  /**
   * Signs an [EIP-191](https://eips.ethereum.org/EIPS/eip-191) message with the given end user EVM account.
   *
   * Per the specification, the message in the request body is prepended with `0x19 <0x45 (E)> <thereum Signed Message:\n" + len(message)>` before being signed.
   */
  readonly signEvmMessageWithEndUserAccount: <Config extends OperationConfig>(
    userId: string,
    options: {
      readonly params?: typeof SignEvmMessageWithEndUserAccountParams.Encoded | undefined
      readonly payload: typeof SignEvmMessageWithEndUserAccountRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof SignEvmMessageWithEndUserAccount200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"SignEvmMessageWithEndUserAccount401", typeof SignEvmMessageWithEndUserAccount401.Type>
    | CdpClientError<"SignEvmMessageWithEndUserAccount402", typeof SignEvmMessageWithEndUserAccount402.Type>
    | CdpClientError<"SignEvmMessageWithEndUserAccount403", typeof SignEvmMessageWithEndUserAccount403.Type>
    | CdpClientError<"SignEvmMessageWithEndUserAccount404", typeof SignEvmMessageWithEndUserAccount404.Type>
    | CdpClientError<"SignEvmMessageWithEndUserAccount409", typeof SignEvmMessageWithEndUserAccount409.Type>
    | CdpClientError<"SignEvmMessageWithEndUserAccount422", typeof SignEvmMessageWithEndUserAccount422.Type>
    | CdpClientError<"SignEvmMessageWithEndUserAccount500", typeof SignEvmMessageWithEndUserAccount500.Type>
    | CdpClientError<"SignEvmMessageWithEndUserAccount502", typeof SignEvmMessageWithEndUserAccount502.Type>
    | CdpClientError<"SignEvmMessageWithEndUserAccount503", typeof SignEvmMessageWithEndUserAccount503.Type>
  >
  /**
   * Signs [EIP-712](https://eips.ethereum.org/EIPS/eip-712) typed data with the given end user EVM account.
   */
  readonly signEvmTypedDataWithEndUserAccount: <Config extends OperationConfig>(
    userId: string,
    options: {
      readonly params?: typeof SignEvmTypedDataWithEndUserAccountParams.Encoded | undefined
      readonly payload: typeof SignEvmTypedDataWithEndUserAccountRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof SignEvmTypedDataWithEndUserAccount200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"SignEvmTypedDataWithEndUserAccount400", typeof SignEvmTypedDataWithEndUserAccount400.Type>
    | CdpClientError<"SignEvmTypedDataWithEndUserAccount401", typeof SignEvmTypedDataWithEndUserAccount401.Type>
    | CdpClientError<"SignEvmTypedDataWithEndUserAccount402", typeof SignEvmTypedDataWithEndUserAccount402.Type>
    | CdpClientError<"SignEvmTypedDataWithEndUserAccount403", typeof SignEvmTypedDataWithEndUserAccount403.Type>
    | CdpClientError<"SignEvmTypedDataWithEndUserAccount404", typeof SignEvmTypedDataWithEndUserAccount404.Type>
    | CdpClientError<"SignEvmTypedDataWithEndUserAccount422", typeof SignEvmTypedDataWithEndUserAccount422.Type>
    | CdpClientError<"SignEvmTypedDataWithEndUserAccount500", typeof SignEvmTypedDataWithEndUserAccount500.Type>
    | CdpClientError<"SignEvmTypedDataWithEndUserAccount502", typeof SignEvmTypedDataWithEndUserAccount502.Type>
    | CdpClientError<"SignEvmTypedDataWithEndUserAccount503", typeof SignEvmTypedDataWithEndUserAccount503.Type>
  >
  /**
   * Returns the active delegation for the specified end user, if one exists. This operation can be performed by the end user themselves or by a developer using their API key.
   */
  readonly getDelegationForEndUser: <Config extends OperationConfig>(
    userId: string,
    options:
      | {
          readonly params?: typeof GetDelegationForEndUserParams.Encoded | undefined
          readonly config?: Config | undefined
        }
      | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof GetDelegationForEndUser200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"GetDelegationForEndUser401", typeof GetDelegationForEndUser401.Type>
    | CdpClientError<"GetDelegationForEndUser404", typeof GetDelegationForEndUser404.Type>
    | CdpClientError<"GetDelegationForEndUser500", typeof GetDelegationForEndUser500.Type>
    | CdpClientError<"GetDelegationForEndUser502", typeof GetDelegationForEndUser502.Type>
    | CdpClientError<"GetDelegationForEndUser503", typeof GetDelegationForEndUser503.Type>
  >
  /**
   * Revokes all active delegations for the specified end user. This operation can be performed by the end user themselves or by a developer using their API key.
   */
  readonly revokeDelegationForEndUser: <Config extends OperationConfig>(
    userId: string,
    options: {
      readonly params?: typeof RevokeDelegationForEndUserParams.Encoded | undefined
      readonly payload: typeof RevokeDelegationForEndUserRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<void, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"RevokeDelegationForEndUser401", typeof RevokeDelegationForEndUser401.Type>
    | CdpClientError<"RevokeDelegationForEndUser404", typeof RevokeDelegationForEndUser404.Type>
    | CdpClientError<"RevokeDelegationForEndUser500", typeof RevokeDelegationForEndUser500.Type>
    | CdpClientError<"RevokeDelegationForEndUser502", typeof RevokeDelegationForEndUser502.Type>
    | CdpClientError<"RevokeDelegationForEndUser503", typeof RevokeDelegationForEndUser503.Type>
  >
  /**
   * Returns the active account-scoped delegation for the specified end user account, if one exists. Useful for showing delegation status in a UI.
   * When the address corresponds to an EVM Smart Account, this returns the delegation for the Smart Account's owner EOA.
   */
  readonly getDelegationForEndUserAccount: <Config extends OperationConfig>(
    userId: string,
    address: string,
    options:
      | {
          readonly params?: typeof GetDelegationForEndUserAccountParams.Encoded | undefined
          readonly config?: Config | undefined
        }
      | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof GetDelegationForEndUserAccount200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"GetDelegationForEndUserAccount401", typeof GetDelegationForEndUserAccount401.Type>
    | CdpClientError<"GetDelegationForEndUserAccount404", typeof GetDelegationForEndUserAccount404.Type>
    | CdpClientError<"GetDelegationForEndUserAccount500", typeof GetDelegationForEndUserAccount500.Type>
    | CdpClientError<"GetDelegationForEndUserAccount502", typeof GetDelegationForEndUserAccount502.Type>
    | CdpClientError<"GetDelegationForEndUserAccount503", typeof GetDelegationForEndUserAccount503.Type>
  >
  /**
   * Creates an account-scoped delegation that allows a developer to sign on behalf of an end user for a single blockchain account (identified by its address) for the specified duration. The end user must be authenticated to authorize this delegation.
   * Multiple account-scoped delegations may exist concurrently for a single end user (one per canonical account address). Account-scoped and user-scoped delegations cannot coexist for the same user.
   * When the address corresponds to an EVM Smart Account, the delegation is scoped to the Smart Account's owner EOA rather than the Smart Account address itself. This means `/address/{smartAccountAddress}/delegation` and `/address/{ownerEoaAddress}/delegation` resolve to the same delegation, and the 409 `account_scoped_delegation_active` error may be returned when creating via either address if one already exists for the canonical owner.
   */
  readonly createDelegationForEndUserAccount: <Config extends OperationConfig>(
    userId: string,
    address: string,
    options: {
      readonly params: typeof CreateDelegationForEndUserAccountParams.Encoded
      readonly payload: typeof CreateDelegationForEndUserAccountRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof CreateDelegationForEndUserAccount201.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"CreateDelegationForEndUserAccount400", typeof CreateDelegationForEndUserAccount400.Type>
    | CdpClientError<"CreateDelegationForEndUserAccount401", typeof CreateDelegationForEndUserAccount401.Type>
    | CdpClientError<"CreateDelegationForEndUserAccount402", typeof CreateDelegationForEndUserAccount402.Type>
    | CdpClientError<"CreateDelegationForEndUserAccount404", typeof CreateDelegationForEndUserAccount404.Type>
    | CdpClientError<"CreateDelegationForEndUserAccount409", typeof CreateDelegationForEndUserAccount409.Type>
    | CdpClientError<"CreateDelegationForEndUserAccount422", typeof CreateDelegationForEndUserAccount422.Type>
    | CdpClientError<"CreateDelegationForEndUserAccount429", typeof CreateDelegationForEndUserAccount429.Type>
    | CdpClientError<"CreateDelegationForEndUserAccount500", typeof CreateDelegationForEndUserAccount500.Type>
    | CdpClientError<"CreateDelegationForEndUserAccount502", typeof CreateDelegationForEndUserAccount502.Type>
    | CdpClientError<"CreateDelegationForEndUserAccount503", typeof CreateDelegationForEndUserAccount503.Type>
  >
  /**
   * Revokes the active account-scoped delegation for the specified end user account. Other account-scoped delegations for the same user are unaffected. This operation can be performed by the end user themselves or by a developer using their API key.
   * When the address corresponds to an EVM Smart Account, this revokes the delegation for the Smart Account's owner EOA.
   */
  readonly revokeDelegationForEndUserAccount: <Config extends OperationConfig>(
    userId: string,
    address: string,
    options: {
      readonly params?: typeof RevokeDelegationForEndUserAccountParams.Encoded | undefined
      readonly payload: typeof RevokeDelegationForEndUserAccountRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<void, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"RevokeDelegationForEndUserAccount401", typeof RevokeDelegationForEndUserAccount401.Type>
    | CdpClientError<"RevokeDelegationForEndUserAccount404", typeof RevokeDelegationForEndUserAccount404.Type>
    | CdpClientError<"RevokeDelegationForEndUserAccount500", typeof RevokeDelegationForEndUserAccount500.Type>
    | CdpClientError<"RevokeDelegationForEndUserAccount502", typeof RevokeDelegationForEndUserAccount502.Type>
    | CdpClientError<"RevokeDelegationForEndUserAccount503", typeof RevokeDelegationForEndUserAccount503.Type>
  >
  /**
   * Creates an EIP-7702 delegation for an end user's EVM EOA account, upgrading it with smart account capabilities.
   *
   * This endpoint:
   * - Retrieves delegation artifacts from onchain
   * - Signs the EIP-7702 authorization for delegation
   * - Assembles and submits a Type 4 transaction
   * - Creates an associated smart account object
   *
   * The delegation allows the EVM EOA to be used as a smart account, which enables batched transactions and gas sponsorship via paymaster.
   */
  readonly createEvmEip7702DelegationWithEndUserAccount: <Config extends OperationConfig>(
    userId: string,
    options: {
      readonly params?: typeof CreateEvmEip7702DelegationWithEndUserAccountParams.Encoded | undefined
      readonly payload: typeof CreateEvmEip7702DelegationWithEndUserAccountRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof CreateEvmEip7702DelegationWithEndUserAccount201.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<
        "CreateEvmEip7702DelegationWithEndUserAccount400",
        typeof CreateEvmEip7702DelegationWithEndUserAccount400.Type
      >
    | CdpClientError<
        "CreateEvmEip7702DelegationWithEndUserAccount401",
        typeof CreateEvmEip7702DelegationWithEndUserAccount401.Type
      >
    | CdpClientError<
        "CreateEvmEip7702DelegationWithEndUserAccount402",
        typeof CreateEvmEip7702DelegationWithEndUserAccount402.Type
      >
    | CdpClientError<
        "CreateEvmEip7702DelegationWithEndUserAccount403",
        typeof CreateEvmEip7702DelegationWithEndUserAccount403.Type
      >
    | CdpClientError<
        "CreateEvmEip7702DelegationWithEndUserAccount404",
        typeof CreateEvmEip7702DelegationWithEndUserAccount404.Type
      >
    | CdpClientError<
        "CreateEvmEip7702DelegationWithEndUserAccount409",
        typeof CreateEvmEip7702DelegationWithEndUserAccount409.Type
      >
    | CdpClientError<
        "CreateEvmEip7702DelegationWithEndUserAccount422",
        typeof CreateEvmEip7702DelegationWithEndUserAccount422.Type
      >
    | CdpClientError<
        "CreateEvmEip7702DelegationWithEndUserAccount429",
        typeof CreateEvmEip7702DelegationWithEndUserAccount429.Type
      >
    | CdpClientError<
        "CreateEvmEip7702DelegationWithEndUserAccount500",
        typeof CreateEvmEip7702DelegationWithEndUserAccount500.Type
      >
    | CdpClientError<
        "CreateEvmEip7702DelegationWithEndUserAccount502",
        typeof CreateEvmEip7702DelegationWithEndUserAccount502.Type
      >
    | CdpClientError<
        "CreateEvmEip7702DelegationWithEndUserAccount503",
        typeof CreateEvmEip7702DelegationWithEndUserAccount503.Type
      >
  >
  /**
   * Prepares, signs, and sends a user operation for an end user's Smart Account.
   */
  readonly sendUserOperationWithEndUserAccount: <Config extends OperationConfig>(
    userId: string,
    address: string,
    options: {
      readonly params?: typeof SendUserOperationWithEndUserAccountParams.Encoded | undefined
      readonly payload: typeof SendUserOperationWithEndUserAccountRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof SendUserOperationWithEndUserAccount200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"SendUserOperationWithEndUserAccount400", typeof SendUserOperationWithEndUserAccount400.Type>
    | CdpClientError<"SendUserOperationWithEndUserAccount401", typeof SendUserOperationWithEndUserAccount401.Type>
    | CdpClientError<"SendUserOperationWithEndUserAccount402", typeof SendUserOperationWithEndUserAccount402.Type>
    | CdpClientError<"SendUserOperationWithEndUserAccount403", typeof SendUserOperationWithEndUserAccount403.Type>
    | CdpClientError<"SendUserOperationWithEndUserAccount404", typeof SendUserOperationWithEndUserAccount404.Type>
    | CdpClientError<"SendUserOperationWithEndUserAccount429", typeof SendUserOperationWithEndUserAccount429.Type>
    | CdpClientError<"SendUserOperationWithEndUserAccount500", typeof SendUserOperationWithEndUserAccount500.Type>
    | CdpClientError<"SendUserOperationWithEndUserAccount502", typeof SendUserOperationWithEndUserAccount502.Type>
    | CdpClientError<"SendUserOperationWithEndUserAccount503", typeof SendUserOperationWithEndUserAccount503.Type>
  >
  /**
   * Signs an arbitrary Base64 encoded message with the given Solana account.
   * **WARNING:**  Never sign a message that you didn't generate as it may put your funds at risk.
   */
  readonly signSolanaMessageWithEndUserAccount: <Config extends OperationConfig>(
    userId: string,
    options: {
      readonly params?: typeof SignSolanaMessageWithEndUserAccountParams.Encoded | undefined
      readonly payload: typeof SignSolanaMessageWithEndUserAccountRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof SignSolanaMessageWithEndUserAccount200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"SignSolanaMessageWithEndUserAccount400", typeof SignSolanaMessageWithEndUserAccount400.Type>
    | CdpClientError<"SignSolanaMessageWithEndUserAccount401", typeof SignSolanaMessageWithEndUserAccount401.Type>
    | CdpClientError<"SignSolanaMessageWithEndUserAccount402", typeof SignSolanaMessageWithEndUserAccount402.Type>
    | CdpClientError<"SignSolanaMessageWithEndUserAccount403", typeof SignSolanaMessageWithEndUserAccount403.Type>
    | CdpClientError<"SignSolanaMessageWithEndUserAccount404", typeof SignSolanaMessageWithEndUserAccount404.Type>
    | CdpClientError<"SignSolanaMessageWithEndUserAccount409", typeof SignSolanaMessageWithEndUserAccount409.Type>
    | CdpClientError<"SignSolanaMessageWithEndUserAccount422", typeof SignSolanaMessageWithEndUserAccount422.Type>
    | CdpClientError<"SignSolanaMessageWithEndUserAccount500", typeof SignSolanaMessageWithEndUserAccount500.Type>
    | CdpClientError<"SignSolanaMessageWithEndUserAccount502", typeof SignSolanaMessageWithEndUserAccount502.Type>
    | CdpClientError<"SignSolanaMessageWithEndUserAccount503", typeof SignSolanaMessageWithEndUserAccount503.Type>
  >
  /**
   * Signs a transaction with the given end user Solana account.
   * The unsigned transaction should be serialized into a byte array and then encoded as base64.
   * **Transaction types**
   * The following transaction types are supported:
   * * [Legacy transactions](https://solana-labs.github.io/solana-web3.js/classes/Transaction.html)
   * * [Versioned transactions](https://solana-labs.github.io/solana-web3.js/classes/VersionedTransaction.html)
   * The developer is responsible for ensuring that the unsigned transaction is valid, as the API will not validate the transaction.
   */
  readonly signSolanaTransactionWithEndUserAccount: <Config extends OperationConfig>(
    userId: string,
    options: {
      readonly params?: typeof SignSolanaTransactionWithEndUserAccountParams.Encoded | undefined
      readonly payload: typeof SignSolanaTransactionWithEndUserAccountRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof SignSolanaTransactionWithEndUserAccount200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<
        "SignSolanaTransactionWithEndUserAccount400",
        typeof SignSolanaTransactionWithEndUserAccount400.Type
      >
    | CdpClientError<
        "SignSolanaTransactionWithEndUserAccount401",
        typeof SignSolanaTransactionWithEndUserAccount401.Type
      >
    | CdpClientError<
        "SignSolanaTransactionWithEndUserAccount402",
        typeof SignSolanaTransactionWithEndUserAccount402.Type
      >
    | CdpClientError<
        "SignSolanaTransactionWithEndUserAccount403",
        typeof SignSolanaTransactionWithEndUserAccount403.Type
      >
    | CdpClientError<
        "SignSolanaTransactionWithEndUserAccount404",
        typeof SignSolanaTransactionWithEndUserAccount404.Type
      >
    | CdpClientError<
        "SignSolanaTransactionWithEndUserAccount409",
        typeof SignSolanaTransactionWithEndUserAccount409.Type
      >
    | CdpClientError<
        "SignSolanaTransactionWithEndUserAccount422",
        typeof SignSolanaTransactionWithEndUserAccount422.Type
      >
    | CdpClientError<
        "SignSolanaTransactionWithEndUserAccount500",
        typeof SignSolanaTransactionWithEndUserAccount500.Type
      >
    | CdpClientError<
        "SignSolanaTransactionWithEndUserAccount502",
        typeof SignSolanaTransactionWithEndUserAccount502.Type
      >
    | CdpClientError<
        "SignSolanaTransactionWithEndUserAccount503",
        typeof SignSolanaTransactionWithEndUserAccount503.Type
      >
  >
  /**
   * Signs a transaction with the given end user Solana account and sends it to the indicated supported network.
   * The API handles recent blockhash management and fee estimation, leaving the developer to provide only the minimal set of fields necessary to send the transaction.
   * The unsigned transaction should be serialized into a byte array and then encoded as base64.
   * **Transaction types**
   * The following transaction types are supported:
   * * [Legacy transactions](https://solana.com/developers/guides/advanced/versions#current-transaction-versions)
   * * [Versioned transactions](https://solana.com/developers/guides/advanced/versions)
   * **Instruction Batching**
   * To batch multiple operations, include multiple instructions within a single transaction. All instructions within a transaction are executed atomically - if any instruction fails, the entire transaction fails and is rolled back.
   * **Network Support**
   * The following Solana networks are supported:
   * * `solana` - Solana Mainnet
   * * `solana-devnet` - Solana Devnet
   * The developer is responsible for ensuring that the unsigned transaction is valid, as the API will not validate the transaction.
   */
  readonly sendSolanaTransactionWithEndUserAccount: <Config extends OperationConfig>(
    userId: string,
    options: {
      readonly params?: typeof SendSolanaTransactionWithEndUserAccountParams.Encoded | undefined
      readonly payload: typeof SendSolanaTransactionWithEndUserAccountRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof SendSolanaTransactionWithEndUserAccount200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<
        "SendSolanaTransactionWithEndUserAccount400",
        typeof SendSolanaTransactionWithEndUserAccount400.Type
      >
    | CdpClientError<
        "SendSolanaTransactionWithEndUserAccount401",
        typeof SendSolanaTransactionWithEndUserAccount401.Type
      >
    | CdpClientError<
        "SendSolanaTransactionWithEndUserAccount402",
        typeof SendSolanaTransactionWithEndUserAccount402.Type
      >
    | CdpClientError<
        "SendSolanaTransactionWithEndUserAccount403",
        typeof SendSolanaTransactionWithEndUserAccount403.Type
      >
    | CdpClientError<
        "SendSolanaTransactionWithEndUserAccount404",
        typeof SendSolanaTransactionWithEndUserAccount404.Type
      >
    | CdpClientError<
        "SendSolanaTransactionWithEndUserAccount422",
        typeof SendSolanaTransactionWithEndUserAccount422.Type
      >
    | CdpClientError<
        "SendSolanaTransactionWithEndUserAccount500",
        typeof SendSolanaTransactionWithEndUserAccount500.Type
      >
    | CdpClientError<
        "SendSolanaTransactionWithEndUserAccount502",
        typeof SendSolanaTransactionWithEndUserAccount502.Type
      >
    | CdpClientError<
        "SendSolanaTransactionWithEndUserAccount503",
        typeof SendSolanaTransactionWithEndUserAccount503.Type
      >
  >
  /**
   * Sends USDC from an end user's Solana account to a recipient address on the Solana network. This endpoint simplifies USDC transfers by automatically handling mint resolution, Associated Token Account (ATA) creation, decimal conversion, and transaction encoding.
   * The `amount` field accepts human-readable amounts as decimal strings (e.g., "1.5", "25.50").
   * Use the optional `createRecipientAta` parameter to control whether the sender pays for creating the recipient's Associated Token Account if it doesn't exist.
   */
  readonly sendSolanaAssetWithEndUserAccount: <Config extends OperationConfig>(
    userId: string,
    address: string,
    asset: string,
    options: {
      readonly params?: typeof SendSolanaAssetWithEndUserAccountParams.Encoded | undefined
      readonly payload: typeof SendSolanaAssetWithEndUserAccountRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof SendSolanaAssetWithEndUserAccount200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"SendSolanaAssetWithEndUserAccount400", typeof SendSolanaAssetWithEndUserAccount400.Type>
    | CdpClientError<"SendSolanaAssetWithEndUserAccount401", typeof SendSolanaAssetWithEndUserAccount401.Type>
    | CdpClientError<"SendSolanaAssetWithEndUserAccount402", typeof SendSolanaAssetWithEndUserAccount402.Type>
    | CdpClientError<"SendSolanaAssetWithEndUserAccount403", typeof SendSolanaAssetWithEndUserAccount403.Type>
    | CdpClientError<"SendSolanaAssetWithEndUserAccount404", typeof SendSolanaAssetWithEndUserAccount404.Type>
    | CdpClientError<"SendSolanaAssetWithEndUserAccount422", typeof SendSolanaAssetWithEndUserAccount422.Type>
    | CdpClientError<"SendSolanaAssetWithEndUserAccount500", typeof SendSolanaAssetWithEndUserAccount500.Type>
    | CdpClientError<"SendSolanaAssetWithEndUserAccount502", typeof SendSolanaAssetWithEndUserAccount502.Type>
    | CdpClientError<"SendSolanaAssetWithEndUserAccount503", typeof SendSolanaAssetWithEndUserAccount503.Type>
  >
  /**
   * Lists the EVM accounts belonging to the developer's CDP Project.
   * The response is paginated, and by default, returns 20 accounts per page.
   */
  readonly listEvmAccounts: <Config extends OperationConfig>(
    options:
      | { readonly params?: typeof ListEvmAccountsParams.Encoded | undefined; readonly config?: Config | undefined }
      | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof ListEvmAccounts200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ListEvmAccounts500", typeof ListEvmAccounts500.Type>
    | CdpClientError<"ListEvmAccounts502", typeof ListEvmAccounts502.Type>
    | CdpClientError<"ListEvmAccounts503", typeof ListEvmAccounts503.Type>
  >
  /**
   * Creates a new EVM account.
   */
  readonly createEvmAccount: <Config extends OperationConfig>(options: {
    readonly params: typeof CreateEvmAccountParams.Encoded
    readonly payload: typeof CreateEvmAccountRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof CreateEvmAccount201.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"CreateEvmAccount400", typeof CreateEvmAccount400.Type>
    | CdpClientError<"CreateEvmAccount401", typeof CreateEvmAccount401.Type>
    | CdpClientError<"CreateEvmAccount402", typeof CreateEvmAccount402.Type>
    | CdpClientError<"CreateEvmAccount409", typeof CreateEvmAccount409.Type>
    | CdpClientError<"CreateEvmAccount422", typeof CreateEvmAccount422.Type>
    | CdpClientError<"CreateEvmAccount500", typeof CreateEvmAccount500.Type>
    | CdpClientError<"CreateEvmAccount502", typeof CreateEvmAccount502.Type>
    | CdpClientError<"CreateEvmAccount503", typeof CreateEvmAccount503.Type>
  >
  /**
   * Gets an EVM account by its address.
   */
  readonly getEvmAccount: <Config extends OperationConfig>(
    address: string,
    options: { readonly config?: Config | undefined } | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof GetEvmAccount200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"GetEvmAccount400", typeof GetEvmAccount400.Type>
    | CdpClientError<"GetEvmAccount404", typeof GetEvmAccount404.Type>
    | CdpClientError<"GetEvmAccount500", typeof GetEvmAccount500.Type>
    | CdpClientError<"GetEvmAccount502", typeof GetEvmAccount502.Type>
    | CdpClientError<"GetEvmAccount503", typeof GetEvmAccount503.Type>
  >
  /**
   * Updates an existing EVM account. Use this to update the account's name or account-level policy.
   */
  readonly updateEvmAccount: <Config extends OperationConfig>(
    address: string,
    options: {
      readonly params?: typeof UpdateEvmAccountParams.Encoded | undefined
      readonly payload: typeof UpdateEvmAccountRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof UpdateEvmAccount200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"UpdateEvmAccount400", typeof UpdateEvmAccount400.Type>
    | CdpClientError<"UpdateEvmAccount404", typeof UpdateEvmAccount404.Type>
    | CdpClientError<"UpdateEvmAccount409", typeof UpdateEvmAccount409.Type>
    | CdpClientError<"UpdateEvmAccount422", typeof UpdateEvmAccount422.Type>
    | CdpClientError<"UpdateEvmAccount500", typeof UpdateEvmAccount500.Type>
    | CdpClientError<"UpdateEvmAccount502", typeof UpdateEvmAccount502.Type>
    | CdpClientError<"UpdateEvmAccount503", typeof UpdateEvmAccount503.Type>
  >
  /**
   * Gets an EVM account by its name.
   */
  readonly getEvmAccountByName: <Config extends OperationConfig>(
    name: string,
    options: { readonly config?: Config | undefined } | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof GetEvmAccountByName200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"GetEvmAccountByName400", typeof GetEvmAccountByName400.Type>
    | CdpClientError<"GetEvmAccountByName404", typeof GetEvmAccountByName404.Type>
    | CdpClientError<"GetEvmAccountByName500", typeof GetEvmAccountByName500.Type>
    | CdpClientError<"GetEvmAccountByName502", typeof GetEvmAccountByName502.Type>
    | CdpClientError<"GetEvmAccountByName503", typeof GetEvmAccountByName503.Type>
  >
  /**
   * Signs a transaction with the given EVM account and sends it to the indicated supported network. This API handles nonce management and gas estimation, leaving the developer to provide only the minimal set of fields necessary to send the transaction. The transaction should be serialized as a hex string using [RLP](https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/).
   *
   * The transaction must be an [EIP-1559 dynamic fee transaction](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md).
   *
   *
   * **Transaction fields and API behavior**
   *
   * - `to` *(Required)*: The address of the contract or account to send the transaction to.
   * - `chainId` *(Ignored)*: The value of the `chainId` field in the transaction is ignored.
   *   The transaction will be sent to the network indicated by the `network` field in the request body.
   *
   * - `nonce` *(Optional)*: The nonce to use for the transaction. If not provided, the API will assign
   *    a nonce to the transaction based on the current state of the account.
   *
   * - `maxPriorityFeePerGas` *(Optional)*: The maximum priority fee per gas to use for the transaction.
   *    If not provided, the API will estimate a value based on current network conditions.
   *
   * - `maxFeePerGas` *(Optional)*: The maximum fee per gas to use for the transaction.
   *    If not provided, the API will estimate a value based on current network conditions.
   *
   * - `gasLimit` *(Optional)*: The gas limit to use for the transaction. If not provided, the API will estimate a value
   *   based on the `to` and `data` fields of the transaction.
   *
   * - `value` *(Optional)*: The amount of ETH, in wei, to send with the transaction.
   * - `data` *(Optional)*: The data to send with the transaction; only used for contract calls.
   * - `accessList` *(Optional)*: The access list to use for the transaction.
   */
  readonly sendEvmTransaction: <Config extends OperationConfig>(
    address: string,
    options: {
      readonly params: typeof SendEvmTransactionParams.Encoded
      readonly payload: typeof SendEvmTransactionRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof SendEvmTransaction200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"SendEvmTransaction400", typeof SendEvmTransaction400.Type>
    | CdpClientError<"SendEvmTransaction401", typeof SendEvmTransaction401.Type>
    | CdpClientError<"SendEvmTransaction402", typeof SendEvmTransaction402.Type>
    | CdpClientError<"SendEvmTransaction403", typeof SendEvmTransaction403.Type>
    | CdpClientError<"SendEvmTransaction404", typeof SendEvmTransaction404.Type>
    | CdpClientError<"SendEvmTransaction409", typeof SendEvmTransaction409.Type>
    | CdpClientError<"SendEvmTransaction422", typeof SendEvmTransaction422.Type>
    | CdpClientError<"SendEvmTransaction500", typeof SendEvmTransaction500.Type>
    | CdpClientError<"SendEvmTransaction502", typeof SendEvmTransaction502.Type>
    | CdpClientError<"SendEvmTransaction503", typeof SendEvmTransaction503.Type>
  >
  /**
   * Signs a transaction with the given EVM account.
   * The transaction should be serialized as a hex string using [RLP](https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/).
   *
   * The transaction must be an [EIP-1559 dynamic fee transaction](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md). The developer is responsible for ensuring that the unsigned transaction is valid, as the API will not validate the transaction.
   */
  readonly signEvmTransaction: <Config extends OperationConfig>(
    address: string,
    options: {
      readonly params: typeof SignEvmTransactionParams.Encoded
      readonly payload: typeof SignEvmTransactionRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof SignEvmTransaction200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"SignEvmTransaction400", typeof SignEvmTransaction400.Type>
    | CdpClientError<"SignEvmTransaction401", typeof SignEvmTransaction401.Type>
    | CdpClientError<"SignEvmTransaction402", typeof SignEvmTransaction402.Type>
    | CdpClientError<"SignEvmTransaction403", typeof SignEvmTransaction403.Type>
    | CdpClientError<"SignEvmTransaction404", typeof SignEvmTransaction404.Type>
    | CdpClientError<"SignEvmTransaction409", typeof SignEvmTransaction409.Type>
    | CdpClientError<"SignEvmTransaction422", typeof SignEvmTransaction422.Type>
    | CdpClientError<"SignEvmTransaction500", typeof SignEvmTransaction500.Type>
    | CdpClientError<"SignEvmTransaction502", typeof SignEvmTransaction502.Type>
    | CdpClientError<"SignEvmTransaction503", typeof SignEvmTransaction503.Type>
  >
  /**
   * Signs an arbitrary 32 byte hash with the given EVM account.
   */
  readonly signEvmHash: <Config extends OperationConfig>(
    address: string,
    options: {
      readonly params: typeof SignEvmHashParams.Encoded
      readonly payload: typeof SignEvmHashRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof SignEvmHash200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"SignEvmHash400", typeof SignEvmHash400.Type>
    | CdpClientError<"SignEvmHash402", typeof SignEvmHash402.Type>
    | CdpClientError<"SignEvmHash404", typeof SignEvmHash404.Type>
    | CdpClientError<"SignEvmHash409", typeof SignEvmHash409.Type>
    | CdpClientError<"SignEvmHash422", typeof SignEvmHash422.Type>
    | CdpClientError<"SignEvmHash500", typeof SignEvmHash500.Type>
    | CdpClientError<"SignEvmHash502", typeof SignEvmHash502.Type>
    | CdpClientError<"SignEvmHash503", typeof SignEvmHash503.Type>
  >
  /**
   * Signs an [EIP-191](https://eips.ethereum.org/EIPS/eip-191) message with the given EVM account.
   *
   * Per the specification, the message in the request body is prepended with `0x19 <0x45 (E)> <thereum Signed Message:\n" + len(message)>` before being signed.
   */
  readonly signEvmMessage: <Config extends OperationConfig>(
    address: string,
    options: {
      readonly params: typeof SignEvmMessageParams.Encoded
      readonly payload: typeof SignEvmMessageRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof SignEvmMessage200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"SignEvmMessage401", typeof SignEvmMessage401.Type>
    | CdpClientError<"SignEvmMessage402", typeof SignEvmMessage402.Type>
    | CdpClientError<"SignEvmMessage404", typeof SignEvmMessage404.Type>
    | CdpClientError<"SignEvmMessage409", typeof SignEvmMessage409.Type>
    | CdpClientError<"SignEvmMessage422", typeof SignEvmMessage422.Type>
    | CdpClientError<"SignEvmMessage500", typeof SignEvmMessage500.Type>
    | CdpClientError<"SignEvmMessage502", typeof SignEvmMessage502.Type>
    | CdpClientError<"SignEvmMessage503", typeof SignEvmMessage503.Type>
  >
  /**
   * Signs [EIP-712](https://eips.ethereum.org/EIPS/eip-712) typed data with the given EVM account.
   */
  readonly signEvmTypedData: <Config extends OperationConfig>(
    address: string,
    options: {
      readonly params: typeof SignEvmTypedDataParams.Encoded
      readonly payload: typeof SignEvmTypedDataRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof SignEvmTypedData200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"SignEvmTypedData400", typeof SignEvmTypedData400.Type>
    | CdpClientError<"SignEvmTypedData401", typeof SignEvmTypedData401.Type>
    | CdpClientError<"SignEvmTypedData402", typeof SignEvmTypedData402.Type>
    | CdpClientError<"SignEvmTypedData404", typeof SignEvmTypedData404.Type>
    | CdpClientError<"SignEvmTypedData422", typeof SignEvmTypedData422.Type>
    | CdpClientError<"SignEvmTypedData500", typeof SignEvmTypedData500.Type>
    | CdpClientError<"SignEvmTypedData502", typeof SignEvmTypedData502.Type>
    | CdpClientError<"SignEvmTypedData503", typeof SignEvmTypedData503.Type>
  >
  /**
   * Creates an EIP-7702 delegation for an EVM EOA account, upgrading it with smart account capabilities.
   *
   * This endpoint:
   * - Retrieves delegation artifacts from onchain
   * - Signs the EIP-7702 authorization for delegation
   * - Assembles and submits a Type 4 transaction
   * - Creates an associated smart account object
   *
   * The delegation allows the EVM EOA to be used as a smart account, which enables batched transactions and gas sponsorship via paymaster.
   */
  readonly createEvmEip7702Delegation: <Config extends OperationConfig>(
    address: string,
    options: {
      readonly params: typeof CreateEvmEip7702DelegationParams.Encoded
      readonly payload: typeof CreateEvmEip7702DelegationRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof CreateEvmEip7702Delegation201.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"CreateEvmEip7702Delegation400", typeof CreateEvmEip7702Delegation400.Type>
    | CdpClientError<"CreateEvmEip7702Delegation401", typeof CreateEvmEip7702Delegation401.Type>
    | CdpClientError<"CreateEvmEip7702Delegation402", typeof CreateEvmEip7702Delegation402.Type>
    | CdpClientError<"CreateEvmEip7702Delegation404", typeof CreateEvmEip7702Delegation404.Type>
    | CdpClientError<"CreateEvmEip7702Delegation409", typeof CreateEvmEip7702Delegation409.Type>
    | CdpClientError<"CreateEvmEip7702Delegation422", typeof CreateEvmEip7702Delegation422.Type>
    | CdpClientError<"CreateEvmEip7702Delegation500", typeof CreateEvmEip7702Delegation500.Type>
    | CdpClientError<"CreateEvmEip7702Delegation502", typeof CreateEvmEip7702Delegation502.Type>
    | CdpClientError<"CreateEvmEip7702Delegation503", typeof CreateEvmEip7702Delegation503.Type>
  >
  /**
   * Returns the EIP-7702 delegation operation. Use the delegationOperationId returned by the Create EIP-7702 delegation endpoint to poll for operation completion.
   */
  readonly getEvmEip7702DelegationOperationById: <Config extends OperationConfig>(
    delegationOperationId: string,
    options: { readonly config?: Config | undefined } | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof GetEvmEip7702DelegationOperationById200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"GetEvmEip7702DelegationOperationById400", typeof GetEvmEip7702DelegationOperationById400.Type>
    | CdpClientError<"GetEvmEip7702DelegationOperationById404", typeof GetEvmEip7702DelegationOperationById404.Type>
    | CdpClientError<"GetEvmEip7702DelegationOperationById500", typeof GetEvmEip7702DelegationOperationById500.Type>
    | CdpClientError<"GetEvmEip7702DelegationOperationById502", typeof GetEvmEip7702DelegationOperationById502.Type>
    | CdpClientError<"GetEvmEip7702DelegationOperationById503", typeof GetEvmEip7702DelegationOperationById503.Type>
  >
  /**
   * Lists the Smart Accounts belonging to the developer's CDP Project.
   * The response is paginated, and by default, returns 20 accounts per page.
   */
  readonly listEvmSmartAccounts: <Config extends OperationConfig>(
    options:
      | {
          readonly params?: typeof ListEvmSmartAccountsParams.Encoded | undefined
          readonly config?: Config | undefined
        }
      | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof ListEvmSmartAccounts200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ListEvmSmartAccounts400", typeof ListEvmSmartAccounts400.Type>
    | CdpClientError<"ListEvmSmartAccounts500", typeof ListEvmSmartAccounts500.Type>
    | CdpClientError<"ListEvmSmartAccounts502", typeof ListEvmSmartAccounts502.Type>
    | CdpClientError<"ListEvmSmartAccounts503", typeof ListEvmSmartAccounts503.Type>
  >
  /**
   * Creates a new Smart Account.
   */
  readonly createEvmSmartAccount: <Config extends OperationConfig>(options: {
    readonly params?: typeof CreateEvmSmartAccountParams.Encoded | undefined
    readonly payload: typeof CreateEvmSmartAccountRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof CreateEvmSmartAccount201.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"CreateEvmSmartAccount400", typeof CreateEvmSmartAccount400.Type>
    | CdpClientError<"CreateEvmSmartAccount402", typeof CreateEvmSmartAccount402.Type>
    | CdpClientError<"CreateEvmSmartAccount500", typeof CreateEvmSmartAccount500.Type>
    | CdpClientError<"CreateEvmSmartAccount502", typeof CreateEvmSmartAccount502.Type>
    | CdpClientError<"CreateEvmSmartAccount503", typeof CreateEvmSmartAccount503.Type>
  >
  /**
   * Gets a Smart Account by its name.
   */
  readonly getEvmSmartAccountByName: <Config extends OperationConfig>(
    name: string,
    options: { readonly config?: Config | undefined } | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof GetEvmSmartAccountByName200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"GetEvmSmartAccountByName400", typeof GetEvmSmartAccountByName400.Type>
    | CdpClientError<"GetEvmSmartAccountByName404", typeof GetEvmSmartAccountByName404.Type>
    | CdpClientError<"GetEvmSmartAccountByName500", typeof GetEvmSmartAccountByName500.Type>
    | CdpClientError<"GetEvmSmartAccountByName502", typeof GetEvmSmartAccountByName502.Type>
    | CdpClientError<"GetEvmSmartAccountByName503", typeof GetEvmSmartAccountByName503.Type>
  >
  /**
   * Import an existing EVM account into the developer's CDP Project. This API should be called from the [CDP SDK](https://github.com/coinbase/cdp-sdk) to ensure that the associated private key is properly encrypted.
   */
  readonly importEvmAccount: <Config extends OperationConfig>(options: {
    readonly params: typeof ImportEvmAccountParams.Encoded
    readonly payload: typeof ImportEvmAccountRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof ImportEvmAccount201.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ImportEvmAccount400", typeof ImportEvmAccount400.Type>
    | CdpClientError<"ImportEvmAccount401", typeof ImportEvmAccount401.Type>
    | CdpClientError<"ImportEvmAccount402", typeof ImportEvmAccount402.Type>
    | CdpClientError<"ImportEvmAccount409", typeof ImportEvmAccount409.Type>
    | CdpClientError<"ImportEvmAccount422", typeof ImportEvmAccount422.Type>
    | CdpClientError<"ImportEvmAccount500", typeof ImportEvmAccount500.Type>
    | CdpClientError<"ImportEvmAccount502", typeof ImportEvmAccount502.Type>
    | CdpClientError<"ImportEvmAccount503", typeof ImportEvmAccount503.Type>
  >
  /**
   * Export an existing EVM account's private key. It is important to store the private key in a secure place after it's exported.
   */
  readonly exportEvmAccount: <Config extends OperationConfig>(
    address: string,
    options: {
      readonly params: typeof ExportEvmAccountParams.Encoded
      readonly payload: typeof ExportEvmAccountRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof ExportEvmAccount200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ExportEvmAccount400", typeof ExportEvmAccount400.Type>
    | CdpClientError<"ExportEvmAccount401", typeof ExportEvmAccount401.Type>
    | CdpClientError<"ExportEvmAccount402", typeof ExportEvmAccount402.Type>
    | CdpClientError<"ExportEvmAccount404", typeof ExportEvmAccount404.Type>
    | CdpClientError<"ExportEvmAccount422", typeof ExportEvmAccount422.Type>
    | CdpClientError<"ExportEvmAccount500", typeof ExportEvmAccount500.Type>
    | CdpClientError<"ExportEvmAccount502", typeof ExportEvmAccount502.Type>
    | CdpClientError<"ExportEvmAccount503", typeof ExportEvmAccount503.Type>
  >
  /**
   * Export an existing EVM account's private key by its name. It is important to store the private key in a secure place after it's exported.
   */
  readonly exportEvmAccountByName: <Config extends OperationConfig>(
    name: string,
    options: {
      readonly params: typeof ExportEvmAccountByNameParams.Encoded
      readonly payload: typeof ExportEvmAccountByNameRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof ExportEvmAccountByName200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ExportEvmAccountByName400", typeof ExportEvmAccountByName400.Type>
    | CdpClientError<"ExportEvmAccountByName401", typeof ExportEvmAccountByName401.Type>
    | CdpClientError<"ExportEvmAccountByName402", typeof ExportEvmAccountByName402.Type>
    | CdpClientError<"ExportEvmAccountByName404", typeof ExportEvmAccountByName404.Type>
    | CdpClientError<"ExportEvmAccountByName422", typeof ExportEvmAccountByName422.Type>
    | CdpClientError<"ExportEvmAccountByName500", typeof ExportEvmAccountByName500.Type>
    | CdpClientError<"ExportEvmAccountByName502", typeof ExportEvmAccountByName502.Type>
    | CdpClientError<"ExportEvmAccountByName503", typeof ExportEvmAccountByName503.Type>
  >
  /**
   * Gets a Smart Account by its address.
   */
  readonly getEvmSmartAccount: <Config extends OperationConfig>(
    address: string,
    options: { readonly config?: Config | undefined } | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof GetEvmSmartAccount200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"GetEvmSmartAccount400", typeof GetEvmSmartAccount400.Type>
    | CdpClientError<"GetEvmSmartAccount404", typeof GetEvmSmartAccount404.Type>
    | CdpClientError<"GetEvmSmartAccount500", typeof GetEvmSmartAccount500.Type>
    | CdpClientError<"GetEvmSmartAccount502", typeof GetEvmSmartAccount502.Type>
    | CdpClientError<"GetEvmSmartAccount503", typeof GetEvmSmartAccount503.Type>
  >
  /**
   * Updates an existing EVM smart account. Use this to update the smart account's name.
   */
  readonly updateEvmSmartAccount: <Config extends OperationConfig>(
    address: string,
    options: {
      readonly payload: typeof UpdateEvmSmartAccountRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof UpdateEvmSmartAccount200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"UpdateEvmSmartAccount400", typeof UpdateEvmSmartAccount400.Type>
    | CdpClientError<"UpdateEvmSmartAccount404", typeof UpdateEvmSmartAccount404.Type>
    | CdpClientError<"UpdateEvmSmartAccount409", typeof UpdateEvmSmartAccount409.Type>
    | CdpClientError<"UpdateEvmSmartAccount422", typeof UpdateEvmSmartAccount422.Type>
    | CdpClientError<"UpdateEvmSmartAccount500", typeof UpdateEvmSmartAccount500.Type>
    | CdpClientError<"UpdateEvmSmartAccount502", typeof UpdateEvmSmartAccount502.Type>
    | CdpClientError<"UpdateEvmSmartAccount503", typeof UpdateEvmSmartAccount503.Type>
  >
  /**
   * Prepares a new user operation on a Smart Account for a specific network.
   */
  readonly prepareUserOperation: <Config extends OperationConfig>(
    address: string,
    options: { readonly payload: typeof PrepareUserOperationRequestJson.Encoded; readonly config?: Config | undefined },
  ) => Effect.Effect<
    WithOptionalResponse<typeof PrepareUserOperation201.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"PrepareUserOperation400", typeof PrepareUserOperation400.Type>
    | CdpClientError<"PrepareUserOperation403", typeof PrepareUserOperation403.Type>
    | CdpClientError<"PrepareUserOperation404", typeof PrepareUserOperation404.Type>
    | CdpClientError<"PrepareUserOperation500", typeof PrepareUserOperation500.Type>
    | CdpClientError<"PrepareUserOperation502", typeof PrepareUserOperation502.Type>
    | CdpClientError<"PrepareUserOperation503", typeof PrepareUserOperation503.Type>
  >
  /**
   * Prepares, signs, and sends a user operation for an EVM Smart Account. This API can be used only if the owner on Smart Account is a CDP EVM Account.
   */
  readonly prepareAndSendUserOperation: <Config extends OperationConfig>(
    address: string,
    options: {
      readonly params: typeof PrepareAndSendUserOperationParams.Encoded
      readonly payload: typeof PrepareAndSendUserOperationRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof PrepareAndSendUserOperation200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"PrepareAndSendUserOperation400", typeof PrepareAndSendUserOperation400.Type>
    | CdpClientError<"PrepareAndSendUserOperation401", typeof PrepareAndSendUserOperation401.Type>
    | CdpClientError<"PrepareAndSendUserOperation402", typeof PrepareAndSendUserOperation402.Type>
    | CdpClientError<"PrepareAndSendUserOperation403", typeof PrepareAndSendUserOperation403.Type>
    | CdpClientError<"PrepareAndSendUserOperation404", typeof PrepareAndSendUserOperation404.Type>
    | CdpClientError<"PrepareAndSendUserOperation429", typeof PrepareAndSendUserOperation429.Type>
    | CdpClientError<"PrepareAndSendUserOperation500", typeof PrepareAndSendUserOperation500.Type>
    | CdpClientError<"PrepareAndSendUserOperation502", typeof PrepareAndSendUserOperation502.Type>
    | CdpClientError<"PrepareAndSendUserOperation503", typeof PrepareAndSendUserOperation503.Type>
  >
  /**
   * Gets a user operation by its hash.
   */
  readonly getUserOperation: <Config extends OperationConfig>(
    address: string,
    userOpHash: string,
    options: { readonly config?: Config | undefined } | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof GetUserOperation200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"GetUserOperation400", typeof GetUserOperation400.Type>
    | CdpClientError<"GetUserOperation404", typeof GetUserOperation404.Type>
    | CdpClientError<"GetUserOperation500", typeof GetUserOperation500.Type>
    | CdpClientError<"GetUserOperation502", typeof GetUserOperation502.Type>
    | CdpClientError<"GetUserOperation503", typeof GetUserOperation503.Type>
  >
  /**
   * Sends a user operation with a signature.
   * The payload to sign must be the `userOpHash` field of the user operation. This hash should be signed directly (not using `personal_sign` or EIP-191 message hashing).
   * The signature must be 65 bytes in length, consisting of: - 32 bytes for the `r` value - 32 bytes for the `s` value - 1 byte for the `v` value (must be 27 or 28)
   * If using the CDP Paymaster, the user operation must be signed and sent within 2 minutes of being prepared.
   */
  readonly sendUserOperation: <Config extends OperationConfig>(
    address: string,
    userOpHash: string,
    options: { readonly payload: typeof SendUserOperationRequestJson.Encoded; readonly config?: Config | undefined },
  ) => Effect.Effect<
    WithOptionalResponse<typeof SendUserOperation200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"SendUserOperation400", typeof SendUserOperation400.Type>
    | CdpClientError<"SendUserOperation402", typeof SendUserOperation402.Type>
    | CdpClientError<"SendUserOperation403", typeof SendUserOperation403.Type>
    | CdpClientError<"SendUserOperation404", typeof SendUserOperation404.Type>
    | CdpClientError<"SendUserOperation429", typeof SendUserOperation429.Type>
    | CdpClientError<"SendUserOperation500", typeof SendUserOperation500.Type>
    | CdpClientError<"SendUserOperation502", typeof SendUserOperation502.Type>
    | CdpClientError<"SendUserOperation503", typeof SendUserOperation503.Type>
  >
  /**
   * Creates a spend permission for the given smart account address.
   */
  readonly createSpendPermission: <Config extends OperationConfig>(
    address: string,
    options: {
      readonly params: typeof CreateSpendPermissionParams.Encoded
      readonly payload: typeof CreateSpendPermissionRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof CreateSpendPermission200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"CreateSpendPermission400", typeof CreateSpendPermission400.Type>
    | CdpClientError<"CreateSpendPermission402", typeof CreateSpendPermission402.Type>
    | CdpClientError<"CreateSpendPermission404", typeof CreateSpendPermission404.Type>
    | CdpClientError<"CreateSpendPermission500", typeof CreateSpendPermission500.Type>
    | CdpClientError<"CreateSpendPermission502", typeof CreateSpendPermission502.Type>
    | CdpClientError<"CreateSpendPermission503", typeof CreateSpendPermission503.Type>
  >
  /**
   * Lists spend permission for the given smart account address.
   */
  readonly listSpendPermissions: <Config extends OperationConfig>(
    address: string,
    options:
      | {
          readonly params?: typeof ListSpendPermissionsParams.Encoded | undefined
          readonly config?: Config | undefined
        }
      | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof ListSpendPermissions200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ListSpendPermissions400", typeof ListSpendPermissions400.Type>
    | CdpClientError<"ListSpendPermissions404", typeof ListSpendPermissions404.Type>
    | CdpClientError<"ListSpendPermissions500", typeof ListSpendPermissions500.Type>
    | CdpClientError<"ListSpendPermissions502", typeof ListSpendPermissions502.Type>
    | CdpClientError<"ListSpendPermissions503", typeof ListSpendPermissions503.Type>
  >
  /**
   * Revokes an existing spend permission.
   */
  readonly revokeSpendPermission: <Config extends OperationConfig>(
    address: string,
    options: {
      readonly params: typeof RevokeSpendPermissionParams.Encoded
      readonly payload: typeof RevokeSpendPermissionRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof RevokeSpendPermission200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"RevokeSpendPermission400", typeof RevokeSpendPermission400.Type>
    | CdpClientError<"RevokeSpendPermission402", typeof RevokeSpendPermission402.Type>
    | CdpClientError<"RevokeSpendPermission404", typeof RevokeSpendPermission404.Type>
    | CdpClientError<"RevokeSpendPermission500", typeof RevokeSpendPermission500.Type>
    | CdpClientError<"RevokeSpendPermission502", typeof RevokeSpendPermission502.Type>
    | CdpClientError<"RevokeSpendPermission503", typeof RevokeSpendPermission503.Type>
  >
  /**
   * Get a price estimate for a swap between two tokens on an EVM network.
   */
  readonly getEvmSwapPrice: <Config extends OperationConfig>(options: {
    readonly params: typeof GetEvmSwapPriceParams.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof GetEvmSwapPrice200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"GetEvmSwapPrice400", typeof GetEvmSwapPrice400.Type>
    | CdpClientError<"GetEvmSwapPrice403", typeof GetEvmSwapPrice403.Type>
    | CdpClientError<"GetEvmSwapPrice500", typeof GetEvmSwapPrice500.Type>
    | CdpClientError<"GetEvmSwapPrice502", typeof GetEvmSwapPrice502.Type>
    | CdpClientError<"GetEvmSwapPrice503", typeof GetEvmSwapPrice503.Type>
  >
  /**
   * Create a swap quote, which includes the payload to sign as well as the transaction data needed to execute the swap. The developer is responsible for signing the payload and submitting the transaction to the network in order to execute the swap.
   */
  readonly createEvmSwapQuote: <Config extends OperationConfig>(options: {
    readonly params?: typeof CreateEvmSwapQuoteParams.Encoded | undefined
    readonly payload: typeof CreateEvmSwapQuoteRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof CreateEvmSwapQuote201.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"CreateEvmSwapQuote400", typeof CreateEvmSwapQuote400.Type>
    | CdpClientError<"CreateEvmSwapQuote403", typeof CreateEvmSwapQuote403.Type>
    | CdpClientError<"CreateEvmSwapQuote500", typeof CreateEvmSwapQuote500.Type>
    | CdpClientError<"CreateEvmSwapQuote502", typeof CreateEvmSwapQuote502.Type>
    | CdpClientError<"CreateEvmSwapQuote503", typeof CreateEvmSwapQuote503.Type>
  >
  /**
   * Lists the token balances of an EVM address on a given network. The balances include ERC-20 tokens and the native gas token (usually ETH). The response is paginated, and by default, returns 20 balances per page.
   * **Note:** This endpoint is still under development and does not yet provide strong freshness guarantees. Specifically, balances of new tokens can, on occasion, take up to ~30 seconds to appear, while balances of tokens already belonging to an address will generally be close to chain tip. Freshness of new token balances will improve over the coming weeks.
   */
  readonly listEvmTokenBalances: <Config extends OperationConfig>(
    network: string,
    address: string,
    options:
      | {
          readonly params?: typeof ListEvmTokenBalancesParams.Encoded | undefined
          readonly config?: Config | undefined
        }
      | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof ListEvmTokenBalances200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ListEvmTokenBalances400", typeof ListEvmTokenBalances400.Type>
    | CdpClientError<"ListEvmTokenBalances404", typeof ListEvmTokenBalances404.Type>
    | CdpClientError<"ListEvmTokenBalances500", typeof ListEvmTokenBalances500.Type>
    | CdpClientError<"ListEvmTokenBalances502", typeof ListEvmTokenBalances502.Type>
    | CdpClientError<"ListEvmTokenBalances503", typeof ListEvmTokenBalances503.Type>
  >
  /**
   * Request funds from the CDP Faucet on supported EVM test networks.
   *
   * Faucets are available for ETH, USDC, EURC, and cbBTC on Base Sepolia and Ethereum Sepolia, and for ETH only on Ethereum Hoodi.
   *
   * To prevent abuse, we enforce rate limits within a rolling 24-hour window to control the amount of funds that can be requested.
   * These limits are applied at both the CDP User level and the blockchain address level.
   * A single blockchain address cannot exceed the specified limits, even if multiple users submit requests to the same address.
   *
   * | Token | Amount per Faucet Request |Rolling 24-hour window Rate Limits|
   * |:-----:|:-------------------------:|:--------------------------------:|
   * | ETH   | 0.0001 ETH                | 0.1 ETH                          |
   * | USDC  | 1 USDC                    | 10 USDC                          |
   * | EURC  | 1 EURC                    | 10 EURC                          |
   * | cbBTC | 0.0001 cbBTC              | 0.001 cbBTC                      |
   */
  readonly requestEvmFaucet: <Config extends OperationConfig>(options: {
    readonly payload: typeof RequestEvmFaucetRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof RequestEvmFaucet200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"RequestEvmFaucet400", typeof RequestEvmFaucet400.Type>
    | CdpClientError<"RequestEvmFaucet403", typeof RequestEvmFaucet403.Type>
    | CdpClientError<"RequestEvmFaucet429", typeof RequestEvmFaucet429.Type>
    | CdpClientError<"RequestEvmFaucet500", typeof RequestEvmFaucet500.Type>
    | CdpClientError<"RequestEvmFaucet502", typeof RequestEvmFaucet502.Type>
    | CdpClientError<"RequestEvmFaucet503", typeof RequestEvmFaucet503.Type>
  >
  /**
   * Lists the policies belonging to the developer's CDP Project. Use the `scope` parameter to filter the policies by scope.
   * The response is paginated, and by default, returns 20 policies per page.
   */
  readonly listPolicies: <Config extends OperationConfig>(
    options:
      | { readonly params?: typeof ListPoliciesParams.Encoded | undefined; readonly config?: Config | undefined }
      | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof ListPolicies200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ListPolicies500", typeof ListPolicies500.Type>
    | CdpClientError<"ListPolicies502", typeof ListPolicies502.Type>
    | CdpClientError<"ListPolicies503", typeof ListPolicies503.Type>
  >
  /**
   * Create a policy that can be used to govern the behavior of accounts.
   */
  readonly createPolicy: <Config extends OperationConfig>(options: {
    readonly params?: typeof CreatePolicyParams.Encoded | undefined
    readonly payload: typeof CreatePolicyRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof CreatePolicy201.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"CreatePolicy400", typeof CreatePolicy400.Type>
    | CdpClientError<"CreatePolicy409", typeof CreatePolicy409.Type>
    | CdpClientError<"CreatePolicy422", typeof CreatePolicy422.Type>
    | CdpClientError<"CreatePolicy500", typeof CreatePolicy500.Type>
    | CdpClientError<"CreatePolicy502", typeof CreatePolicy502.Type>
    | CdpClientError<"CreatePolicy503", typeof CreatePolicy503.Type>
  >
  /**
   * Get a policy by its ID.
   */
  readonly getPolicyById: <Config extends OperationConfig>(
    policyId: string,
    options: { readonly config?: Config | undefined } | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof GetPolicyById200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"GetPolicyById404", typeof GetPolicyById404.Type>
    | CdpClientError<"GetPolicyById500", typeof GetPolicyById500.Type>
    | CdpClientError<"GetPolicyById502", typeof GetPolicyById502.Type>
    | CdpClientError<"GetPolicyById503", typeof GetPolicyById503.Type>
  >
  /**
   * Updates a policy by its ID. This will have the effect of applying the updated policy to all accounts that are currently using it.
   */
  readonly updatePolicy: <Config extends OperationConfig>(
    policyId: string,
    options: {
      readonly params?: typeof UpdatePolicyParams.Encoded | undefined
      readonly payload: typeof UpdatePolicyRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof UpdatePolicy200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"UpdatePolicy400", typeof UpdatePolicy400.Type>
    | CdpClientError<"UpdatePolicy404", typeof UpdatePolicy404.Type>
    | CdpClientError<"UpdatePolicy409", typeof UpdatePolicy409.Type>
    | CdpClientError<"UpdatePolicy422", typeof UpdatePolicy422.Type>
    | CdpClientError<"UpdatePolicy500", typeof UpdatePolicy500.Type>
    | CdpClientError<"UpdatePolicy502", typeof UpdatePolicy502.Type>
    | CdpClientError<"UpdatePolicy503", typeof UpdatePolicy503.Type>
  >
  /**
   * Delete a policy by its ID. This will have the effect of removing the policy from all accounts that are currently using it.
   */
  readonly deletePolicy: <Config extends OperationConfig>(
    policyId: string,
    options:
      | { readonly params?: typeof DeletePolicyParams.Encoded | undefined; readonly config?: Config | undefined }
      | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<void, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"DeletePolicy400", typeof DeletePolicy400.Type>
    | CdpClientError<"DeletePolicy404", typeof DeletePolicy404.Type>
    | CdpClientError<"DeletePolicy409", typeof DeletePolicy409.Type>
    | CdpClientError<"DeletePolicy422", typeof DeletePolicy422.Type>
    | CdpClientError<"DeletePolicy500", typeof DeletePolicy500.Type>
    | CdpClientError<"DeletePolicy502", typeof DeletePolicy502.Type>
    | CdpClientError<"DeletePolicy503", typeof DeletePolicy503.Type>
  >
  /**
   * Lists the Solana accounts belonging to the developer.
   * The response is paginated, and by default, returns 20 accounts per page.
   *
   * If a name is provided, the response will contain only the account with that name.
   */
  readonly listSolanaAccounts: <Config extends OperationConfig>(
    options:
      | { readonly params?: typeof ListSolanaAccountsParams.Encoded | undefined; readonly config?: Config | undefined }
      | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof ListSolanaAccounts200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ListSolanaAccounts500", typeof ListSolanaAccounts500.Type>
    | CdpClientError<"ListSolanaAccounts502", typeof ListSolanaAccounts502.Type>
    | CdpClientError<"ListSolanaAccounts503", typeof ListSolanaAccounts503.Type>
  >
  /**
   * Creates a new Solana account.
   */
  readonly createSolanaAccount: <Config extends OperationConfig>(options: {
    readonly params: typeof CreateSolanaAccountParams.Encoded
    readonly payload: typeof CreateSolanaAccountRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof CreateSolanaAccount201.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"CreateSolanaAccount400", typeof CreateSolanaAccount400.Type>
    | CdpClientError<"CreateSolanaAccount401", typeof CreateSolanaAccount401.Type>
    | CdpClientError<"CreateSolanaAccount402", typeof CreateSolanaAccount402.Type>
    | CdpClientError<"CreateSolanaAccount409", typeof CreateSolanaAccount409.Type>
    | CdpClientError<"CreateSolanaAccount422", typeof CreateSolanaAccount422.Type>
    | CdpClientError<"CreateSolanaAccount500", typeof CreateSolanaAccount500.Type>
    | CdpClientError<"CreateSolanaAccount502", typeof CreateSolanaAccount502.Type>
    | CdpClientError<"CreateSolanaAccount503", typeof CreateSolanaAccount503.Type>
  >
  /**
   * Gets a Solana account by its address.
   */
  readonly getSolanaAccount: <Config extends OperationConfig>(
    address: string,
    options: { readonly config?: Config | undefined } | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof GetSolanaAccount200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"GetSolanaAccount400", typeof GetSolanaAccount400.Type>
    | CdpClientError<"GetSolanaAccount404", typeof GetSolanaAccount404.Type>
    | CdpClientError<"GetSolanaAccount500", typeof GetSolanaAccount500.Type>
    | CdpClientError<"GetSolanaAccount502", typeof GetSolanaAccount502.Type>
    | CdpClientError<"GetSolanaAccount503", typeof GetSolanaAccount503.Type>
  >
  /**
   * Updates an existing Solana account. Use this to update the account's name or account-level policy.
   */
  readonly updateSolanaAccount: <Config extends OperationConfig>(
    address: string,
    options: {
      readonly params?: typeof UpdateSolanaAccountParams.Encoded | undefined
      readonly payload: typeof UpdateSolanaAccountRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof UpdateSolanaAccount200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"UpdateSolanaAccount400", typeof UpdateSolanaAccount400.Type>
    | CdpClientError<"UpdateSolanaAccount404", typeof UpdateSolanaAccount404.Type>
    | CdpClientError<"UpdateSolanaAccount409", typeof UpdateSolanaAccount409.Type>
    | CdpClientError<"UpdateSolanaAccount422", typeof UpdateSolanaAccount422.Type>
    | CdpClientError<"UpdateSolanaAccount500", typeof UpdateSolanaAccount500.Type>
    | CdpClientError<"UpdateSolanaAccount502", typeof UpdateSolanaAccount502.Type>
    | CdpClientError<"UpdateSolanaAccount503", typeof UpdateSolanaAccount503.Type>
  >
  /**
   * Gets a Solana account by its name.
   */
  readonly getSolanaAccountByName: <Config extends OperationConfig>(
    name: string,
    options: { readonly config?: Config | undefined } | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof GetSolanaAccountByName200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"GetSolanaAccountByName400", typeof GetSolanaAccountByName400.Type>
    | CdpClientError<"GetSolanaAccountByName404", typeof GetSolanaAccountByName404.Type>
    | CdpClientError<"GetSolanaAccountByName500", typeof GetSolanaAccountByName500.Type>
    | CdpClientError<"GetSolanaAccountByName502", typeof GetSolanaAccountByName502.Type>
    | CdpClientError<"GetSolanaAccountByName503", typeof GetSolanaAccountByName503.Type>
  >
  /**
   * Import an existing Solana account into the developer's CDP Project. This API should be called from the [CDP SDK](https://github.com/coinbase/cdp-sdk) to ensure that the associated private key is properly encrypted.
   */
  readonly importSolanaAccount: <Config extends OperationConfig>(options: {
    readonly params: typeof ImportSolanaAccountParams.Encoded
    readonly payload: typeof ImportSolanaAccountRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof ImportSolanaAccount201.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ImportSolanaAccount400", typeof ImportSolanaAccount400.Type>
    | CdpClientError<"ImportSolanaAccount401", typeof ImportSolanaAccount401.Type>
    | CdpClientError<"ImportSolanaAccount402", typeof ImportSolanaAccount402.Type>
    | CdpClientError<"ImportSolanaAccount409", typeof ImportSolanaAccount409.Type>
    | CdpClientError<"ImportSolanaAccount422", typeof ImportSolanaAccount422.Type>
    | CdpClientError<"ImportSolanaAccount500", typeof ImportSolanaAccount500.Type>
    | CdpClientError<"ImportSolanaAccount502", typeof ImportSolanaAccount502.Type>
    | CdpClientError<"ImportSolanaAccount503", typeof ImportSolanaAccount503.Type>
  >
  /**
   * Export an existing Solana account's private key. It is important to store the private key in a secure place after it's exported.
   */
  readonly exportSolanaAccount: <Config extends OperationConfig>(
    address: string,
    options: {
      readonly params: typeof ExportSolanaAccountParams.Encoded
      readonly payload: typeof ExportSolanaAccountRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof ExportSolanaAccount200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ExportSolanaAccount400", typeof ExportSolanaAccount400.Type>
    | CdpClientError<"ExportSolanaAccount401", typeof ExportSolanaAccount401.Type>
    | CdpClientError<"ExportSolanaAccount402", typeof ExportSolanaAccount402.Type>
    | CdpClientError<"ExportSolanaAccount404", typeof ExportSolanaAccount404.Type>
    | CdpClientError<"ExportSolanaAccount422", typeof ExportSolanaAccount422.Type>
    | CdpClientError<"ExportSolanaAccount500", typeof ExportSolanaAccount500.Type>
    | CdpClientError<"ExportSolanaAccount502", typeof ExportSolanaAccount502.Type>
    | CdpClientError<"ExportSolanaAccount503", typeof ExportSolanaAccount503.Type>
  >
  /**
   * Export an existing Solana account's private key by its name. It is important to store the private key in a secure place after it's exported.
   */
  readonly exportSolanaAccountByName: <Config extends OperationConfig>(
    name: string,
    options: {
      readonly params: typeof ExportSolanaAccountByNameParams.Encoded
      readonly payload: typeof ExportSolanaAccountByNameRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof ExportSolanaAccountByName200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ExportSolanaAccountByName400", typeof ExportSolanaAccountByName400.Type>
    | CdpClientError<"ExportSolanaAccountByName401", typeof ExportSolanaAccountByName401.Type>
    | CdpClientError<"ExportSolanaAccountByName402", typeof ExportSolanaAccountByName402.Type>
    | CdpClientError<"ExportSolanaAccountByName404", typeof ExportSolanaAccountByName404.Type>
    | CdpClientError<"ExportSolanaAccountByName422", typeof ExportSolanaAccountByName422.Type>
    | CdpClientError<"ExportSolanaAccountByName500", typeof ExportSolanaAccountByName500.Type>
    | CdpClientError<"ExportSolanaAccountByName502", typeof ExportSolanaAccountByName502.Type>
    | CdpClientError<"ExportSolanaAccountByName503", typeof ExportSolanaAccountByName503.Type>
  >
  /**
   * Signs a transaction with the given Solana account.
   * The unsigned transaction should be serialized into a byte array and then encoded as base64.
   *
   * **Transaction types**
   *
   * The following transaction types are supported:
   * * [Legacy transactions](https://solana-labs.github.io/solana-web3.js/classes/Transaction.html)
   * * [Versioned transactions](https://solana-labs.github.io/solana-web3.js/classes/VersionedTransaction.html)
   *
   * The developer is responsible for ensuring that the unsigned transaction is valid, as the API will not validate the transaction.
   */
  readonly signSolanaTransaction: <Config extends OperationConfig>(
    address: string,
    options: {
      readonly params: typeof SignSolanaTransactionParams.Encoded
      readonly payload: typeof SignSolanaTransactionRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof SignSolanaTransaction200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"SignSolanaTransaction400", typeof SignSolanaTransaction400.Type>
    | CdpClientError<"SignSolanaTransaction401", typeof SignSolanaTransaction401.Type>
    | CdpClientError<"SignSolanaTransaction402", typeof SignSolanaTransaction402.Type>
    | CdpClientError<"SignSolanaTransaction403", typeof SignSolanaTransaction403.Type>
    | CdpClientError<"SignSolanaTransaction404", typeof SignSolanaTransaction404.Type>
    | CdpClientError<"SignSolanaTransaction409", typeof SignSolanaTransaction409.Type>
    | CdpClientError<"SignSolanaTransaction422", typeof SignSolanaTransaction422.Type>
    | CdpClientError<"SignSolanaTransaction500", typeof SignSolanaTransaction500.Type>
    | CdpClientError<"SignSolanaTransaction502", typeof SignSolanaTransaction502.Type>
    | CdpClientError<"SignSolanaTransaction503", typeof SignSolanaTransaction503.Type>
  >
  /**
   * Signs an arbitrary message with the given Solana account.
   *
   * **WARNING:** Never sign a message that you didn't generate, as it can be an arbitrary transaction. For example, it might send all of your funds to an attacker.
   */
  readonly signSolanaMessage: <Config extends OperationConfig>(
    address: string,
    options: {
      readonly params: typeof SignSolanaMessageParams.Encoded
      readonly payload: typeof SignSolanaMessageRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof SignSolanaMessage200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"SignSolanaMessage400", typeof SignSolanaMessage400.Type>
    | CdpClientError<"SignSolanaMessage401", typeof SignSolanaMessage401.Type>
    | CdpClientError<"SignSolanaMessage402", typeof SignSolanaMessage402.Type>
    | CdpClientError<"SignSolanaMessage404", typeof SignSolanaMessage404.Type>
    | CdpClientError<"SignSolanaMessage409", typeof SignSolanaMessage409.Type>
    | CdpClientError<"SignSolanaMessage422", typeof SignSolanaMessage422.Type>
    | CdpClientError<"SignSolanaMessage500", typeof SignSolanaMessage500.Type>
    | CdpClientError<"SignSolanaMessage502", typeof SignSolanaMessage502.Type>
    | CdpClientError<"SignSolanaMessage503", typeof SignSolanaMessage503.Type>
  >
  /**
   * Signs and sends a single Solana transaction using multiple Solana accounts. The transaction may contain contain several instructions, each of which may require signatures from different account keys.
   *
   * The transaction should be serialized into a byte array and base64 encoded. The API handles recent blockhash management and fee estimation, leaving the developer to provide only the minimal set of fields necessary to send the transaction.
   *
   * **Transaction types**
   *
   * The following transaction types are supported:
   * * [Legacy transactions](https://solana.com/developers/guides/advanced/versions#current-transaction-versions)
   * * [Versioned transactions](https://solana.com/developers/guides/advanced/versions)
   *
   * **Instruction Batching**
   *
   * To batch multiple operations, include multiple instructions within a single transaction. All instructions within a transaction are executed atomically - if any instruction fails, the entire transaction fails and is rolled back.
   *
   * **Network Support**
   *
   * The following Solana networks are supported:
   * * `solana` - Solana Mainnet
   * * `solana-devnet` - Solana Devnet
   *
   * The developer is responsible for ensuring that the unsigned transaction is valid, as the API will not validate the transaction.
   */
  readonly sendSolanaTransaction: <Config extends OperationConfig>(options: {
    readonly params: typeof SendSolanaTransactionParams.Encoded
    readonly payload: typeof SendSolanaTransactionRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof SendSolanaTransaction200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"SendSolanaTransaction400", typeof SendSolanaTransaction400.Type>
    | CdpClientError<"SendSolanaTransaction401", typeof SendSolanaTransaction401.Type>
    | CdpClientError<"SendSolanaTransaction402", typeof SendSolanaTransaction402.Type>
    | CdpClientError<"SendSolanaTransaction403", typeof SendSolanaTransaction403.Type>
    | CdpClientError<"SendSolanaTransaction404", typeof SendSolanaTransaction404.Type>
    | CdpClientError<"SendSolanaTransaction422", typeof SendSolanaTransaction422.Type>
    | CdpClientError<"SendSolanaTransaction500", typeof SendSolanaTransaction500.Type>
    | CdpClientError<"SendSolanaTransaction502", typeof SendSolanaTransaction502.Type>
    | CdpClientError<"SendSolanaTransaction503", typeof SendSolanaTransaction503.Type>
  >
  /**
   * Request funds from the CDP Faucet on Solana devnet.
   *
   * Faucets are available for SOL, USDC, and CBTUSD.
   *
   * To prevent abuse, we enforce rate limits within a rolling 24-hour window to control the amount of funds that can be requested.
   * These limits are applied at both the CDP Project level and the blockchain address level.
   * A single blockchain address cannot exceed the specified limits, even if multiple users submit requests to the same address.
   *
   * | Token  | Amount per Faucet Request |Rolling 24-hour window Rate Limits|
   * |:-----: |:-------------------------:|:--------------------------------:|
   * | SOL    | 0.00125 SOL               | 0.0125 SOL                       |
   * | USDC   | 1 USDC                    | 10 USDC                          |
   * | CBTUSD | 1 CBTUSD                  | 10 CBTUSD                        |
   */
  readonly requestSolanaFaucet: <Config extends OperationConfig>(options: {
    readonly payload: typeof RequestSolanaFaucetRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof RequestSolanaFaucet200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"RequestSolanaFaucet400", typeof RequestSolanaFaucet400.Type>
    | CdpClientError<"RequestSolanaFaucet403", typeof RequestSolanaFaucet403.Type>
    | CdpClientError<"RequestSolanaFaucet429", typeof RequestSolanaFaucet429.Type>
    | CdpClientError<"RequestSolanaFaucet500", typeof RequestSolanaFaucet500.Type>
    | CdpClientError<"RequestSolanaFaucet502", typeof RequestSolanaFaucet502.Type>
    | CdpClientError<"RequestSolanaFaucet503", typeof RequestSolanaFaucet503.Type>
  >
  /**
   * Lists the token balances of a Solana address on a given network. The balances include SPL tokens and the native SOL token. The response is paginated, and by default, returns 20 balances per page.
   *
   * **Note:** This endpoint is still under development and does not yet provide strong availability or freshness guarantees. Freshness and availability of new token balances will improve over the coming weeks.
   */
  readonly listSolanaTokenBalances: <Config extends OperationConfig>(
    network: string,
    address: string,
    options:
      | {
          readonly params?: typeof ListSolanaTokenBalancesParams.Encoded | undefined
          readonly config?: Config | undefined
        }
      | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof ListSolanaTokenBalances200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ListSolanaTokenBalances400", typeof ListSolanaTokenBalances400.Type>
    | CdpClientError<"ListSolanaTokenBalances404", typeof ListSolanaTokenBalances404.Type>
    | CdpClientError<"ListSolanaTokenBalances500", typeof ListSolanaTokenBalances500.Type>
    | CdpClientError<"ListSolanaTokenBalances502", typeof ListSolanaTokenBalances502.Type>
    | CdpClientError<"ListSolanaTokenBalances503", typeof ListSolanaTokenBalances503.Type>
  >
  /**
   * Run a read-only SQL query against indexed blockchain data including transactions, events, and decoded logs.
   *
   * This endpoint provides direct SQL access to comprehensive blockchain data across supported networks.
   *
   * Queries are executed against optimized data structures for high-performance analytics.
   *
   * ### Allowed Queries
   *
   *   - Standard SQL syntax (CoinbaSeQL dialect, based on ClickHouse dialect)
   *   - Read-only queries (SELECT statements)
   *   - No DDL or DML operations
   *   - Query that follow limits (defined below)
   *
   * ### Supported Tables
   *
   *   - `<network>.events` - Base mainnet decoded event logs with parameters, event signature, topics, and more.
   *   - `<network>.transactions` - Base mainnet transaction data including hash, block number, gas usage.
   *   - `<network>.blocks` - Base mainnet block information.
   *   - `<network>.encoded_logs` - Encoded log data of event logs that aren't able to be decoded by our event decoder (ex: log0 opcode).
   *   - `<network>.decoded_user_operations` - Decoded user operations data including hash, block number, gas usage, builder codes, entrypoint version, and more.
   *   - `<network>.transaction_attributions` - Information about the attributions of a transaction to a builder and associated builder codes.
   *
   * ### Supported Networks
   *
   *   - Base Mainnet: `base`
   *   - Base Sepolia: `base_sepolia`
   *
   *   So for example, valid tables are: `base.events`, `base_sepolia.events`, `base.transactions`, etc.
   *
   * ### Query Limits
   *
   *   - Maximum result set: 50,000 rows
   *   - Maximum query length: 10,000 characters
   *   - Maximum on-disk data to read: 100GB
   *   - Maximum memory usage: 15GB
   *   - Query timeout: 30 seconds
   *   - Maximum JOINs: 12
   *
   * ### Query Caching
   *
   * By default, each query result is returned from cache so long as the result is from an identical query and less than 750ms old. This freshness tolerance can be modified upwards, to a maximum of 900000ms (i.e. 900s, 15m).
   * This can be helpful for users who wish to reduce expensive calls to the SQL API by reusing cached results.
   */
  readonly runSQLQuery: <Config extends OperationConfig>(options: {
    readonly payload: typeof RunSQLQueryRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof RunSQLQuery200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"RunSQLQuery400", typeof RunSQLQuery400.Type>
    | CdpClientError<"RunSQLQuery401", typeof RunSQLQuery401.Type>
    | CdpClientError<"RunSQLQuery402", typeof RunSQLQuery402.Type>
    | CdpClientError<"RunSQLQuery408", typeof RunSQLQuery408.Type>
    | CdpClientError<"RunSQLQuery429", typeof RunSQLQuery429.Type>
    | CdpClientError<"RunSQLQuery499", typeof RunSQLQuery499.Type>
    | CdpClientError<"RunSQLQuery500", typeof RunSQLQuery500.Type>
    | CdpClientError<"RunSQLQuery504", typeof RunSQLQuery504.Type>
  >
  /**
   * Retrieve the SQL grammar for the SQL API.
   *
   * The SQL queries that are supported by the SQL API are defined in ANTLR4 grammar which is evaluated by server before executing the query. This ensures the safety and soundness of the SQL query before execution.
   *
   * This endpoint returns the ANTLR4 grammar that is used to evaluate the SQL queries so that developers can understand the SQL API and build SQL queries with high confidence and correctness.
   *
   * LLMs interact well with ANTLR4 grammar. You can feed the grammar directly into the LLMs to help generate SQL queries.
   */
  readonly getSQLGrammar: <Config extends OperationConfig>(
    options: { readonly config?: Config | undefined } | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof GetSQLGrammar200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"GetSQLGrammar401", typeof GetSQLGrammar401.Type>
    | CdpClientError<"GetSQLGrammar429", typeof GetSQLGrammar429.Type>
    | CdpClientError<"GetSQLGrammar500", typeof GetSQLGrammar500.Type>
    | CdpClientError<"GetSQLGrammar504", typeof GetSQLGrammar504.Type>
  >
  /**
   * Retrieve the schema information for the available tables in the SQL API's indexed data.
   *
   * This includes table names, column definitions, data types, and indexed fields.
   */
  readonly getSQLSchema: <Config extends OperationConfig>(
    options:
      | { readonly params?: typeof GetSQLSchemaParams.Encoded | undefined; readonly config?: Config | undefined }
      | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof GetSQLSchema200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"GetSQLSchema401", typeof GetSQLSchema401.Type>
    | CdpClientError<"GetSQLSchema500", typeof GetSQLSchema500.Type>
  >
  /**
   * Retrieve all ERC-20 token contract addresses that an account has ever received tokens from.
   * Analyzes transaction history to discover token interactions.
   */
  readonly listTokensForAccount: <Config extends OperationConfig>(
    network: string,
    address: string,
    options: { readonly config?: Config | undefined } | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof ListTokensForAccount200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ListTokensForAccount400", typeof ListTokensForAccount400.Type>
    | CdpClientError<"ListTokensForAccount401", typeof ListTokensForAccount401.Type>
    | CdpClientError<"ListTokensForAccount429", typeof ListTokensForAccount429.Type>
    | CdpClientError<"ListTokensForAccount500", typeof ListTokensForAccount500.Type>
  >
  /**
   * Lists the token balances of an EVM address on a given network. The balances include ERC-20 tokens and the native gas token (usually ETH). The response is paginated, and by default, returns 20 balances per page.
   *
   * **Note:** This endpoint provides <1 second freshness from chain tip, <500ms response latency for wallets with reasonable token history, and 99.9% uptime for production use.
   */
  readonly listDataTokenBalances: <Config extends OperationConfig>(
    network: string,
    address: string,
    options:
      | {
          readonly params?: typeof ListDataTokenBalancesParams.Encoded | undefined
          readonly config?: Config | undefined
        }
      | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof ListDataTokenBalances200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ListDataTokenBalances400", typeof ListDataTokenBalances400.Type>
    | CdpClientError<"ListDataTokenBalances404", typeof ListDataTokenBalances404.Type>
    | CdpClientError<"ListDataTokenBalances500", typeof ListDataTokenBalances500.Type>
    | CdpClientError<"ListDataTokenBalances502", typeof ListDataTokenBalances502.Type>
    | CdpClientError<"ListDataTokenBalances503", typeof ListDataTokenBalances503.Type>
  >
  /**
   * Retrieve a paginated list of webhook subscriptions for the authenticated project.
   * Returns subscriptions for all CDP product events (onchain, onramp/offramp, wallet, etc.)
   * in descending order by creation time.
   *
   * ### Use Cases
   * - Monitor all active webhook subscriptions across CDP products
   * - Audit webhook configurations
   * - Manage subscription lifecycle
   */
  readonly listWebhookSubscriptions: <Config extends OperationConfig>(
    options:
      | {
          readonly params?: typeof ListWebhookSubscriptionsParams.Encoded | undefined
          readonly config?: Config | undefined
        }
      | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof ListWebhookSubscriptions200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ListWebhookSubscriptions400", typeof ListWebhookSubscriptions400.Type>
    | CdpClientError<"ListWebhookSubscriptions401", typeof ListWebhookSubscriptions401.Type>
    | CdpClientError<"ListWebhookSubscriptions429", typeof ListWebhookSubscriptions429.Type>
    | CdpClientError<"ListWebhookSubscriptions500", typeof ListWebhookSubscriptions500.Type>
  >
  /**
   * Subscribe to real-time events across CDP products using flexible filtering.
   *
   * ### Event Types
   *
   * **Onchain Events** - Monitor Base mainnet with microsecond precision:
   * - `onchain.activity.detected` - Smart contract events, transfers, swaps, NFT activity
   * - **Requires** `labels` for filtering (e.g., `contract_address`, `event_name`)
   *
   * **Onramp/Offramp Events** - Transaction lifecycle notifications:
   * - `onramp.transaction.created`, `onramp.transaction.updated`
   * - `onramp.transaction.success`, `onramp.transaction.failed`
   * - `offramp.transaction.created`, `offramp.transaction.updated`
   * - `offramp.transaction.success`, `offramp.transaction.failed`
   * - **No labels required** - maximum simplicity for transaction monitoring
   *
   * **Payments Transfers Events** - Transfer lifecycle notifications:
   * - `payments.transfers.quoted` - Transfer created and awaiting execution
   * - `payments.transfers.processing` - Transfer execution in progress
   * - `payments.transfers.completed` - Transfer completed successfully
   * - `payments.transfers.failed` - Transfer failed
   * - `payments.transfers.travel_rule_incomplete` - Travel rule information is missing
   * - `payments.transfers.travel_rule_completed` - Travel rule information has been provided and the transfer will proceed
   * - **No labels required** - enable the transfers webhook to monitor status transitions
   *
   * **Wallet Events** - Wallet activity notifications:
   * - `wallet.activity.detected`
   *
   * ### Webhook Signature Verification
   * All webhooks include cryptographic signatures for security.
   * The signature secret is returned in `secret` field when creating a subscription.
   *
   * **Note:** Webhooks are in beta and this interface is subject to change.
   *
   * See the [verification guide](https://docs.cdp.coinbase.com/onramp-&-offramp/webhooks#webhook-signature-verification) for implementation details.
   *
   * ### Onchain Label Filtering
   *
   * For `onchain.activity.detected` events, use `labels` for precise filtering with AND logic (max 20 labels per webhook).
   *
   * **Allowed labels** (all in snake_case format):
   * - `network` (required) - Blockchain network
   * - `contract_address` - Smart contract address
   * - `event_name` - Event name (e.g., "Transfer", "Burn")
   * - `event_signature` - Event signature hash
   * - `transaction_from` - Transaction sender address
   * - `transaction_to` - Transaction recipient address
   * - `params.*` - Any event parameter (e.g., `params.from`, `params.to`, `params.sender`, `params.tokenId`)
   *
   * **Examples**:
   * - **Liquidity Pool Monitor**: `{"network": "base-mainnet", "contract_address": "0xcd1f9777571493aeacb7eae45cd30a226d3e612d", "event_name": "Burn"}`
   * - **Price Oracle Tracker**: `{"network": "base-mainnet", "contract_address": "0xbac4a9428ea707c51f171ed9890c3c2fa810305d", "event_name": "PriceUpdated"}`
   * - **DeFi Protocol Activity**: `{"network": "base-mainnet", "contract_address": "0x45c6e6a47a711b14d8357d5243f46704904578e3", "event_name": "Deposit"}`
   */
  readonly createWebhookSubscription: <Config extends OperationConfig>(options: {
    readonly payload: typeof CreateWebhookSubscriptionRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof CreateWebhookSubscription201.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"CreateWebhookSubscription400", typeof CreateWebhookSubscription400.Type>
    | CdpClientError<"CreateWebhookSubscription401", typeof CreateWebhookSubscription401.Type>
    | CdpClientError<"CreateWebhookSubscription429", typeof CreateWebhookSubscription429.Type>
    | CdpClientError<"CreateWebhookSubscription500", typeof CreateWebhookSubscription500.Type>
  >
  /**
   * Retrieve detailed information about a specific webhook subscription including
   * configuration, status, creation timestamp, and webhook signature secret.
   *
   * ### Response Includes
   * - Subscription configuration and filters
   * - Target URL and custom headers
   * - Webhook signature secret for verification
   * - Creation timestamp and status
   */
  readonly getWebhookSubscription: <Config extends OperationConfig>(
    subscriptionId: string,
    options: { readonly config?: Config | undefined } | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof GetWebhookSubscription200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"GetWebhookSubscription401", typeof GetWebhookSubscription401.Type>
    | CdpClientError<"GetWebhookSubscription404", typeof GetWebhookSubscription404.Type>
    | CdpClientError<"GetWebhookSubscription429", typeof GetWebhookSubscription429.Type>
    | CdpClientError<"GetWebhookSubscription500", typeof GetWebhookSubscription500.Type>
  >
  /**
   * Update an existing webhook subscription's configuration including
   * event types, target URL, filtering criteria, and enabled status.
   * All required fields must be provided, even if they are not being changed.
   *
   * ### Common Updates
   * - Change target URL or headers
   * - Add/remove event type filters
   * - Update multi-label filtering criteria
   * - Enable/disable subscription
   */
  readonly updateWebhookSubscription: <Config extends OperationConfig>(
    subscriptionId: string,
    options: {
      readonly payload: typeof UpdateWebhookSubscriptionRequestJson.Encoded
      readonly config?: Config | undefined
    },
  ) => Effect.Effect<
    WithOptionalResponse<typeof UpdateWebhookSubscription200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"UpdateWebhookSubscription400", typeof UpdateWebhookSubscription400.Type>
    | CdpClientError<"UpdateWebhookSubscription401", typeof UpdateWebhookSubscription401.Type>
    | CdpClientError<"UpdateWebhookSubscription404", typeof UpdateWebhookSubscription404.Type>
    | CdpClientError<"UpdateWebhookSubscription429", typeof UpdateWebhookSubscription429.Type>
    | CdpClientError<"UpdateWebhookSubscription500", typeof UpdateWebhookSubscription500.Type>
  >
  /**
   * Permanently delete a webhook subscription and stop all event deliveries.
   * This action cannot be undone.
   *
   * ### Important Notes
   * - All webhook deliveries will cease immediately
   * - Subscription cannot be recovered after deletion
   * - Consider disabling instead of deleting for temporary pauses
   */
  readonly deleteWebhookSubscription: <Config extends OperationConfig>(
    subscriptionId: string,
    options: { readonly config?: Config | undefined } | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<void, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"DeleteWebhookSubscription401", typeof DeleteWebhookSubscription401.Type>
    | CdpClientError<"DeleteWebhookSubscription404", typeof DeleteWebhookSubscription404.Type>
    | CdpClientError<"DeleteWebhookSubscription429", typeof DeleteWebhookSubscription429.Type>
    | CdpClientError<"DeleteWebhookSubscription500", typeof DeleteWebhookSubscription500.Type>
  >
  /**
   * Retrieve webhook event delivery attempts for a specific subscription.
   * Returns event deliveries in descending order by creation time (newest first),
   * including delivery status, retry count, and response details.
   *
   * ### Use Cases
   * - Debug webhook delivery failures and inspect response codes
   * - Monitor delivery status and retry counts
   * - Audit event delivery history for a subscription
   * - Verify that expected events were sent to webhook URLs
   *
   * ### Filtering
   * Use optional query parameters to narrow results:
   * - `eventId` — find a specific event by ID
   * - `minCreatedAt` / `maxCreatedAt` — filter by time range
   * - `eventTypeNames` — filter by event type (comma-separated)
   *
   * **Note:** Results are limited to the 50 most recent events (newest first). No pagination is supported.
   */
  readonly listWebhookSubscriptionEvents: <Config extends OperationConfig>(
    subscriptionId: string,
    options:
      | {
          readonly params?: typeof ListWebhookSubscriptionEventsParams.Encoded | undefined
          readonly config?: Config | undefined
        }
      | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof ListWebhookSubscriptionEvents200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ListWebhookSubscriptionEvents400", typeof ListWebhookSubscriptionEvents400.Type>
    | CdpClientError<"ListWebhookSubscriptionEvents401", typeof ListWebhookSubscriptionEvents401.Type>
    | CdpClientError<"ListWebhookSubscriptionEvents404", typeof ListWebhookSubscriptionEvents404.Type>
    | CdpClientError<"ListWebhookSubscriptionEvents429", typeof ListWebhookSubscriptionEvents429.Type>
    | CdpClientError<"ListWebhookSubscriptionEvents500", typeof ListWebhookSubscriptionEvents500.Type>
  >
  /**
   * Verify an x402 protocol payment with a specific scheme and network.
   */
  readonly verifyX402Payment: <Config extends OperationConfig>(options: {
    readonly payload: typeof VerifyX402PaymentRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof VerifyX402Payment200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"VerifyX402Payment400", typeof VerifyX402Payment400.Type>
    | CdpClientError<"VerifyX402Payment500", typeof VerifyX402Payment500.Type>
    | CdpClientError<"VerifyX402Payment502", typeof VerifyX402Payment502.Type>
    | CdpClientError<"VerifyX402Payment503", typeof VerifyX402Payment503.Type>
  >
  /**
   * Settle an x402 protocol payment with a specific scheme and network.
   */
  readonly settleX402Payment: <Config extends OperationConfig>(options: {
    readonly payload: typeof SettleX402PaymentRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof SettleX402Payment200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"SettleX402Payment400", typeof SettleX402Payment400.Type>
    | CdpClientError<"SettleX402Payment402", typeof SettleX402Payment402.Type>
    | CdpClientError<"SettleX402Payment500", typeof SettleX402Payment500.Type>
    | CdpClientError<"SettleX402Payment502", typeof SettleX402Payment502.Type>
    | CdpClientError<"SettleX402Payment503", typeof SettleX402Payment503.Type>
  >
  /**
   * Get the supported x402 protocol payment schemes and networks that the facilitator is able to verify and settle payments for.
   */
  readonly supportedX402PaymentKinds: <Config extends OperationConfig>(
    options: { readonly config?: Config | undefined } | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof SupportedX402PaymentKinds200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"SupportedX402PaymentKinds500", typeof SupportedX402PaymentKinds500.Type>
    | CdpClientError<"SupportedX402PaymentKinds502", typeof SupportedX402PaymentKinds502.Type>
    | CdpClientError<"SupportedX402PaymentKinds503", typeof SupportedX402PaymentKinds503.Type>
  >
  /**
   * Lists all active discovered x402 resources.
   * This endpoint returns resources that have been discovered and cached by the x402 facilitator, including their payment requirements and metadata.
   * The response is paginated, and by default, returns 100 items per page.
   */
  readonly listX402DiscoveryResources: <Config extends OperationConfig>(
    options:
      | {
          readonly params?: typeof ListX402DiscoveryResourcesParams.Encoded | undefined
          readonly config?: Config | undefined
        }
      | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof ListX402DiscoveryResources200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ListX402DiscoveryResources400", typeof ListX402DiscoveryResources400.Type>
    | CdpClientError<"ListX402DiscoveryResources500", typeof ListX402DiscoveryResources500.Type>
    | CdpClientError<"ListX402DiscoveryResources502", typeof ListX402DiscoveryResources502.Type>
    | CdpClientError<"ListX402DiscoveryResources503", typeof ListX402DiscoveryResources503.Type>
  >
  /**
   * Gets x402 merchant discovery information for a given merchant payment address.
   * This endpoint returns all active x402 resources associated with the specified `payTo` address, allowing clients to discover what payment-gated resources a merchant exposes and their corresponding payment requirements.
   * The response is paginated, and by default, returns 20 items per page.
   */
  readonly listX402DiscoveryMerchant: <Config extends OperationConfig>(options: {
    readonly params: typeof ListX402DiscoveryMerchantParams.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof ListX402DiscoveryMerchant200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ListX402DiscoveryMerchant400", typeof ListX402DiscoveryMerchant400.Type>
    | CdpClientError<"ListX402DiscoveryMerchant404", typeof ListX402DiscoveryMerchant404.Type>
    | CdpClientError<"ListX402DiscoveryMerchant500", typeof ListX402DiscoveryMerchant500.Type>
    | CdpClientError<"ListX402DiscoveryMerchant502", typeof ListX402DiscoveryMerchant502.Type>
    | CdpClientError<"ListX402DiscoveryMerchant503", typeof ListX402DiscoveryMerchant503.Type>
  >
  /**
   * Searches for active x402 resources using a text query and optional filters.
   * Supports both text-based and vector-based search depending on availability. Results are sorted by relevance and quality score.
   * Legacy network names (e.g., `base`, `base-sepolia`, `solana`) are automatically normalized to their CAIP-2 equivalents.
   * The response is limited to 20 items per request. If more results exist, `partialResults` will be `true`.
   */
  readonly searchX402Resources: <Config extends OperationConfig>(
    options:
      | { readonly params?: typeof SearchX402ResourcesParams.Encoded | undefined; readonly config?: Config | undefined }
      | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof SearchX402Resources200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"SearchX402Resources400", typeof SearchX402Resources400.Type>
    | CdpClientError<"SearchX402Resources500", typeof SearchX402Resources500.Type>
    | CdpClientError<"SearchX402Resources502", typeof SearchX402Resources502.Type>
    | CdpClientError<"SearchX402Resources503", typeof SearchX402Resources503.Type>
  >
  /**
   * Handles JSON-RPC requests for the Model Context Protocol (MCP). Supports MCP methods for discovering x402 payment resources and tools.
   */
  readonly postX402DiscoveryMcp: <Config extends OperationConfig>(options: {
    readonly payload: typeof PostX402DiscoveryMcpRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof PostX402DiscoveryMcp200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"PostX402DiscoveryMcp400", typeof PostX402DiscoveryMcp400.Type>
    | CdpClientError<"PostX402DiscoveryMcp500", typeof PostX402DiscoveryMcp500.Type>
  >
  /**
   * Create a new Onramp order or get a quote for an Onramp order. Either `paymentAmount` or `purchaseAmount` must be provided.
   *
   * This API currently only supports the payment method `GUEST_CHECKOUT_APPLE_PAY`.
   *
   * For detailed integration instructions and to get access to this API, refer to the  [Apple Pay Onramp API docs](https://docs.cdp.coinbase.com/onramp-&-offramp/onramp-apis/apple-pay-onramp-api).
   */
  readonly createOnrampOrder: <Config extends OperationConfig>(options: {
    readonly payload: typeof CreateOnrampOrderRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof CreateOnrampOrder201.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"CreateOnrampOrder400", typeof CreateOnrampOrder400.Type>
    | CdpClientError<"CreateOnrampOrder401", typeof CreateOnrampOrder401.Type>
    | CdpClientError<"CreateOnrampOrder429", typeof CreateOnrampOrder429.Type>
    | CdpClientError<"CreateOnrampOrder500", typeof CreateOnrampOrder500.Type>
  >
  /**
   * Get an onramp order by ID.
   */
  readonly getOnrampOrderById: <Config extends OperationConfig>(
    orderId: string,
    options: { readonly config?: Config | undefined } | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof GetOnrampOrderById200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"GetOnrampOrderById401", typeof GetOnrampOrderById401.Type>
    | CdpClientError<"GetOnrampOrderById404", typeof GetOnrampOrderById404.Type>
    | CdpClientError<"GetOnrampOrderById429", typeof GetOnrampOrderById429.Type>
  >
  /**
   * Returns a single-use URL for an Onramp session. This API provides flexible  functionality based on the parameters provided, supporting three cases:
   *
   * **Important**: The returned URL is single-use only. Once a user visits the URL,  no one else can access it.
   * ## Use Cases
   * ### 1. Basic Session (Minimum Parameters)
   * **Required**: `destinationAddress`, `purchaseCurrency`, `destinationNetwork`
   *
   * **Returns**: Basic single-use onramp URL. The `quote` object will not be included in the response.
   * ### 2. One-Click Onramp URL
   * **Required**: Basic parameters + (`paymentAmount` OR `purchaseAmount`), `paymentCurrency`
   *
   * **Returns**: One-click onramp URL for streamlined checkout. The `quote` object will not be included in the response.
   * ### 3. One-Click Onramp URL with Quote
   * **Required**: One-Click Onramp parameters + `paymentMethod`, `country`, `subdivision`
   *
   * **Returns**: Complete pricing quote and one-click onramp URL. Both `session` and `quote` objects will be included in the response.
   *
   * **Note**: Only one of `paymentAmount` or `purchaseAmount` should be provided, not both. Providing both will result in an error. When `paymentAmount` is provided, the quote shows how much crypto the user will receive for the specified fiat amount (fee-inclusive). When `purchaseAmount` is provided, the quote shows how much fiat the user needs to pay for the specified crypto amount (fee-exclusive).
   */
  readonly createOnrampSession: <Config extends OperationConfig>(options: {
    readonly payload: typeof CreateOnrampSessionRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof CreateOnrampSession201.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"CreateOnrampSession400", typeof CreateOnrampSession400.Type>
    | CdpClientError<"CreateOnrampSession401", typeof CreateOnrampSession401.Type>
    | CdpClientError<"CreateOnrampSession429", typeof CreateOnrampSession429.Type>
    | CdpClientError<"CreateOnrampSession500", typeof CreateOnrampSession500.Type>
  >
  /**
   * Returns the transaction limits for an onramp user based on their payment method and user identifier. Use this API to show users their remaining purchase capacity before initiating an onramp transaction.
   * Currently supports `GUEST_CHECKOUT_APPLE_PAY` payment method with phone number identification. The phone number must have been previously verified via OTP.
   */
  readonly getOnrampUserLimits: <Config extends OperationConfig>(options: {
    readonly payload: typeof GetOnrampUserLimitsRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<typeof GetOnrampUserLimits200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"GetOnrampUserLimits400", typeof GetOnrampUserLimits400.Type>
    | CdpClientError<"GetOnrampUserLimits401", typeof GetOnrampUserLimits401.Type>
    | CdpClientError<"GetOnrampUserLimits429", typeof GetOnrampUserLimits429.Type>
    | CdpClientError<"GetOnrampUserLimits500", typeof GetOnrampUserLimits500.Type>
  >
  /**
   * Requests a limit upgrade for an onramp user by submitting identity information. Only phone number is currently supported as a userId.
   *
   * The verification process is asynchronous. After calling this endpoint, use the [Get Onramp User Limits](https://docs.cdp.coinbase.com/api-reference/v2/rest-api/onramp/get-onramp-user-limits) endpoint to check the status in the `limitUpgradeOptions` array.
   *
   * **Prerequisites:**
   * - The phone number must have been previously verified by your app via OTP. - Upgrades may not be available until a certain number of successful transactions by the user.
   *
   * **Supported fields:**
   * - `ssnLast4`: Last 4 digits of the Social Security Number (no dashes or spaces).
   * - `dateOfBirth`: Date of birth (day, month, year as zero-padded strings).
   */
  readonly requestLimitsUpgrade: <Config extends OperationConfig>(options: {
    readonly payload: typeof RequestLimitsUpgradeRequestJson.Encoded
    readonly config?: Config | undefined
  }) => Effect.Effect<
    WithOptionalResponse<void, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"RequestLimitsUpgrade400", typeof RequestLimitsUpgrade400.Type>
    | CdpClientError<"RequestLimitsUpgrade401", typeof RequestLimitsUpgrade401.Type>
    | CdpClientError<"RequestLimitsUpgrade429", typeof RequestLimitsUpgrade429.Type>
    | CdpClientError<"RequestLimitsUpgrade500", typeof RequestLimitsUpgrade500.Type>
  >
  /**
   * List payment methods linked to your entity. Payment methods represent external financial instruments that can be used as a target for transfers. The list will not include disabled or deleted payment methods.
   *
   * **Currently Supported Types:**
   * - `fedwire`: Domestic USD wire transfers
   * - `swift`: International wire transfers
   * - `sepa`: SEPA EUR transfers
   *
   * **Note:** Payment methods are created and verified through your linked CDP entity. Currently, fetching payment methods is only supported for Prime investment vehicles linked to CDP.
   */
  readonly listPaymentMethods: <Config extends OperationConfig>(
    options:
      | { readonly params?: typeof ListPaymentMethodsParams.Encoded | undefined; readonly config?: Config | undefined }
      | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof ListPaymentMethods200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"ListPaymentMethods400", typeof ListPaymentMethods400.Type>
    | CdpClientError<"ListPaymentMethods401", typeof ListPaymentMethods401.Type>
    | CdpClientError<"ListPaymentMethods500", typeof ListPaymentMethods500.Type>
  >
  /**
   * Get details of a specific payment method by its ID. Returns 404 if the payment method is not found or not owned by the requesting entity.
   */
  readonly getPaymentMethod: <Config extends OperationConfig>(
    paymentMethodId: string,
    options: { readonly config?: Config | undefined } | undefined,
  ) => Effect.Effect<
    WithOptionalResponse<typeof GetPaymentMethod200.Type, Config>,
    | HttpClientError.HttpClientError
    | SchemaError
    | CdpClientError<"GetPaymentMethod400", typeof GetPaymentMethod400.Type>
    | CdpClientError<"GetPaymentMethod401", typeof GetPaymentMethod401.Type>
    | CdpClientError<"GetPaymentMethod404", typeof GetPaymentMethod404.Type>
    | CdpClientError<"GetPaymentMethod500", typeof GetPaymentMethod500.Type>
  >
}

export interface CdpClientError<Tag extends string, E> {
  readonly _tag: Tag
  readonly request: HttpClientRequest.HttpClientRequest
  readonly response: HttpClientResponse.HttpClientResponse
  readonly cause: E
}

class CdpClientErrorImpl extends Data.Error<{
  _tag: string
  cause: any
  request: HttpClientRequest.HttpClientRequest
  response: HttpClientResponse.HttpClientResponse
}> {}

export const CdpClientError = <Tag extends string, E>(
  tag: Tag,
  cause: E,
  response: HttpClientResponse.HttpClientResponse,
): CdpClientError<Tag, E> =>
  new CdpClientErrorImpl({
    _tag: tag,
    cause,
    response,
    request: response.request,
  }) as any
