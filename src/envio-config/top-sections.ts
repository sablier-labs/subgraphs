import type { Indexed } from "../types";
import type { EnvioConfig } from "./config-types";

const topSections: Record<Indexed.Protocol, EnvioConfig.TopSection> = {
  airdrops: get("airdrops"),
  flow: get("flow"),
  lockup: get("lockup"),
};

export default topSections;

function get(name: string): EnvioConfig.TopSection {
  return {
    name: `sablier-${name}`,
    ecosystem: "evm",
    unordered_multichain_mode: true,
    rollback_on_reorg: false,
    field_selection: {
      transaction_fields: ["from", "hash", "to", "transactionIndex", "value"],
    },
    contracts: [],
    networks: [],
  };
}
