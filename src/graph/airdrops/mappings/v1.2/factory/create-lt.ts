import { CreateMerkleLT as EventCreateMerkleLT } from "../../../bindings/SablierV2MerkleLockupFactory_v1_2/SablierV2MerkleLockupFactory";
import { SablierV2MerkleLT_v1_2 as TemplateLT } from "../../../bindings/templates";
import { convertTranchesV1_2 } from "../../../helpers";
import { Processor } from "../../processor";

export function handleCreateMerkleLT(event: EventCreateMerkleLT): void {
  /* -------------------------------- CAMPAIGN -------------------------------- */
  Processor.Create.merkleLT(
    event,
    {
      admin: event.params.baseParams.initialAdmin,
      aggregateAmount: event.params.aggregateAmount,
      asset: event.params.baseParams.asset,
      campaignAddress: event.params.merkleLT,
      category: "LockupLinear",
      expiration: event.params.baseParams.expiration,
      ipfsCID: event.params.baseParams.ipfsCID,
      merkleRoot: event.params.baseParams.merkleRoot,
      minimumFee: null,
      name: event.params.baseParams.name,
      recipientCount: event.params.recipientCount,
    },
    {
      cancelable: event.params.baseParams.cancelable,
      lockup: event.params.lockupTranched,
      shape: null,
      startTime: null, // all v1.2 streams use the claim time as the start time
      totalDuration: event.params.totalDuration,
      tranchesWithPercentages: convertTranchesV1_2(event.params.tranchesWithPercentages),
      transferable: event.params.baseParams.transferable,
    },
  );

  /* ---------------------------- CONTRACT TEMPLATE --------------------------- */
  TemplateLT.create(event.params.merkleLT);
}
