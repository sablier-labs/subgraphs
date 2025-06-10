import { Airdrops as enums } from "../../../../../schema/enums";
import type { Entity } from "../../../bindings";
import type {
  SablierV2MerkleStreamerLL_v1_1_Clawback_handler as Handler_v1_1,
  SablierV2MerkleLL_v1_2_Clawback_handler as Handler_v1_2,
  SablierMerkleInstant_v1_3_Clawback_handler as Handler_v1_3,
  SablierV2MerkleStreamerLL_v1_1_Clawback_loader as Loader_v1_1,
  SablierV2MerkleLL_v1_2_Clawback_loader as Loader_v1_2,
  SablierMerkleInstant_v1_3_Clawback_loader as Loader_v1_3,
} from "../../../bindings/src/Types.gen";
import { Store } from "../../../store";

/* -------------------------------------------------------------------------- */
/*                                   LOADER                                   */
/* -------------------------------------------------------------------------- */
type LoaderReturn = {
  campaign?: Entity.Campaign;
  watcher?: Entity.Watcher;
};

type Loader<T> = Loader_v1_1<T> & Loader_v1_2<T> & Loader_v1_3<T>;

const loader: Loader<LoaderReturn> = async ({ context, event }) => {
  const campaign = await Store.Campaign.get(context, event);
  const watcher = await Store.Watcher.get(context, event.chainId);

  return {
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

  /* --------------------------------- ACTION --------------------------------- */
  const entities = { campaign, watcher };
  const action = await Store.Action.create(context, event, entities, {
    category: enums.ActionCategory.Clawback,
    clawbackAmount: event.params.amount,
    clawbackFrom: event.params.admin,
    clawbackTo: event.params.to,
  });

  /* -------------------------------- CAMPAIGN -------------------------------- */
  await Store.Campaign.updateClawback(context, event, campaign, action.id);
};

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */

export const clawback = { handler, loader };
