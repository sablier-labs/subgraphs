import { Airdrops as enums } from "../../../../../schema/enums";
import type { Entity } from "../../../bindings";
import type {
  SablierV2MerkleStreamerLL_v1_1_Claim_handler as Handler_v1_1,
  SablierV2MerkleLL_v1_2_Claim_handler as Handler_v1_2,
  SablierMerkleInstant_v1_3_Claim_handler as Handler_v1_3,
  SablierV2MerkleStreamerLL_v1_1_Claim_loader as Loader_v1_1,
  SablierV2MerkleLL_v1_2_Claim_loader as Loader_v1_2,
  SablierMerkleInstant_v1_3_Claim_loader as Loader_v1_3,
} from "../../../bindings/src/Types.gen";
import { isVersionWithFees } from "../../../helpers";
import { Store } from "../../../store";

/* -------------------------------------------------------------------------- */
/*                                   LOADER                                   */
/* -------------------------------------------------------------------------- */

type LoaderReturn = {
  activity?: Entity.Activity;
  campaign?: Entity.Campaign;
  watcher?: Entity.Watcher;
};

type Loader<T> = Loader_v1_1<T> & Loader_v1_2<T> & Loader_v1_3<T>;
const loader: Loader<LoaderReturn> = async ({ context, event }) => {
  const activity = await Store.Activity.get(context, event);
  const campaign = await Store.Campaign.get(context, event);
  const watcher = await Store.Watcher.get(context, event.chainId);

  return {
    activity,
    campaign,
    watcher,
  };
};

/* -------------------------------------------------------------------------- */
/*                                   HANDLER                                  */
/* -------------------------------------------------------------------------- */

type Handler<T> = Handler_v1_1<T> & Handler_v1_2<T> & Handler_v1_3<T>;

const handler: Handler<LoaderReturn> = async ({ context, event, loaderReturn }) => {
  const { campaign, watcher } = loaderReturn;
  Store.Campaign.exists(event, campaign);
  Store.Watcher.exists(event.chainId, watcher);

  /* -------------------------------- CAMPAIGN -------------------------------- */
  await Store.Campaign.updateClaimed(context, campaign, event.params.amount);

  /* -------------------------------- ACTIVITY -------------------------------- */
  const activity = loaderReturn.activity ?? (await Store.Activity.create(context, event, campaign.id));
  await Store.Activity.update(context, activity, event.params.amount);

  /* --------------------------------- ACTION --------------------------------- */
  const actionEntities = {
    campaign,
    watcher,
  };
  let fee: bigint | undefined;
  if (isVersionWithFees(event.chainId, campaign.factory_id)) {
    fee = event.transaction.value;
  }
  await Store.Action.create(context, event, actionEntities, {
    category: enums.ActionCategory.Claim,
    claimAmount: event.params.amount,
    claimIndex: event.params.index,
    claimRecipient: event.params.recipient,
    fee,
  });
};

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */

export const claimLockup = { handler, loader };
