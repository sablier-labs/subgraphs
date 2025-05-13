import {
  CreateMerkleInstant as EventCreateMerkleInstant,
  CreateMerkleLL as EventCreateMerkleLL,
  CreateMerkleLT as EventCreateMerkleLT,
} from "../../bindings/SablierMerkleFactory_v1_3/SablierMerkleFactory";
import {
  SablierMerkleInstant_v1_3 as TemplateInstant,
  SablierMerkleLL_v1_3 as TemplateLL,
  SablierMerkleLT_v1_3 as TemplateLT,
} from "../../bindings/templates";
import { createEntityAction, createEntityCampaignInstant } from "../../entities";
import { convertTranchesV1_3 } from "../../helpers";
import { processCreateMerkleLL, processCreateMerkleLT } from "../processors";

export function handleCreateMerkleInstant(event: EventCreateMerkleInstant): void {
  const campaign = createEntityCampaignInstant(event, {
    admin: event.params.baseParams.initialAdmin,
    aggregateAmount: event.params.aggregateAmount,
    asset: event.params.baseParams.token,
    campaignAddress: event.params.merkleInstant,
    category: "Instant",
    expiration: event.params.baseParams.expiration,
    ipfsCID: event.params.baseParams.ipfsCID,
    minimumFee: event.params.fee,
    name: event.params.baseParams.campaignName,
    recipientCount: event.params.recipientCount,
    root: event.params.baseParams.merkleRoot,
  });
  createEntityAction(event, campaign, "Create");

  // Create an instance of the campaign template so that future events can be indexed.
  TemplateInstant.create(event.params.merkleInstant);
}

export function handleCreateMerkleLL(event: EventCreateMerkleLL): void {
  processCreateMerkleLL(
    event,
    {
      admin: event.params.baseParams.initialAdmin,
      aggregateAmount: event.params.aggregateAmount,
      asset: event.params.baseParams.token,
      campaignAddress: event.params.merkleLL,
      category: "LockupLinear",
      expiration: event.params.baseParams.expiration,
      ipfsCID: event.params.baseParams.ipfsCID,
      minimumFee: event.params.fee,
      name: event.params.baseParams.campaignName,
      recipientCount: event.params.recipientCount,
      root: event.params.baseParams.merkleRoot,
    },
    {
      cancelable: event.params.cancelable,
      cliffDuration: event.params.schedule.cliffDuration,
      cliffPercentage: event.params.schedule.cliffPercentage,
      lockup: event.params.lockup,
      shape: event.params.baseParams.shape,
      startTime: event.params.schedule.startTime,
      startPercentage: event.params.schedule.startPercentage,
      transferable: event.params.transferable,
      totalDuration: event.params.schedule.totalDuration,
    },
  );

  // Create an instance of the campaign template so that future events can be indexed.
  TemplateLL.create(event.params.merkleLL);
}

export function handleCreateMerkleLT(event: EventCreateMerkleLT): void {
  processCreateMerkleLT(
    event,
    {
      admin: event.params.baseParams.initialAdmin,
      aggregateAmount: event.params.aggregateAmount,
      asset: event.params.baseParams.token,
      campaignAddress: event.params.merkleLT,
      category: "LockupTranched",
      expiration: event.params.baseParams.expiration,
      ipfsCID: event.params.baseParams.ipfsCID,
      minimumFee: event.params.fee,
      name: event.params.baseParams.campaignName,
      recipientCount: event.params.recipientCount,
      root: event.params.baseParams.merkleRoot,
    },
    {
      cancelable: event.params.cancelable,
      lockup: event.params.lockup,
      shape: event.params.baseParams.shape,
      startTime: event.params.streamStartTime,
      transferable: event.params.transferable,
      totalDuration: event.params.totalDuration,
      tranchesWithPercentages: convertTranchesV1_3(event.params.tranchesWithPercentages),
    },
  );

  // Create an instance of the campaign template so that future events can be indexed.
  TemplateLT.create(event.params.merkleLT);
}
