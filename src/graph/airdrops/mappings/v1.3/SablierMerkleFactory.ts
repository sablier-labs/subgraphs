import { DataSourceContext } from "@graphprotocol/graph-ts";
import { readChainId } from "../../../common/context";
import {
  CreateMerkleInstant,
  CreateMerkleLL,
  CreateMerkleLT,
} from "../../bindings/SablierMerkleFactory_v1_3/SablierMerkleFactory";
import {
  SablierMerkleInstant_v1_3 as TemplateInstant_v1_3,
  SablierMerkleLL_v1_3 as TemplateLL_v1_3,
  SablierMerkleLT_v1_3 as TemplateLT_v1_3,
} from "../../bindings/templates";
import { convertTranchesV1_3 } from "../../helpers";
import { Store } from "../../store";
import { handleCreateMerkleLL, handleCreateMerkleLT } from "../common";

export function handle_SablierMerkleFactory_v1_3_CreateMerkleInstant(event: CreateMerkleInstant): void {
  const params = event.params;
  const baseParams = params.baseParams;

  /* -------------------------------- TEMPLATE -------------------------------- */
  const context = new DataSourceContext();
  context.setBigInt("chainId", readChainId());
  TemplateInstant_v1_3.createWithContext(params.merkleInstant, context);

  /* -------------------------------- CAMPAIGN -------------------------------- */
  Store.Campaign.createInstant(event, {
    admin: baseParams.initialAdmin,
    aggregateAmount: params.aggregateAmount,
    asset: baseParams.token,
    campaignAddress: params.merkleInstant,
    category: "Instant",
    expiration: baseParams.expiration,
    ipfsCID: baseParams.ipfsCID,
    merkleRoot: baseParams.merkleRoot,
    minimumFee: params.fee,
    name: baseParams.campaignName,
    recipientCount: params.recipientCount,
  });
}

export function handle_SablierMerkleFactory_v1_3_CreateMerkleLL(event: CreateMerkleLL): void {
  const params = event.params;
  const baseParams = params.baseParams;

  handleCreateMerkleLL(
    TemplateLL_v1_3.createWithContext,
    event,
    {
      admin: baseParams.initialAdmin,
      aggregateAmount: params.aggregateAmount,
      asset: baseParams.token,
      campaignAddress: params.merkleLL,
      category: "LockupLinear",
      expiration: baseParams.expiration,
      ipfsCID: baseParams.ipfsCID,
      merkleRoot: baseParams.merkleRoot,
      minimumFee: params.fee,
      name: baseParams.campaignName,
      recipientCount: params.recipientCount,
    },
    {
      cancelable: params.cancelable,
      cliffDuration: params.schedule.cliffDuration,
      cliffPercentage: params.schedule.cliffPercentage,
      lockup: params.lockup,
      shape: baseParams.shape,
      startPercentage: params.schedule.startPercentage,
      startTime: params.schedule.startTime,
      totalDuration: params.schedule.totalDuration,
      transferable: params.transferable,
    },
  );
}

export function handle_SablierMerkleFactory_v1_3_CreateMerkleLT(event: CreateMerkleLT): void {
  const params = event.params;
  const baseParams = params.baseParams;

  handleCreateMerkleLT(
    TemplateLT_v1_3.createWithContext,
    event,
    {
      admin: baseParams.initialAdmin,
      aggregateAmount: params.aggregateAmount,
      asset: baseParams.token,
      campaignAddress: params.merkleLT,
      category: "LockupTranched",
      expiration: baseParams.expiration,
      ipfsCID: baseParams.ipfsCID,
      merkleRoot: baseParams.merkleRoot,
      minimumFee: params.fee,
      name: baseParams.campaignName,
      recipientCount: params.recipientCount,
    },
    {
      cancelable: params.cancelable,
      lockup: params.lockup,
      shape: baseParams.shape,
      startTime: params.streamStartTime,
      totalDuration: params.totalDuration,
      tranchesWithPercentages: convertTranchesV1_3(params.tranchesWithPercentages),
      transferable: params.transferable,
    },
  );
}
