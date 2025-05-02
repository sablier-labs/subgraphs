import { Address } from "@graphprotocol/graph-ts";
import { ADDRESS_ZERO, log_exit, one } from "../constants";
import type { Claim as EventClaimInstant } from "../generated/types/templates/ContractMerkleFactory/SablierMerkleInstant";
import type {
  Claim as EventClaimLockup,
  Clawback as EventClawback,
  TransferAdmin as EventTransferAdmin,
} from "../generated/types/templates/ContractMerkleFactory/SablierMerkleLL";
import { createAction, generateStreamId, getCampaignById, getOrCreateActivity, getOrCreateAsset } from "../helpers";
import { generateCampaignNickname } from "../helpers/campaign";

export function handleClaimLockup(event: EventClaimLockup): void {
  const action = createAction(event, "Claim");
  if (action == null) {
    log_exit("Campaign not registered yet, cannot bind action");
    return;
  }

  const campaign = getCampaignById(action.campaign);
  if (campaign == null) {
    log_exit("Campaign not registered yet");
    return;
  }

  /** --------------- */

  action.claimIndex = event.params.index;
  action.claimAmount = event.params.amount;
  action.claimRecipient = event.params.recipient;
  action.claimTokenId = event.params.streamId;
  action.claimStreamId = generateStreamId(campaign.lockup, event.params.streamId);
  action.fee = event.transaction.value;

  /** --------------- */
  action.save();

  /** --------------- */
  campaign.claimedAmount = campaign.claimedAmount.plus(event.params.amount);
  campaign.claimedCount = campaign.claimedCount.plus(one);
  campaign.save();

  /** --------------- */
  const activity = getOrCreateActivity(campaign.id, event);
  if (activity == null) {
    log_exit("Activity not registered yet");
    return;
  }

  activity.claims = activity.claims.plus(one);
  activity.amount = activity.amount.plus(event.params.amount);
  activity.save();
}

export function handleClaimInstant(event: EventClaimInstant): void {
  const action = createAction(event, "Claim");
  if (action == null) {
    log_exit("Campaign not registered yet, cannot bind action");
    return;
  }

  const campaign = getCampaignById(action.campaign);
  if (campaign == null) {
    log_exit("Campaign not registered yet");
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
  campaign.claimedCount = campaign.claimedCount.plus(one);
  campaign.save();

  /** --------------- */
  const activity = getOrCreateActivity(campaign.id, event);
  if (activity == null) {
    log_exit("Activity not registered yet");
    return;
  }

  activity.claims = activity.claims.plus(one);
  activity.amount = activity.amount.plus(event.params.amount);
  activity.save();
}

export function handleClawback(event: EventClawback): void {
  const action = createAction(event, "Clawback");
  if (action == null) {
    log_exit("Campaign not registered yet, cannot bind action");
    return;
  }

  const campaign = getCampaignById(action.campaign);
  if (campaign == null) {
    log_exit("Campaign not registered yet");
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
    log_exit("Campaign not registered yet, cannot bind action");
    return;
  }

  const campaign = getCampaignById(action.campaign);
  if (campaign == null) {
    log_exit("Campaign not registered yet");
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
