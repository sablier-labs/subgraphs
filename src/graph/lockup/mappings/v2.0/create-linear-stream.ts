import { CreateLockupLinearStream as EventCreateLinearV2_0 } from "../../bindings/SablierLockup_v2_0/SablierLockup";
import { processCreateLinear } from "../processors";

export function handleCreateLockupLinearStream(event: EventCreateLinearV2_0): void {
  processCreateLinear(
    event,
    {
      asset: event.params.commonParams.token,
      cancelable: event.params.commonParams.cancelable,
      category: "LockupLinear",
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
      cliffTime: event.params.cliffTime,
      unlockAmountCliff: event.params.unlockAmounts.cliff,
      unlockAmountStart: event.params.unlockAmounts.start,
    },
  );
}
