import { CreateMerkleStreamerLL as EventCreateMerkleStreamerLL } from "../../../bindings/SablierV2MerkleStreamerFactory_v1_1/SablierV2MerkleStreamerFactory";
import { SablierV2MerkleStreamerLL_v1_1 as TemplateLL } from "../../../bindings/templates";
import { Processor } from "../../processor";

export function handleCreateMerkleStreamerLL(event: EventCreateMerkleStreamerLL): void {
  /* -------------------------------- CAMPAIGN -------------------------------- */
  Processor.Create.merkleLL(
    event,
    {
      admin: event.params.admin,
      aggregateAmount: event.params.aggregateAmount,
      asset: event.params.asset,
      campaignAddress: event.params.merkleStreamer,
      category: "LockupLinear",
      expiration: event.params.expiration,
      ipfsCID: event.params.ipfsCID,
      merkleRoot: event.params.merkleRoot,
      minimumFee: null,
      name: null,
      recipientCount: event.params.recipientsCount,
    },
    {
      cancelable: event.params.cancelable,
      cliffDuration: event.params.streamDurations.cliff,
      cliffPercentage: null,
      lockup: event.params.lockupLinear,
      shape: null,
      startPercentage: null,
      startTime: null, // all v1.1 streams use the claim time as the start time
      totalDuration: event.params.streamDurations.total,
      transferable: event.params.transferable,
    },
  );

  /* ---------------------------- CONTRACT TEMPLATE --------------------------- */
  TemplateLL.create(event.params.merkleStreamer);
}
