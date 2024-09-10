import * as arbitrum from "../addresses/arbitrum";
import * as avalanche from "../addresses/avalanche";
import * as base from "../addresses/base";
import * as blast from "../addresses/blast";
import * as bsc from "../addresses/bsc";
import * as gnosis from "../addresses/gnosis";
import * as linea from "../addresses/linea";
import * as mainnet from "../addresses/mainnet";
import * as optimism from "../addresses/optimism";
import * as polygon from "../addresses/polygon";
import * as scroll from "../addresses/scroll";
import * as sepolia from "../addresses/sepolia";
import * as zksync from "../addresses/zksync";

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

export const chains = () => {
  const list = [
    arbitrum,
    avalanche,
    base,
    blast,
    bsc,
    gnosis,
    linea,
    mainnet,
    optimism,
    polygon,
    scroll,
    sepolia,
    zksync,
  ] as const;

  /** Merging the linear and dynamic arrays with a spread operator will break mustache's template engine */

  return list.map((item) => {
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

    return {
      id: item.chainId,
      name: item.chain,
      start_block: item.startBlock_merkle,
      V21,
      V22,
    };
  });
};
