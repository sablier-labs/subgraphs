import { experimental_createEffect, S } from "envio";
import _ from "lodash";
import { erc20Abi, erc20Abi_bytes32, hexToString, trim } from "viem";
import type { Envio } from "../bindings";
import { getClient } from "../rpc-clients";
import { initDataEntry } from "../rpc-data";
import { RPCData } from "../types";

const UNKNOWN_METADATA = {
  decimals: 0,
  name: "Unknown",
  symbol: "Unknown",
};

const input = {
  address: S.string,
  chainId: S.number,
};

const output = S.schema({
  decimals: S.number,
  name: S.string,
  symbol: S.string,
});

/**
 * Reads the ERC-20 metadata from the cache or, if not found, fetches it from the RPC.
 * @see https://docs.envio.dev/docs/HyperIndex/event-handlers#contexteffect-experimental
 */
export const readOrFetchMetadata = experimental_createEffect(
  {
    input,
    name: "readOrFetchMetadata",
    output,
  },
  async ({ input }) => {
    const dataKey = input.address.toLowerCase();
    const data = initDataEntry(RPCData.Category.ERC20, input.chainId);
    const cachedMetadata = data.read(dataKey);
    if (!_.isEmpty(cachedMetadata)) {
      return cachedMetadata;
    }
    const metadata = await fetch(input.chainId, input.address);
    if (metadata.name !== UNKNOWN_METADATA.name) {
      data.write({ [dataKey]: metadata });
    }
    return metadata;
  },
);

/* -------------------------------------------------------------------------- */
/*                               INTERNAL LOGIC                               */
/* -------------------------------------------------------------------------- */

async function fetch(chainId: number, address: Envio.Address): Promise<RPCData.ERC20Metadata> {
  // Try standard ERC20 ABI first
  try {
    const result = await fetchStandard(chainId, address);
    return result;
  } catch (err1) {
    // Try bytes32 ERC20 ABI as fallback
    try {
      const result = await fetchBytes32(chainId, address);
      return result;
    } catch (err2) {
      console.error("Failed to fetch ERC20 metadata", err1, err2);
      return UNKNOWN_METADATA;
    }
  }
}

async function fetchStandard(chainId: number, address: Envio.Address): Promise<RPCData.ERC20Metadata> {
  const client = getClient(chainId);
  const erc20Contract = { abi: erc20Abi, address: address as `0x${string}` };

  const results = await client.multicall({
    allowFailure: false,
    contracts: [
      {
        ...erc20Contract,
        functionName: "decimals",
      },
      {
        ...erc20Contract,
        functionName: "name",
      },
      {
        ...erc20Contract,
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

async function fetchBytes32(chainId: number, address: Envio.Address): Promise<RPCData.ERC20Metadata> {
  const client = getClient(chainId);
  const erc20Contract = { abi: erc20Abi_bytes32, address: address as `0x${string}` };

  const results = await client.multicall({
    allowFailure: false,
    contracts: [
      {
        ...erc20Contract,
        functionName: "decimals",
      },
      {
        ...erc20Contract,
        functionName: "name",
      },
      {
        ...erc20Contract,
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
