import { DataSourceContext } from "@graphprotocol/graph-ts";
import { readChainId } from "../../../common/context";
import { CreateMerkleVCA } from "../../bindings/SablierFactoryMerkleVCA_v1_4/SablierFactoryMerkleVCA";
import { SablierMerkleVCA_v1_4 as TemplateVCA_v1_4 } from "../../bindings/templates";
import { Store } from "../../store";

export function handle_SablierFactoryMerkleVCA_v1_4_CreateMerkleVCA(event: CreateMerkleVCA): void {
  const params = event.params;
  const baseParams = params.params;

  /* -------------------------------- TEMPLATE -------------------------------- */
  const context = new DataSourceContext();
  context.setBigInt("chainId", readChainId());
  TemplateVCA_v1_4.createWithContext(params.merkleVCA, context);

  /* -------------------------------- CAMPAIGN -------------------------------- */
  Store.Campaign.createVCA(
    event,
    {
      admin: baseParams.initialAdmin,
      aggregateAmount: params.aggregateAmount,
      asset: baseParams.token,
      campaignAddress: params.merkleVCA,
      category: "VCA",
      expiration: baseParams.expiration,
      ipfsCID: baseParams.ipfsCID,
      merkleRoot: baseParams.merkleRoot,
      minimumFee: params.minFeeUSD,
      name: baseParams.campaignName,
      recipientCount: params.recipientCount,
    },
    {
      startTime: baseParams.startTime,
      endTime: baseParams.endTime,
      unlockPercentage: baseParams.unlockPercentage,
    },
  );
}