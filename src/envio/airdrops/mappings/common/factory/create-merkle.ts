import type { Envio } from "../../../../common/bindings";
import { CommonStore } from "../../../../common/store";
import type { Context } from "../../../bindings";
import { isOfficialLockup } from "../../../helpers";
import type { Params } from "../../../helpers/types";
import { Store } from "../../../store";
import { type Loader } from "../../common/loader";

type Input<P> = {
  context: Context.Handler;
  event: Envio.Event;
  loaderReturn: Loader.CreateReturn;
  params: P;
};

/* -------------------------------------------------------------------------- */
/*                               MERKLE INSTANT                               */
/* -------------------------------------------------------------------------- */

export async function createMerkleInstant(input: Input<Params.CreateCampaignBase>): Promise<void> {
  const { context, event, loaderReturn, params } = input;

  /* -------------------------------- CAMPAIGN -------------------------------- */
  const createEntities = await createAssociatedEntities(context, event, loaderReturn, params);
  const campaign = await Store.Campaign.createInstant(
    context,
    event,
    createEntities,
    params as Params.CreateCampaignBase,
  );

  /* --------------------------------- ACTION --------------------------------- */
  const actionEntities = { campaign, ...createEntities };
  await Store.Action.create(context, event, actionEntities, { category: "Create" });

  /* --------------------------------- WATCHER -------------------------------- */
  await Store.Watcher.incrementCounters(context, createEntities.watcher);
}

/* -------------------------------------------------------------------------- */
/*                                  MERKLE LL                                 */
/* -------------------------------------------------------------------------- */

export async function createMerkleLL(input: Input<Params.CreateCampaignLL>): Promise<void> {
  const { context, event, loaderReturn, params } = input;

  /* -------------------------------- CAMPAIGN -------------------------------- */
  if (!isOfficialLockup(event, params.lockup)) {
    return;
  }
  const createEntities = await createAssociatedEntities(context, event, loaderReturn, params);
  const campaign = await Store.Campaign.createLL(context, event, createEntities, params as Params.CreateCampaignLL);

  /* --------------------------------- ACTION --------------------------------- */
  const actionEntities = { campaign, ...createEntities };
  await Store.Action.create(context, event, actionEntities, { category: "Create" });

  /* --------------------------------- WATCHER -------------------------------- */
  await Store.Watcher.incrementCounters(context, createEntities.watcher);
}

/* -------------------------------------------------------------------------- */
/*                                  MERKLE LT                                 */
/* -------------------------------------------------------------------------- */

export async function createMerkleLT(input: Input<Params.CreateCampaignLT>): Promise<void> {
  const { context, event, loaderReturn, params } = input;

  /* -------------------------------- CAMPAIGN -------------------------------- */
  if (!isOfficialLockup(event, params.lockup)) {
    return;
  }
  const createEntities = await createAssociatedEntities(context, event, loaderReturn, params);
  const campaign = await Store.Campaign.createLT(context, event, createEntities, params as Params.CreateCampaignLT);

  /* --------------------------------- ACTION --------------------------------- */
  const actionEntities = { campaign, ...createEntities };
  await Store.Action.create(context, event, actionEntities, { category: "Create" });

  /* --------------------------------- WATCHER -------------------------------- */
  await Store.Watcher.incrementCounters(context, createEntities.watcher);
}

/* -------------------------------------------------------------------------- */
/*                               INTERNAL LOGIC                               */
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
