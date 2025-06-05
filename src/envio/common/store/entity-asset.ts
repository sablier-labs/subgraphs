import type { Common, Envio } from "../bindings";
import { Id } from "../id";
import type { ERC20Metadata } from "../types";

export async function create<
  TContext extends { Asset: { set: (asset: TAsset) => void | Promise<void> } },
  TAsset extends Common.Asset,
>(context: TContext, chainId: number, assetAddress: Envio.Address, metadata: ERC20Metadata): Promise<TAsset> {
  const asset: Common.Asset = {
    address: assetAddress.toLowerCase(),
    chainId: BigInt(chainId),
    decimals: BigInt(metadata.decimals),
    id: Id.asset(chainId, assetAddress),
    name: metadata.name,
    symbol: metadata.symbol,
  };
  await context.Asset.set(asset as TAsset);
  return asset as TAsset;
}
