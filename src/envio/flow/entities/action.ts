import type { Event } from "@envio/common/bindings";
import { ids } from "@envio/common/ids";
import type { ActionParams } from "@envio/common/params";
import type { Entity, Enum, HandlerContext } from "@envio/flow/bindings";

export async function createEntityAction(
  context: HandlerContext,
  watcher: Entity.Watcher,
  event: Event,
  params: ActionParams,
): Promise<Entity.Action> {
  const id = ids.action(event);

  const action: Entity.Action = {
    // Transaction
    id,
    block: BigInt(event.block.number),
    chainId: BigInt(event.chainId),
    contract: event.srcAddress,
    fee: event.transaction.value,
    from: event.transaction.from?.toLowerCase() || "",
    hash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    subgraphId: watcher.actionCounter,
    // Params
    addressA: params.addressA?.toLowerCase(),
    addressB: params.addressB?.toLowerCase(),
    amountA: params.amountA,
    amountB: params.amountB,
    category: params.category as Enum.ActionCategory,
    stream_id: params.streamId,
  };
  await context.Action.set(action);

  // Watcher
  const updatedWatcher: Entity.Watcher = {
    ...watcher,
    actionCounter: watcher.actionCounter + 1n,
  };
  await context.Watcher.set(updatedWatcher);

  return action;
}

export async function getAction(event: Event, loader: (id: string) => Promise<Entity.Action | undefined>) {
  const id = ids.action(event);
  const loaded = await loader(id);

  if (!loaded) {
    throw new Error("Missing action instance");
  }

  return loaded;
}
