import _ from "lodash";
import { erc20Abi, erc20Abi_bytes32, hexToString, trim } from "viem";
import type { Address } from "./bindings";
import { DataCategory, initDataEntry } from "./data";
import { getClient } from "./rpc-clients";
import type { ERC20Metadata } from "./types";

/**
 * Query ERC20 metadata for a given asset address. If the data is not found in the cache, it will be fetched from the chain.
 */
export async function queryERC20Metadata(chainId: number, address: Address): Promise<ERC20Metadata> {
  const key = address.toLowerCase();
  const data = initDataEntry(DataCategory.Asset, chainId);
  const asset = data.read(key);

  // If the data is found in the cache, return it.
  if (!_.isEmpty(asset)) {
    return asset;
  }

  // Try standard ERC20 ABI first
  try {
    const result = await fetchStandard(address, chainId);
    data.save({ [key]: result });
    return result;
  } catch (err1) {
    // Try bytes32 ERC20 ABI as fallback
    try {
      const result = await fetchBytes32(address, chainId);
      data.save({ [key]: result });
      return result;
    } catch (err2) {
      console.error("Failed to fetch ERC20 metadata", err1, err2);
      return {
        decimals: 0,
        name: "Unknown",
        symbol: "Unknown",
      };
    }
  }
}

async function fetchStandard(address: Address, chainId: number): Promise<ERC20Metadata> {
  const client = getClient(chainId);
  const contract = { abi: erc20Abi, address: address as `0x${string}` };

  const results = await client.multicall({
    allowFailure: false,
    contracts: [
      {
        ...contract,
        functionName: "decimals",
      },
      {
        ...contract,
        functionName: "name",
      },
      {
        ...contract,
        functionName: "symbol",
      },
    ],
  });

  return {
    decimals: results[0],
    name: results[1],
    symbol: results[2],
  };
}

async function fetchBytes32(address: Address, chainId: number): Promise<ERC20Metadata> {
  const client = getClient(chainId);
  const contract = { abi: erc20Abi_bytes32, address: address as `0x${string}` };

  const results = await client.multicall({
    allowFailure: false,
    contracts: [
      {
        ...contract,
        functionName: "decimals",
      },
      {
        ...contract,
        functionName: "name",
      },
      {
        ...contract,
        functionName: "symbol",
      },
    ],
  });

  const fromHex = (value: `0x${string}`) => {
    const trimmed = trim(value, { dir: "right" });
    return hexToString(trimmed);
  };

  return {
    decimals: results[0],
    name: fromHex(results[1]),
    symbol: fromHex(results[2]),
  };
}
