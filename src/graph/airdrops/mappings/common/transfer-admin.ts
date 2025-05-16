import { Address } from "@graphprotocol/graph-ts";
import { ADDRESS_ZERO } from "../../../common/constants";
import { logError } from "../../../common/logger";
import { EventTransferAdmin } from "../../bindings";
import { createEntityAction, getEntityCampaign, getOrCreateEntityAsset } from "../../entities";
import { getNickname } from "../../helpers";

export function handleTransferAdminInCampaign(event: EventTransferAdmin): void {
  const campaign = getEntityCampaign(event.address);
  if (campaign == null) {
    return;
  }

  // Starting with v1.3, the constructor emits a TransferAdmin event.
  if (event.params.oldAdmin.equals(ADDRESS_ZERO)) {
    return;
  }

  const action = createEntityAction(event, campaign, "TransferAdmin");
  if (action == null) {
    logError("Could not handle the admin transfer: {}", [event.transaction.hash.toString()]);
    return;
  }

  // Update the admin and the nickname.
  campaign.admin = event.params.newAdmin;
  const asset = getOrCreateEntityAsset(Address.fromString(campaign.asset));
  const nickname = getNickname(Address.fromBytes(campaign.admin), asset, campaign.name);
  campaign.nickname = nickname;
  campaign.save();
}
