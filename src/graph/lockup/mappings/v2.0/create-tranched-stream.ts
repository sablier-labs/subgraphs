import { CreateLockupTranchedStream as EventCreateTranchedV2_0 } from "../../bindings/SablierLockup_v2_0/SablierLockup";
import { convertTranchesV2_0 } from "../../helpers";
import { processCreateTranched } from "../processors";

export function handleCreateLockupTranchedStream(event: EventCreateTranchedV2_0): void {
  processCreateTranched(
    event,
    {
      asset: event.params.commonParams.token,
      cancelable: event.params.commonParams.cancelable,
      category: "LockupTranched",
      depositAmount: event.params.commonParams.amounts.deposit,
      endTime: event.params.commonParams.timestamps.end,
      funder: event.params.commonParams.funder,
      recipient: event.params.commonParams.recipient,
      sender: event.params.commonParams.sender,
      startTime: event.params.commonParams.timestamps.start,
      tokenId: event.params.streamId,
      transferable: event.params.commonParams.transferable,
    },
    {
      tranches: convertTranchesV2_0(event.params.tranches),
    },
  );
}
