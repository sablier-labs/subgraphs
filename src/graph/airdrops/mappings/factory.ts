import { logError } from "../../logger";
import { logDebug } from "../../logger";
import {
  ContractMerkleInstant as ContractCampaignInstant,
  ContractMerkleLL as ContractCampaignLL,
  ContractMerkleLT as ContractCampaignLT,
} from "../bindings/types/templates";
import {
  CreateMerkleInstant as EventCreateCampaignInstant_V23,
  CreateMerkleStreamerLL as EventCreateCampaignLL_V21,
  CreateMerkleLL as EventCreateCampaignLL_V22,
  CreateMerkleLL1 as EventCreateCampaignLL_V23,
  CreateMerkleLT as EventCreateCampaignLT_V22,
  CreateMerkleLT1 as EventCreateCampaignLT_V23,
} from "../bindings/types/templates/ContractMerkleFactory/SablierMerkleFactory";
import { isWhitelistedShape } from "../config";
import {
  createCampaignInstant_V23,
  createCampaignLinear_V21,
  createCampaignLinear_V22,
  createCampaignLinear_V23,
  createCampaignTranched_V22,
  createCampaignTranched_V23,
  createEntityAction,
} from "../schema";

export function handleCreateCampaignLL_V21(event: EventCreateCampaignLL_V21): void {
  if (!isWhitelistedShape(event.params.lockupLinear)) {
    logDebug("Campaign skipped, shape contract not whitelisted: {}", [event.params.lockupLinear.toString()]);
    return;
  }

  const campaign = createCampaignLinear_V21(event);
  if (campaign == null) {
    return;
  }

  ContractCampaignLL.create(event.params.merkleStreamer);
  campaign.save();

  const action = createEntityAction(event, "Create");
  if (action == null) {
    logError("Campaign not registered yet, cannot bind action");
    return;
  }
  action.campaign = campaign.id;
  action.save();
}

export function handleCreateCampaignLL_V22(event: EventCreateCampaignLL_V22): void {
  if (!isWhitelistedShape(event.params.lockupLinear)) {
    logDebug("Campaign skipped, shape contract not whitelisted: {}", [event.params.lockupLinear.toString()]);
    return;
  }

  const campaign = createCampaignLinear_V22(event);
  if (campaign == null) {
    return;
  }

  ContractCampaignLL.create(event.params.merkleLL);
  campaign.save();

  const action = createEntityAction(event, "Create");
  if (action == null) {
    logError("Campaign not registered yet, cannot bind action");
    return;
  }
  action.campaign = campaign.id;
  action.save();
}

export function handleCreateCampaignLL_V23(event: EventCreateCampaignLL_V23): void {
  if (!isWhitelistedShape(event.params.lockup)) {
    logDebug("Campaign skipped, shape contract not whitelisted: {}", [event.params.merkleLL.toString()]);
    return;
  }

  const campaign = createCampaignLinear_V23(event);
  if (campaign == null) {
    return;
  }

  ContractCampaignLL.create(event.params.merkleLL);
  campaign.save();

  const action = createEntityAction(event, "Create");
  if (action == null) {
    logError("Campaign not registered yet, cannot bind action");
    return;
  }
  action.campaign = campaign.id;
  action.save();
}

export function handleCreateCampaignLT_V22(event: EventCreateCampaignLT_V22): void {
  if (!isWhitelistedShape(event.params.lockupTranched)) {
    logDebug("Campaign skipped, shape contract not whitelisted: {}", [event.params.lockupTranched.toString()]);
    return;
  }

  const campaign = createCampaignTranched_V22(event);
  if (campaign == null) {
    return;
  }

  ContractCampaignLT.create(event.params.merkleLT);
  campaign.save();

  const action = createEntityAction(event, "Create");
  if (action == null) {
    logError("Campaign not registered yet, cannot bind action");
    return;
  }
  action.campaign = campaign.id;
  action.save();
}

export function handleCreateCampaignLT_V23(event: EventCreateCampaignLT_V23): void {
  if (!isWhitelistedShape(event.params.lockup)) {
    logDebug("Campaign skipped, shape contract not whitelisted: {}", [event.params.merkleLT.toString()]);
    return;
  }

  const campaign = createCampaignTranched_V23(event);
  if (campaign == null) {
    return;
  }

  ContractCampaignLT.create(event.params.merkleLT);
  campaign.save();

  const action = createEntityAction(event, "Create");
  if (action == null) {
    logError("Campaign not registered yet, cannot bind action");
    return;
  }
  action.campaign = campaign.id;
  action.save();
}

export function handleCreateCampaignInstant_V23(event: EventCreateCampaignInstant_V23): void {
  const campaign = createCampaignInstant_V23(event);
  if (campaign == null) {
    return;
  }

  ContractCampaignInstant.create(event.params.merkleInstant);
  campaign.save();

  const action = createEntityAction(event, "Create");
  if (action == null) {
    logError("Campaign not registered yet, cannot bind action");
    return;
  }
  action.campaign = campaign.id;
  action.save();
}
