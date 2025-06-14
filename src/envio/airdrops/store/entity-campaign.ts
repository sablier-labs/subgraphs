import type { Envio } from "../../common/bindings";
import { getContractVersion } from "../../common/deployments";
import { Id } from "../../common/id";
import type { Context, Entity, EnvioEnum } from "../bindings";
import { getNickname } from "../helpers/campaign";
import type { Params } from "../helpers/types";

export async function createInstant(
  context: Context.Handler,
  event: Envio.Event,
  entities: Params.CreateEntities,
  params: Params.CreateCampaignBase,
): Promise<Entity.Campaign> {
  const campaign = await createBaseCampaign(context, event, entities, params);
  await context.Campaign.set(campaign);
  return campaign;
}

export async function createLL(
  context: Context.Handler,
  event: Envio.Event,
  entities: Params.CreateEntities,
  params: Params.CreateCampaignLL,
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
  event: Envio.Event,
  entities: Params.CreateEntities,
  params: Params.CreateCampaignLT,
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

export function exists(event: Envio.Event, campaign?: Entity.Campaign): asserts campaign is Entity.Campaign {
  if (!campaign) {
    const id = Id.campaign(event.chainId, event.srcAddress);
    throw new Error(`Campaign not loaded from the entity store: ${id}`);
  }
}

export async function get(context: Context.Loader, event: Envio.Event) {
  const id = Id.campaign(event.chainId, event.srcAddress);
  const campaign = await context.Campaign.get(id);
  return campaign;
}

export async function updateAdmin(
  context: Context.Handler,
  campaign: Entity.Campaign,
  newAdmin: Envio.Address,
): Promise<void> {
  const asset = await context.Asset.get(campaign.asset_id);
  const updatedCampaign: Entity.Campaign = {
    ...campaign,
    admin: newAdmin,
    nickname: getNickname(newAdmin, campaign.name, asset),
  };
  await context.Campaign.set(updatedCampaign);
}

export async function updateClawback(
  context: Context.Handler,
  event: Envio.Event,
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
  event: Envio.Event,
  entities: Params.CreateEntities,
  params: Params.CreateCampaignBase,
): Promise<Entity.Campaign> {
  const factoryVersion = getContractVersion("airdrops", event.chainId, entities.factory.address);

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
    id: Id.campaign(event.chainId, params.campaignAddress),
    ipfsCID: params.ipfsCID,
    lockup: undefined,
    name: params.name,
    nickname: getNickname(params.admin, params.name, entities.asset),
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
    version: factoryVersion,
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
