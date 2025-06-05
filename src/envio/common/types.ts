import type * as enums from "../../schema/enums";
import type { Common } from "./bindings";

export type ERC20Metadata = {
  decimals: number;
  name: string;
  symbol: string;
};

export namespace CommonParams {
  export type Action = {
    addressA?: string;
    addressB?: string;
    amountA?: bigint;
    amountB?: bigint;
    category: enums.Flow.ActionCategory | enums.Lockup.ActionCategory;
    streamId?: string;
    watcher: Common.StreamWatcher;
  };
}
