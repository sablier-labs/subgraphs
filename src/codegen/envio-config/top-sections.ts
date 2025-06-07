import type { Types } from "../../types";
import type { EnvioConfig } from "./config-types";

export const topSections: Record<Types.Protocol, EnvioConfig.TopSection> = {
  airdrops: get("airdrops"),
  flow: get("flow"),
  lockup: get("lockup"),
};

function get(name: string): EnvioConfig.TopSection {
  return {
    name: `sablier-${name}`,
    ecosystem: "evm",
    unordered_multichain_mode: true,
    rollback_on_reorg: false,
    schema: "../schema.graphql",
    field_selection: {
      transaction_fields: ["from", "hash", "to", "transactionIndex", "value"],
    },
    contracts: [],
    networks: [],
  };
}
