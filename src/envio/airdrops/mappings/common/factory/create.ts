import { Airdrops as enums } from "../../../../../schema/enums";
import type { Envio } from "../../../../common/bindings";
import { CommonStore } from "../../../../common/store";
import type { Context } from "../../../bindings";
import type { CreateEntities, Params } from "../../../helpers/types";
import { Store } from "../../../store";
import { type Loader } from "../../loader";

type Input = {
  context: Context.Handler;
  event: Envio.Event;
  loaderReturn: Loader.CreateReturn;
  params: Params.CampaignLL | Params.CampaignLT;
};

/* -------------------------------------------------------------------------- */
/*                                  MERKLE LL                                 */
/* -------------------------------------------------------------------------- */

export async function createMerkleLL(input: Input): Promise<void> {
  const { context, event, loaderReturn, params } = input;

  const campaignEntities = await loadEntities(context, event, loaderReturn, params.asset);
  const campaign = await Store.Campaign.createLL(context, event, campaignEntities, params as Params.CampaignLL);

  const actionEntities = {
    campaign,
    factory: campaignEntities.factory,
    watcher: campaignEntities.watcher,
  };
  await Store.Action.create(context, event, actionEntities, { category: enums.ActionCategory.Create });
}

/* -------------------------------------------------------------------------- */
/*                                  MERKLE LT                                 */
/* -------------------------------------------------------------------------- */

export async function createMerkleLT(input: Input): Promise<void> {
  const { context, event, loaderReturn, params } = input;

  const campaignEntities = await loadEntities(context, event, loaderReturn, params.asset);
  const campaign = await Store.Campaign.createLT(context, event, campaignEntities, params as Params.CampaignLT);

  const actionEntities = {
    campaign,
    factory: campaignEntities.factory,
    watcher: campaignEntities.watcher,
  };
  await Store.Action.create(context, event, actionEntities, { category: enums.ActionCategory.Create });
}

/* -------------------------------------------------------------------------- */
/*                                COMMON LOGIC                                */
/* -------------------------------------------------------------------------- */

async function loadEntities(
  context: Context.Handler,
  event: Envio.Event,
  loaderReturn: Loader.CreateReturn,
  assetAddress: Envio.Address,
): Promise<CreateEntities> {
  return {
    asset: loaderReturn.asset ?? (await CommonStore.Asset.create(context, event.chainId, assetAddress)),
    factory: loaderReturn.factory ?? (await Store.Factory.create(context, event.chainId, event.srcAddress)),
    watcher: loaderReturn.watcher ?? (await Store.Watcher.create(event.chainId)),
  };
}
