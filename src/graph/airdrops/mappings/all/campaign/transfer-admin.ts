import { ADDRESS_ZERO } from "../../../../common/constants";
import { EventTransferAdmin } from "../../../bindings";
import { Params } from "../../../helpers/types";
import { Store } from "../../../store";

export function handleTransferAdminInCampaign(event: EventTransferAdmin): void {
  const campaign = Store.Campaign.get(event.address);
  if (campaign === null) {
    return;
  }

  // Starting with v1.3, the constructor emits a TransferAdmin event.
  if (event.params.oldAdmin.equals(ADDRESS_ZERO)) {
    return;
  }

  /* -------------------------------- CAMPAIGN -------------------------------- */
  Store.Campaign.updateAdmin(campaign, event.params.newAdmin);

  /* --------------------------------- ACTION --------------------------------- */
  Store.Action.create(event, campaign, { category: "TransferAdmin" } as Params.Action);
}
