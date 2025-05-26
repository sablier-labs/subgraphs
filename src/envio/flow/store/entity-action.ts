import type { Envio } from "@envio-common/bindings";
import { Store as CommonStore } from "@envio-common/store";
import type { ParamsAction } from "@envio-common/types";
import type { Context, Entity } from "@envio-flow/bindings";

export async function create(
  context: Context.Handler,
  event: Envio.Event,
  watcher: Entity.Watcher,
  params: ParamsAction,
): Promise<Entity.Action> {
  return CommonStore.Action.create<typeof context, Entity.Action, typeof watcher>(context, event, watcher, params);
}
