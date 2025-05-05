import * as arbitrum from "../addresses/arbitrum";
import * as avalanche from "../addresses/avalanche";
import * as base from "../addresses/base";
import * as baseSepolia from "../addresses/base-sepolia";
import * as bsc from "../addresses/bsc";
import * as chiliz from "../addresses/chiliz";
import * as gnosis from "../addresses/gnosis";
import * as linea from "../addresses/linea";
import * as mainnet from "../addresses/mainnet";
import * as mode from "../addresses/mode";
import * as morph from "../addresses/morph";
import * as optimism from "../addresses/optimism";
import * as polygon from "../addresses/polygon";
import * as scroll from "../addresses/scroll";
import * as sepolia from "../addresses/sepolia";
import * as superseed from "../addresses/superseed";
import * as tangle from "../addresses/tangle";
import * as zksync from "../addresses/zksync";
import definitions from "./definitions";

const available = (v: { flow: unknown[] }) => {
  return v.flow.length > 0;
};

const filter = (list: string[][], version: string) => {
  return (
    list
      .filter((entry) => entry[2] === version)
      .map((entry) => ({
        address: entry[0]?.toLowerCase() || "",
        alias: entry[1],
        version: entry[2],
      })) || []
  );
};

/**
 * Bind a viem chain definition to a sablier indexer configuration.
 * ↪ 🚨 Chains without valid viem definitions will not be taken into account.
 */

export const chains = () => {
  const list = [
    [arbitrum, definitions.arbitrum],
    [avalanche, definitions.avalanche],
    [base, definitions.base],
    [baseSepolia, definitions.baseSepolia],
    [bsc, definitions.bsc],
    [chiliz, definitions.chiliz],
    [gnosis, definitions.gnosis],
    [linea, definitions.linea],
    [mainnet, definitions.mainnet],
    [mode, definitions.mode],
    [morph, definitions.morph],
    [optimism, definitions.optimism],
    [polygon, definitions.polygon],
    [sepolia, definitions.sepolia],
    [scroll, definitions.scroll],
    [superseed, definitions.superseed],
    [tangle, definitions.tangle],
    [zksync, definitions.zksync],
  ] as const;

  /** Merging the arrays with a spread operator will break mustache's template engine */

  return list
    .map(([item, definition]) => {
      const V10 = {
        flow: filter(item.flow, "V10"),
        available: false,
      };

      V10.available = available(V10);

      const V11 = {
        flow: filter(item.flow, "V11"),
        available: false,
      };

      V11.available = available(V11);

      return {
        definition,
        id: item.chainId,
        name: item.chain,
        hypersync: "hypersync" in item ? item.hypersync : undefined,
        rpcsync: "rpcsync" in item ? item.rpcsync : undefined,
        start_block: item.startBlock_merkle,
        V10,
        V11,
      };
    })
    .filter((item) => item.definition);
};
