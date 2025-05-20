import { CreateMerkleLL as EventCreateMerkleLL } from "../../../bindings/SablierV2MerkleLockupFactory_v1_2/SablierV2MerkleLockupFactory";
import { SablierV2MerkleLT_v1_2 as TemplateLL } from "../../../bindings/templates";
import { Processor } from "../../processor";

export function handleCreateMerkleLL(event: EventCreateMerkleLL): void {
  Processor.Create.merkleLL(
    event,
    {
      admin: event.params.baseParams.initialAdmin,
      aggregateAmount: event.params.aggregateAmount,
      asset: event.params.baseParams.asset,
      campaignAddress: event.params.merkleLL,
      category: "LockupLinear",
      expiration: event.params.baseParams.expiration,
      ipfsCID: event.params.baseParams.ipfsCID,
      minimumFee: null,
      name: event.params.baseParams.name,
      recipientCount: event.params.recipientCount,
      root: event.params.baseParams.merkleRoot,
    },
    {
      cancelable: event.params.baseParams.cancelable,
      cliffDuration: event.params.streamDurations.cliff,
      cliffPercentage: null,
      lockup: event.params.lockupLinear,
      shape: null,
      startPercentage: null, // all v1.2 streams use the claim time as the start time
      startTime: null,
      totalDuration: event.params.streamDurations.total,
      transferable: event.params.baseParams.transferable,
    },
  );

  // Create an instance of the campaign template so that future events can be indexed.
  TemplateLL.create(event.params.merkleLL);
}
