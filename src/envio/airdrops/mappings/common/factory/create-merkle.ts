import { Airdrops as enums } from "../../../../../schema/enums";
import type { Envio } from "../../../../common/bindings";
import { CommonStore } from "../../../../common/store";
import type { Context } from "../../../bindings";
import type { Params } from "../../../helpers/types";
import { Store } from "../../../store";
import { type Loader } from "../../common/loader";

type Input = {
  context: Context.Handler;
  event: Envio.Event;
  loaderReturn: Loader.CreateReturn;
  params: Params.CreateCampaignLL | Params.CreateCampaignLT;
};

/* -------------------------------------------------------------------------- */
/*                                  MERKLE LL                                 */
/* -------------------------------------------------------------------------- */

export async function createMerkleLL(input: Input): Promise<void> {
  const { context, event, loaderReturn, params } = input;

  const createEntities = await createAssociatedEntities(context, event, loaderReturn, params);
  const campaign = await Store.Campaign.createLL(context, event, createEntities, params as Params.CreateCampaignLL);

  const actionEntities = {
    campaign,
    factory: createEntities.factory,
    watcher: createEntities.watcher,
  };
  await Store.Action.create(context, event, actionEntities, { category: enums.ActionCategory.Create });
}

/* -------------------------------------------------------------------------- */
/*                                  MERKLE LT                                 */
/* -------------------------------------------------------------------------- */

export async function createMerkleLT(input: Input): Promise<void> {
  const { context, event, loaderReturn, params } = input;

  const createEntities = await createAssociatedEntities(context, event, loaderReturn, params);
  const campaign = await Store.Campaign.createLT(context, event, createEntities, params as Params.CreateCampaignLT);

  const actionEntities = {
    campaign,
    factory: createEntities.factory,
    watcher: createEntities.watcher,
  };
  await Store.Action.create(context, event, actionEntities, { category: enums.ActionCategory.Create });
}

/* -------------------------------------------------------------------------- */
/*                                COMMON LOGIC                                */
/* -------------------------------------------------------------------------- */

async function createAssociatedEntities(
  context: Context.Handler,
  event: Envio.Event,
  loaderReturn: Loader.CreateReturn,
  params: { asset: string },
): Promise<Params.CreateEntities> {
  const { asset, assetMetadata, factory, watcher } = loaderReturn;
  return {
    asset: asset ?? (await CommonStore.Asset.create(context, event.chainId, params.asset, assetMetadata)),
    factory: factory ?? (await Store.Factory.create(context, event.chainId, event.srcAddress)),
    watcher: watcher ?? (await Store.Watcher.create(event.chainId)),
  };
}
