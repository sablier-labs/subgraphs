import type { Context, Entity, EnvioEnum } from "@envio-airdrops/bindings";
import type { CreateEntities, Params } from "@envio-airdrops/helpers/types";
import type { Address, Event } from "@envio-common/bindings";
import { getContract } from "@envio-common/deployments";
import { Id } from "@envio-common/id";
import { getNickname } from "../helpers/campaign";
import { getOrThrow as getAssetOrThrow } from "./entity-asset";

export async function createInstant(
  context: Context.Handler,
  event: Event,
  entities: CreateEntities,
  params: Params.CampaignBase,
): Promise<Entity.Campaign> {
  const campaign = await createBaseCampaign(context, event, entities, params);
  await context.Campaign.set(campaign);
  return campaign;
}

export async function createLL(
  context: Context.Handler,
  event: Event,
  entities: CreateEntities,
  params: Params.CampaignLL,
): Promise<Entity.Campaign> {
  let campaign = await createBaseCampaign(context, event, entities, params);
  campaign = {
    ...campaign,
    lockup: params.lockup,
    streamCancelable: params.cancelable,
    streamCliff: params.cliffDuration > 0n,
    streamCliffDuration: params.cliffDuration,
    streamCliffPercentage: params.cliffPercentage,
    streamInitial: params.startPercentage ? params.startPercentage > 0n : undefined,
    streamInitialPercentage: params.startPercentage,
    streamShape: params.shape,
    streamStart: params.startTime ? params.startTime > 0n : undefined,
    streamStartTime: params.startTime,
    streamTotalDuration: params.totalDuration,
    streamTransferable: params.transferable,
  };
  await context.Campaign.set(campaign);
  return campaign;
}

export async function createLT(
  context: Context.Handler,
  event: Event,
  entities: CreateEntities,
  params: Params.CampaignLT,
): Promise<Entity.Campaign> {
  let campaign = await createBaseCampaign(context, event, entities, params);
  campaign = {
    ...campaign,
    lockup: params.lockup,
    streamCancelable: params.cancelable,
    streamShape: params.shape,
    streamStart: params.startTime ? params.startTime > 0n : undefined,
    streamStartTime: params.startTime,
    streamTotalDuration: params.totalDuration,
    streamTransferable: params.transferable,
  };
  await context.Campaign.set(campaign);
  return campaign;
}

export async function getOrThrow(context: Context.Loader, event: Event) {
  const id = Id.campaign(event.chainId, event.srcAddress);
  const campaign = await context.Campaign.get(id);
  if (!campaign) {
    throw new Error(`Campaign not loaded from the entity store: ${id}`);
  }
  return campaign;
}

export async function updateAdmin(
  context: Context.Handler,
  event: Event,
  campaign: Entity.Campaign,
  admin: Address,
): Promise<void> {
  const asset = await getAssetOrThrow(context, event.chainId, campaign.asset_id);
  const updatedCampaign: Entity.Campaign = {
    ...campaign,
    admin,
    nickname: getNickname(admin, asset, campaign.name),
  };
  await context.Campaign.set(updatedCampaign);
}

export async function updateClawback(
  context: Context.Handler,
  event: Event,
  campaign: Entity.Campaign,
  actionId: string,
): Promise<void> {
  const updatedCampaign: Entity.Campaign = {
    ...campaign,
    clawbackAction_id: actionId,
    clawbackTime: BigInt(event.block.timestamp),
  };
  await context.Campaign.set(updatedCampaign);
}

export async function updateClaimed(
  context: Context.Handler,
  campaign: Entity.Campaign,
  amount: bigint,
): Promise<void> {
  const updatedCampaign: Entity.Campaign = {
    ...campaign,
    claimedAmount: campaign.claimedAmount + amount,
    claimedCount: campaign.claimedCount + 1n,
  };
  await context.Campaign.set(updatedCampaign);
}

async function createBaseCampaign(
  context: Context.Handler,
  event: Event,
  entities: CreateEntities,
  params: Params.CampaignBase,
): Promise<Entity.Campaign> {
  const campaignId = Id.campaign(event.chainId, params.campaignAddress);
  const factory = getContract("airdrops", event.chainId, entities.factory.address);

  /* -------------------------------- CAMPAIGN -------------------------------- */
  // Some fields are set to 0/ undefined because they are set later depending on the campaign category.
  const campaign: Entity.Campaign = {
    address: params.campaignAddress,
    admin: params.admin,
    aggregateAmount: params.aggregateAmount,
    asset_id: entities.asset.address,
    category: params.category as EnvioEnum.CampaignCategory,
    chainId: BigInt(event.chainId),
    claimedAmount: 0n,
    claimedCount: 0n,
    clawbackAction_id: undefined,
    clawbackTime: undefined,
    expiration: params.expiration,
    expires: params.expiration > 0n,
    factory_id: entities.factory.address,
    fee: params.minimumFee,
    hash: event.transaction.hash,
    id: campaignId,
    ipfsCID: params.ipfsCID,
    lockup: undefined,
    name: params.name,
    nickname: getNickname(params.admin, entities.asset, params.name),
    position: entities.factory.campaignCounter,
    root: params.merkleRoot,
    streamCancelable: undefined,
    streamCliff: undefined,
    streamCliffDuration: undefined,
    streamCliffPercentage: undefined,
    streamInitial: undefined,
    streamInitialPercentage: undefined,
    streamShape: undefined,
    streamStart: undefined,
    streamStartTime: undefined,
    streamTotalDuration: undefined,
    streamTransferable: undefined,
    subgraphId: entities.watcher.campaignCounter,
    timestamp: BigInt(event.block.timestamp),
    totalRecipients: params.recipientCount,
    version: factory.version,
  };

  /* --------------------------------- FACTORY -------------------------------- */
  const updatedFactory = {
    ...entities.factory,
    campaignCounter: entities.factory.campaignCounter + 1n,
  };
  await context.Factory.set(updatedFactory);

  /* --------------------------------- WATCHER -------------------------------- */
  const updatedWatcher = {
    ...entities.watcher,
    campaignCounter: entities.watcher.campaignCounter + 1n,
  };
  await context.Watcher.set(updatedWatcher);

  return campaign;
}
