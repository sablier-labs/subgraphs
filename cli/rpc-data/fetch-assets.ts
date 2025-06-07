import * as path from "node:path";
import { type Sablier, sablier } from "@sablier/deployments";
import * as fs from "fs-extra";
import { GraphQLClient } from "graphql-request";
import _ from "lodash";
import type { RPCData } from "../../src/envio/common/types";
import { getSablierGraphIndexer, indexers } from "../../src/exports/indexers";
import type { Indexer } from "../../src/exports/types";
import { ENVIO_DIR } from "../../src/paths";
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

/**
 * CLI for generating Envio config file
 *
 * @example Generate for Flow:
 * pnpm tsx cli/rpc-data/fetch-assets.ts flow ethereum
 *
 * @param {string} protocol - Required: 'airdrops', 'flow', 'lockup', or 'all'
 * @param {string} chain - Required: The chain slug to fetch assets for. Use 'all' to fetch for all chains.
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const protocolArg = helpers.validateProtocolArg(args[0]);
  const chainArg = helpers.validateChainArg(args[1]);

  logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  logger.info("🚀 Starting asset fetching process...");
  logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  if (protocolArg === "all") {
    await handleAllProtocols(chainArg);
  } else {
    await handleProtocol(protocolArg, chainArg);
  }

  logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  logger.info("🎉 Asset fetching process completed successfully!");
  logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

if (require.main === module) {
  main();
}

/* -------------------------------------------------------------------------- */
/*                                  HANDLERS                                  */
/* -------------------------------------------------------------------------- */

async function handleAllProtocols(chainArg: string): Promise<void> {
  for (const p of PROTOCOLS) {
    await handleProtocol(p, chainArg);
  }
}

async function handleProtocol(protocol: Types.Protocol, chainArg: string): Promise<void> {
  if (chainArg === "all") {
    await handleAllChains(protocol);
    return;
  }

  const chain = helpers.getChain(chainArg);
  const indexer = getSablierGraphIndexer({ chainId: chain.id, protocol });
  if (!indexer) {
    throw new Error(`No indexer found for ${protocol} protocol on ${chainArg} chain`);
  }
  await handle(indexer, chain);
}

async function handleAllChains(protocol: Types.Protocol): Promise<void> {
  for (const indexer of indexers.graph[protocol]) {
    const chain = sablier.chains.getOrThrow(indexer.chainId);
    await handle(indexer, chain);
  }
}

async function handle(indexer: Indexer.Graph, chain: Sablier.Chain): Promise<void> {
  const endpoint = indexer.subgraph.url;

  try {
    const assets = await fetchAssets(endpoint);

    const filePath = path.join(ENVIO_DIR, "common", "rpc-data", "erc20", `${chain.slug}.json`);
    const mergedData = mergeData(filePath, assets);
    writeData(filePath, mergedData);

    const newAssetsCount = assets.length;
    const totalAssetsCount = _.keys(mergedData).length;
    logger.info(`✅ Successfully fetched ${newAssetsCount} assets for ${indexer.protocol} indexer on ${chain.slug}`);
    logger.info(`📁 Total assets in ${helpers.getRelative(filePath)}: ${totalAssetsCount}`);
  } catch (error) {
    logger.error(`❌ Failed to fetch assets for ${indexer.protocol} on ${chain.slug}: ${error}`);
  }
}

/* -------------------------------------------------------------------------- */
/*                                OTHER HELPERS                               */
/* -------------------------------------------------------------------------- */

/**
 * Fetches asset data from a GraphQL endpoint using The Graph API.
 */
async function fetchAssets(endpoint: string): Promise<Asset[]> {
  const client = new GraphQLClient(endpoint);
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
function mergeData(filePath: string, newAssets: Asset[]): ERC20Data {
  const currentData = loadCurrentData(filePath);
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
