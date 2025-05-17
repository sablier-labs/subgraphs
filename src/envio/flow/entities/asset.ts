import type { Address, Event } from "../../common/bindings";
import { queryERC20Metadata } from "../../common/erc20";
import { ids } from "../../common/ids";
import type { Entity, HandlerContext, LoaderContext } from "../bindings";

export async function createEntityAsset(context: HandlerContext, event: Event, assetAddress: Address) {
  const metadata = await queryERC20Metadata(event.chainId, assetAddress);
  const asset: Entity.Asset = {
    id: ids.asset(assetAddress, event.chainId),
    address: assetAddress.toLowerCase(),
    chainId: BigInt(event.chainId),
    decimals: BigInt(metadata.decimals),
    name: metadata.name,
    symbol: metadata.symbol,
  };
  await context.Asset.set(asset);

  return asset;
}

export async function getAssetOrThrow(context: LoaderContext, chainId: number, address: Address) {
  const id = ids.asset(address, chainId);
  const loaded = await context.Asset.get(id);
  if (!loaded) {
    throw new Error(`Asset not loaded from the database: ${id}`);
  }
  return loaded;
}
