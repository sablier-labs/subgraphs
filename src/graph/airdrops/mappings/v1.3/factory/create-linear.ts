import { CreateMerkleLL as EventCreateMerkleLL } from "../../../bindings/SablierMerkleFactory_v1_3/SablierMerkleFactory";
import { SablierMerkleLL_v1_3 as TemplateLL } from "../../../bindings/templates";
import { processCreateMerkleLL } from "../../processors";

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
