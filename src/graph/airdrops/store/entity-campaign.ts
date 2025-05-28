import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { ONE, ZERO } from "../../common/constants";
import { readChainId, readContractVersion } from "../../common/context";
import { Id } from "../../common/id";
import { logError } from "../../common/logger";
import { EntityCampaign } from "../bindings";
import { getNickname } from "../helpers";
import { Params } from "../helpers/types";
import { getOrCreateAsset } from "./entity-asset";
import { getOrCreateFactory } from "./entity-factory";
import { createTranchesWithPercentages } from "./entity-tranche";
import { getOrCreateWatcher } from "./entity-watcher";

export function createCampaignInstant(event: ethereum.Event, params: Params.CampaignBase): EntityCampaign {
  const campaign = createBaseCampaign(event, params);
  campaign.save();
  return campaign;
}

export function createCampaignLL(
  event: ethereum.Event,
  paramsBase: Params.CampaignBase,
  paramsLL: Params.CampaignLL,
): EntityCampaign {
  const campaign = createBaseCampaign(event, paramsBase);

  /* --------------------------------- LOCKUP --------------------------------- */
  campaign.lockup = paramsLL.lockup;
  campaign.streamCancelable = paramsLL.cancelable;
  campaign.streamShape = paramsLL.shape;
  campaign.streamTotalDuration = paramsLL.totalDuration;
  campaign.streamTransferable = paramsLL.transferable;

  const startTime = paramsLL.startTime;
  if (startTime) {
    campaign.streamStart = startTime.isZero() === false;
    campaign.streamStartTime = startTime;
  }

  /* ------------------------------ LOCKUP LINEAR ----------------------------- */
  campaign.streamCliff = paramsLL.cliffDuration.isZero() === false;
  campaign.streamCliffDuration = paramsLL.cliffDuration;
  campaign.streamCliffPercentage = paramsLL.cliffPercentage;
  const startPercentage = paramsLL.startPercentage;
  if (startPercentage) {
    campaign.streamInitial = startPercentage.isZero() === false;
    campaign.streamInitialPercentage = startPercentage;
  }

  campaign.save();
  return campaign;
}

export function createCampaignLT(
  event: ethereum.Event,
  paramsBase: Params.CampaignBase,
  paramsLT: Params.CampaignLT,
): EntityCampaign {
  let campaign = createBaseCampaign(event, paramsBase);

  /* --------------------------------- LOCKUP --------------------------------- */
  campaign.lockup = paramsLT.lockup;
  campaign.streamCancelable = paramsLT.cancelable;
  campaign.streamShape = paramsLT.shape;
  campaign.streamTransferable = paramsLT.transferable;
  campaign.streamTotalDuration = paramsLT.totalDuration;
  const startTime = paramsLT.startTime;
  if (startTime) {
    campaign.streamStart = startTime.isZero() === false;
    campaign.streamStartTime = startTime;
  }

  /* ----------------------------- LOCKUP TRANCHED ---------------------------- */
  campaign = createTranchesWithPercentages(campaign, paramsLT.tranchesWithPercentages);

  campaign.save();
  return campaign;
}

export function getCampaign(address: Address): EntityCampaign | null {
  const id = Id.campaign(address);
  const campaign = EntityCampaign.load(id);
  if (campaign === null) {
    logError("Campaign entity not saved for address: {}", [address.toHexString()]);
  }
  return campaign;
}

export function updateCampaignAdmin(campaign: EntityCampaign, admin: Address): void {
  campaign.admin = admin;
  const asset = getOrCreateAsset(Address.fromString(campaign.asset));
  const nickname = getNickname(Address.fromBytes(campaign.admin), asset, campaign.name);
  campaign.nickname = nickname;
  campaign.save();
}

export function updateCampaignClaimed(campaign: EntityCampaign, amount: BigInt): void {
  campaign.claimedAmount = campaign.claimedAmount.plus(amount);
  campaign.claimedCount = campaign.claimedCount.plus(ONE);
  campaign.save();
}

export function updateCampaignClawback(event: ethereum.Event, campaign: EntityCampaign, actionId: string): void {
  campaign.clawbackAction = actionId;
  campaign.clawbackTime = event.block.timestamp;
  campaign.save();
}

function createBaseCampaign(event: ethereum.Event, params: Params.CampaignBase): EntityCampaign {
  const campaignId = Id.campaign(params.campaignAddress);
  const campaign = new EntityCampaign(campaignId);
  const asset = getOrCreateAsset(params.asset);
  const factory = getOrCreateFactory(event.address);
  const watcher = getOrCreateWatcher();

  /* --------------------------------- CAMPAIGN -------------------------------- */
  campaign.address = params.campaignAddress;
  campaign.admin = params.admin;
  campaign.aggregateAmount = params.aggregateAmount;
  campaign.asset = asset.id;
  campaign.category = params.category;
  campaign.chainId = readChainId();
  campaign.claimedAmount = ZERO;
  campaign.claimedCount = ZERO;
  campaign.expiration = params.expiration;
  campaign.expires = params.expiration.isZero() === false;
  campaign.factory = factory.id;
  campaign.hash = event.transaction.hash;
  campaign.ipfsCID = params.ipfsCID;
  campaign.name = params.name;
  campaign.nickname = getNickname(params.admin, asset, params.name);
  campaign.position = factory.campaignCounter;
  campaign.root = params.merkleRoot;
  campaign.subgraphId = watcher.campaignCounter;
  campaign.timestamp = event.block.timestamp;
  campaign.totalRecipients = params.recipientCount;
  campaign.version = readContractVersion();

  const minimumFee = params.minimumFee;
  if (minimumFee) {
    campaign.fee = minimumFee;
  }

  /* --------------------------------- WATCHER -------------------------------- */
  watcher.campaignCounter = watcher.campaignCounter.plus(ONE);
  watcher.save();

  /* --------------------------------- FACTORY -------------------------------- */
  factory.campaignCounter = factory.campaignCounter.plus(ONE);
  factory.save();

  return campaign;
}
