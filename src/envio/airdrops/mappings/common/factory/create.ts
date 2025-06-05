import { Airdrops as enums } from "../../../../../schema/enums";
import type { Envio } from "../../../../common/bindings";
import type { Context } from "../../../bindings";
import { type Entity } from "../../../bindings";
import type { Params } from "../../../helpers/types";
import { Store } from "../../../store";

type Input = {
  context: Context.Handler;
  event: Envio.Event;
  params: Params.CreateCampaignLL | Params.CreateCampaignLT;
};

/* -------------------------------------------------------------------------- */
/*                                  MERKLE LL                                 */
/* -------------------------------------------------------------------------- */

export async function createMerkleLL(input: Input): Promise<void> {
  const { context, event, params } = input;

  const associatedEntities = await createAssociatedEntities(context, event, params.entities);
  const campaign = await Store.Campaign.createLL(context, event, params as Params.CreateCampaignLL);

  const actionEntities = {
    campaign,
    factory: associatedEntities.factory,
    watcher: associatedEntities.watcher,
  };
  await Store.Action.create(context, event, { category: enums.ActionCategory.Create, entities: actionEntities });
}

/* -------------------------------------------------------------------------- */
/*                                  MERKLE LT                                 */
/* -------------------------------------------------------------------------- */

export async function createMerkleLT(input: Input): Promise<void> {
  const { context, event, params } = input;

  const associatedEntities = await createAssociatedEntities(context, event, params.entities);
  const campaign = await Store.Campaign.createLT(context, event, params as Params.CreateCampaignLT);

  const actionEntities = {
    campaign,
    factory: associatedEntities.factory,
    watcher: associatedEntities.watcher,
  };
  await Store.Action.create(context, event, { category: enums.ActionCategory.Create, entities: actionEntities });
}

/* -------------------------------------------------------------------------- */
/*                                COMMON LOGIC                                */
/* -------------------------------------------------------------------------- */

async function createAssociatedEntities(
  context: Context.Handler,
  event: Envio.Event,
  entities: {
    factory?: Entity.Factory;
    watcher?: Entity.Watcher;
  },
): Promise<{
  factory: Entity.Factory;
  watcher: Entity.Watcher;
}> {
  return {
    factory: entities.factory ?? (await Store.Factory.create(context, event.chainId, event.srcAddress)),
    watcher: entities.watcher ?? (await Store.Watcher.create(event.chainId)),
  };
}
