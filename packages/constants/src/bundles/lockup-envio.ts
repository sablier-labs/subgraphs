import * as arbitrum from "../addresses/arbitrum";
import * as avalanche from "../addresses/avalanche";
import * as base from "../addresses/base";
import * as blast from "../addresses/blast";
import * as bsc from "../addresses/bsc";
import * as gnosis from "../addresses/gnosis";
import * as linea from "../addresses/linea";
import * as mainnet from "../addresses/mainnet";
import * as mode from "../addresses/mode";
import * as morph from "../addresses/morph";
import * as optimism from "../addresses/optimism";
import * as polygon from "../addresses/polygon";
import * as scroll from "../addresses/scroll";
import * as sepolia from "../addresses/sepolia";
import * as zksync from "../addresses/zksync";

const available = (v: {
  linear: unknown[];
  dynamic: unknown[];
  tranched: unknown[];
}) => {
  return v.linear.length + v.dynamic.length + v.tranched.length > 0;
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
    mode,
    morph,
    optimism,
    polygon,
    scroll,
    sepolia,
    zksync,
  ] as const;

  /** Merging the linear and dynamic arrays with a spread operator will break mustache's template engine */

  return list.map((item) => {
    const V20 = {
      dynamic: filter(item.dynamic, "V20"),
      linear: filter(item.linear, "V20"),
      tranched: [],
      available: false,
    };

    V20.available = available(V20);

    const V21 = {
      dynamic: filter(item.dynamic, "V21"),
      linear: filter(item.linear, "V21"),
      tranched: [],
      available: false,
    };

    V21.available = available(V21);

    const V22 = {
      dynamic: filter(item.dynamic, "V22"),
      linear: filter(item.linear, "V22"),
      tranched: filter(item.tranched || [], "V22"),
      available: false,
    };

    V22.available = available(V22);

    return {
      id: item.chainId,
      name: item.chain,
      start_block: item.startBlock_lockup,
      registry: item.registry?.toLowerCase() || "",
      V20,
      V21,
      V22,
    };
  });
};
