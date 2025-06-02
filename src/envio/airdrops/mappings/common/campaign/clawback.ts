import type { Entity } from "@envio-airdrops/bindings";
import type {
  SablierV2MerkleStreamerLL_v1_1_Clawback_handler as Handler_v1_1,
  SablierV2MerkleLL_v1_2_Clawback_handler as Handler_v1_2,
  SablierMerkleInstant_v1_3_Clawback_handler as Handler_v1_3,
  SablierV2MerkleStreamerLL_v1_1_Clawback_loader as Loader_v1_1,
  SablierV2MerkleLL_v1_2_Clawback_loader as Loader_v1_2,
  SablierMerkleInstant_v1_3_Clawback_loader as Loader_v1_3,
} from "@envio-airdrops/bindings/index";
import { Store } from "@envio-airdrops/store";
import { Airdrops as enums } from "@src/schema/enums";

/* -------------------------------------------------------------------------- */
/*                                   LOADER                                   */
/* -------------------------------------------------------------------------- */
type LoaderReturn = {
  campaign: Entity.Campaign;
  watcher: Entity.Watcher;
};

type Loader<T> = Loader_v1_1<T> & Loader_v1_2<T> & Loader_v1_3<T>;

const loader: Loader<LoaderReturn> = async ({ context, event }) => {
  const campaign = await Store.Campaign.getOrThrow(context, event);
  const watcher = await Store.Watcher.getOrThrow(context, event.chainId);

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
  /* --------------------------------- ACTION --------------------------------- */
  const action = await Store.Action.create(context, event, loaderReturn, {
    category: enums.ActionCategory.Clawback,
    clawbackAmount: event.params.amount,
    clawbackFrom: event.params.admin,
    clawbackTo: event.params.to,
  });

  /* -------------------------------- CAMPAIGN -------------------------------- */
  await Store.Campaign.updateClawback(context, event, loaderReturn.campaign, action.id);
};

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */

export const clawback = { handler, loader };
