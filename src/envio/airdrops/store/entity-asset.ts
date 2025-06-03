import type { Context } from "@envio-airdrops/bindings";
import type { Envio } from "@envio-common/bindings";
import { Id } from "@envio-common/id";

export async function getOrThrow(
  context: Context.Loader | Context.Handler,
  chainId: number,
  assetAddress: Envio.Address,
) {
  const id = Id.asset(chainId, assetAddress);
  const asset = await context.Asset.get(id);
  if (!asset) {
    throw new Error(`Asset not loaded from the entity store: ${id}`);
  }
  return asset;
}
