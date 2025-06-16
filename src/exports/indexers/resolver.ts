import type { Indexer } from "../types";
import { getGraphChainName } from "../vendors";
import { envioRecords } from "./envio-records";

export function resolveEnvio(protocol: Indexer.Protocol, chainId: number): Indexer {
  const record = envioRecords[protocol];
  return {
    chainId,
    endpoint: {
      id: record.endpoint.id,
      url: record.endpoint.url,
    },
    explorerURL: record.explorerURL,
    kind: "official",
    name: `sablier-${protocol}`,
    protocol,
    testingURL: `https://cloud.hasura.io/public/graphiql?endpoint=${encodeURIComponent(record.endpoint.url)}`,
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
    protocol,
    testingURL: `https://api.studio.thegraph.com/query/${GRAPH_STUDIO_ID}/${subgraphName}/version/latest`,
  };
}

/* -------------------------------------------------------------------------- */
/*                               INTERNAL LOGIC                               */
/* -------------------------------------------------------------------------- */

function getSubgraphName(chainId: number, protocol: Indexer.Protocol): Indexer.SubgraphName {
  const graphChainName = getGraphChainName(chainId);
  return `sablier-${protocol}-${graphChainName}`;
}
