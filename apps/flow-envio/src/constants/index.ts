import { chains as generator } from "../_generated/original/bundles/flow-envio";

export const ADDRESS_ZERO = String(
  "0x0000000000000000000000000000000000000000",
);

export const StreamVersion = {
  V20: "V20",
  V21: "V21",
  V22: "V22",
} as const;

export const ActionCategory = {
  Adjust: "Adjust",
  Approval: "Approval",
  ApprovalForAll: "ApprovalForAll",
  Create: "Create",
  Deposit: "Deposit",
  Pause: "Pause",
  Refund: "Refund",
  Restart: "Restart",
  Transfer: "Transfer",
  Void: "Void",
  Withdraw: "Withdraw",
} as const;

export const CacheCategory = {
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
    contracts: [...configuration.V22.flow],
  };
}

export type ActionCategory =
  (typeof ActionCategory)[keyof typeof ActionCategory];

export type CacheCategory = (typeof CacheCategory)[keyof typeof CacheCategory];

export type StreamVersion = (typeof StreamVersion)[keyof typeof StreamVersion];
