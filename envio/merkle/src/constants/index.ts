import { chains as generator_lockup } from "../_generated/original/bundles/lockup-envio";
import { chains as generator_merkle } from "../_generated/original/bundles/merkle-envio";

export const ADDRESS_ZERO = String("0x0000000000000000000000000000000000000000");
export const NULL_BYTE = String.fromCharCode(0);
export const NULL_BYTE_REGEX = new RegExp(NULL_BYTE, "g");

export const StreamVersion = {
  V20: "V20",
  V21: "V21",
  V22: "V22",
  V23: "V23",
} as const;

export const StreamCategory = {
  LockupLinear: "LockupLinear",
  LockupDynamic: "LockupDynamic",
  LockupTranched: "LockupTranched",
} as const;

export const ActionCategory = {
  Claim: "Claim",
  Clawback: "Clawback",
  Create: "Create",
  TransferAdmin: "TransferAdmin",
} as const;

export const CacheCategory = {
  Token: "token",
} as const;

export const chains = generator_merkle();

export function configuration(chainId: number | string | bigint) {
  const configuration = chains.find((c) => String(c.id) === chainId.toString());

  if (!configuration) {
    throw new Error("Missing chain configuration");
  }

  return {
    ...configuration,
    contracts: [...configuration.V21.factory, ...configuration.V22.factory, ...configuration.V23.factory],
  };
}

export function isWhitelistedShape(chainId: number | string | bigint, address: string) {
  const configuration = generator_lockup().find((c) => String(c.id) === chainId.toString());
  if (!configuration) {
    throw new Error("Missing chain configuration");
  }

  const contracts = [configuration?.V20, configuration?.V21, configuration?.V22, configuration?.V23].flatMap((item) => [
    ...(item?.linear || []),
    ...(item?.dynamic || []),
    ...(item?.tranched || []),
    ...(item?.merged || []),
  ]);

  const addresses = contracts.map((c) => c.address.toLowerCase());

  return addresses.includes(address.toLowerCase());
}

export type ActionCategory = (typeof ActionCategory)[keyof typeof ActionCategory];

export type CacheCategory = (typeof CacheCategory)[keyof typeof CacheCategory];

export type StreamCategory = (typeof StreamCategory)[keyof typeof StreamCategory];

export type StreamVersion = (typeof StreamVersion)[keyof typeof StreamVersion];
