import type { Envio } from "../../common/bindings";
import { Id } from "../../common/id";
import type { Context, Entity, EnvioEnum } from "../bindings";
import type { Params } from "../helpers/types";

export async function create(
  context: Context.Handler,
  event: Envio.Event,
  entities: Params.ActionEntities,
  params: Params.Action,
): Promise<Entity.Action> {
  /* --------------------------------- ACTION --------------------------------- */
  const action: Entity.Action = {
    block: BigInt(event.block.number),
    campaign_id: entities.campaign.id,
    category: params.category as EnvioEnum.ActionCategory,
    chainId: BigInt(event.chainId),
    claimAmount: params.claimAmount,
    claimIndex: params.claimIndex,
    claimRecipient: params.claimRecipient,
    claimStreamId: params.claimStreamId,
    claimTokenId: params.claimTokenId,
    clawbackAmount: params.clawbackAmount,
    clawbackFrom: params.clawbackFrom,
    clawbackTo: params.clawbackTo,
    fee: params.fee,
    from: event.transaction.from?.toLowerCase() || "",
    hash: event.transaction.hash,
    id: Id.action(event),
    subgraphId: entities.watcher.actionCounter,
    timestamp: BigInt(event.block.timestamp),
  };
  await context.Action.set(action);

  /* --------------------------------- WATCHER -------------------------------- */
  const updatedWatcher: Entity.Watcher = {
    ...entities.watcher,
    actionCounter: entities.watcher.actionCounter + 1n,
  };
  await context.Watcher.set(updatedWatcher);

  return action;
}
