import type { Common, Envio } from "../bindings";
import { Id } from "../id";
import type { RPCData } from "../types";

type AssetContext = { Asset: { set: (asset: Common.Asset) => void | Promise<void> } };

export async function create(
  context: AssetContext,
  chainId: number,
  assetAddress: Envio.Address,
  metadata: RPCData.ERC20Metadata,
): Promise<Common.Asset> {
  const asset: Common.Asset = {
    address: assetAddress.toLowerCase(),
    chainId: BigInt(chainId),
    decimals: BigInt(metadata.decimals),
    id: Id.asset(chainId, assetAddress),
    name: metadata.name,
    symbol: metadata.symbol,
  };
  await context.Asset.set(asset);
  return asset;
}
