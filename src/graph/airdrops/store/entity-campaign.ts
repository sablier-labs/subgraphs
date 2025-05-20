import { Address, ethereum } from "@graphprotocol/graph-ts";
import { ONE, ZERO } from "../../common/constants";
import { readChainId, readContractVersion } from "../../common/context";
import { Id } from "../../common/id";
import { logError } from "../../common/logger";
import { EntityCampaign } from "../bindings";
import { getNickname } from "../helpers";
import { CampaignCommonParams, CampaignLLParams, CampaignLTParams } from "../helpers/types";
import { getOrCreateAsset } from "./entity-asset";
import { getOrCreateFactory } from "./entity-factory";
import { createTranchesWithPercentages } from "./entity-tranche";
import { getOrCreateWatcher } from "./entity-watcher";

export function createCampaignInstant(event: ethereum.Event, params: CampaignCommonParams): EntityCampaign {
  const campaign = createBaseCampaign(event, params);
  campaign.save();
  return campaign;
}

export function createCampaignLL(
  event: ethereum.Event,
  paramsCommon: CampaignCommonParams,
  paramsLL: CampaignLLParams,
): EntityCampaign {
  const campaign = createBaseCampaign(event, paramsCommon);

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

export function createCampaignLT(
  event: ethereum.Event,
  paramsCommon: CampaignCommonParams,
  paramsLT: CampaignLTParams,
): EntityCampaign {
  let campaign = createBaseCampaign(event, paramsCommon);

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

function createBaseCampaign(event: ethereum.Event, params: CampaignCommonParams): EntityCampaign {
  const id = Id.campaign(params.campaignAddress);
  const campaign = new EntityCampaign(id);

  /* --------------------------------- WATCHER -------------------------------- */
  const watcher = getOrCreateWatcher();
  campaign.subgraphId = watcher.campaignCounter;
  watcher.campaignCounter = watcher.campaignCounter.plus(ONE);
  watcher.save();

  /* --------------------------------- ASSET --------------------------------- */
  const asset = getOrCreateAsset(params.asset);
  campaign.asset = asset.id;

  /* --------------------------------- FACTORY -------------------------------- */
  const factory = getOrCreateFactory(event.address);
  campaign.factory = factory.id;
  const campaignCounter = factory.campaignCounter.plus(ONE);
  campaign.position = campaignCounter;
  factory.campaignCounter = campaignCounter;
  factory.save();

  /* --------------------------------- CAMPAIGN -------------------------------- */
  campaign.chainId = readChainId();
  campaign.hash = event.transaction.hash;
  campaign.timestamp = event.block.timestamp;
  campaign.version = readContractVersion();

  /* --------------------------------- PARAMS --------------------------------- */
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

  /* --------------------------------- DEFAULTS -------------------------------- */
  campaign.claimedAmount = ZERO;
  campaign.claimedCount = ZERO;

  return campaign;
}
