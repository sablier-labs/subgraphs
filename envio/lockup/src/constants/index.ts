import { chains as generator } from "../_generated/original/bundles/lockup-envio";

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

export const ContractCategory = {
  LockupLinear: "LockupLinear",
  LockupDynamic: "LockupDynamic",
  LockupTranched: "LockupTranched",
  LockupMerged: "LockupMerged",
} as const;

export const ActionCategory = {
  Approval: "Approval",
  ApprovalForAll: "ApprovalForAll",
  Cancel: "Cancel",
  Create: "Create",
  Renounce: "Renounce",
  Transfer: "Transfer",
  Withdraw: "Withdraw",
} as const;

export const CacheCategory = {
  Proxy: "proxy",
  Token: "token",
} as const;

export const chains = generator();

export function configuration(chainId: number | string | bigint) {
  const configuration = chains.find((c) => String(c.id) === chainId.toString());

  if (!configuration) {
    throw new Error("Missing chain configuration");
  }

  return {
    ...configuration,
    contracts: [
      ...configuration.V20.linear,
      ...configuration.V20.dynamic,
      ...configuration.V21.linear,
      ...configuration.V21.dynamic,
      ...configuration.V22.linear,
      ...configuration.V22.dynamic,
      ...configuration.V22.tranched,
      ...configuration.V23.merged,
    ],
  };
}

export type ActionCategory = (typeof ActionCategory)[keyof typeof ActionCategory];

export type CacheCategory = (typeof CacheCategory)[keyof typeof CacheCategory];

export type StreamCategory = (typeof StreamCategory)[keyof typeof StreamCategory];
export type ContractCategory = (typeof ContractCategory)[keyof typeof ContractCategory];

export type StreamVersion = (typeof StreamVersion)[keyof typeof StreamVersion];
