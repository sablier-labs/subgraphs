import { CreateMerkleLT as EventCreateMerkleLT } from "../../../bindings/SablierMerkleFactory_v1_3/SablierMerkleFactory";
import { SablierMerkleLT_v1_3 as TemplateLT } from "../../../bindings/templates";
import { convertTranchesV1_3 } from "../../../helpers";
import { Processor } from "../../processor";

export function handleCreateMerkleLT(event: EventCreateMerkleLT): void {
  Processor.Create.merkleLT(
    TemplateLT.createWithContext,
    event,
    {
      admin: event.params.baseParams.initialAdmin,
      aggregateAmount: event.params.aggregateAmount,
      asset: event.params.baseParams.token,
      campaignAddress: event.params.merkleLT,
      category: "LockupTranched",
      expiration: event.params.baseParams.expiration,
      ipfsCID: event.params.baseParams.ipfsCID,
      merkleRoot: event.params.baseParams.merkleRoot,
      minimumFee: event.params.fee,
      name: event.params.baseParams.campaignName,
      recipientCount: event.params.recipientCount,
    },
    {
      cancelable: event.params.cancelable,
      lockup: event.params.lockup,
      shape: event.params.baseParams.shape,
      startTime: event.params.streamStartTime,
      totalDuration: event.params.totalDuration,
      tranchesWithPercentages: convertTranchesV1_3(event.params.tranchesWithPercentages),
      transferable: event.params.transferable,
    },
  );
}
