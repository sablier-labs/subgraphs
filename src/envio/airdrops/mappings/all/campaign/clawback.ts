import type { Entity } from "@envio-airdrops/bindings";
import { Contract } from "@envio-airdrops/bindings";
import type {
  SablierV2MerkleStreamerLL_v1_1_Clawback_handler as Handler,
  SablierV2MerkleStreamerLL_v1_1_Clawback_loader as Loader,
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
/*                                  MAPPINGS                                  */
/* -------------------------------------------------------------------------- */

const handlerWithLoader = { loader, handler };

Contract.Campaign.MerkleStreamerLL_v1_1.Clawback.handlerWithLoader(handlerWithLoader);

Contract.Campaign.MerkleLL_v1_2.Clawback.handlerWithLoader(handlerWithLoader);
Contract.Campaign.MerkleLT_v1_2.Clawback.handlerWithLoader(handlerWithLoader);

Contract.Campaign.MerkleInstant_v1_3.Clawback.handlerWithLoader(handlerWithLoader);
Contract.Campaign.MerkleLL_v1_3.Clawback.handlerWithLoader(handlerWithLoader);
Contract.Campaign.MerkleLT_v1_3.Clawback.handlerWithLoader(handlerWithLoader);
