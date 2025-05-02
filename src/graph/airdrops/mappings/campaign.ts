import { Address } from "@graphprotocol/graph-ts";
import { ADDRESS_ZERO, ONE } from "../../constants";
import { logError } from "../../logger";
import { Claim as EventClaimInstant } from "../bindings/types/templates/ContractMerkleFactory/SablierMerkleInstant";
import {
  Claim as EventClaimLockup,
  Clawback as EventClawback,
  TransferAdmin as EventTransferAdmin,
} from "../bindings/types/templates/ContractMerkleFactory/SablierMerkleLL";
import {
  createAction,
  generateCampaignNickname,
  generateStreamIdWithContract,
  getCampaignById,
  getOrCreateActivity,
  getOrCreateAsset,
} from "../schema";

export function handleClaimLockup(event: EventClaimLockup): void {
  const action = createAction(event, "Claim");
  if (action == null) {
    logError("Campaign not registered yet, cannot bind action");
    return;
  }

  const campaign = getCampaignById(action.campaign);
  if (campaign == null) {
    logError("Campaign not registered yet");
    return;
  }

  /** --------------- */

  action.claimIndex = event.params.index;
  action.claimAmount = event.params.amount;
  action.claimRecipient = event.params.recipient;
  action.claimTokenId = event.params.streamId;
  action.claimStreamId = generateStreamIdWithContract(event.params.streamId, campaign.lockup);
  action.fee = event.transaction.value;

  /** --------------- */
  action.save();

  /** --------------- */
  campaign.claimedAmount = campaign.claimedAmount.plus(event.params.amount);
  campaign.claimedCount = campaign.claimedCount.plus(ONE);
  campaign.save();

  /** --------------- */
  const activity = getOrCreateActivity(campaign.id, event);
  if (activity == null) {
    logError("Activity not registered yet");
    return;
  }

  activity.claims = activity.claims.plus(ONE);
  activity.amount = activity.amount.plus(event.params.amount);
  activity.save();
}

export function handleClaimInstant(event: EventClaimInstant): void {
  const action = createAction(event, "Claim");
  if (action == null) {
    logError("Campaign not registered yet, cannot bind action");
    return;
  }

  const campaign = getCampaignById(action.campaign);
  if (campaign == null) {
    logError("Campaign not registered yet");
    return;
  }

  /** --------------- */

  action.claimIndex = event.params.index;
  action.claimAmount = event.params.amount;
  action.claimRecipient = event.params.recipient;

  action.fee = event.transaction.value;

  /** --------------- */
  action.save();

  /** --------------- */
  campaign.claimedAmount = campaign.claimedAmount.plus(event.params.amount);
  campaign.claimedCount = campaign.claimedCount.plus(ONE);
  campaign.save();

  /** --------------- */
  const activity = getOrCreateActivity(campaign.id, event);
  if (activity == null) {
    logError("Activity not registered yet");
    return;
  }

  activity.claims = activity.claims.plus(ONE);
  activity.amount = activity.amount.plus(event.params.amount);
  activity.save();
}

export function handleClawback(event: EventClawback): void {
  const action = createAction(event, "Clawback");
  if (action == null) {
    logError("Campaign not registered yet, cannot bind action");
    return;
  }

  const campaign = getCampaignById(action.campaign);
  if (campaign == null) {
    logError("Campaign not registered yet");
    return;
  }

  /** --------------- */
  action.clawbackFrom = event.params.admin;
  action.clawbackTo = event.params.to;
  action.clawbackAmount = event.params.amount;

  /** --------------- */
  action.save();

  /** --------------- */
  campaign.clawbackTime = event.block.timestamp;
  campaign.clawbackAction = action.id;
  campaign.save();
}
export function handleTransferAdmin(event: EventTransferAdmin): void {
  if (event.params.oldAdmin.equals(ADDRESS_ZERO)) {
    return;
  }

  const action = createAction(event, "TransferAdmin");
  if (action == null) {
    logError("Campaign not registered yet, cannot bind action");
    return;
  }

  const campaign = getCampaignById(action.campaign);
  if (campaign == null) {
    logError("Campaign not registered yet");
    return;
  }

  /** --------------- */
  action.save();

  /** --------------- */

  const nickname = generateCampaignNickname(
    event.params.newAdmin,
    getOrCreateAsset(Address.fromString(campaign.asset)),
    campaign.name,
    campaign.version,
  );
  campaign.nickname = nickname;

  /** --------------- */
  campaign.admin = event.params.newAdmin;
  campaign.save();
}
