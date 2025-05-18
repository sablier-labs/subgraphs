import { Address, ethereum } from "@graphprotocol/graph-ts";
import { ONE, ZERO } from "../../common/constants";
import { readChainId, readContractVersion } from "../../common/context";
import { Id } from "../../common/id";
import { logError } from "../../common/logger";
import { EntityCampaign } from "../bindings";
import { getNickname } from "../helpers";
import { CampaignCommonParams, CampaignLLParams, CampaignLTParams } from "../params";
import { getOrCreateEntityAsset } from "./asset";
import { getOrCreateEntityFactory } from "./factory";
import { addTranchesWithPercentages } from "./tranche";
import { getOrCreateEntityWatcher } from "./watcher";

export function createEntityCampaignInstant(event: ethereum.Event, params: CampaignCommonParams): EntityCampaign {
  const campaign = createBaseEntity(event, params);
  campaign.save();
  return campaign;
}

export function createEntityCampaignLL(
  event: ethereum.Event,
  paramsCommon: CampaignCommonParams,
  paramsLL: CampaignLLParams,
): EntityCampaign {
  const campaign = createBaseEntity(event, paramsCommon);

  // Lockup
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

  // LockupLinear
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

export function createEntityCampaignLT(
  event: ethereum.Event,
  paramsCommon: CampaignCommonParams,
  paramsLT: CampaignLTParams,
): EntityCampaign {
  let campaign = createBaseEntity(event, paramsCommon);

  // Lockup
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

  // LockupTranched
  campaign = addTranchesWithPercentages(campaign, paramsLT.tranchesWithPercentages);

  campaign.save();
  return campaign;
}

export function getEntityCampaign(address: Address): EntityCampaign | null {
  const id = Id.campaign(address);
  const campaign = EntityCampaign.load(id);
  if (campaign === null) {
    logError("Campaign entity not saved for address: {}", [address.toHexString()]);
  }
  return campaign;
}

function createBaseEntity(event: ethereum.Event, params: CampaignCommonParams): EntityCampaign {
  const id = Id.campaign(params.campaignAddress);
  const campaign = new EntityCampaign(id);

  // Watcher
  const watcher = getOrCreateEntityWatcher();
  campaign.subgraphId = watcher.campaignCounter;
  watcher.campaignCounter = watcher.campaignCounter.plus(ONE);
  watcher.save();

  // Asset
  const asset = getOrCreateEntityAsset(params.asset);
  campaign.asset = asset.id;

  // Factory
  const factory = getOrCreateEntityFactory(event.address);
  campaign.factory = factory.id;
  const campaignCounter = factory.campaignCounter.plus(ONE);
  campaign.position = campaignCounter;
  factory.campaignCounter = campaignCounter;
  factory.save();

  // Campaign: general
  campaign.chainId = readChainId();
  campaign.hash = event.transaction.hash;
  campaign.timestamp = event.block.timestamp;
  campaign.version = readContractVersion();

  // Campaign: params
  campaign.address = params.campaignAddress;
  campaign.admin = params.admin;
  campaign.aggregateAmount = params.aggregateAmount;
  campaign.category = params.category;
  campaign.expires = params.expiration.isZero() === false;
  campaign.expiration = params.expiration;
  campaign.name = params.name;
  campaign.nickname = getNickname(params.admin, asset, params.name);
  campaign.ipfsCID = params.ipfsCID;
  campaign.root = params.root;
  campaign.totalRecipients = params.recipientCount;
  if (params.minimumFee) {
    campaign.fee = params.minimumFee;
  }

  // Campaign: defaults
  campaign.claimedAmount = ZERO;
  campaign.claimedCount = ZERO;

  return campaign;
}
