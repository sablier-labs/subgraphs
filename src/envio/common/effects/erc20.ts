import type { Logger } from "envio";
import { experimental_createEffect, S } from "envio";
import _ from "lodash";
import { erc20Abi, erc20Abi_bytes32, hexToString, trim } from "viem";
import type { Envio } from "../bindings";
import { isDecimalsRevertedError } from "../errors";
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
  async ({ context, input }) => {
    const dataKey = input.address.toLowerCase();
    const data = initDataEntry(RPCData.Category.ERC20, input.chainId, context.log);
    const cachedMetadata = data.read(dataKey);
    if (!_.isEmpty(cachedMetadata)) {
      return cachedMetadata;
    }
    const metadata = await fetch(context.log, input.chainId, input.address);
    if (metadata.name !== UNKNOWN_METADATA.name) {
      data.write({ [dataKey]: metadata });
    }
    return metadata;
  },
);

/* -------------------------------------------------------------------------- */
/*                               INTERNAL LOGIC                               */
/* -------------------------------------------------------------------------- */

/**
 * Fetches the ERC-20 metadata from the RPC. The flow of the function is:
 *
 * 1. Try standard ERC20 ABI first
 * 2. If the decimals call reverts, the token might be an ERC-721. We return UNKNOWN_METADATA.
 * 3. If the revert is due to a different reason, we try the bytes32 ABI.
 * 4. If the bytes32 ABI call reverts, we return UNKNOWN_METADATA.
 *
 * @see https://github.com/sablier-labs/indexers/issues/150
 */
async function fetch(logger: Logger, chainId: number, address: Envio.Address): Promise<RPCData.ERC20Metadata> {
  try {
    const result = await fetchStandard(chainId, address);
    return result;
  } catch (error1) {
    try {
      if (isDecimalsRevertedError(error1)) {
        logger.info("Decimals reverted, token might be an ERC-721", { assetAddress: address, chainId });
        return UNKNOWN_METADATA;
      }
      const result = await fetchBytes32(chainId, address);
      return result;
    } catch (error2) {
      const sanitizedError1 = error1 instanceof Error ? _.omit(error1, "abi") : error1;
      const sanitizedError2 = error2 instanceof Error ? _.omit(error2, "abi") : error2;
      logger.error("Failed to fetch ERC20 metadata", {
        assetAddress: address,
        chainId,
        error1: sanitizedError1,
        error2: sanitizedError2,
      });
      return UNKNOWN_METADATA;
    }
  }
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
    decimals: Number(results[0]),
    name: fromHex(results[1]),
    symbol: fromHex(results[2]),
  };
}

async function fetchStandard(chainId: number, address: Envio.Address): Promise<RPCData.ERC20Metadata> {
  const client = getClient(chainId);
  const erc20Contract = { abi: erc20Abi, address: address as `0x${string}` };

  const results = await client.multicall({
    allowFailure: false,
    contracts: [
      {
        ...erc20Contract,
        functionName: "name",
      },
      {
        ...erc20Contract,
        functionName: "symbol",
      },
      {
        ...erc20Contract,
        functionName: "decimals",
      },
    ],
  });

  return {
    decimals: Number(results[2]),
    name: String(results[0]),
    symbol: String(results[1]),
  };
}
