import type { Common, Envio } from "@envio-common/bindings";
import { readOrFetchERC20Metadata } from "@envio-common/erc20";
import { Id } from "@envio-common/id";

export async function create<
  TContext extends { Asset: { set: (asset: TAsset) => void | Promise<void> } },
  TAsset extends Common.Asset,
>(context: TContext, chainId: number, assetAddress: Envio.Address): Promise<TAsset> {
  const metadata = await readOrFetchERC20Metadata(chainId, assetAddress);
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
