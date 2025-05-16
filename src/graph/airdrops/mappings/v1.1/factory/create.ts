import { CreateMerkleStreamerLL as EventCreateMerkleStreamerLL } from "../../../bindings/SablierV2MerkleStreamerFactory_v1_1/SablierV2MerkleStreamerFactory";
import { SablierV2MerkleStreamerLL_v1_1 as TemplateLL } from "../../../bindings/templates";
import { processCreateMerkleLL } from "../../processors";

export function handleCreateMerkleStreamerLL(event: EventCreateMerkleStreamerLL): void {
  processCreateMerkleLL(
    event,
    {
      admin: event.params.admin,
      aggregateAmount: event.params.aggregateAmount,
      asset: event.params.asset,
      campaignAddress: event.params.merkleStreamer,
      category: "LockupLinear",
      expiration: event.params.expiration,
      ipfsCID: event.params.ipfsCID,
      minimumFee: null,
      name: null,
      recipientCount: event.params.recipientsCount,
      root: event.params.merkleRoot,
    },
    {
      cancelable: event.params.cancelable,
      cliffDuration: event.params.streamDurations.cliff,
      cliffPercentage: null,
      lockup: event.params.lockupLinear,
      shape: null,
      startTime: null, // all v1.1 streams use the claim time as the start time
      startPercentage: null,
      transferable: event.params.transferable,
      totalDuration: event.params.streamDurations.total,
    },
  );

  // Create an instance of the campaign template so that future events can be indexed.
  TemplateLL.create(event.params.merkleStreamer);
}
