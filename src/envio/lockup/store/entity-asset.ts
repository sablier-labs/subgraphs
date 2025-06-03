import type { Envio } from "@envio-common/bindings";
import { Id } from "@envio-common/id";
import type { Context } from "@envio-lockup/bindings";

export async function getOrThrow(context: Context.Loader, chainId: number, address: Envio.Address) {
  const id = Id.asset(chainId, address);
  const asset = await context.Asset.get(id);
  if (!asset) {
    throw new Error(`Asset not loaded from the entity store: ${id}`);
  }
  return asset;
}
