import { Protocol } from "@sablier/deployments";
import { getGraphChainName } from "./chains";
import type { Indexer } from "./types";

export function resolveEnvio(protocol: Indexer.Protocol, chainId: number): Indexer.Envio {
  function getURL(id: string) {
    return `https://indexer.hyperindex.xyz/${id}/v1/graphql`;
  }

  let endpoint: string = "";
  if (protocol === Protocol.Airdrops) {
    endpoint = getURL("508d217");
  } else if (protocol === Protocol.Flow) {
    endpoint = getURL("3b4ea6b");
  } else if (protocol === Protocol.Lockup) {
    endpoint = getURL("53b7e25");
  }

  return {
    chainId,
    envio: endpoint,
    protocol,
  };
}

export function resolveGraphCustom(protocol: Indexer.Protocol, chainId: number, baseURL: string): Indexer.Graph {
  const name = getSubgraphName(chainId, protocol);
  return {
    chainId,
    graph: {
      explorerURL: `${baseURL}/{${name}}/graphql`,
      kind: "custom",
      subgraphURL: `${baseURL}/${name}`,
    },
    protocol,
  };
}

// User ID in Subgraph Studio for account 0x905Cd35100ad357699B579995825a56C6Ce1e07b
const GRAPH_STUDIO_ID = 112500;

export function resolveGraphOfficial(protocol: Indexer.Protocol, chainId: number, subgraphId: string): Indexer.Graph {
  const subgraphName = getSubgraphName(chainId, protocol);
  return {
    chainId,
    graph: {
      explorerURL: `https://thegraph.com/explorer/subgraphs/${subgraphId}`,
      kind: "official",
      studioURL: `https://api.studio.thegraph.com/query/${GRAPH_STUDIO_ID}/${subgraphName}/version/latest`,
      subgraph: {
        id: subgraphId,
        url: `https://gateway.thegraph.com/api/subgraphs/id/${subgraphId}`,
      },
    },
    protocol,
  };
}

/* -------------------------------------------------------------------------- */
/*                               INTERNAL LOGIC                               */
/* -------------------------------------------------------------------------- */

function getSubgraphName(chainId: number, protocol: Indexer.Protocol): string {
  const graphChainName = getGraphChainName(chainId);
  return `sablier-${protocol}-${graphChainName}`;
}
