import type { Event } from "@envio/common/bindings";
import { Id } from "@envio/common/id";
import type { ActionParams } from "@envio/common/params";
import type { Context, Entity, EnvioEnum } from "@envio-flow/bindings";

export async function create(
  context: Context.Handler,
  event: Event,
  watcher: Entity.Watcher,
  params: ActionParams,
): Promise<Entity.Action> {
  const id = Id.action(event);

  const action: Entity.Action = {
    addressA: params.addressA?.toLowerCase(),
    addressB: params.addressB?.toLowerCase(),
    amountA: params.amountA,
    amountB: params.amountB,
    block: BigInt(event.block.number),
    category: params.category as EnvioEnum.ActionCategory,
    chainId: BigInt(event.chainId),
    contract: event.srcAddress,
    fee: event.transaction.value,
    from: event.transaction.from?.toLowerCase() || "",
    hash: event.transaction.hash,
    id,
    stream_id: params.streamId,
    subgraphId: watcher.actionCounter,
    timestamp: BigInt(event.block.timestamp),
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
