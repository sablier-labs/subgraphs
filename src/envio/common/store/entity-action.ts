import type { Common, Envio } from "../bindings";
import { Id } from "../id";
import type { ParamsAction } from "../types";

export async function create<
  TContext,
  TAction extends Omit<Common.StreamAction, "category"> & { category: string },
  TWatcher extends Common.StreamWatcher,
>(
  context: TContext & {
    Action: { set: (action: TAction) => void | Promise<void> };
    Watcher: { set: (watcher: TWatcher) => void | Promise<void> };
  },
  event: Envio.Event,
  watcher: TWatcher,
  params: ParamsAction,
): Promise<TAction> {
  const id = Id.action(event);

  const action: Common.StreamAction = {
    addressA: params.addressA?.toLowerCase(),
    addressB: params.addressB?.toLowerCase(),
    amountA: params.amountA,
    amountB: params.amountB,
    block: BigInt(event.block.number),
    category: params.category,
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
  await context.Action.set(action as TAction);

  const updatedWatcher = {
    ...watcher,
    actionCounter: watcher.actionCounter + 1n,
  };
  await context.Watcher.set(updatedWatcher);

  return action as TAction;
}
