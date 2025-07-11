import type { Envio } from "../../common/bindings";
import { CommonStore } from "../../common/store";
import type { CommonParams } from "../../common/types";
import type { Context, Entity, Enum } from "../bindings";

export async function create(
  context: Context.Handler,
  event: Envio.Event,
  watcher: Entity.Watcher,
  params: CommonParams.Action,
): Promise<Entity.Action> {
  return CommonStore.Action.create<Entity.Action>(context, event, watcher, params);
}
