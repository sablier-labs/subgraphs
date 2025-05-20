import type { Address, Event } from "@envio/common/bindings";
import { queryERC20Metadata } from "@envio/common/erc20";
import { Id } from "@envio/common/id";
import type { Context, Entity } from "@envio-lockup/bindings";

export async function create(context: Context.Handler, event: Event, assetAddress: Address) {
  const metadata = await queryERC20Metadata(event.chainId, assetAddress);
  const asset: Entity.Asset = {
    address: assetAddress.toLowerCase(),
    chainId: BigInt(event.chainId),
    decimals: BigInt(metadata.decimals),
    id: Id.asset(assetAddress, event.chainId),
    name: metadata.name,
    symbol: metadata.symbol,
  };
  await context.Asset.set(asset);

  return asset;
}

export async function getOrThrow(context: Context.Loader, chainId: number, address: Address) {
  const id = Id.asset(address, chainId);
  const loaded = await context.Asset.get(id);
  if (!loaded) {
    throw new Error(`Asset not loaded from the database: ${id}`);
  }
  return loaded;
}
