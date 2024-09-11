import { CacheCategory } from "../constants";
import type { Address, Event, Asset } from "../types";
import { Cache, framework, fromHex } from "../utils";

export async function getAsset(
  event: Event,
  address: Address,
  loader: (id: string) => Promise<Asset | undefined>,
) {
  const id = generateAssetId(event, address.toLowerCase());
  const loaded = await loader(id);

  if (!loaded) {
    throw new Error("Missing asset instance");
  }

  return loaded;
}

export async function getOrCreateAsset(
  event: Event,
  address: Address,
  loader: (id: string) => Promise<Asset | undefined>,
) {
  const id = generateAssetId(event, address);
  const loaded = await loader(id);

  if (!loaded) {
    return createAsset(event, address.toLowerCase());
  }

  return loaded;
}

async function createAsset(event: Event, address: Address) {
  const { decimals, name, symbol } = await details(address, event.chainId);

  const entity: Asset = {
    id: generateAssetId(event, address),
    address: address.toLowerCase(),
    decimals: BigInt(decimals),
    chainId: BigInt(event.chainId),
    name,
    symbol,
  };

  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateAssetId(event: Event, address: Address) {
  return "".concat(address).concat("-").concat(event.chainId.toString());
}

async function details(address: Address, chainId: number) {
  const cache = Cache.init(CacheCategory.Token, chainId);
  const token = cache.read(address.toLowerCase());

  if (token) {
    return {
      address,
      decimals: BigInt(token.decimals),
      name: token.name,
      symbol: token.symbol,
    };
  }

  const client = framework.getClient(chainId);

  try {
    const erc20 = framework.getERC20Contract(address);
    const results = await client.multicall({
      allowFailure: false,
      contracts: [
        {
          ...erc20,
          functionName: "decimals",
        },
        {
          ...erc20,
          functionName: "name",
        },
        {
          ...erc20,
          functionName: "symbol",
        },
      ],
    });

    const entry = {
      decimals: results[0].toString() || "",
      name: results[1].toString() || "",
      symbol: results[2].toString() || "",
    } as const;

    cache.add({ [address.toLowerCase()]: entry });

    return {
      decimals: BigInt(entry.decimals || 0),
      name: entry.name,
      symbol: entry.symbol,
    };
  } catch (_error) {
    /** Some tokens store their parameters as bytes not strings */
    try {
      const erc20Bytes = framework.getERC20BytesContract(address);
      const results = await client.multicall({
        allowFailure: false,
        contracts: [
          {
            ...erc20Bytes,
            functionName: "decimals",
          },
          {
            ...erc20Bytes,
            functionName: "name",
          },
          {
            ...erc20Bytes,
            functionName: "symbol",
          },
        ],
      });

      const entry = {
        decimals: results[0].toString() || "",
        name: fromHex(results[1].toString() || ""),
        symbol: fromHex(results[2].toString() || ""),
      } as const;

      cache.add({ [address.toLowerCase()]: entry });

      return {
        decimals: BigInt(entry.decimals || 0),
        name: entry.name,
        symbol: entry.symbol,
      };
    } catch (__error) {
      console.error(_error, __error);
      return {
        decimals: 18,
        symbol: address,
        name: address,
      };
    }
  }
}
