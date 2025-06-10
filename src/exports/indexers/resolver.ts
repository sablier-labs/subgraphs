import { Protocol } from "@sablier/deployments";
import type { Indexer } from "../types";
import { getGraphChainName } from "../vendors";

export function resolveEnvio(protocol: Indexer.Protocol, chainId: number): Indexer {
  let id: string | undefined;
  if (protocol === Protocol.Airdrops) {
    id = "508d217";
  } else if (protocol === Protocol.Flow) {
    id = "3b4ea6b";
  } else {
    id = "53b7e25";
  }

  return {
    chainId,
    endpoint: {
      id,
      url: `https://indexer.hyperindex.xyz/${id}/v1/graphql`,
    },
    kind: "official",
    name: `sablier-${protocol}`,
    protocol,
  };
}

const NAME_TEMPLATING_VAR = "{SUBGRAPH_NAME}";

export function resolveGraphCustom(protocol: Indexer.Protocol, chainId: number, templateURL: string): Indexer {
  if (!templateURL.includes(NAME_TEMPLATING_VAR)) {
    throw new Error(`Template URL for custom graph does not include ${NAME_TEMPLATING_VAR}`);
  }
  const subgraphName = getSubgraphName(chainId, protocol);
  return {
    chainId,
    endpoint: {
      url: templateURL.replace(NAME_TEMPLATING_VAR, subgraphName),
    },
    kind: "custom",
    name: subgraphName,
    protocol,
  };
}

// User ID in Subgraph Studio for account 0x905Cd35100ad357699B579995825a56C6Ce1e07b
const GRAPH_STUDIO_ID = 112500;

export function resolveGraphOfficial(protocol: Indexer.Protocol, chainId: number, subgraphId: string): Indexer {
  const subgraphName = getSubgraphName(chainId, protocol);
  return {
    chainId,
    endpoint: {
      id: subgraphId,
      url: `https://gateway.thegraph.com/api/subgraphs/id/${subgraphId}`,
    },
    explorerURL: `https://thegraph.com/explorer/subgraphs/${subgraphId}`,
    kind: "official",
    name: subgraphName,
    playgroundURL: `https://api.studio.thegraph.com/query/${GRAPH_STUDIO_ID}/${subgraphName}/version/latest`,
    protocol,
  };
}

/* -------------------------------------------------------------------------- */
/*                               INTERNAL LOGIC                               */
/* -------------------------------------------------------------------------- */

function getSubgraphName(chainId: number, protocol: Indexer.Protocol): Indexer.SubgraphName {
  const graphChainName = getGraphChainName(chainId);
  return `sablier-${protocol}-${graphChainName}`;
}
