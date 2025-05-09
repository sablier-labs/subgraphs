import * as arbitrum from "../constants/addresses/arbitrum";
import * as avalanche from "../constants/addresses/avalanche";
import * as base from "../constants/addresses/base";
import * as baseSepolia from "../constants/addresses/base-sepolia";
import * as bsc from "../constants/addresses/bsc";
import * as chiliz from "../constants/addresses/chiliz";
import * as gnosis from "../constants/addresses/gnosis";
import * as linea from "../constants/addresses/linea";
import * as mainnet from "../constants/addresses/mainnet";
import * as mode from "../constants/addresses/mode";
import * as morph from "../constants/addresses/morph";
import * as optimism from "../constants/addresses/optimism";
import * as polygon from "../constants/addresses/polygon";
import * as scroll from "../constants/addresses/scroll";
import * as sepolia from "../constants/addresses/sepolia";
import * as superseed from "../constants/addresses/superseed";
import * as tangle from "../constants/addresses/tangle";
import * as zksync from "../constants/addresses/zksync";
import definitions from "./definitions";

const available = (v: { factory: unknown[] }) => {
  return v.factory.length > 0;
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
    [scroll, definitions.scroll],
    [sepolia, definitions.sepolia],
    [superseed, definitions.superseed],
    [tangle, definitions.tangle],
    [zksync, definitions.zksync],
  ] as const;

  /** Merging the arrays with a spread operator will break mustache's template engine */

  return list.map(([item, definition]) => {
    const V21 = {
      factory: filter(item.factory, "V21"),
      available: false,
    };

    V21.available = available(V21);

    const V22 = {
      factory: filter(item.factory, "V22"),
      available: false,
    };

    V22.available = available(V22);

    const V23 = {
      factory: filter(item.factory, "V23"),
      available: false,
    };

    V23.available = available(V23);

    return {
      definition,
      id: item.chainId,
      name: item.chain,
      start_block: item.startBlock_merkle,
      hypersync: "hypersync" in item ? item.hypersync : undefined,
      V21,
      V22,
      V23,
    };
  });
};
