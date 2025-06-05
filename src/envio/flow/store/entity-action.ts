import type { Envio } from "../../common/bindings";
import { CommonStore } from "../../common/store";
import type { CommonParams } from "../../common/types";
import type { Context, Entity } from "../bindings";

export async function create(
  context: Context.Handler,
  event: Envio.Event,
  params: CommonParams.Action,
): Promise<Entity.Action> {
  return CommonStore.Action.create<typeof context, Entity.Action, typeof params.watcher>(context, event, params);
}
