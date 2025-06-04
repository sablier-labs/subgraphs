import type { Envio } from "../../common/bindings";
import { CommonStore } from "../../common/store";
import type { ParamsAction } from "../../common/types";
import type { Context, Entity } from "../bindings";

export async function create(
  context: Context.Handler,
  event: Envio.Event,
  watcher: Entity.Watcher,
  params: ParamsAction,
): Promise<Entity.Action> {
  return CommonStore.Action.create<typeof context, Entity.Action, typeof watcher>(context, event, watcher, params);
}
