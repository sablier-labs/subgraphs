import type * as enums from "@src/schema/enums";

export type ERC20Metadata = {
  decimals: number;
  name: string;
  symbol: string;
};

export type ParamsAction = {
  addressA?: string;
  addressB?: string;
  amountA?: bigint;
  amountB?: bigint;
  category: enums.Flow.ActionCategory | enums.Lockup.ActionCategory;
  streamId?: string;
};
