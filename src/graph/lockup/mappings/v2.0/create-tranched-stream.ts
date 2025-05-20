import { CreateLockupTranchedStream as EventCreateTranchedV2_0 } from "../../bindings/SablierLockup_v2_0/SablierLockup";
import { convertTranchesV2_0 } from "../../helpers";
import { Processor } from "../processor";

export function handleCreateLockupTranchedStream(event: EventCreateTranchedV2_0): void {
  const allParams = event.params;
  const commonParams = allParams.commonParams;
  Processor.Create.tranched(
    event,
    {
      asset: commonParams.token,
      cancelable: commonParams.cancelable,
      category: "LockupTranched",
      depositAmount: commonParams.amounts.deposit,
      endTime: commonParams.timestamps.end,
      funder: commonParams.funder,
      recipient: commonParams.recipient,
      sender: commonParams.sender,
      shape: commonParams.shape,
      startTime: commonParams.timestamps.start,
      tokenId: allParams.streamId,
      transferable: commonParams.transferable,
    },
    {
      tranches: convertTranchesV2_0(allParams.tranches),
    },
  );
}
