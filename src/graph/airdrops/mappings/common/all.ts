/**
 * @file Note that 'all' refers to all versions.
 */
import { Address } from "@graphprotocol/graph-ts";
import { ADDRESS_ZERO, ONE } from "../../../common/constants";
import { getStreamId } from "../../../common/ids";
import { logError } from "../../../common/logger";
import { EventClaimLockup, EventClawback, EventTransferAdmin } from "../../bindings";
import { createEntityAction, createOrUpdateActivity, getEntityCampaign, getOrCreateEntityAsset } from "../../entities";
import { getNickname } from "../../helpers";

export function handleClawback(event: EventClawback): void {
  const campaign = getEntityCampaign(event.address);
  if (campaign == null) {
    return;
  }

  const action = createEntityAction(event, campaign, "Clawback");
  if (action == null) {
    logError("Could not handle the clawback: {}", [event.transaction.hash.toString()]);
    return;
  }

  campaign.clawbackAction = action.id;
  campaign.clawbackTime = event.block.timestamp;
  campaign.save();

  action.clawbackAmount = event.params.amount;
  action.clawbackFrom = event.params.admin;
  action.clawbackTo = event.params.to;
  action.save();
}

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
