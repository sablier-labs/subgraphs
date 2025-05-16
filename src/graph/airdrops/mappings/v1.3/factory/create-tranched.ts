import { CreateMerkleLT as EventCreateMerkleLT } from "../../../bindings/SablierMerkleFactory_v1_3/SablierMerkleFactory";
import { SablierMerkleLT_v1_3 as TemplateLT } from "../../../bindings/templates";
import { convertTranchesV1_3 } from "../../../helpers";
import { processCreateMerkleLT } from "../../processors";

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
