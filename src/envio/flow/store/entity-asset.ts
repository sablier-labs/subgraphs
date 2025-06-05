import type { Envio } from "../../common/bindings";
import { Id } from "../../common/id";
import type { Context } from "../bindings";

export async function getOrThrow(context: Context.Loader, chainId: number, address: Envio.Address) {
  const id = Id.asset(chainId, address);
  const asset = await context.Asset.get(id);
  if (!asset) {
    throw new Error(`Asset not loaded from the entity store: ${id}`);
  }
  return asset;
}
