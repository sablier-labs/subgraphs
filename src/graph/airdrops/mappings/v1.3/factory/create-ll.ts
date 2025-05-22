import { CreateMerkleLL as EventCreateMerkleLL } from "../../../bindings/SablierMerkleFactory_v1_3/SablierMerkleFactory";
import { SablierMerkleLL_v1_3 as TemplateLL } from "../../../bindings/templates";
import { Processor } from "../../processor";

export function handleCreateMerkleLL(event: EventCreateMerkleLL): void {
  /* -------------------------------- CAMPAIGN -------------------------------- */
  Processor.Create.merkleLL(
    event,
    {
      admin: event.params.baseParams.initialAdmin,
      aggregateAmount: event.params.aggregateAmount,
      asset: event.params.baseParams.token,
      campaignAddress: event.params.merkleLL,
      category: "LockupLinear",
      expiration: event.params.baseParams.expiration,
      ipfsCID: event.params.baseParams.ipfsCID,
      merkleRoot: event.params.baseParams.merkleRoot,
      minimumFee: event.params.fee,
      name: event.params.baseParams.campaignName,
      recipientCount: event.params.recipientCount,
    },
    {
      cancelable: event.params.cancelable,
      cliffDuration: event.params.schedule.cliffDuration,
      cliffPercentage: event.params.schedule.cliffPercentage,
      lockup: event.params.lockup,
      shape: event.params.baseParams.shape,
      startPercentage: event.params.schedule.startPercentage,
      startTime: event.params.schedule.startTime,
      totalDuration: event.params.schedule.totalDuration,
      transferable: event.params.transferable,
    },
  );

  /* ---------------------------- CONTRACT TEMPLATE --------------------------- */
  TemplateLL.create(event.params.merkleLL);
}
