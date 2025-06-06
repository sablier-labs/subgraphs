import * as path from "node:path";
import * as fs from "fs-extra";
import { GraphQLClient } from "graphql-request";
import _ from "lodash";
import type { RPCData } from "../../src/envio/common/types";
import { ENVIO_DIR } from "../../src/paths";
import { type Indexed } from "../../src/types";
import logger from "../../src/winston";
import { PROTOCOLS } from "../constants";
import { getChain, getRelative, validateChainArg, validateProtocolArg } from "../helpers";

/* -------------------------------------------------------------------------- */
/*                                  CONSTANTS                                 */
/* -------------------------------------------------------------------------- */

const ENDPOINTS: Record<Indexed.Protocol, string> = {
  airdrops:
    "https://gateway.thegraph.com/api/5500d776e976ef9fc7edcc92318efbc4/subgraphs/id/DFD73EcSue44R7mpHvXeyvcgaT8tR1iKakZFjBsiFpjs",
  flow: "https://gateway.thegraph.com/api/5500d776e976ef9fc7edcc92318efbc4/subgraphs/id/ECxBJhKceBGaVvK6vqmK3VQAncKwPeAQutEb8TeiUiod",
  lockup:
    "https://gateway.thegraph.com/api/5500d776e976ef9fc7edcc92318efbc4/subgraphs/id/AvDAMYYHGaEwn9F9585uqq6MM5CfvRtYcb7KjK7LKPCt",
} as const;

// See https://ethereum.stackexchange.com/q/114818/24693
const QUERY = `#graphql
  query GetAllAssets {
    assets(first: 1000) {
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
 * pnpm tsx scripts/fetch-assets.ts flow mainnet
 *
 * @param {string} protocol - Required: 'airdrops', 'flow', 'lockup', or 'all'
 * @param {string} [chainSlug] - Required: The chain slug to fetch assets for.
 * Use 'all' to fetch for all chains.
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const protocolArg = validateProtocolArg(args[0]);
  const chainArg = validateChainArg(args[1]);

  if (protocolArg === "all") {
    throw new Error(`Protocol must be one of: ${_.join(PROTOCOLS, ", ")}`);
  }
  if (chainArg !== "ethereum") {
    throw new Error("Only 'mainnet' chain slug is currently supported");
  }

  logger.info(`📡 Fetching assets for ${protocolArg} protocol on ${chainArg}...`);

  const endpoint = ENDPOINTS[protocolArg];
  const assets = await fetchAssets(endpoint);

  const chain = getChain(chainArg);
  const filePath = path.join(ENVIO_DIR, "common", "rpc-data", "erc20", `${chain.slug}.json`);
  const existingData = loadExistingData(filePath);
  const mergedData = mergeAssets(existingData, assets);

  saveData(filePath, mergedData);

  const newAssetsCount = assets.length;
  const totalAssetsCount = _.keys(mergedData).length;

  logger.info(`✅ Successfully processed ${newAssetsCount} assets`);
  logger.info(`📁 Total assets in ${getRelative(filePath)}: ${totalAssetsCount}`);
}

if (require.main === module) {
  main();
}

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

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

async function fetchAssets(endpoint: string): Promise<Asset[]> {
  const client = new GraphQLClient(endpoint);
  const result = await client.request<GraphQLResponse["data"]>(QUERY);
  if (!result?.assets) {
    throw new Error("Invalid GraphQL response: missing assets data from The Graph");
  }
  if (result.assets.length === 1000) {
    logger.warn("⚠️  Warning: Maximum number of results (1000) was returned. You may have to query more pages.");
  }
  return result.assets;
}

function loadExistingData(filePath: string): ERC20Data {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch {
    logger.warn(`Warning: Could not parse existing file ${filePath}, starting with empty data`);
    return {};
  }
}

function mergeAssets(existing: ERC20Data, newAssets: Asset[]): ERC20Data {
  const merged = { ...existing };

  for (const asset of newAssets) {
    merged[asset.address] = {
      decimals: Number(asset.decimals),
      name: asset.name,
      symbol: asset.symbol,
    };
  }

  return merged;
}

function saveData(filePath: string, data: ERC20Data): void {
  const dir = path.dirname(filePath);
  fs.ensureDirSync(dir);

  const sortedData: ERC20Data = {};
  const sortedKeys = _.keys(data).sort((a, b) => data[a].name.localeCompare(data[b].name));
  for (const key of sortedKeys) {
    sortedData[key] = data[key];
  }

  fs.writeFileSync(filePath, `${JSON.stringify(sortedData)}\n`);
}
