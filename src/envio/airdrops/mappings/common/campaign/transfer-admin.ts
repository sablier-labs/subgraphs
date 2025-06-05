import { Airdrops as enums } from "../../../../../schema/enums";
import { ADDRESS_ZERO } from "../../../../common/constants";
import { type Entity } from "../../../bindings";
import type {
  SablierV2MerkleStreamerLL_v1_1_TransferAdmin_handler as Handler_v1_1,
  SablierV2MerkleLL_v1_2_TransferAdmin_handler as Handler_v1_2,
  SablierMerkleInstant_v1_3_TransferAdmin_handler as Handler_v1_3,
  SablierV2MerkleStreamerLL_v1_1_TransferAdmin_loader as Loader_v1_1,
  SablierV2MerkleLL_v1_2_TransferAdmin_loader as Loader_v1_2,
  SablierMerkleInstant_v1_3_TransferAdmin_loader as Loader_v1_3,
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

export const loader: Loader<LoaderReturn> = async ({ context, event }) => {
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
  // Starting with v1.3, the constructor emits a TransferAdmin event.
  if (event.params.oldAdmin === ADDRESS_ZERO) {
    return;
  }

  const { campaign, watcher } = loaderReturn;
  Store.Campaign.exists(event, campaign);
  Store.Watcher.exists(event.chainId, watcher);

  /* -------------------------------- CAMPAIGN -------------------------------- */
  await Store.Campaign.updateAdmin(context, campaign, event.params.newAdmin);

  /* --------------------------------- ACTION --------------------------------- */
  const entities = {
    campaign,
    watcher,
  };
  await Store.Action.create(context, event, entities, {
    category: enums.ActionCategory.TransferAdmin,
  });
};

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */

export const transferAdmin = { handler, loader };
