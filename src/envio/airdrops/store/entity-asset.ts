import type { Context, Entity } from "@envio-airdrops/bindings";
import type { Envio } from "@envio-common/bindings";
import { readOrFetchERC20Metadata } from "@envio-common/erc20";
import { Id } from "@envio-common/id";

export async function create(context: Context.Handler, chainId: number, assetAddress: Envio.Address) {
  const metadata = await readOrFetchERC20Metadata(chainId, assetAddress);
  const asset: Entity.Asset = {
    address: assetAddress.toLowerCase(),
    chainId: BigInt(chainId),
    decimals: BigInt(metadata.decimals),
    id: Id.asset(assetAddress, chainId),
    name: metadata.name,
    symbol: metadata.symbol,
  };
  await context.Asset.set(asset);

  return asset;
}

export async function getOrThrow(
  context: Context.Loader | Context.Handler,
  chainId: number,
  assetAddress: Envio.Address,
) {
  const id = Id.asset(assetAddress, chainId);
  const asset = await context.Asset.get(id);
  if (!asset) {
    throw new Error(`Asset not loaded from the entity store: ${id}`);
  }
  return asset;
}
