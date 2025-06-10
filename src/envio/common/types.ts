import type * as enums from "../../schema/enums";
import type { Envio } from "./bindings";

export namespace RPCData {
  export enum Category {
    Proxender = "proxenders",
    ERC20 = "erc20",
  }

  export type ERC20Metadata = {
    decimals: number;
    name: string;
    symbol: string;
  };

  export type ProxenderInfo = {
    owner: Envio.Address;
  };
}

export namespace CommonParams {
  export type Action = {
    addressA?: string;
    addressB?: string;
    amountA?: bigint;
    amountB?: bigint;
    category: enums.Flow.ActionCategory | enums.Lockup.ActionCategory;
    streamId?: string;
  };
}
