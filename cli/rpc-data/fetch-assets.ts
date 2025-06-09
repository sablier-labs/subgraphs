/**
 * @file This script fetches ERC20 token data from The Graph subgraphs and saves it to JSON files.
 *
 * @example Generate for Flow:
 * just fetch-assets flow ethereum
 *
 * @param {string} protocol - Required: 'airdrops', 'flow', 'lockup', or 'all'
 * @param {string} chain - Required: The chain slug to fetch assets for. Use 'all' to fetch for all chains.
 */
import * as path from "node:path";
import { type Sablier, sablier } from "@sablier/deployments";
import * as fs from "fs-extra";
import { GraphQLClient } from "graphql-request";
import _ from "lodash";
import { RPCData } from "../../src/envio/common/types";
import { getSablierSubgraph, indexers } from "../../src/exports/indexers";
import type { Indexer } from "../../src/exports/types";
import paths from "../../src/paths";
import { type Types } from "../../src/types";
import logger from "../../src/winston";
import { PROTOCOLS } from "../constants";
import * as helpers from "../helpers";

type Asset = RPCData.ERC20Metadata & {
  address: string;
};

type GraphQLResponse = {
  data: {
    assets: Asset[];
  };
};

type ERC20Data = {
  [address: string]: {
    decimals: number;
    name: string;
    symbol: string;
  };
};

/* -------------------------------------------------------------------------- */
/*                                  CONSTANTS                                 */
/* -------------------------------------------------------------------------- */

// See https://ethereum.stackexchange.com/q/114818/24693
const MAX_LIMIT = 1000;
const QUERY = `#graphql
  query GetAllAssets {
    assets(first: ${MAX_LIMIT}) {
      address
      decimals
      name
      symbol
    }
  }
`;

/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const chainArg = helpers.validateChainArg(args[0]);
  const protocolArg = helpers.validateProtocolArg(args[1]);

  if (chainArg === "all") {
    await handleAllChains(protocolArg);
    return;
  }

  await handleChain(chainArg, protocolArg);
}

if (require.main === module) {
  main();
}

/* -------------------------------------------------------------------------- */
/*                                  HANDLERS                                  */
/* -------------------------------------------------------------------------- */

async function handleAllChains(protocolArg: string): Promise<void> {
  // If protocolArg is 'all', aggregate across all protocols and chains
  if (protocolArg === "all") {
    const chainIds = _.uniq(
      Object.values(indexers.graph)
        .flat()
        .map((indexer) => indexer.chainId),
    );
    for (const chainId of chainIds) {
      const chain = sablier.chains.getOrThrow(chainId);
      let totalNew = 0;
      let totalAssets = 0;
      for (const protocol of PROTOCOLS) {
        const indexer = getSablierSubgraph({ chainId, protocol });
        if (!indexer) continue;
        const { newCount, totalCount } = await handle(indexer, chain, true);
        totalNew += newCount;
        totalAssets += totalCount;
      }
      logger.info(`📊 Chain ${chain.slug}: ${totalNew} new assets, ${totalAssets} total assets (all protocols)`);
    }
    return;
  }
  // protocolArg is a specific protocol
  for (const indexer of indexers.graph[protocolArg as Types.Protocol]) {
    const chain = sablier.chains.getOrThrow(indexer.chainId);
    await handle(indexer, chain);
  }
}

async function handleChain(chainArg: string, protocolArg: string): Promise<void> {
  if (protocolArg === "all") {
    const chain = helpers.getChain(chainArg);
    let totalNew = 0;
    let totalAssets = 0;
    for (const protocol of PROTOCOLS) {
      const indexer = getSablierSubgraph({ chainId: chain.id, protocol });
      if (!indexer) continue;
      const { newCount, totalCount } = await handle(indexer, chain, true);
      totalNew += newCount;
      totalAssets += totalCount;
    }
    logger.info(`📊 Chain ${chain.slug}: ${totalNew} new assets, ${totalAssets} total assets (all protocols)`);
    return;
  }
  // protocolArg is a specific protocol
  const chain = helpers.getChain(chainArg);
  const indexer = getSablierSubgraph({ chainId: chain.id, protocol: protocolArg as Types.Protocol });
  if (!indexer) {
    throw new Error(`No indexer found for ${protocolArg} protocol on ${chainArg} chain`);
  }
  await handle(indexer, chain);
}

async function handle(
  indexer: Indexer.Graph,
  chain: Sablier.Chain,
  skipLogger = false,
): Promise<{ newCount: number; totalCount: number }> {
  const endpoint = indexer.subgraph.url;

  try {
    const filePath = paths.envio.rpcData(RPCData.Category.ERC20, chain.slug);
    const currentData = loadCurrentData(filePath);

    const assets = await fetchAssets(endpoint);
    const mergedData = mergeData(currentData, assets);
    writeData(filePath, mergedData);

    const currentCount = _.keys(currentData).length;
    const totalCount = _.keys(mergedData).length;
    const newCount = totalCount - currentCount;
    if (!skipLogger) {
      if (newCount > 0) {
        logger.info(`✅ Successfully fetched ${newCount} new assets for ${indexer.protocol} indexer on ${chain.slug}`);
      } else {
        logger.info(`✔️  No new assets found for ${indexer.protocol} indexer on ${chain.slug}`);
      }
      if (totalCount > 0) {
        logger.info(`📁 There are ${totalCount} total assets in ${helpers.getRelative(filePath)}`);
      }
      console.log("");
    }
    return { newCount, totalCount };
  } catch (error) {
    logger.error(`❌ Failed to fetch assets for ${indexer.protocol} on ${chain.slug}: ${error}`);
    return { newCount: 0, totalCount: 0 };
  }
}

/* -------------------------------------------------------------------------- */
/*                                OTHER HELPERS                               */
/* -------------------------------------------------------------------------- */

/**
 * Fetches asset data from a GraphQL endpoint using The Graph API.
 */
async function fetchAssets(endpoint: string): Promise<Asset[]> {
  const GRAPH_QUERY_KEY = process.env.GRAPH_QUERY_KEY;
  if (!GRAPH_QUERY_KEY) {
    throw new Error("GRAPH_QUERY_KEY is not set");
  }
  const headers = { Authorization: `Bearer ${GRAPH_QUERY_KEY}` };
  const client = new GraphQLClient(endpoint, { headers });
  const result = await client.request<GraphQLResponse["data"]>(QUERY);
  if (!result?.assets) {
    throw new Error("Invalid GraphQL response: missing assets data from The Graph");
  } else if (result.assets.length === MAX_LIMIT) {
    logger.warn(
      `⚠️  Warning: Maximum number of results (${MAX_LIMIT}) was returned. You may need to query more data from the indexer.`,
    );
  }
  return result.assets;
}

/**
 * Loads current ERC20 token data from the JSON file.
 */
function loadCurrentData(filePath: string): ERC20Data {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch {
    logger.warn(`⚠️  Warning: Could not parse existing file ${filePath}, starting with empty data`);
    return {};
  }
}

/**
 * Merges new asset data with existing ERC20 token data.
 */
function mergeData(currentData: ERC20Data, newAssets: Asset[]): ERC20Data {
  const merged = { ...currentData };

  for (const asset of newAssets) {
    merged[asset.address] = {
      decimals: Number(asset.decimals),
      name: asset.name,
      symbol: asset.symbol,
    };
  }

  return merged;
}

/**
 * Saves ERC20 token data to a JSON file, sorted by name.
 */
function writeData(filePath: string, data: ERC20Data): void {
  const dir = path.dirname(filePath);
  fs.ensureDirSync(dir);

  const sortedData: ERC20Data = {};
  const sortedKeys = _.keys(data).sort((a, b) => {
    return data[a].name.localeCompare(data[b].name);
  });

  for (const key of sortedKeys) {
    sortedData[key] = data[key];
  }

  fs.writeFileSync(filePath, `${JSON.stringify(sortedData)}\n`);
}
