import type { Envio } from "@envio-common/bindings";
import { Id } from "@envio-common/id";
import { Store as CommonStore } from "@envio-common/store";
import type { Context, Entity } from "@envio-flow/bindings";

export async function create(context: Context.Handler, chainId: number, assetAddress: Envio.Address) {
  return CommonStore.Asset.create<typeof context, Entity.Asset>(context, chainId, assetAddress);
}

export async function getOrThrow(context: Context.Loader, chainId: number, address: Envio.Address) {
  const id = Id.asset(address, chainId);
  const asset = await context.Asset.get(id);
  if (!asset) {
    throw new Error(`Asset not loaded from the entity store: ${id}`);
  }
  return asset;
}
